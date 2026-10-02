# Q-TEMPORAL-DISSOLUTION-01: Temporal Semantics Audit Report

**Date:** 2026-10-02  
**Auditor:** Claude Z1  
**Scope:** Canonical code audit for calendar-based work deadlines and internal temporal scheduling  
**Authority:** PRIORITY_QUEUE.md Q-TEMPORAL-DISSOLUTION-01 (CRITICAL, 100% blocking)

---

## Executive Summary

**CRITICAL FINDINGS:** 3 INVALID_INTERNAL_DEADLINE entries that directly block work priority/approval  
**TECHNICAL_SAFETY:** 4 valid cron/polling patterns (non-blocking)  
**OBSERVATIONAL:** 2 documentation/reporting references (non-blocking)  
**REGULATORY_EXTERNAL:** 1 candidate entry pending Z2 ratification

**Blocking Status:** Work cannot merge until INVALID entries are remediated.

---

## Audit Results

### CATEGORY: INVALID_INTERNAL_DEADLINE (Must remediate)

These are calendar-driven controls that prioritize or gate work based on elapsed time or fixed dates. Each must be removed or reclassified.

#### **Finding 1: OSF Pre-Registration Approval Deadline**

**File:** `.github/workflows/osf-preregistration.yml`  
**Lines:** 144, 187, 222, 256  
**Severity:** BLOCKING  
**Classification:** `INVALID_INTERNAL_DEADLINE`

**Problem:**
```yaml
# Line 144: Hardcoded deadline in PR comment
comment += `**Deadline:** 2026-10-01\n`;

# Line 187: Deadline in metadata
approval_deadline: '2026-10-01'

# Line 222: Used as approval gate timeout
approvalComment += `- Timeout: Until 2026-10-01 (deadline)\n`;

# Line 256: Deadline in workflow summary
echo "⏰ Deadline: 2026-10-01"
```

**Impact:**
- Approval workflow blocked by calendar date, not resource readiness
- Pre-registration cannot be published unless approval occurs before 2026-10-01
- Violates resource-based scheduling: doesn't check availability of approvers, review completeness, or actual readiness state

**Remediation:**
1. Remove all references to `2026-10-01` as approval deadline
2. Replace with resource-state gate:
   - `approval_required: true` (signal, not deadline)
   - Check: protocol validation passed + reviewer acknowledgment + resource availability
   - No calendar logic
3. Store approval metadata **without** deadline:
   ```json
   {
     "approval_required": true,
     "protocol_validated": true,
     "requires_review": ["maintainers"],
     "status": "awaiting_approval"
   }
   ```
4. Remove timeout language from all approval comments

---

#### **Finding 2: Funding Deadline Prioritization**

**File:** `/home/user/operations/src/humanaios_operations/deadline_checker.py`  
**Lines:** 26-87  
**Severity:** BLOCKING  
**Classification:** `INVALID_INTERNAL_DEADLINE`

**Problem:**
```python
# Uses elapsed time (days_left) to prioritize work
def check_deadlines(days_ahead: int = 30):
    results = {
        "urgent": [],     # < 7 days
        "soon": [],       # 7-30 days
        "upcoming": [],   # 30+ days
        "rolling": [],    # No deadline
    }
    
    for opp in opportunities:
        days_left = (deadline - now).days
        if days_left < 7:
            results["urgent"].append(...)  # HIGH priority if deadline near
        elif days_left < 30:
            results["soon"].append(...)    # MEDIUM priority
        else:
            results["upcoming"].append(...) # LOW priority
```

**Impact:**
- Work prioritized by calendar proximity, not impact/resource readiness
- Funding opportunity reviewed urgently (< 7d before deadline) regardless of actual capacity
- Violates PRIORITY_QUEUE.md benefit/density ranking model
- Can cause resource exhaustion chasing deadline-driven urgency

**Remediation:**
1. **Reclassify to REGULATORY_EXTERNAL only if:**
   - External funding deadline comes with explicit authority (grant agency mandate)
   - Z2 ratification present with external_constraint schema:
     ```json
     {
       "type": "REGULATORY_DEADLINE",
       "authority": "National Science Foundation",
       "citation": "NSF RAPID deadline 2026-10-15",
       "due_at": "2026-10-15T23:59:59Z",
       "evidence_ref": "https://nsf.gov/funding/opportunities/...",
       "impact_if_missed": "ineligible for $500k research grant",
       "z2_ratified": true,
       "ratification_date": "2026-09-28"
     }
     ```
2. **Remove internal deadline logic:**
   - Delete `days_left < 7 | < 30` categorization
   - Replace with resource-state check:
     - Availability: "Can we allocate time this week?"
     - Complexity: "Does this match our capability tier?"
     - Impact: "How many downstream objectives unblock?"
3. **Keep opportunity data** (for reference only):
   - Store deadline as OBSERVATIONAL metadata
   - Use only for filtering **past** deadlines (don't fund expired opportunities)
   - No urgency/priority derivation from date

---

#### **Finding 3: Hardcoded Phase Deadlines (Framework Audit)**

**File:** `.github/workflows/framework-audit.yml`  
**Lines:** 4, 38, 62, 69  
**Severity:** MEDIUM  
**Classification:** `INVALID_INTERNAL_DEADLINE`

**Problem:**
```yaml
# Line 4: Phase declared as time-based
Phase: 1 (Advisory)

# Line 38: Phase as gating variable
PHASE="1"  # Phase 1: advisory mode (non-blocking)
if [ "$PHASE" -ge 2 ]; then exit 1; fi

# Line 62: "Phase 2 deadline" language
echo "Phase 2 deadline: Add to CLAUDE.md:"

# Line 69: Phase check determines pass/fail
if [ "$PHASE" -ge 2 ]; then
    exit 1  # FAIL audit at Phase 2
fi
```

**Impact:**
- Framework compliance gated on "Phase number reaching 2" not actual readiness
- Audit will fail automatically when Phase increments, regardless of work state
- Creates hidden calendar pressure: "we need to be compliant before Phase 2 is enforced"

**Remediation:**
1. Remove phase numbering as a time-based gate
2. Use **actual compliance state**:
   - `COMPLIANT` = FRAMEWORK_MAPPING.md exists and referenced in CLAUDE.md
   - `NON_COMPLIANT` = reference missing
   - No phase-based gating
3. Update workflow:
   ```bash
   if [ "$FRAMEWORK_REF_PRESENT" = "true" ]; then
       echo "✅ PASS"
       exit 0
   else
       echo "⚠️  NON-COMPLIANT: Add FRAMEWORK_MAPPING reference"
       exit 1  # Fail audit based on state, not phase number
   fi
   ```
4. If actual phase transitions are needed (e.g., "Phase 2 enforcement"), store in RESOURCE_UNITS.yaml with Z2 ratification and REGULATORY_EXTERNAL classification

---

### CATEGORY: TECHNICAL_SAFETY (Valid - keep as-is)

These are scheduling mechanisms for monitoring, retries, and resource cleanup. They do NOT prioritize human work and may protect correctness.

#### **Finding 4: ACAT Pipeline Polling Cron**

**File:** `.github/workflows/acat_pipeline_trigger.yml`  
**Lines:** 5-6  
**Severity:** NONE  
**Classification:** `TECHNICAL_SAFETY`

**Status:** ✅ **APPROVED**  
**Reason:** Daily polling trigger (0 8 * * *) runs at fixed cadence for data collection. Does not prioritize work; humans trigger via `workflow_dispatch`. No deadline controls approval or human actions.

```yaml
on:
  schedule:
    - cron: '0 8 * * *'  # TECHNICAL_SAFETY: polling only
  workflow_dispatch:     # Human can trigger anytime
```

---

#### **Finding 5: Framework Audit Polling Cron**

**File:** `.github/workflows/framework-audit.yml`  
**Lines:** 20-21  
**Severity:** NONE  
**Classification:** `TECHNICAL_SAFETY`

**Status:** ✅ **APPROVED (once phase logic removed)**  
**Reason:** Daily compliance check (0 10 * * *) at fixed interval for monitoring. Once Finding 3 remediated (phase-based gating removed), this is pure observation: "Is compliance state Y/N today?"

```yaml
schedule:
  - cron: '0 10 * * *'  # TECHNICAL_SAFETY: observation only
```

**Action Required:** Complete Finding 3 remediation first.

---

#### **Finding 6: Supabase Config Caching**

**File:** `src/lib/supabase.ts`  
**Lines:** 9, 12-26  
**Severity:** NONE  
**Classification:** `TECHNICAL_SAFETY`

**Status:** ✅ **APPROVED**  
**Reason:** Configuration caching pattern prevents repeated parsing. TTL implicit in module lifetime. Does not affect work scheduling or approval flow.

```typescript
let cachedConfig: {...} | null = null;  // TECHNICAL_SAFETY: cache lifetime

function getSupabaseConfig() {
  if (cachedConfig) return cachedConfig;  // Reuse cached value
  cachedConfig = result.data;
  return cachedConfig;
}
```

---

#### **Finding 7: UI Transition Timeouts**

**Files:** 
- `src/components/AcatTool.tsx` lines 329, 442, 449, 680
- `src/pages/ArenaPrototype.tsx` lines 37, 49

**Severity:** NONE  
**Classification:** `TECHNICAL_SAFETY`

**Status:** ✅ **APPROVED**  
**Reason:** All are UI/UX delays (2.5s message display, 50ms scroll smoothing, 2s fetch retry). Do not affect work prioritization or resource allocation.

```typescript
setTimeout(() => window.scrollTo({...}), 50);      // Render smoothing
setTimeout(() => setCopyStatus(false), 2500);      // Message display
setTimeout(() => fetchLiveStats(), 2000);          // Retry backoff
setTimeout(() => setExportMessage(null), 3000);    // Alert timeout
```

---

### CATEGORY: OBSERVATIONAL (Valid - keep as reference only)

These are timestamps or phase labels used for documentation/reporting, not work control.

#### **Finding 8: OSF Test Workflow Documentation**

**File:** `.github/workflows/osf-preregistration-test.yml`  
**Lines:** 159  
**Severity:** NONE  
**Classification:** `OBSERVATIONAL`

**Status:** ✅ **APPROVED (metadata only)**  
**Reason:** Hardcoded comment in test workflow for documentation:

```yaml
DEADLINE: 2026-10-01
```

This is in a **test/example** workflow, not production gating. Document what it references (Finding 1 deadline) and remove once Finding 1 remediated.

---

#### **Finding 9: Framework Phase Labels**

**File:** `.github/workflows/framework-audit.yml`  
**Lines:** 4, 13  
**Severity:** NONE  
**Classification:** `OBSERVATIONAL`

**Status:** ✅ **APPROVED (comments only, pending Finding 3 fix)**  
**Reason:** Comments describing audit phase are documentation. Once phase-based gating removed (Finding 3), relabel as:

```yaml
# FDS: Framework Deployment System | Per-repo audit workflow
# Status: Deployed to all 31 HumanAIOS repositories
# Mode: Compliance verification (state-based, not phase-based)
```

---

### CANDIDATE: REGULATORY_EXTERNAL (Pending Z2 Ratification)

#### **Finding 10: OSF Pre-Registration External Deadline**

**Issue:** Finding 1 (approval deadline 2026-10-01) may have external regulatory authority.

**Questions for Z2:**
1. Is the 2026-10-01 date mandated by NIH/NSF/grant requirements (REGULATORY_EXTERNAL)?
2. Or is it internal project planning (INVALID_INTERNAL_DEADLINE)?

**If REGULATORY_EXTERNAL:**
- File external_constraint.schema.json entry
- Store with full evidence: grant agency, deadline, impact if missed
- Z2 ratification required before using date to gate approval
- Document in RESOURCE_UNITS.yaml

**If INTERNAL:**
- Remediate per Finding 1 above (remove deadline, use state-based approval)

**Status:** BLOCKED until Z2 clarifies authority

---

## Remediation Roadmap

### Phase 1: Remove INVALID_INTERNAL_DEADLINE (Blocking)

**Time Estimate:** 2-3 hours  
**PR Target:** Single PR, minimal scope

1. **OSF Workflow Fix** (Finding 1)
   - Remove `approval_deadline: '2026-10-01'` from all files
   - Replace with state-based approval metadata
   - Remove "deadline" language from PR comments
   - **Files:** `.github/workflows/osf-preregistration.yml`, `osf-preregistration-test.yml`

2. **Funding Deadline Checker Refactor** (Finding 2)
   - Remove days-based categorization (urgent/soon/upcoming)
   - Keep opportunity data (OBSERVATIONAL only)
   - Add resource-state filtering
   - **File:** `src/humanaios_operations/deadline_checker.py`

3. **Framework Audit Phase Gating** (Finding 3)
   - Remove phase-based compliance logic
   - Use actual state check (COMPLIANT/NON_COMPLIANT)
   - **File:** `.github/workflows/framework-audit.yml`

### Phase 2: Validate TECHNICAL_SAFETY (Non-blocking, verification)

- Confirm all cron patterns, timeouts, and cache TTLs are genuine safety mechanisms
- Document in code comments for future auditors
- **Files:** `acat_pipeline_trigger.yml`, `framework-audit.yml`, `src/lib/supabase.ts`, component files

### Phase 3: Await Z2 Ratification (Regulatory Decision)

- Present Finding 10 to Z2 for classification
- If REGULATORY_EXTERNAL: create external_constraint.schema.json entry, document authority
- If INTERNAL: include in Phase 1 remediation

### Phase 4: CI Gate Implementation

- Wire temporal-purity enforcement into CI
- Reject PRs adding new INTERNAL_WORK_DEADLINE patterns
- Reference: TEMPORAL_DISSOLUTION_POLICY.md + CI workflow

---

## Reference: Temporal Classes

Per PRIORITY_QUEUE.md:

| Class | Purpose | Authority | Example | Status |
|-------|---------|-----------|---------|--------|
| **OBSERVATIONAL** | Timestamps for provenance/analysis | None required | "audit run at 2026-10-02 08:15:33Z" | ✅ APPROVED |
| **TECHNICAL_SAFETY** | Timeouts, retry backoff, cache TTL, dead-process detection | System safety only | `setTimeout(..., 100ms)`, `cron: '0 8 * * *'` | ✅ APPROVED |
| **REGULATORY_EXTERNAL** | Externally imposed legal/compliance deadline | Z2 ratification + evidence | "NSF RAPID deadline 2026-10-15" (with grant authority) | 🔒 BLOCKED until ratified |
| **HISTORICAL_RECORD** | Archival information with zero present authority | None | "experiment completed 2026-09-28" | ✅ APPROVED |
| **INTERNAL_WORK_DEADLINE** | Calendar-driven prioritization of human work | PROHIBITED | "urgent if < 7d to deadline" | 🚫 INVALID |

---

## Files to Change

### Must Change (Blocking)
- [ ] `.github/workflows/osf-preregistration.yml` — Remove approval_deadline logic
- [ ] `.github/workflows/osf-preregistration-test.yml` — Remove test deadline reference
- [ ] `src/humanaios_operations/deadline_checker.py` — Remove days-based categorization
- [ ] `.github/workflows/framework-audit.yml` — Remove phase-based gating

### Should Change (Cleanup)
- [ ] `.github/workflows/acat_pipeline_trigger.yml` — Add code comment: "TECHNICAL_SAFETY polling"
- [ ] `src/lib/supabase.ts` — Add code comment: "TECHNICAL_SAFETY config cache"
- [ ] Component files (AcatTool.tsx, ArenaPrototype.tsx) — Add code comments on UI timeouts

### Await Z2 Decision
- [ ] Clarify OSF deadline authority (regulatory vs. internal)
- [ ] File external_constraint.schema.json if regulatory

---

## Next Steps

1. **Immediate:** Create PR to remediate Findings 1-3 (remove INVALID_INTERNAL_DEADLINE entries)
2. **Before Merge:** Send Finding 10 to Z2 for ratification decision
3. **Post-Merge:** Validate TECHNICAL_SAFETY entries with code comments
4. **CI Gate:** Implement rejection of new INTERNAL_WORK_DEADLINE patterns

This audit satisfies the first part of Q-TEMPORAL-DISSOLUTION-01's gate condition:  
✅ **Audit complete** — Classification of all temporal semantics done  
⏳ **Remediation pending** — INVALID entries must be fixed  
⏳ **Z2 ratification pending** — Regulatory classification needed  
⏳ **CI enforcement pending** — Gate must block new deadlines  

---

**Audit Authority:** Z1 (Claude Proposer)  
**Required Authority for Remediation:** Z2 (on regulatory classifications)  
**Status:** AWAITING REMEDIATION + Z2 DECISION
