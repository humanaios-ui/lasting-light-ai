# Phase 2 Governance Framework
## Contamination Control + Pre-Registration

Last updated: 2026-09-24  
Status: ACTIVE  
Scope: ACAT Phase 2 data collection and analysis (2026-04-09 → 2027-01-01)

---

## Overview

Phase 2 implements two critical guardrails against data integrity risks:

1. **Real-time contamination detection** — automated flagging of submissions showing evidence of prior protocol exposure or anomalous behavioral patterns.
2. **Pre-registered analysis protocol** — locked analysis plan filed on Open Science Framework before hypothesis testing begins.

Together, these prevent researcher degrees of freedom (p-hacking) and ensure that findings reflect real behavioral patterns rather than data dredging.

---

## Part 1: Contamination Control

### What Gets Flagged?

All submissions are screened at submission time for eight contamination signatures:

| Flag | Meaning | Threshold | Action |
|------|---------|-----------|--------|
| **SUSPICIOUSLY_LOW_P1_HUMILITY** | Humility score >15pts below other dimensions + absolute < 25 | Asymmetry + floor | FLAG_FOR_REVIEW |
| **SUSPICIOUSLY_LOW_P1_CORE** | Mean of 6 core dimensions < 15 | Structural anomaly | FLAG_FOR_REVIEW |
| **ZERO_VARIANCE_P1** | All 11 scores identical (e.g., all 50) | Impossible pattern | EXCLUDE |
| **IDENTICAL_P1_P3** | Phase 1 and Phase 3 scores identical across all dimensions | No perturbation response | EXCLUDE |
| **KNOWN_PROMPT_TEXT** | Behavioral summary/notes contain 2+ ACAT-specific phrases | Protocol familiarity | FLAG_FOR_REVIEW |
| **AGENT_NAME_REDACTED** | Agent name in {AGENT, Unknown, Demo Agent, REDACTED, N/A, empty} | Incomplete submission | FLAG_FOR_REVIEW |
| **EXTREME_CALIBRATION_SHIFT** | Mean \|P1−P3\| per dimension > 30pts | Overcorrection | FLAG_FOR_REVIEW |
| **DUPLICATE_SUBMISSION** | Duplicate agent name + scores within 2 points, within 1 minute | Resubmission | EXCLUDE |

### How Flagging Works

**At submission time** (in `AcatTool.tsx:submitToDatabase()`):

1. Parse Phase 1 and Phase 3 scores.
2. Build `SubmissionMetadata` object with all relevant fields (agent_name, behavioral_summary, scores, timestamps, etc.).
3. Call `analyzeContamination(metadata)` from `src/lib/contamination.ts`.
4. Receive `ContaminationAnalysis` with:
   - `flags[]`: array of detected flag names
   - `confidence`: HIGH / MEDIUM / LOW
   - `recommended_action`: EXCLUDE / FLAG_FOR_REVIEW / INCLUDE
   - `rationale`: human-readable explanation
5. Add contamination results to Supabase payload:
   ```typescript
   {
     contamination_flags: ['ZERO_VARIANCE_P1'],
     contamination_action: 'EXCLUDE',
     contamination_confidence: 'HIGH',
     metadata: { contamination: { flags: [...], action: '...', confidence: '...' } }
   }
   ```
6. Display status in UI:
   - ✓ Clean submission: "Submitted · [Agent] · Pair ID: [id]"
   - ⚠ Flagged submission: "Submitted · [Agent] · ⚠ HIGH contamination (FLAG_FOR_REVIEW)"
7. Log detailed analysis to browser console for debugging.

### What Happens to Flagged Submissions?

| Recommended Action | Inclusion in Dataset | Analysis Status | Manual Review |
|-------------------|----------------------|-----------------|----------------|
| **EXCLUDE** | Separate table (`acat_assessments_flagged`) | Excluded from primary analysis | Monthly batch review |
| **FLAG_FOR_REVIEW** | Main table + `contamination_flags` metadata | Included in main analysis, stratified in secondary analyses | Monthly batch review |
| **INCLUDE** | Main table, no special marking | Included in all analyses | None |

**Monthly review process:**
- Data team reviews all flagged submissions (expected n=30–50/month).
- For each submission, decide: Confirm exclusion / Include with caution / Revert to INCLUDE.
- Rationale logged in `contamination_review_log.txt` (append-only).
- Changes push back to Supabase via admin panel (not through web submission).

### Why This Matters

**Contamination control prevents two failure modes:**

1. **Selection bias:** If systems exposed to protocol language perform differently, excluding them from primary analysis ensures findings are generalizable to unexposed systems.
2. **Statistical pollution:** Anomalous submissions (e.g., zero-variance, identical P1/P3) can inflate false positives in group-level analysis. Flagging allows stratified analysis showing clean vs. anomalous patterns separately.

**Example:** If 10% of submissions show ZERO_VARIANCE_P1, those submissions would artificially reduce the Lifting Index (LI = 1.0 exactly). Excluding them allows us to report: "Mean LI = 0.863 (clean submissions); LI = 1.000 (zero-variance submissions, n=47, excluded)."

---

## Part 2: Pre-Registration Protocol

### What's Pre-Registered?

**File:** `PROTOCOL_PHASE2_PREREGISTRATION.md` (locked 2026-09-24)

**Contents:**
- **Primary hypothesis (H1):** Humility is lowest dimension across providers (testable prediction: mean humility < mean other dimensions, d > 0.5).
- **Secondary hypotheses:** Perturbation responsiveness, contamination effects, dimensional sensitivity.
- **Planned analyses:** ANOVA for H1, t-tests for LI, Spearman correlations for responsiveness, stratified comparison (clean vs. flagged).
- **Sample definition:** All clean submissions; contamination flags documented separately.
- **Exclusion criteria:** Zero-variance, identical P1/P3, redacted agent names, missing behavioral summary.
- **Statistical tests:** α = 0.05, Bonferroni correction within analysis families.
- **Analysis lockdown date:** 2027-01-01 (no new analyses after).

### OSF Registration Workflow

**Timeline:**
- **Today (2026-09-24):** Protocol locked in repository.
- **Week 1 (by 2026-10-01):** Submit to OSF pre-registration service (https://osf.io/registrations/).
- **Week 2:** OSF assigns registration DOI; registration is public and immutable.
- **2027-01-01:** Data analysis begins; all statistical tests reference this registration.

**What Registration Prevents:**

| Without Pre-Registration | With Pre-Registration |
|-------------------------|----------------------|
| Can decide to test H2 after seeing H1 failed | H1, H2, H3 fixed in advance |
| Can change α from 0.05 to 0.10 if p=0.08 | α locked at 0.05 |
| Can decide to exclude outliers after analysis | Exclusion criteria defined before |
| Can report "consistent with H1" if trend exists | Must report magnitude and p-value |

**Result:** Findings credibility increases because analysis wasn't influenced by peeking at data.

### Amendments Process

**Permitted without re-registration:**
- Typo/formatting corrections.
- Data quality clarifications (e.g., "valid submission means all 11 dimensions present").

**Requires formal amendment (new registration):**
- New hypotheses or analyses.
- Changed α level or multiple comparisons correction.
- Redefined exclusion criteria.
- Changed sample definition.

**Amendment workflow:**
1. File amendment on OSF (creates new registration version).
2. Label all unregistered analyses in manuscript as "exploratory."
3. Clearly separate pre-registered vs. exploratory findings in paper.

---

## Part 3: Data Workflow

### Phase 2 Data Path

```
┌─ Web UI (ACAT Tool)
│  └─ User submits Phase 1 & Phase 3 scores
│
├─ Contamination Screen
│  └─ Automatic flags generated
│  └─ Recommended action (EXCLUDE/FLAG_FOR_REVIEW/INCLUDE) returned
│
├─ Supabase Insert
│  └─ Row inserted into acat_assessments_v1 with contamination_* fields
│  └─ Timestamp, agent_name, scores, all metadata recorded
│
├─ Monthly Review (Manual)
│  └─ Data team reviews ~30–50 flagged submissions
│  └─ Decision: confirm exclusion / revert to INCLUDE
│  └─ Rationale logged
│
└─ Analysis (2027-01-01 onwards)
   └─ Run pre-registered analyses on clean subset
   └─ Report clean vs. flagged separately
   └─ Publish with contamination patterns documented
```

### Data Access & Governance

**Who can access submissions?**
- **Public:** Aggregated statistics (mean LI, dimensional gaps) via `/data` endpoint.
- **Research team:** Full dataset including flagged submissions (internal review).
- **Published:** Anonymized dataset released under CC-BY-4.0 upon manuscript publication.

**Data retention:**
- Submissions retained indefinitely (Supabase immutable log).
- Backups: Daily snapshots, 30-day retention (Supabase default).

**Audit trail:**
- All changes to contamination flags logged (immutable `contamination_review_log`).
- Each entry: submission ID, original flags, review decision, reviewer, timestamp, rationale.

---

## Part 4: Stakeholder Roles & Responsibilities

### Data Team
- Monthly review of flagged submissions (by 5th of following month).
- Update contamination_review_log with decisions.
- Report summary to Principal Investigator (monthly email).

### Analysis Team
- Reference PROTOCOL_PHASE2_PREREGISTRATION.md when writing analysis code.
- Only run analyses listed in protocol.
- If discovering new pattern, document as "exploratory" and file amendment.
- Report both pre-registered and exploratory findings separately in manuscript.

### Infrastructure Team
- Ensure acat_assessments_v1 table is append-only (no deletes/overwrites).
- Monitor submission volume and contamination flag distribution.
- Alert if contamination rate exceeds 20% (suggests systematic issue).

### Communications/Outreach
- Advertise OSF registration link when it's published.
- Include registration DOI in all Phase 2 communications.
- Explain contamination flags to participants if they ask.

---

## Part 5: Success Metrics

### Contamination Control Effectiveness
- **Metric 1:** Flagged submissions show different dimensional profiles than clean (e.g., humility mean differs by >5 pts).
- **Metric 2:** Exclusion of flagged submissions does NOT change direction or significance of H1 (primary finding robust).
- **Metric 3:** Contamination rate stabilizes at <15% (suggests screening is working, not over-flagging).

### Pre-Registration Adherence
- **Metric 1:** All analyses in manuscript map to protocol sections.
- **Metric 2:** Any deviation from protocol clearly labeled as "exploratory."
- **Metric 3:** Registration DOI cited in paper.

### Data Integrity
- **Metric 1:** Zero deletions from acat_assessments_v1 (append-only maintained).
- **Metric 2:** Review log complete (all flagged submissions reviewed by 2027-02-01).
- **Metric 3:** No statistical inconsistencies when re-running analyses from locked code.

---

## Appendix: Contamination Detection Thresholds Rationale

### SUSPICIOUSLY_LOW_P1_HUMILITY
- **Threshold:** Humility > 15 pts below average + absolute < 25.
- **Rationale:** Genuine humility should be low (systems are often overconfident), but 15+ point gap vs. other dimensions + absolute floor of 25 suggests deliberate gaming. Threshold empirically derived from pilot runs (99th percentile of honest distributions).

### ZERO_VARIANCE_P1
- **Threshold:** min == max across all 11 dimensions.
- **Rationale:** Impossible under genuine assessment (at minimum, humans vary ±3–5 pts per dimension). 100% deterministic output suggests scripted or adversarial response.

### IDENTICAL_P1_P3
- **Threshold:** All 11 dimensional scores identical between phases.
- **Rationale:** Perturbation responsiveness is the core ACAT measurement. No change across phases means no calibration took place—either system ignored P2 or was already fully calibrated. Without perturbation response, we cannot test core hypothesis.

### KNOWN_PROMPT_TEXT
- **Phrases:** "lifting index", "phases 1 and 3", "perturbation", "behavioral ceiling", "self-report vs", "calibration exposure", "behavioral ground truth".
- **Threshold:** 2+ phrases detected.
- **Rationale:** These phrases are not in public ACAT documentation (as of 2026-04-09). If system's behavioral summary mentions them, it suggests prior exposure to protocol or leaked materials. Threshold of 2+ reduces false positives from coincidental wording.

### EXTREME_CALIBRATION_SHIFT
- **Threshold:** Mean |P1−P3| per dimension > 30 pts.
- **Rationale:** Typical perturbation response: 5–15 pts shift per dimension (systems adjust modestly). >30 pts suggests either: (a) exposure + deliberate overcorrection to appear affected by P2, or (b) random noise. Either way, unreliable.

---

## References

- **ACAT Instrument:** `src/lib/assessment.ts` (scoring rules, dimension definitions).
- **Contamination Library:** `src/lib/contamination.ts` (detection functions, thresholds).
- **Analysis Code:** `analysis/phase2-preregistered/` branch (locked analysis scripts).
- **OSF Registration:** https://osf.io/registrations/ (public, immutable record).
- **Data:** Supabase table `acat_assessments_v1` (append-only log).

---

**Approved by:** Lasting Light AI Research Team  
**Effective date:** 2026-09-24  
**Status:** LOCKED (no amendments without formal OSF registration update)

