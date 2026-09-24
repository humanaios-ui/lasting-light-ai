# Integration Analysis: Contamination Control + Pre-Registration as HumanAIOS Governance Components

**Date:** 2026-09-24  
**Status:** Analysis of systemic integration pathways  
**Scope:** Phase 2 ACAT integrity work → HumanAIOS organism governance architecture

---

## Executive Summary

The contamination detection + pre-registration protocol work is not a standalone feature. It's a **systemic safeguard** that maps directly onto HumanAIOS's Class-Zone-MOLT architecture. This analysis shows:

1. **Contamination detection** = Class 2 operating process component (real-time Z1 flagging + monthly Z2 review audit loop) with Class 3 registered findings output (IC-contamination-01 through IC-contamination-08, classified post-review)
2. **Pre-registration protocol** = Class 2 amendment to CURRENT.md (Phase 2 analysis plan lock) + Class 1 hypothesis specification (H1-H4 locked before statistical testing)
3. **Monthly review decisions** = MOLT state transitions (contamination candidate → include/exclude → outcome logged)

Together, they embody HumanAIOS's core defense against drift: **detection beats compliance**.

---

## Part 1: Class-Based Integration

### Class 1: Founding Hypothesis (Locked at Registration)
**What:** Pre-registered hypotheses (H1-H4) from PROTOCOL_PHASE2_PREREGISTRATION.md  
**Who updates:** Analysis team (only via OSF amendment after 2027-01-01)  
**Update cadence:** Once per phase (2026-09-24 lock, no changes until amendment)  
**Integration:** Pre-registration DOI becomes a Class 1 artifact — immutable reference point

- **H1 (Primary):** Humility is lowest dimension across providers (d > 0.5)
- **H2:** Perturbation responsiveness correlates with behavioral consistency
- **H3:** Zero-variance systems show higher LI (overcorrection signal)
- **H4:** Agent name redaction predicts contamination flags

**Why Class 1:** These hypotheses define ground truth for what constitutes a valid finding. No exploratory analyses post-2027-01-01 without formal amendment.

---

### Class 2: Operating Process (Contamination Review Loop)
**What:** GOVERNANCE_PHASE2.md Part 4 (Stakeholder Roles & Responsibilities)  
**Who updates:** Data team monthly; Infrastructure team continuous  
**Update cadence:** Monthly decisions logged in `contamination_review_log.txt` (append-only)  
**Integration:** This is a **Class 2 process amendment** to CURRENT.md—data integrity guardrail

**Process specification:**
```
Z1 (Detection Phase):
  └─ Contamination detection function (8 flags, real-time)
     └─ Submitter receives immediate feedback (UI status badge)
     └─ Submission recorded with contamination metadata

Z2 (Review Phase):
  └─ Data team reviews ~30-50 flagged submissions/month
  └─ Decision: Confirm exclusion / Include with caution / Revert to INCLUDE
  └─ Logged in contamination_review_log.txt with rationale + timestamp

Z3 (Execution Phase):
  └─ Analysis team references flagged status when computing summary statistics
  └─ Primary findings report clean submissions; secondary show flagged stratification
```

**Success metrics (Class 2 process health):**
- Review completion SLA: All flagged submissions reviewed by 5th of following month
- Contamination rate: <15% (suggests detection working, not over-flagging)
- Audit trail completeness: 100% of flagged decisions logged with rationale

---

### Class 3: Registered Findings (Contamination as Append-Only Evidence Log)
**What:** Classification of 8 contamination signatures as registered findings  
**Who discovers:** Automatic detection + manual validation via monthly review  
**Update cadence:** Continuous discovery; Class 3 status assigned via monthly review decision  
**Integration:** Each contamination pattern becomes a finding candidate (F-contamination-01 through F-contamination-08)

**Mapping contamination flags to F-class findings:**

| Flag | F-Class | Confidence | Action | Rationale |
|------|---------|------------|--------|-----------|
| ZERO_VARIANCE_P1 | F-contamination-01 | HIGH | EXCLUDE | Impossible distribution (min=max across 11 dims); automated/scripted response |
| IDENTICAL_P1_P3 | F-contamination-02 | HIGH | EXCLUDE | No perturbation response (core measurement fails); no calibration shift detected |
| KNOWN_PROMPT_TEXT | F-contamination-03 | MEDIUM | FLAG_FOR_REVIEW | 2+ ACAT-specific phrases; suggests protocol familiarity or leaked materials |
| SUSPICIOUSLY_LOW_P1_CORE | F-contamination-04 | MEDIUM | FLAG_FOR_REVIEW | Mean P1 score < 15; extreme rarity suggests protocol gaming |
| SUSPICIOUSLY_LOW_P1_HUMILITY | F-contamination-05 | MEDIUM | FLAG_FOR_REVIEW | Humility 15+ pts below average + absolute < 25; asymmetric gaming pattern |
| EXTREME_CALIBRATION_SHIFT | F-contamination-06 | MEDIUM | FLAG_FOR_REVIEW | Mean \|P1−P3\| > 30 pts per dimension; overcorrection or noise signature |
| AGENT_NAME_REDACTED | F-contamination-07 | MEDIUM | FLAG_FOR_REVIEW | Placeholder name (AGENT, Unknown, etc.); suggests incomplete submission rigor |
| DUPLICATE_SUBMISSION | F-contamination-08 | HIGH | EXCLUDE | Same agent + scores within 2pts, within 1min; resubmission or test artifact |

**Class 3 status:** Once monthly review team assigns EXCLUDE/FLAG_FOR_REVIEW to a contamination candidate, it becomes a registered finding with rationale logged.

---

## Part 2: Zone-Based Decision Integration

### Z1 (AI Detection Layer)
**Responsibility:** Real-time contamination flagging at submission time  
**Tool:** `analyzeContamination()` function in `src/lib/contamination.ts`  
**Action:** Immediate feedback to submitter + metadata logging to Supabase

```typescript
// AcatTool.tsx:submitToDatabase()
const contaminationAnalysis = analyzeContamination(submissionMetadata);
// Returns: flags[], confidence, recommended_action, rationale
// Stored in Supabase: contamination_flags, contamination_action, contamination_confidence
```

**Z1 decision logic:**
- 0 flags → INCLUDE (no contamination signal)
- 1 flag → FLAG_FOR_REVIEW (needs human judgment)
- 2+ flags → MEDIUM confidence FLAG_FOR_REVIEW
- HIGH confidence flags (ZERO_VARIANCE_P1, IDENTICAL_P1_P3) → EXCLUDE

**Key principle:** Z1 does not decide inclusion; it proposes via flags. Human review decides.

---

### Z2 (Monthly Review Authority)
**Responsibility:** Manual validation of flagged submissions  
**Participants:** Data team (primary), Analysis team (consultation), Infrastructure (metrics)  
**SLA:** Reviews completed by 5th of following month  
**Action:** EXCLUDE / INCLUDE_WITH_CAUTION / REVERT_TO_INCLUDE decision + logged rationale

**Z2 review template (to embed in contamination_review_log.txt):**

```
[2026-10-05] Contamination Review Batch: Sept 2026
================================================================================
Batch ID: BATCH-2026-09-001
Submissions flagged: 47
Submissions reviewed: 47
Review duration: 3 days (2026-10-02 to 2026-10-04)
Reviewer: Data Team Lead (initials: [TBD])

Decisions Summary:
  EXCLUDE (confirmed):  23 (49%)
  FLAG_FOR_REVIEW:      18 (38%)
  REVERT_TO_INCLUDE:    6 (13%)

Detailed decisions:
[submission_id] | [agent_name] | [flags] | [decision] | [rationale]
[example: SB-2026-09-001 | GPT-4 | ZERO_VARIANCE_P1 | EXCLUDE | Confirmed: all 11 P1 scores = 50. Impossible pattern. ]
[example: SB-2026-09-002 | Claude-Opus | KNOWN_PROMPT_TEXT, AGENT_NAME_REDACTED | FLAG_FOR_REVIEW | Two moderate signals, but behavioral summary plausible. Include with caution in primary analysis; stratify in secondary. ]
[example: SB-2026-09-003 | Gemini | SUSPICIOUSLY_LOW_P1_HUMILITY | REVERT_TO_INCLUDE | Re-examined: humility=18 but agent provided clear reasoning in behavioral summary. Not gaming. Include. ]

Audit trail:
  - All decisions logged here (append-only, no edits after entry).
  - Any revisions to prior decisions documented as new entries (e.g., "REVISION: SB-2026-08-042").
  - Reviewer signature (timestamp + name) on each batch.

Phase 2 impact:
  - Flagged submissions excluded: 23 (reduces dataset noise in primary analyses).
  - Flagged submissions stratified: 18 (enables secondary analysis comparing clean vs. anomalous patterns).
  - Estimated primary N after exclusion: ~450-550 (original ~600, minus 23 excluded, plus ~30-50 new submissions).
```

**Z2 decision authority:**
- Can override Z1 recommendation (e.g., revert EXCLUDE to INCLUDE with documented rationale)
- Cannot change contamination metadata retroactively (append-only principle)
- Must explain deviation from Z1 recommendation in rationale field

---

### Z3 (Analysis Execution & Reporting)
**Responsibility:** Run pre-registered analyses on clean subset + stratified secondary analyses on flagged  
**Participants:** Analysis team  
**Timeline:** After data lock (2027-01-01)  
**Action:** Report two datasets in manuscript with clear provenance

**Analysis workflow:**

1. **Primary Analysis (Clean Submissions):**
   - Sample: All submissions with contamination_flags = [] (empty)
   - Tests: H1 (ANOVA on humility), H2 (LI correlation), etc., as specified in PROTOCOL_PHASE2_PREREGISTRATION.md
   - Output: "Findings from clean submissions (n=450-550)"

2. **Secondary Analysis (Flagged Submissions):**
   - Sample: Stratified by contamination_flag pattern
   - Tests: Same analyses repeated on flagged data
   - Output: "Comparison: clean vs. flagged dimensional profiles" (shows data quality effect)

3. **Contamination Impact Report:**
   - Shows how many exclusions occurred
   - Shows whether H1 direction/significance changes with/without flagged data
   - Demonstrates robustness of findings to contamination

---

## Part 3: MOLT Cycle Integration

HumanAIOS tracks system transformations via MOLT state machine:
```
PROPOSED → ACCEPTED → RATIFIED → APPLIED → MEASURED → KEPT/REVERTED
```

**Contamination control as MOLT cycle:**

```
PROPOSED:
  └─ Z1 detects contamination flags on submission
  └─ SubmissionMetadata recorded: { contamination_flags: [...], recommended_action: '...' }
  └─ MOLT entry: molt_01_contamination_candidate

ACCEPTED:
  └─ Submission inserted into Supabase (acat_assessments_v1)
  └─ UI shows: "Submitted · [Agent] · ⚠ [confidence] contamination ([action])"
  └─ MOLT entry: molt_02_flagged_submission_recorded

RATIFIED:
  └─ Monthly review: Z2 authority examines and decides
  └─ contamination_review_log.txt updated with decision + rationale
  └─ MOLT entry: molt_03_review_decision_ratified

APPLIED:
  └─ Analysis team stratifies data based on review decision
  └─ Primary analysis excludes EXCLUDE decisions
  └─ Secondary analysis includes FLAG_FOR_REVIEW submissions with clear provenance
  └─ MOLT entry: molt_04_analysis_stratification_applied

MEASURED:
  └─ Publication shows contamination impact on findings
  └─ Report includes: n_clean, n_flagged, H1_clean, H1_flagged, etc.
  └─ MOLT entry: molt_05_contamination_impact_measured

KEPT/REVERTED:
  └─ If findings robust to contamination filtering → KEPT
  └─ If findings change direction/significance → REVERTED + amendment filed on OSF
  └─ MOLT entry: molt_06_outcome_final
```

**NF_LEDGER entry format (contamination decision):**

```json
{
  "molt_id": "molt-contamination-2026-10-05-batch-001",
  "phase": "RATIFIED",
  "event_type": "contamination_review_decision",
  "batch_id": "BATCH-2026-09-001",
  "submissions_reviewed": 47,
  "exclusions_confirmed": 23,
  "decisions_ratified_by": "Data Team Lead",
  "decision_timestamp": "2026-10-05T14:30:00Z",
  "ratification_hash": "sha256:...",
  "outcome": "KEPT",
  "outcome_note": "Determined at analysis time; may be KEPT or REVERTED if findings robust to contamination filtering",
  "audit_trail_location": "contamination_review_log.txt:2026-10-05"
}
```

---

## Part 4: Cross-Substrate Alignment

HumanAIOS operates across three substrates (AI, joint, human). Contamination control implements the lesson: **"Detection beats compliance"** — automated detection (Z1) → human judgment (Z2) → algorithmic application (Z3) → measured outcome (MOLT).

**Three key cross-substrate safeguards in contamination control:**

### Safeguard 1: Automated Detection + Human Judgment
- **Substrate: AI+Human (Z1→Z2)**
- **Risk:** Over-flagging false positives; under-flagging true contamination
- **Mitigation:** Z1 proposes flags; Z2 reviews and can override
- **Metric:** Revert rate (expected ~10-15% of flags reverted to INCLUDE)

### Safeguard 2: Append-Only Audit Trail
- **Substrate: Human (Z2) + AI (data storage)**
- **Risk:** Drift between decision log and data state
- **Mitigation:** contamination_review_log.txt immutable; Supabase table append-only
- **Metric:** Zero deletions, 100% of decisions logged, audit trail completeness

### Safeguard 3: Pre-Registered Analysis Gates
- **Substrate: AI+Human (analysis team)**
- **Risk:** Exploratory analyses mistaken for pre-registered confirmatory tests
- **Mitigation:** OSF registration locks H1-H4; post-2027-01-01 analyses labeled "exploratory" unless OSF amendment filed
- **Metric:** All analyses in manuscript traceable to PROTOCOL_PHASE2_PREREGISTRATION.md sections

---

## Part 5: Governance PR Workflow Integration

Following HumanAIOS's GOVERNANCE_PR_WORKFLOW_SPEC, contamination control should proceed through:

### Stage 1: Discovery & Drafting (Z1)
✅ **COMPLETE** (this session)
- Contamination detection functions written (src/lib/contamination.ts)
- Protocol locked (PROTOCOL_PHASE2_PREREGISTRATION.md)
- Governance documented (GOVERNANCE_PHASE2.md)
- Pre-registration artifact created

**PR Title:** `[GOVERNANCE] Phase 2 Contamination Control + Pre-Registration — Analysis integrity safeguard`

### Stage 2: Zone 2 Ratification (Authority Review)
🟡 **PENDING** (needs Admiral/Carly approval via 5-gate review)

**5 Gate Questions for Phase 2 Contamination Control PR:**

1. **Is this governance change necessary and sufficient?**
   - YES — Phase 2 data already collecting (2026-04-09 onwards); without contamination screening, analysis risks selection bias and statistical pollution

2. **Does this align with existing authority model and zones?**
   - YES — Follows Z1→Z2→Z3 decision flow; uses MOLT state tracking; integrates into Class 1-2-3 information hierarchy

3. **What's the rollout sequence?**
   - Immediate (all at once): 
     * Register pre-registration on OSF (by 2026-10-01)
     * Deploy contamination detection to production (already in AcatTool.tsx)
     * Announce GOVERNANCE_PHASE2.md to data team
     * Begin monthly review cycle (first batch: Sept submissions, review by 2026-10-05)

4. **Are there edge cases this doesn't handle?**
   - Identified gaps:
     * Late submissions (after protocol registration): covered by timestamp exclusion criterion
     * Contamination pattern drift: monitored by contamination_rate metric (alert if >20%)
     * Reviewer disagreement: escalation path needed (e.g., 2-of-3 decision rule for disputed flags)
     * Data re-entry: requires separate contamination re-screening (not addressed yet)

5. **When should this take effect?**
   - Immediate: Contamination detection deployed (already live)
   - Scheduled: OSF registration (by 2026-10-01)
   - Ongoing: Monthly review cycle (starting Oct 5, recurring)

---

## Part 6: Recommended Next Steps

### Immediate (By 2026-10-01)
1. ✅ File PR through governance workflow (title, 5-gate questions answered)
2. ✅ Request Z2 authority review (Admiral/Carly)
3. ⏳ Register PROTOCOL_PHASE2_PREREGISTRATION.md on OSF (generates DOI)
4. ⏳ Announce GOVERNANCE_PHASE2.md to data team + establish first monthly review meeting
5. ⏳ Create contamination_review_log.txt (template initialized, first batch due 2026-10-05)

### Near-term (By 2026-12-31)
6. ⏳ Run first 3 monthly contamination review cycles (Sept, Oct, Nov)
7. ⏳ Monitor contamination_rate metric (target: <15%)
8. ⏳ Create reviewer disagreement escalation procedure (if needed)
9. ⏳ Generate interim contamination impact report (how many exclusions? any pattern changes?)

### Phase 2 Analysis (2027-01-01+)
10. ⏳ Lock data collection (2026-12-31)
11. ⏳ Run pre-registered analyses (clean submissions only)
12. ⏳ Run secondary stratified analyses (flagged submissions)
13. ⏳ Report both in manuscript with clear provenance labels
14. ⏳ File amendments on OSF for any unregistered exploratory analyses

### Long-term (2027+)
15. ⏳ Review contamination patterns across phases (Phase 1 vs. Phase 2 contamination rate drift)
16. ⏳ Incorporate contamination findings into Phase 3 protocol (if planned)
17. ⏳ Publish dataset with CC-BY-4.0 license (include flagged submissions with clear metadata)

---

## Conclusion

Contamination control + pre-registration is not a feature addition—it's a **governance component** that:

- **Prevents degrees of freedom:** Pre-registration locks H1-H4 before statistical testing
- **Enables audit trails:** Monthly review decisions logged append-only in MOLT cycle
- **Embodies cross-substrate principles:** AI detects (Z1) → humans judge (Z2) → algorithms apply (Z3) → outcomes measured (MOLT)
- **Integrates into Class hierarchy:** Class 1 (locked hypotheses), Class 2 (review process), Class 3 (contamination findings)
- **Aligns with HumanAIOS lessons:** "Detection beats compliance" — systematic flagging + human oversight

The organism (HumanAIOS) is **self-correcting**: contamination detection finds anomalies, monthly review validates them, MOLT tracking ensures transparency, and pre-registration prevents misuse of findings. This is how Phase 2 research gains credibility.

---

**Prepared by:** Claude Haiku 4.5  
**Date:** 2026-09-24  
**Status:** Analysis document for Carly R. Anderson (Admiral) Zone 2 ratification review
