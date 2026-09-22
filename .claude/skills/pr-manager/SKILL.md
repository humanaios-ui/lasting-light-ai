# PR Manager Agent

**Status:** Active  
**Scope:** Governance-aware PR tracking and progression  
**Authority:** Z1 (Claude proposer) reads PR state, suggests actions; Z2/Z3 execute

---

## Overview

The PR Manager Agent helps you:

1. **Monitor PRs** — List open PRs with governance metadata (SMAG prediction, molt tier, zone)
2. **Identify Blockers** — CI failures, merge conflicts, review comments, receipt gaps
3. **Suggest Next Actions** — What needs to be done to move each PR forward
4. **Track Progress** — Predict merge probability, time to merge, action checklist
5. **Batch Operations** — Group PRs by status, zone, or blocker type for efficient dispatch

---

## Commands

### `/pr-manager status`

Print a real-time dashboard of all open PRs:

```
┌─ PR #445: Fix YAML parse errors [ZONE: Z1]
│  Status: READY TO MERGE (CI ✓, reviews ✓)
│  Blocker: None
│  Action: Merge when Z2 ratification hash received
│  SMAG: 0.92 confidence
│  Molt: Tier 0 (no constants)
│
├─ PR #446: Block ordering-bought corroboration [ZONE: Z2]
│  Status: PENDING REVIEW
│  Blocker: 1 review comment (unresolved)
│  Action: Address review comment, request re-review
│  SMAG: 0.75 confidence
│  Molt: Tier 1 (constants/weights)
│
└─ PR #447: Deferral rule research [ZONE: Z1]
   Status: CI RUNNING
   Blocker: None active
   Action: Wait for CI; then request review
   SMAG: 0.68 confidence
   Molt: Tier 0
```

### `/pr-manager blockers`

Show only PRs with active blockers, ranked by severity:

```
CRITICAL (Blocking merge):
  #445: Merge conflict with main (last updated 2h ago)

MAJOR (Blocking review):
  #446: 1 unresolved design comment

MINOR (Blocking CI):
  #447: Flaky test (passed on retry; likely flake)
```

### `/pr-manager action-plan <PR#>`

Detailed next-steps plan for a specific PR:

```
PR #446: Block ordering-bought corroboration [ZONE: Z2]

Current State:
  Author: Claude
  Branch: claude/ordering-bought-corroboration
  Target: main
  Created: 2d ago
  Last push: 1d ago
  CI: ✓ All checks pass
  Reviews: 1 requested (Night/Z2)

Blocker Analysis:
  - Review comment (line 42): "Why prefer convergence_weight over learned_weight?"
    Status: Unresolved
    Impact: Blocks Z2 approval

Suggested Actions:
  1. Read the review comment in full
  2. Answer on the thread: explain the design choice
  3. Push any code changes if requested
  4. Request re-review from Night

Expected Outcome:
  - If resolved: Merge probability 0.92 (SMAG baseline)
  - Time to merge: 24h (if Z2 approves within 24h window)

Z2 Note:
  Molt tier claimed: Tier 1
  SMAG prediction: 0.75 (risky change)
  Receipt reconciliation: Awaiting findings-registry merge
```

### `/pr-manager zone <ZONE>`

Filter PRs by governance zone:

```
Zone: Z2 (Operator Ratification)

Open PRs:
  #445 ✓ Ready to merge (awaiting Z2 hash)
  #446 ◯ Pending Z2 review (1 comment unresolved)
  #448 ⧗ Waiting for Z2 decision (48h window)

Summary:
  Ready: 1
  Pending: 1
  Waiting on Z2: 1
  Merge rate (last 7d): 85% (avg time: 18h)
```

### `/pr-manager batch-assign <ZONE> <ACTION>`

Generate instructions for batch operations:

```
Batch Assign: Z2 PRs awaiting review

Found: 3 PRs
  #445 — SMAG 0.92, Tier 0, awaiting Z2 hash
  #446 — SMAG 0.75, Tier 1, needs review
  #448 — SMAG 0.81, Tier 0, needs approval

Recommended Order (by urgency × Z2 time budget):
  1. #445 (quickest: just sign hash) → 2 min
  2. #448 (simple: approve) → 5 min
  3. #446 (complex: address design Q) → 15 min

Total estimated time: 22 min
```

---

## Architecture

### Data Sources

- **GitHub API** (via mcp__github__*)
  - PR metadata, status, CI checks, reviews, comments
  - Branch info, merge state, conflicts

- **REGISTERED.md** (live-fetch)
  - F/IC/H/MOLT candidates, Z2 ratification hashes
  - Receipt reconciliation status

- **PR diff** (file-based)
  - Molt tier classification (constants/gates detection)
  - SMAG metadata extraction from description

- **.github/workflows/** (CI gate state)
  - Check run status, failed jobs, retry history

### Blockers Taxonomy

| Blocker | Type | Resolution | Time Est. |
|---------|------|-----------|-----------|
| CI Red | Actionable | Fix code, push, re-run | 15m–2h |
| CI Flake | Investigation | Confirm flake, re-run, comment | 5m–30m |
| Merge Conflict | Actionable | Merge base, resolve, push | 10m–1h |
| Review Pending | Waiting | Wait for reviewer decision | 1h–48h |
| Review Comment | Actionable | Address, reply, re-request | 15m–2h |
| Receipt Gap | Governance | File IC, await Z2 decision | 24h–48h |
| Z2 Await Hash | Waiting | Z2 ratifies, signs hash | 1h–48h |
| Z3 Await Deploy | Waiting | Z3 executes merge, deploy | 5m–2h |

### Decision Routing

```
PR Status → Blocker? → Action → Owner → Expected Wait
    ↓           ↓        ↓         ↓            ↓
Ready       None     Merge    Z2/Z3       5–60m
Pending     Review   Reply    Z1          1–48h
CI Fail     Code     Fix+Push  Z1         15m–2h
Conflict    Git      Merge    Z1          10m–1h
Await Z2    Hash     Sign     Z2/Admiral  1–48h
```

---

## Integration with Governance

### Z1 (Proposer) Workflow

1. **Create PR** with governance metadata:
   - `## What & why` — clear description
   - `smag_p: 0.XX` — confidence prediction
   - `molt_tier_claimed: [0|1|2]` — constant/gate change classification
   - Zone selection (`Z1 / Z2 / Z3`)

2. **Monitor blocker** via `/pr-manager action-plan <PR#>`
   - CI failures → fix code, push, re-run
   - Review comments → address, re-request review
   - Receipt gaps → file IC-candidate, link in REGISTERED.md

3. **Handoff to Z2** once ready
   - All CI passes
   - No merge conflicts
   - All review comments addressed
   - Receipt reconciliation complete

### Z2 (Ratifier) Workflow

1. **Review PR** with governance lens:
   - Is SMAG prediction reasonable? Flag if overconfident.
   - Is molt tier correct? CI will measure and audit.
   - Are receipt gaps resolved? Block if not.

2. **Sign ratification hash** (once approved)
   - `RATIFY sha256(PR#:<commit> | by=Night | at=<timestamp> | decision=ACCEPT)`
   - Push to REGISTERED.md

3. **Monitor Z3 execution** once merged
   - Check CI on main branch
   - Verify deploy if applicable

### Z3 (Executor) Workflow

1. **Merge PR** only with Z2 hash + CI green
   - CI enforces: no merge without valid hash
   - Stop-hook validates: INTENT-OS capability or authorized identity

2. **Emit VERDICT** event
   - Brier score (prediction vs. outcome)
   - Receipt reconciliation summary
   - Any findings (F/IC/H) discovered during merge

3. **Deploy** per zone role
   - Main branch only (no direct prod)
   - Log all VERDICT events to NF_LEDGER.jsonl

---

## Configuration

### .claude/settings.json

```json
{
  "pr-manager": {
    "enabled": true,
    "watch_zones": ["Z1", "Z2"],
    "blockers_threshold": "MAJOR",
    "auto_dashboard": true,
    "receipt_reconciliation": true,
    "smag_confidence_floor": 0.50
  }
}
```

### Environment Variables

- `GITHUB_OWNER=humanaios-ui`
- `GITHUB_REPO=operations`
- `Z2_CANONICAL_EMAIL=carly.r.anderson@gmail.com`
- `Z2_BUSINESS_EMAIL=aioshuman@gmail.com`

---

## Examples

### Example 1: Monitor a Z2 PR Awaiting Review

```bash
$ /pr-manager status

PR #446: Block ordering-bought corroboration [ZONE: Z2]
  Status: PENDING Z2 REVIEW
  Blocker: 1 unresolved review comment
  SMAG: 0.75 (risky change)
  Molt: Tier 1 (constants/weights)
  
  Next Action (Z1): Address review comment & re-request
  Expected by: 24h from now (Z2 48h window)
```

### Example 2: Batch Process Z2 Approvals

```bash
$ /pr-manager batch-assign Z2 review

Found 3 PRs awaiting Z2 decision:
  1. #445 (2 min) — SMAG 0.92, Tier 0, just needs hash
  2. #448 (5 min) — SMAG 0.81, Tier 0, approve & hash
  3. #446 (15 min) — SMAG 0.75, Tier 1, address design Q

Estimated total: 22 minutes
```

### Example 3: Identify Receipt Gaps

```bash
$ /pr-manager blockers

CRITICAL (Blocking merge):
  #445: Receipt gap — claim in transcript not in tree
    Action: File IC-candidate, link in REGISTERED.md
    Expected: Z2 decision within 48h
```

---

## Related

- **CLAUDE.md** — Governance authority & Z-role definitions
- **REGISTERED.md** — Live registry of F/IC/H/MOLT candidates & Z2 signatures
- **PRIORITY_QUEUE.md** — Impact scoring and Z2 ranked decisions
- **.github/workflows/z2_ratification_gate.yml** — CI enforcement
- **tools/molting_protocol_diff_v1_0.py** — Molt tier classification

