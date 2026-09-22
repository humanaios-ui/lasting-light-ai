# PR Manager Integration Guide

## Overview

The PR Manager Agent (from humanaios-ui/operations PR #451) has been integrated into the lasting-light-ai workflow to provide **governance-aware PR tracking and progression**. This enables continuous observability into the Witness system development lifecycle.

## Quick Start

```bash
# Show dashboard of all open PRs
/pr-manager status

# Show only PRs with active blockers
/pr-manager blockers

# Get detailed action plan for a specific PR
/pr-manager action-plan 42

# Filter PRs by governance zone
/pr-manager zone Z1
```

## Example: PR #42 Analysis

PR #42 (Witness System: Integrated Homepage & Constitutional Architecture) demonstrates how the PR Manager tracks governance-aware PR progression:

### PR #42 Status Dashboard

```
PR #42: Witness System: Integrated Homepage & Constitutional Architecture
  Repository: humanaios-ui/lasting-light-ai
  Zone: Z1 (Claude proposer)
  Status: READY TO MERGE
  Blocker: None
  SMAG Confidence: 0.98 (High)
  Molt Tier: TIER_0 (Pure specification, no constants/gates)
  
TIMELINE
  Created: 2026-09-21 18:07:11 UTC
  Time Open: 14 hours
  
CI STATUS
  ✓ Quality checks passed
  ✓ E2E tests passed
  ✓ Cloudflare deployment successful
  
REVIEWS
  ✓ Owner (@humanaios-ui): RESOLVED - 4 review rounds
  ✓ Copilot Bot: COMMENTED - 10 findings (mostly minor)
  
BLOCKERS
  Active blockers: 0 (NONE)
  ✓ CI fully green
  ✓ No merge conflicts
  ✓ All review comments resolved
  
Z1 AUTHORITY (Claude)
  • No additional gates required
  • Mergeable immediately
  • Recommendation: MERGE
  
Z2 AUTHORITY (Operator)
  • No Z2 ratification required
  • Status: Not blocking
  
EXPECTED OUTCOME
  Merge probability: 98%
  Time to merge: Ready now
  Impact: Safe (Molt Tier 0 — specification only)
```

### Key Insights

1. **Z1 Governance** — PR #42 is Z1 authority only (Claude proposer), requiring no human ratification
2. **SMAG Confidence 0.98** — High merge probability based on:
   - All CI checks passing
   - All blockers resolved
   - Owner approval
   - Pure specification tier (no risky code changes)
3. **Molt Tier 0** — No constants or gates modified, safe to merge
4. **14 Hours Open** — Efficient review cycle with 4 rounds of feedback

## Governance Integration

### Z-Role Authority Structure

**Z1 (Claude/Proposer)**
- Creates PRs with governance metadata
- Fixes issues, addresses feedback
- Monitors blockers and merge readiness
- Requests Z2 review when needed
- **Authority**: Merge Z1-scoped PRs independently

**Z2 (Operator/Ratifier — Carly)**
- Reviews high-impact changes (constants, gates, credentials)
- Provides Z2 ratification hash
- Approves governance changes
- **Authority**: Merge Z2-scoped PRs after review

**Z3 (Deploy/Infrastructure)**
- Handles credential changes and deployments
- Requires both Z1 and Z2 approval
- **Authority**: Execute deployment operations

### Molt Tier Classification

Determines PR risk level and merge authority:

- **Tier 0** — No constants or gates → Z1 can merge
- **Tier 1** — Constants only → Z2 review required
- **Tier 2** — Gates/credentials → Z1+Z2 approval required

PR #42 is **Tier 0** (pure specification), so it's fully Z1-mergeable.

## Commands Reference

### `/pr-manager status`

Displays real-time dashboard of all open PRs:

```
PR #42: Witness System [ZONE: Z1]
  Status: READY TO MERGE
  Blocker: None
  SMAG: 0.98
  Molt: Tier 0

PR #43: [Next PR] [ZONE: Z2]
  Status: PENDING REVIEW
  Blocker: 1 review comment
  SMAG: 0.75
  Molt: Tier 1
```

### `/pr-manager blockers`

Shows PRs with active blockers, ranked by severity:

```
CRITICAL (Merge blocked):
  #450: Merge conflict with main

MAJOR (Review blocked):
  #448: 2 unresolved design comments

MINOR (CI issues):
  #449: Flaky test (likely flake)
```

### `/pr-manager action-plan <PR#>`

Detailed next steps for a specific PR:

```
PR #42: Witness Nervous System Integration

Current State:
  Author: Claude
  Branch: claude/humanaios-witness-homepage-dknfmr
  Created: 2026-09-21 18:07:11 UTC
  CI: ✓ All pass
  
Blocker Analysis:
  Active blockers: 0
  
Suggested Actions:
  ✓ All CI checks passing
  ✓ All blockers resolved
  ✓ Owner approved changes
  → READY TO MERGE
  
Expected Outcome:
  Merge probability: 98%
  Authority required: Z1 only
  Impact: Safe (Molt Tier 0)
```

### `/pr-manager zone <Z1|Z2|Z3>`

Filters PRs by governance zone:

```
Zone: Z1 (Claude Authority)

Open PRs:
  #42 ✓ Ready to merge
  #44 ◯ Pending review
  #45 ⧗ Waiting for CI

Summary:
  Ready: 1
  Pending: 1
  Waiting: 1
  Merge rate (7d): 100%
```

### `/pr-manager batch-assign <ZONE> <ACTION>`

Batch operations for multiple PRs:

```
Batch: Z1 PRs awaiting merge

Found: 3 PRs
  #42 — SMAG 0.98, Tier 0, ready now (2 min)
  #44 — SMAG 0.85, Tier 0, ready now (2 min)
  #46 — SMAG 0.72, Tier 1, needs Z2 (20 min)

Total estimated time: 24 min
```

## Integration Benefits

1. **Continuous Observability** — Always know PR status and blockers
2. **Governance Alignment** — Z-role authority tracked at every stage
3. **Risk Assessment** — SMAG confidence and Molt tier predict merge safety
4. **Efficient Dispatch** — Batch operations ordered by urgency × time
5. **Receipt Tracking** — Monitors evidence reconciliation and ratification
6. **Blocker Prioritization** — Critical (CI red, conflicts) vs major vs minor

## Configuration

PR Manager config is in `.claude/skills/pr-manager/config.json`:

```json
{
  "github": {
    "owner": "humanaios-ui",
    "repo": "lasting-light-ai",
    "base_branch": "main"
  },
  "governance": {
    "z1_canonical_email": "claude@anthropic.com",
    "z2_canonical_email": "carly.r.anderson@gmail.com",
    "z2_decision_window_hours": 48,
    "z2_urgent_window_hours": 24
  },
  "molt": {
    "tier_0_max_time_hours": 4,
    "tier_1_max_time_hours": 24,
    "tier_2_max_time_hours": 72
  }
}
```

## Next Steps

1. Use `/pr-manager status` to monitor all open PRs
2. Address blockers identified by `/pr-manager blockers`
3. Create detailed action plans with `/pr-manager action-plan <PR#>`
4. Batch operations with `/pr-manager batch-assign Z1 merge`
5. Track governance compliance with zone filtering

---

**Related PRs:**
- humanaios-ui/lasting-light-ai#42 (Witness Nervous System integration)
- humanaios-ui/operations#451 (PR Manager Agent implementation)
