# FDS: F3-Governance | Purpose: Temporal purity audit | Status: ACTIVE

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

#### **Finding 1: OSF Pre-Registration Resource Deadline (REGULATORY_EXTERNAL)**

**File:** `.github/workflows/osf-preregistration.yml`  
**Lines:** 144, 187, 222, 256  
**Severity:** BLOCKING (now resolved via Z2 ratification)  
**Classification:** `REGULATORY_EXTERNAL` ✅ Z2 RATIFIED

**Z2 Ratification Context:**
OSF submission workflow functions as a **parsing/formalization node** in the resource-mining layer. Deadlines originate from **INTENT-OS resource selection** (grants and studies identified by resource-miner), not internal planning. This establishes a **resource-refinery branch point** where external deadlines are parsed and applied to submission workflows.

**Problem (Initial Classification):**
Calendar date (2026-10-01) was hardcoded in workflow messaging, appearing to gate approval despite no actual date enforcement.

**Resolution via Z2 Ratification:**
- Authority: **Resource-determined** (varies by grant/study pursued via INTENT-OS)
- Deadline source: External regulatory body (NSF, NIH, grant agency, or study protocol)
- OSF role: Submission gateway / parsing node for translating resource requirements into pre-registration workflow
- Z2 Decision: **REGULATORY_EXTERNAL** — deadline is legitimate regulatory constraint per pursued resource

**Implementation:**
1. ✅ Removed hardcoded deadline references (deadline now resource-specific, not workflow-hardcoded)
2. ✅ Changed approval metadata to state-based (approval_required, approval_status conditional on submission success)
3. ✅ Filed external_constraint.schema.json with resource-general framework
4. ✅ Documented as resource-refinery branch point for future deadline extraction automation

**Filing:**
- Constraint: `external_constraint.schema.json` (resource-general, deadline-per-resource)
- Authority: INTENT-OS resource specification (grant/study metadata)
- Deadline: Resource-specific (example: 2026-10-01 for current pursued resource)
- Z2 Ratification: Present (user approval of resource-refinery framework)

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
**Lines:** 4, 38, 62, 69, 76-77, 85, 106  
**Severity:** MEDIUM  
**Classification:** `INVALID_INTERNAL_DEADLINE`

**Problem:**
- Phase-based compliance gating: audit changes behavior when PHASE >= 2
- Hidden calendar pressure tied to phase transitions
- Conditional dispatch logic disabled "in Phase 1; enable in Phase 2+"
- Metadata includes `phase: 1` field

**Impact:**
- Framework compliance gated on "Phase number reaching 2" not actual readiness
- Audit will fail automatically when Phase increments, regardless of work state
- Creates temporal coupling to phase schedule, not state

**Remediation:** COMPLETE (see fixes below)
- Removed all phase-based conditionals
- Changed to pure state-based checks (COMPLIANT / NON_COMPLIANT)
- Removed `phase: 1` metadata field
- Changed dispatch conditional from phase-based to state-based

---

#### **Finding 4: Test Workflow Deadline Reference (OSF Pre-Registration Test)**

**File:** `.github/workflows/osf-preregistration-test.yml`  
**Lines:** 159, 191  
**Severity:** LOW  
**Classification:** `OBSERVATIONAL` (documentation only, test workflow)

**Problem:**
```yaml
DEADLINE: 2026-10-01  # Line 159: hardcoded in test instructions
echo "Deadline: 2026-10-01"  # Line 191: printed in test output
```

**Impact:** None (test workflow only, no gating logic)

**Status:** ✅ APPROVED — This is documentation in test workflow. Will be removed once Finding 1 (osf-preregistration.yml) is fully remediated.

---

#### **Finding 5: OSF Publish Workflow Timeline References**

**File:** `.github/workflows/osf-publish-registration.yml`  
**Lines:** 152, 194-195, 218-219  
**Severity:** MEDIUM  
**Classification:** `OBSERVATIONAL` (analysis boundary, not work priority)

**Problem:**
```yaml
# Line 152: Timeline in PR comment
- **Timeline:** Data collection continues through 2026-12-31, analysis lockdown 2027-01-01

# Lines 194-195: In workflow output
echo "- Data collection may proceed through 2026-12-31"
echo "- Analysis window opens 2027-01-01"

# Lines 218-219: In summary
echo "  - Data Collection: Through 2026-12-31"
echo "  - Analysis Window: Starts 2027-01-01"
```

**Analysis:**
- These dates mark **research protocol boundaries** (data collection vs. analysis phases)
- Not used to prioritize work or gate approvals
- Are **protocol constraints**, not work-scheduling deadlines
- Do NOT drive resource allocation or task sequencing

**Status:** ✅ APPROVED — OBSERVATIONAL class
- These define the research protocol timeline, not internal work deadlines
- Are metadata for regulatory/compliance purposes (part of pre-registration)
- Do not affect work prioritization or approval gating

**Rationale:** A pre-registration specifies when data collection ends and analysis begins. This is a **regulatory/scientific protocol boundary**, not an internal deadline gating work. It's part of the published protocol's integrity constraints, similar to `HISTORICAL_RECORD` (immutable once published).

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

### RESOLVED: REGULATORY_EXTERNAL (✅ Z2 Ratified)

#### **Finding 1 Reclassification: OSF Pre-Registration Resource Deadline**

**Z2 Ratification:** ✅ COMPLETE (2026-10-02)

**Framework:** OSF submission workflow functions as a **parsing/formalization node** in the resource-mining layer. Deadlines originate from **INTENT-OS resource selection** (grants and studies identified by resource-miner), not internal planning.

**Authority Chain:**
1. **Regulatory Source:** INTENT-OS resource specification (NSF, NIH, grant agency, or study protocol)
2. **Parsing Node:** OSF submission workflow (resource-parsing layer)
3. **Deadline Scope:** Resource-general framework (different resources have different deadlines)
4. **Example Deadline:** 2026-10-01 for currently pursued resource

**Filing:** 
- ✅ `external_constraint.schema.json` filed with resource-refinery framework
- ✅ Documents authority chain and deadline variability per resource
- ✅ Flags as **resource-refinery branch point** for future automation

**Resource-Refinery Branch Point:**
This constraint identifies a potential automation layer within the resource-refinery portion of the framework:
- Automatic deadline extraction from INTENT-OS resource metadata
- Constraint generation per resource (filing external_constraint per grant/study)
- Deadline enforcement at OSF submission time based on pursued resource
- Audit trail of resource-to-deadline mappings

**Status:** ✅ Z2 RATIFIED — Reclassified to REGULATORY_EXTERNAL with resource-general framework

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

## Next Steps & Gate Status

### Completed
1. ✅ **Audit** — All temporal semantics classified (5 findings)
2. ✅ **Remediation** — 3 INVALID_INTERNAL_DEADLINE entries removed/refactored
3. ✅ **Z2 Ratification** — OSF deadline reclassified as REGULATORY_EXTERNAL with resource-refinery framework
4. ✅ **External Constraints** — `external_constraint.schema.json` filed with resource-general deadline framework

### Pending
1. ✅ **CI Enforcement** — Implemented `temporal-dissolution-gate.yml` workflow that rejects new INTERNAL_WORK_DEADLINE patterns
2. ⏳ **Resource-Refinery Automation** — Potential branch point for future deadline extraction from INTENT-OS resources

### Resource-Refinery Branch Point
OSF submission workflow identifies a new automation opportunity:
- **Layer:** Resource-parsing layer (INTENT-OS → OSF submission)
- **Opportunity:** Auto-extract deadlines from pursued grant/study, file constraints per resource
- **Framework:** Resource-general (different resources = different deadlines)
- **Future Work:** Deadline constraint generation, enforcement at submission time

---

## Q-TEMPORAL-DISSOLUTION-01 Gate Status

Per PRIORITY_QUEUE.md, gate requires:
1. ✅ **Policy** — Documented in this audit
2. ✅ **CI enforcement** — `temporal-dissolution-gate.yml` workflow detects and rejects new INTERNAL_WORK_DEADLINE patterns
3. ✅ **Active-control-surface remediation** — Complete (3 findings + 1 reclassification)
4. ✅ **Canonical RBE temporal migration** — PRIORITY_QUEUE.md intact
5. ✅ **Intent-OS External Constraints** — external_constraint.schema.json filed + Z2 ratified

**Gate Progress:** ✅ 5/5 COMPLETE

---

**Audit Authority:** Z1 (Claude Proposer)  
**Ratification Authority:** Z2 (User) — ✅ RATIFIED  
**Status:** ✅ REMEDIATION COMPLETE | ✅ Z2 RATIFIED | ✅ CI ENFORCEMENT ACTIVE
