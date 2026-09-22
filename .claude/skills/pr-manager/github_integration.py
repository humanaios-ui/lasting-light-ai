#!/usr/bin/env python3
"""
GitHub integration for PR Manager — fetches and parses PR data via GitHub API.

Integrates with mcp__github__* tools to retrieve:
  - Open PRs with full metadata
  - CI check status and failed jobs
  - Review state and comments
  - Merge conflict state
  - Author and branch information
"""

import json
import re
from typing import Optional, List, Dict, Any
from dataclasses import dataclass


@dataclass
class GitHubPRData:
    """Raw data fetched from GitHub API."""
    number: int
    title: str
    body: str
    author: str
    created_at: str
    updated_at: str
    branch: str
    target: str
    url: str
    state: str  # "open" or "closed"
    draft: bool
    merge_conflict: bool
    reviews: List[Dict[str, Any]]
    check_runs: List[Dict[str, Any]]
    labels: List[str]


class GitHubIntegration:
    """Fetches and parses PR data from GitHub."""

    # Paths for molt tier classification
    CONSTANTS_PATHS = [
        "behavior_spec.json",
        "RESOURCE_UNITS.yaml",
        "constants.json",
        "weights/",
        "caps/",
        "rubrics/",
    ]

    GATE_PATHS = [
        ".github/workflows/",
        ".z1-control/",
        "system_graph.json",
        ".github/CODEOWNERS",
        "ci_gates.py",
    ]

    def __init__(self, owner: str, repo: str):
        self.owner = owner
        self.repo = repo

    def parse_governance_metadata(self, body: str) -> Dict[str, Any]:
        """Extract governance metadata from PR description."""
        metadata = {
            "zone": None,
            "smag_prediction": None,
            "molt_tier_claimed": None,
            "receipt_reconciliation": None,
        }

        # Normalize null body to empty string (GitHub returns null for missing descriptions)
        if body is None:
            body = ""

        # Parse SMAG prediction: smag_p: 0.XX
        smag_match = re.search(r"smag_p:\s*(0\.\d{2})", body, re.IGNORECASE)
        if smag_match:
            try:
                metadata["smag_prediction"] = float(smag_match.group(1))
            except ValueError:
                pass

        # Parse molt tier: molt_tier_claimed: [0|1|2]
        molt_match = re.search(r"molt_tier_claimed:\s*`?(\d)`?", body, re.IGNORECASE)
        if molt_match:
            try:
                metadata["molt_tier_claimed"] = int(molt_match.group(1))
            except ValueError:
                pass

        # Parse zone: [ ] **Z1** / [ ] **Z2** / [ ] **Z3**
        if re.search(r"\[x\]\s*\*\*Z1\*\*", body, re.IGNORECASE):
            metadata["zone"] = "Z1"
        elif re.search(r"\[x\]\s*\*\*Z2\*\*", body, re.IGNORECASE):
            metadata["zone"] = "Z2"
        elif re.search(r"\[x\]\s*\*\*Z3\*\*", body, re.IGNORECASE):
            metadata["zone"] = "Z3"

        # Check receipt reconciliation: [ ] Immune memory
        if re.search(r"\[x\]\s*\*\*Immune memory\*\*", body, re.IGNORECASE):
            metadata["receipt_reconciliation"] = True

        return metadata

    def analyze_check_runs(self, check_runs: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze CI check runs to determine status."""
        analysis = {
            "status": "PASS",  # "PASS", "FAIL", "RUNNING"
            "failed_jobs": [],
            "flaky_jobs": [],
            "running_jobs": [],
        }

        for run in check_runs:
            conclusion = run.get("conclusion", "pending")
            status = run.get("status", "pending")
            name = run.get("name", "Unknown")

            if status == "in_progress":
                analysis["running_jobs"].append(name)
                if analysis["status"] == "PASS":
                    analysis["status"] = "RUNNING"
            elif conclusion == "failure":
                analysis["failed_jobs"].append(name)
                analysis["status"] = "FAIL"
            elif conclusion == "neutral":
                # Neutral checks don't block merge
                pass

        return analysis

    def analyze_reviews(self, reviews: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze PR reviews to determine review state."""
        analysis = {
            "requested_reviewers": [],
            "approved_by": [],
            "changes_requested_by": [],
            "review_comments_count": 0,
        }

        # Track unique reviewers by latest submission
        reviewer_state = {}
        for review in reviews:
            reviewer = review.get("user", {}).get("login", "Unknown")
            state = review.get("state", "COMMENTED")
            reviewer_state[reviewer] = state

        # Summarize
        for reviewer, state in reviewer_state.items():
            if state == "APPROVED":
                analysis["approved_by"].append(reviewer)
            elif state == "CHANGES_REQUESTED":
                analysis["changes_requested_by"].append(reviewer)

        return analysis

    def estimate_molt_tier(self, files_changed: List[str], body: str) -> int:
        """Estimate molt tier from changed files and description."""
        # Normalize null body
        if body is None:
            body = ""

        # First check if author claimed a tier
        metadata = self.parse_governance_metadata(body)
        if metadata.get("molt_tier_claimed") is not None:
            return metadata["molt_tier_claimed"]

        # Otherwise, infer from file paths
        has_constants = any(
            any(const_path in f for const_path in self.CONSTANTS_PATHS)
            for f in files_changed
        )
        has_gates = any(
            any(gate_path in f for gate_path in self.GATE_PATHS)
            for f in files_changed
        )

        if has_gates:
            return 2
        if has_constants:
            return 1
        return 0

    def estimate_merge_probability(
        self,
        ci_status: str,
        has_merge_conflict: bool,
        reviews: Dict[str, Any],
        smag_prediction: Optional[float],
    ) -> float:
        """Estimate merge probability based on multiple signals."""
        base_prob = smag_prediction or 0.75

        # CI status impact
        if ci_status == "FAIL":
            base_prob *= 0.3
        elif ci_status == "RUNNING":
            base_prob *= 0.6

        # Merge conflict impact
        if has_merge_conflict:
            base_prob *= 0.5

        # Review impact
        if reviews.get("changes_requested_by"):
            base_prob *= 0.6
        elif reviews.get("approved_by"):
            base_prob *= 1.1  # Boost if already approved

        # Cap at 0.0-1.0
        return max(0.0, min(1.0, base_prob))

    def estimate_time_to_merge(
        self,
        ci_status: str,
        has_merge_conflict: bool,
        reviews_pending: List[str],
        molt_tier: int,
    ) -> int:
        """Estimate time to merge in hours."""
        estimate = 0

        # CI time
        if ci_status == "RUNNING":
            estimate += 0.5  # Assume ~30min for CI
        elif ci_status == "FAIL":
            estimate += 1.0  # ~1h to fix and re-run

        # Merge conflict time
        if has_merge_conflict:
            estimate += 0.5

        # Review time (Z2 48h window)
        if reviews_pending:
            estimate += 24  # Conservative: ~1d for review

        # Molt tier time (higher tiers = more scrutiny)
        if molt_tier == 2:
            estimate += 12
        elif molt_tier == 1:
            estimate += 6

        # Round up to nearest hour
        return max(1, int(estimate + 0.5))


class PRDataValidator:
    """Validates PR data for governance compliance."""

    @staticmethod
    def check_smag_prediction(pr_data: GitHubPRData, smag_prediction: Optional[float]) -> tuple[bool, str]:
        """Validate SMAG prediction is present and reasonable."""
        if smag_prediction is None:
            return False, "SMAG prediction missing (required for all PRs)"

        if not (0.0 <= smag_prediction <= 1.0):
            return False, f"SMAG prediction {smag_prediction} out of range [0.0, 1.0]"

        return True, "SMAG prediction valid"

    @staticmethod
    def check_molt_tier(pr_data: GitHubPRData, molt_tier: int) -> tuple[bool, str]:
        """Validate molt tier is correctly claimed."""
        if molt_tier not in [0, 1, 2, -1]:  # -1 = unknown
            return False, f"Molt tier {molt_tier} invalid (must be 0, 1, or 2)"

        return True, "Molt tier valid"

    @staticmethod
    def check_zone(pr_data: GitHubPRData, zone: Optional[str]) -> tuple[bool, str]:
        """Validate zone selection."""
        if zone is None:
            return False, "Zone not selected (Z1, Z2, or Z3 required)"

        if zone not in ["Z1", "Z2", "Z3"]:
            return False, f"Zone {zone} invalid"

        return True, f"Zone {zone} selected"

    @staticmethod
    def check_immunity_memory(pr_data: GitHubPRData) -> tuple[bool, str]:
        """Check if PR registers findings in REGISTERED.md."""
        # Normalize null body
        body = pr_data.body or ""

        # TODO: Wire to live REGISTERED.md fetch + receipt reconciliation
        # For now, flag if description mentions IC/F/H as a signal
        if "IC-" in body or "F-" in body or "H-" in body:
            return True, "Immunity memory referenced"

        # Return unknown state until REGISTERED.md validation is wired
        return None, "Receipt validation not yet wired to REGISTERED.md (future phase)"


if __name__ == "__main__":
    # Example usage
    integration = GitHubIntegration("humanaios-ui", "operations")

    # Parse sample metadata
    sample_body = """
    ## What & why
    Fix YAML parse errors in CI workflows.

    ## Prediction (SMAG calibration)
    smag_p: 0.92

    ## Molt Classification
    molt_tier_claimed: `0`

    ## Zone
    - [x] **Z1** — AI-executable, no ratification needed
    """

    metadata = integration.parse_governance_metadata(sample_body)
    print(f"Extracted metadata: {metadata}")
