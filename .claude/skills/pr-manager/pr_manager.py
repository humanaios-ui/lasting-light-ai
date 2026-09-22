#!/usr/bin/env python3
"""
PR Manager Agent — Governance-aware PR tracking and progression.

Integrates with Z-role governance system to help:
  - Monitor open PRs with governance metadata
  - Identify blockers (CI, reviews, conflicts, receipts)
  - Suggest next actions for Z1/Z2/Z3
  - Track merge probability and time to merge
  - Batch assign actions by zone
"""

import json
import subprocess
from dataclasses import dataclass
from datetime import datetime, timedelta
from enum import Enum
from typing import Optional, List, Dict, Any


class MoltTier(Enum):
    """Molt tier classification (Tier 0, 1, 2)."""
    TIER_0 = 0  # No constants or gates
    TIER_1 = 1  # Constants only
    TIER_2 = 2  # Gates
    UNKNOWN = -1


class BlockerType(Enum):
    """Types of PR blockers."""
    CI_RED = "CI Red"
    CI_FLAKE = "CI Flake"
    MERGE_CONFLICT = "Merge Conflict"
    REVIEW_PENDING = "Review Pending"
    REVIEW_COMMENT = "Review Comment"
    RECEIPT_GAP = "Receipt Gap"
    Z2_AWAIT_HASH = "Z2 Await Hash"
    Z3_AWAIT_DEPLOY = "Z3 Await Deploy"
    NONE = "None"


class Zone(Enum):
    """Governance zones (Z1, Z2, Z3)."""
    Z1 = "Z1"
    Z2 = "Z2"
    Z3 = "Z3"
    UNKNOWN = "Unknown"


@dataclass
class PRBlocker:
    """Represents a blocker on a PR."""
    type: BlockerType
    severity: str  # "CRITICAL", "MAJOR", "MINOR"
    description: str
    resolution: str
    time_estimate: str  # "5m", "15m", "1h", "24h"
    owner: str  # Z1/Z2/Z3


@dataclass
class PRMetadata:
    """Governance metadata extracted from PR description."""
    number: int
    title: str
    author: str
    zone: Zone
    smag_prediction: Optional[float]  # 0.0-1.0
    molt_tier_claimed: MoltTier
    url: str
    created_at: str
    updated_at: str
    branch: str
    target: str  # Usually "main"
    labels: List[str]


@dataclass
class PRStatus:
    """Complete PR status with blockers and actions."""
    metadata: PRMetadata
    blockers: List[PRBlocker]
    ci_status: str  # "PASS", "FAIL", "RUNNING"
    ci_failed_jobs: List[str]
    reviews_requested: List[str]
    reviews_completed: List[Dict[str, str]]  # [{reviewer, decision}, ...]
    merge_conflict: bool
    merge_probability: float  # 0.0-1.0
    time_to_merge_hours: int
    next_actions: List[str]


class PRManager:
    """Main PR Manager agent."""

    def __init__(self, owner: str = "humanaios-ui", repo: str = "operations"):
        self.owner = owner
        self.repo = repo
        self.gh_repo = f"{owner}/{repo}"

    def status(self) -> str:
        """Print real-time dashboard of all open PRs."""
        prs = self._fetch_open_prs()
        if not prs:
            return "No open PRs found."

        output = []
        output.append("┌─ PR Manager Dashboard")
        output.append("│")

        for i, pr_status in enumerate(prs):
            is_last = i == len(prs) - 1
            prefix = "└─" if is_last else "├─"

            title = pr_status.metadata.title[:50]
            zone = pr_status.metadata.zone.value
            status = self._status_badge(pr_status)

            output.append(f"{prefix} PR #{pr_status.metadata.number}: {title} [{zone}]")
            output.append(f"   Status: {status}")

            if pr_status.blockers:
                blocker_str = ", ".join(b.type.value for b in pr_status.blockers)
                output.append(f"   Blocker: {blocker_str}")
            else:
                output.append("   Blocker: None")

            if pr_status.next_actions:
                action = pr_status.next_actions[0]
                output.append(f"   Action: {action}")

            if pr_status.metadata.smag_prediction is not None:
                output.append(f"   SMAG: {pr_status.metadata.smag_prediction:.2f} confidence")

            output.append(f"   Molt: Tier {pr_status.metadata.molt_tier_claimed.value}")

            if not is_last:
                output.append("│")

        output.append("")
        return "\n".join(output)

    def blockers(self) -> str:
        """Show only PRs with active blockers, ranked by severity."""
        prs = self._fetch_open_prs()
        prs_with_blockers = [p for p in prs if p.blockers]

        if not prs_with_blockers:
            return "No PRs with active blockers. All clear! ✓"

        # Sort by severity: CRITICAL → MAJOR → MINOR
        severity_order = {"CRITICAL": 0, "MAJOR": 1, "MINOR": 2}
        prs_with_blockers.sort(
            key=lambda p: (
                severity_order.get(p.blockers[0].severity, 3),
                -(p.metadata.smag_prediction if p.metadata.smag_prediction is not None else 0.5),
            )
        )

        output = []
        current_severity = None

        for pr in prs_with_blockers:
            blocker = pr.blockers[0]  # Primary blocker

            if current_severity != blocker.severity:
                current_severity = blocker.severity
                output.append(f"\n{blocker.severity} (Blocking {'merge' if blocker.severity == 'CRITICAL' else 'review'}):")

            output.append(f"  #{pr.metadata.number}: {blocker.description}")

        output.append("")
        return "\n".join(output)

    def action_plan(self, pr_number: int) -> str:
        """Detailed next-steps plan for a specific PR."""
        pr = self._fetch_pr_status(pr_number)
        if not pr:
            return f"PR #{pr_number} not found."

        output = []
        output.append(f"PR #{pr.metadata.number}: {pr.metadata.title} [{pr.metadata.zone.value}]")
        output.append("")
        output.append("Current State:")
        output.append(f"  Author: {pr.metadata.author}")
        output.append(f"  Branch: {pr.metadata.branch}")
        output.append(f"  Target: {pr.metadata.target}")
        output.append(f"  Created: {self._time_ago(pr.metadata.created_at)}")
        output.append(f"  Last push: {self._time_ago(pr.metadata.updated_at)}")
        output.append(f"  CI: {'✓ All checks pass' if pr.ci_status == 'PASS' else f'✗ {pr.ci_status}'}")
        if pr.reviews_requested:
            output.append(f"  Reviews: {len(pr.reviews_requested)} requested ({', '.join(pr.reviews_requested)})")

        output.append("")
        output.append("Blocker Analysis:")
        if pr.blockers:
            for blocker in pr.blockers:
                output.append(f"  - {blocker.type.value}: {blocker.description}")
                output.append(f"    Status: {blocker.severity}")
                output.append(f"    Resolution: {blocker.resolution}")
        else:
            output.append("  None active — ready for merge")

        output.append("")
        output.append("Suggested Actions:")
        for i, action in enumerate(pr.next_actions, 1):
            output.append(f"  {i}. {action}")

        output.append("")
        output.append("Expected Outcome:")
        output.append(f"  - Merge probability: {pr.merge_probability:.0%}")
        output.append(f"  - Time to merge: ~{pr.time_to_merge_hours}h")

        if pr.metadata.zone == Zone.Z2:
            output.append("")
            output.append("Z2 Note:")
            output.append(f"  Molt tier claimed: Tier {pr.metadata.molt_tier_claimed.value}")
            if pr.metadata.smag_prediction:
                output.append(f"  SMAG prediction: {pr.metadata.smag_prediction:.2f}")

        output.append("")
        return "\n".join(output)

    def zone(self, zone: str) -> str:
        """Filter PRs by governance zone."""
        try:
            zone_enum = Zone[zone.upper()]
        except KeyError:
            return f"Zone '{zone}' not recognized. Use Z1, Z2, or Z3."

        prs = self._fetch_open_prs()
        prs = [p for p in prs if p.metadata.zone == zone_enum]

        if not prs:
            return f"No open PRs in zone {zone}."

        output = []
        output.append(f"Zone: {zone}")
        output.append("")
        output.append("Open PRs:")

        for pr in prs:
            status_icon = "✓" if pr.ci_status == "PASS" else "◯" if pr.ci_status == "RUNNING" else "✗"
            ready_icon = "✓" if not pr.blockers else "◯" if pr.ci_status == "RUNNING" else "⧗"
            output.append(f"  {ready_icon} #{pr.metadata.number} {status_icon} (SMAG: {pr.metadata.smag_prediction or 0:.2f})")

        output.append("")
        output.append(f"Summary:")
        output.append(f"  Ready: {len([p for p in prs if not p.blockers])}")
        output.append(f"  Pending: {len([p for p in prs if p.blockers])}")
        output.append(f"  Avg merge time: ~{int(sum(p.time_to_merge_hours for p in prs) / len(prs)) if prs else 0}h")

        output.append("")
        return "\n".join(output)

    def batch_assign(self, zone: str, action: str) -> str:
        """Generate instructions for batch operations."""
        try:
            zone_enum = Zone[zone.upper()]
        except KeyError:
            return f"Zone '{zone}' not recognized."

        prs = self._fetch_open_prs()
        prs = [p for p in prs if p.metadata.zone == zone_enum]

        if not prs:
            return f"No open PRs in zone {zone}."

        # Filter by action type
        if action == "review":
            # Only include PRs with review-related blockers (not CI/conflict issues)
            review_blocker_types = {BlockerType.REVIEW_PENDING, BlockerType.REVIEW_COMMENT}
            prs = [p for p in prs if p.reviews_requested or any(
                b.type in review_blocker_types for b in p.blockers
            )]
        elif action == "merge":
            prs = [p for p in prs if not p.blockers and p.ci_status == "PASS"]
        elif action == "fix":
            prs = [p for p in prs if p.ci_status == "FAIL" or p.merge_conflict]

        output = []
        output.append(f"Batch Assign: {zone} PRs awaiting {action}")
        output.append("")
        output.append(f"Found: {len(prs)} PRs")

        # Sort by urgency
        prs.sort(key=lambda p: (len(p.blockers), -p.merge_probability))

        total_time_min = 0
        for pr in prs:
            output.append(f"  #{pr.metadata.number} (SMAG: {pr.metadata.smag_prediction or 0:.2f}, Tier {pr.metadata.molt_tier_claimed.value})")
            if pr.blockers:
                time_est = self._parse_time_estimate(pr.blockers[0].time_estimate)
                total_time_min += time_est
                output.append(f"    → {time_est} min")

        if total_time_min > 0:
            output.append(f"\nTotal estimated time: {total_time_min} minutes")

        output.append("")
        return "\n".join(output)

    # Helper methods

    def _fetch_open_prs(self) -> List[PRStatus]:
        """Fetch all open PRs and their status.

        TODO: Wire to GitHub MCP tools:
          - mcp__github__list_pull_requests() to get all open PRs
          - For each PR: get_check_runs(), get_reviews(), parse metadata
          - Build PRStatus objects with blocker detection

        Phase 1 implementation will use local caching of PR state.
        """
        # Placeholder: return empty list until GitHub integration wired
        return []

    def _fetch_pr_status(self, pr_number: int) -> Optional[PRStatus]:
        """Fetch status for a specific PR.

        TODO: Wire to GitHub MCP tools:
          - mcp__github__pull_request_read(method='get') for PR metadata
          - Check runs and review state from same call
          - Parse governance metadata from PR body
          - Return PRStatus with all blockers and recommendations
        """
        # Placeholder: return None until GitHub integration wired
        return None

    def _status_badge(self, pr: PRStatus) -> str:
        """Generate status badge string."""
        if pr.blockers:
            return f"PENDING ({pr.blockers[0].type.value})"
        if pr.ci_status == "PASS" and not pr.merge_conflict:
            return "READY TO MERGE"
        if pr.ci_status == "RUNNING":
            return "CI RUNNING"
        return pr.ci_status

    def _time_ago(self, timestamp: str) -> str:
        """Convert ISO timestamp to human-readable 'time ago'."""
        # Placeholder
        return timestamp

    def _parse_time_estimate(self, estimate: str) -> int:
        """Parse time estimate string to minutes."""
        if "h" in estimate:
            return int(estimate.replace("h", "")) * 60
        if "m" in estimate:
            return int(estimate.replace("m", ""))
        return 0


if __name__ == "__main__":
    import sys

    manager = PRManager()

    if len(sys.argv) < 2:
        print("Usage: pr_manager.py <command> [args]")
        print("Commands: status, blockers, action-plan <PR#>, zone <Z1|Z2|Z3>, batch-assign <ZONE> <ACTION>")
        sys.exit(1)

    command = sys.argv[1]

    if command == "status":
        print(manager.status())
    elif command == "blockers":
        print(manager.blockers())
    elif command == "action-plan" and len(sys.argv) > 2:
        print(manager.action_plan(int(sys.argv[2])))
    elif command == "zone" and len(sys.argv) > 2:
        print(manager.zone(sys.argv[2]))
    elif command == "batch-assign" and len(sys.argv) > 3:
        print(manager.batch_assign(sys.argv[2], sys.argv[3]))
    else:
        print("Invalid command or missing arguments.")
        sys.exit(1)
