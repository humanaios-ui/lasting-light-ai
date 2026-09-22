# PR Manager Agent

Governance-aware PR tracking and progression for the HumanAIOS operations repository.

## Quick Start

```bash
# Show all open PRs with status
/pr-manager status

# Show only PRs with blockers
/pr-manager blockers

# Get detailed action plan for a specific PR
/pr-manager action-plan 445

# Filter by governance zone
/pr-manager zone Z2

# Batch operations
/pr-manager batch-assign Z2 review
```

## Features

### 1. Real-Time Dashboard (`status`)

Displays all open PRs with:
- PR number and title
- Governance zone (Z1/Z2/Z3)
- Status (READY TO MERGE / PENDING / CI RUNNING / etc.)
- Active blockers
- Suggested next action
- SMAG prediction (merge confidence)
- Molt tier classification

**Example:**
```
PR #445: Fix YAML parse errors [ZONE: Z1]
  Status: READY TO MERGE
  Blocker: None
  Action: Merge when Z2 ratification hash received
  SMAG: 0.92 confidence
  Molt: Tier 0
```

### 2. Blocker Analysis (`blockers`)

Identifies PRs with active blockers, ranked by severity:

| Severity | Type | Resolution | Time |
|----------|------|-----------|------|
| CRITICAL | CI Red, Merge Conflict, Receipt Gap | Fix code, resolve conflict | 15m–2h |
| MAJOR | Review Pending, Review Comment | Wait or address | 1h–48h |
| MINOR | CI Flake, Z3 Await Deploy | Investigate or wait | 5m–2h |

### 3. Detailed Action Plans (`action-plan <PR#>`)

For each PR, shows:
- Current state (author, branch, created date, CI status)
- Blocker analysis (what's blocking merge)
- Suggested actions (step-by-step)
- Expected outcome (merge probability, time to merge)
- Z2/Z3 notes (molt tier, SMAG, receipt status)

### 4. Zone Filtering (`zone <Z1|Z2|Z3>`)

Filter PRs by governance zone:
- **Z1**: AI-executable, no ratification needed
- **Z2**: Requires operator (Night/Z2) ratification
- **Z3**: Involves credentials/billing/deploy

Shows per-zone summary:
- Ready to merge
- Pending review/action
- Average merge time

### 5. Batch Operations (`batch-assign <ZONE> <ACTION>`)

Process multiple PRs efficiently:
- **Action: review** — PRs awaiting review
- **Action: merge** — PRs ready to merge (all checks pass, no conflicts)
- **Action: fix** — PRs with CI failures or conflicts

Shows:
- Count of PRs matching criteria
- Recommended order (by urgency × reviewer time budget)
- Time estimate for each PR
- Total estimated time

## Governance Integration

### Z-Role Authority

**Z1 (Proposers — Claude)**
- Create PRs with governance metadata
- Monitor blockers and fix issues
- Request Z2 review once ready

**Z2 (Ratifiers — Night)**
- Review PRs for governance compliance
- Sign ratification hash once approved
- Enforce anti-cascade rules

**Z3 (Executors)**
- Merge PRs with Z2 hash + CI green
- Emit VERDICT events
- Deploy per zone role

### Governance Metadata Extracted

From each PR description:

```markdown
## Prediction (SMAG calibration)
smag_p: 0.92

## Molt Classification
molt_tier_claimed: `0`

## Zone
- [x] **Z1** — AI-executable, no ratification needed
```

- **SMAG prediction** (0.0–1.0): Author's confidence the PR will merge
- **Molt tier** (0/1/2): Constant/gate change classification
  - Tier 0: No constants or gates
  - Tier 1: Constants only (weights, caps, rubrics)
  - Tier 2: Gates (.github/workflows, system_graph.json, etc.)
- **Zone**: Z1/Z2/Z3 authority level required

### Blockers

Eight blocker types, each with resolution path and time estimate:

1. **CI Red** — One or more check failed
   - Resolution: Fix code, push, re-run
   - Severity: CRITICAL
   - Time: 15m–2h

2. **CI Flake** — Flaky test, likely to pass on retry
   - Resolution: Confirm pattern, re-run, comment
   - Severity: MINOR
   - Time: 5m–30m

3. **Merge Conflict** — PR branch conflicts with base
   - Resolution: Merge base, resolve, push
   - Severity: CRITICAL
   - Time: 10m–1h

4. **Review Pending** — Review requested but not yet submitted
   - Resolution: Wait for reviewer
   - Severity: MAJOR
   - Time: 1h–48h (Z2 window)

5. **Review Comment** — Reviewer left unresolved comment
   - Resolution: Address comment, reply, re-request review
   - Severity: MAJOR
   - Time: 15m–2h

6. **Receipt Gap** — Claim in transcript not found in tree
   - Resolution: File IC-candidate, link in REGISTERED.md, await Z2 decision
   - Severity: CRITICAL
   - Time: 24h–48h

7. **Z2 Await Hash** — Awaiting Z2 ratification signature
   - Resolution: Z2 reviews, signs hash
   - Severity: MAJOR
   - Time: 1h–48h

8. **Z3 Await Deploy** — PR merged, awaiting Z3 execution
   - Resolution: Z3 merges/deploys
   - Severity: MINOR
   - Time: 5m–2h

## Configuration

See `config.json` for:
- GitHub repo settings
- Governance authority emails and windows
- Blocker severity levels
- Time estimates per blocker type
- Output format preferences
- Permissions model

### Example Override

To change Z2 decision window from 48h to 24h:

```json
{
  "governance": {
    "z2_decision_window_hours": 24
  }
}
```

## Architecture

### Data Flow

```
┌─ GitHub API (PRs, checks, reviews)
│
├─ REGISTERED.md (Z2 ratification hashes, findings)
│
├─ PRIORITY_QUEUE.md (impact scores, blocker ranking)
│
├─ ZONE_REGISTRY.md (active repos, executor assignments)
│
├─ PR diff → molt tier classification
│
└─ CI gate state → check run analysis
       ↓
    [PR Manager]
       ↓
    Blocker Detection
    ├─ CI status analysis
    ├─ Review state analysis
    ├─ Merge conflict detection
    ├─ Receipt gap checking
    └─ Z2 authority checks
       ↓
    Action Planning
    ├─ Suggest next steps (by zone/role)
    ├─ Estimate time to resolution
    ├─ Rank by urgency × blocker severity
    └─ Generate batch operations
       ↓
    Dashboard / Blockers / Action Plan / Zone Filter / Batch Assign
```

### Blocker Detection Logic

For each open PR:

1. **Read metadata** from description (SMAG, molt tier, zone)
2. **Fetch CI status** from check runs
3. **Fetch review state** from pull request reviews
4. **Check merge conflict** from PR merge_conflict field
5. **Scan for receipt gaps** against REGISTERED.md
6. **Classify blockers** using blocker taxonomy
7. **Estimate resolution** using time model
8. **Calculate merge probability** from signals:
   - Base = SMAG prediction
   - CI impact: × 0.3 if FAIL, × 0.6 if RUNNING
   - Conflict impact: × 0.5 if present
   - Review impact: × 0.6 if changes requested, × 1.1 if approved
9. **Suggest actions** based on zone and blocker type

## Examples

### Example 1: Monitor Z2 PR Awaiting Review

```bash
$ /pr-manager action-plan 446

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
  - Review Comment (line 42): "Why prefer convergence_weight over learned_weight?"
    Status: Unresolved
    Impact: Blocks Z2 approval

Suggested Actions:
  1. Read the review comment in full
  2. Answer on the thread: explain the design choice
  3. Push any code changes if requested
  4. Request re-review from Night

Expected Outcome:
  - Merge probability: 0.92 (SMAG baseline)
  - Time to merge: 24h (if Z2 approves within 48h window)

Z2 Note:
  Molt tier claimed: Tier 1
  SMAG prediction: 0.75 (risky change)
  Receipt reconciliation: Awaiting findings-registry merge
```

### Example 2: Batch Assign Z2 Reviews

```bash
$ /pr-manager batch-assign Z2 review

Found 3 PRs awaiting Z2 decision:
  1. #445 (2 min) — SMAG 0.92, Tier 0, just needs hash
  2. #448 (5 min) — SMAG 0.81, Tier 0, approve & hash
  3. #446 (15 min) — SMAG 0.75, Tier 1, address design Q

Total estimated time: 22 minutes
```

### Example 3: List All Z1 PRs

```bash
$ /pr-manager zone Z1

Zone: Z1

Open PRs:
  ✓ #445 ✓ (SMAG: 0.92)
  ✓ #447 ◯ (SMAG: 0.68)

Summary:
  Ready: 1
  Pending: 1
  Avg merge time: ~12h
```

## Related Files

- **CLAUDE.md** — Authority & Z-role governance
- **REGISTERED.md** — Live registry of findings & Z2 signatures
- **PRIORITY_QUEUE.md** — Impact scoring & blocker ranking
- **ZONE_REGISTRY.md** — Active repos & executor assignments
- **.github/workflows/z2_ratification_gate.yml** — CI merge gate
- **tools/molting_protocol_diff_v1_0.py** — Molt tier classification

## Future Enhancements

- [ ] Automatic receipt gap detection from REGISTERED.md live-fetch
- [ ] Brier score tracking for SMAG calibration
- [ ] Molt window close notifications
- [ ] Z2 decision window expiry alerts
- [ ] Anti-cascade rule enforcement in UI
- [ ] Per-PR verdicts from NF_LEDGER.jsonl
- [ ] Merge conflict resolution suggestions
- [ ] CI failure root cause analysis
- [ ] Flake pattern detection and auto-comment
- [ ] Z3 executor status tracking per zone

## Development

To extend the PR Manager:

1. **Add new blocker type**: Update `BlockerType` enum in `pr_manager.py`
2. **Add new command**: Add method to `PRManager` class
3. **Improve detection**: Enhance blocker detection logic in `github_integration.py`
4. **Update config**: Modify `config.json` with new settings
5. **Test**: Run `pr_manager.py <command>` to verify

## Support

- For governance questions: See CLAUDE.md
- For issue: File issue in humanaios-ui/operations
- For feature request: Create PR with enhancement

