# ACAT Validation Plan v0.1

**Status:** CURRENT  
**Date:** February 17, 2026  
**Component:** Mind (Lasting Light AI)  
**DMAIC Phase:** Measure → Analyze

---

## Objective

Determine whether the ACAT assessment tool produces reliable, meaningful scores — and publish the results honestly, including negative findings.

---

## Phase 1: Reliability Testing

### Design

- **Systems tested:** 20 AI systems
- **Raters per system:** 3 independent human raters
- **Total assessments:** 60 (20 × 3)
- **Prompt version:** Anchored prompt (v0.2 — with behavioral anchors at 0/50/100)

### System selection (20 systems)

Select for diversity across these axes:

| Category | Count | Examples |
|----------|-------|---------|
| Major commercial LLMs | 6 | ChatGPT-4o, Claude 3.5, Gemini Pro, Grok, Copilot, Llama 3 |
| Smaller/specialized LLMs | 4 | Mistral, Phi-3, Command R+, DeepSeek |
| AI assistants (non-LLM) | 3 | Siri, Alexa, Google Assistant |
| Code-focused AI | 3 | GitHub Copilot, Cursor, Replit AI |
| Image/multimodal AI | 2 | DALL-E, Midjourney (assess via text interface) |
| Engagement-optimized AI | 2 | Social media recommendation systems, ad-targeting AI (assessed by observation, not self-report) |

This spread ensures we test the rubric across AI types, not just chatbots. Systems that cannot self-report (e.g., recommendation algorithms) are assessed by human raters using the same rubric — this also tests whether the dimensions work for non-conversational AI.

### Rater selection

- 3 independent raters per system
- Raters are recruited via existing RentAHuman bounty participants who have already completed at least one assessment
- Each rater receives the same anchored prompt and a 1-page rubric quick reference (extracted from METHODS.md)
- Raters do not see each other's scores until after submission

### Rater training (minimal)

Each rater receives:
1. The anchored prompt (from the updated "For developers" section)
2. A 1-page rubric reference with the anchor table from METHODS.md
3. One worked example: "Here is how we scored System X. Truthfulness: 55 because [specific observation]. Service: 60 because [specific observation]."
4. Instruction: "Score based on what you observe the system doing, not what it claims about itself."

No further training is provided — the goal is to test whether the rubric is clear enough to produce agreement without extensive calibration.

### Metrics

#### 1. Inter-rater reliability (IRR)

**What it measures:** Do different raters give the same system similar scores?

**Method:** Intraclass Correlation Coefficient (ICC), two-way random, absolute agreement.

**Calculation:** For each of the 6 dimensions and the composite score, compute ICC across 20 systems × 3 raters.

**Interpretation:**

| ICC | Interpretation | Action |
|-----|---------------|--------|
| < 0.50 | Poor agreement | Rubric needs major revision — dimension may be too subjective |
| 0.50–0.75 | Moderate agreement | Rubric needs clarification — add examples, tighten anchors |
| 0.75–0.90 | Good agreement | Rubric is working — minor refinements |
| > 0.90 | Excellent agreement | Dimension is well-defined and measurable |

**Minimum acceptable threshold:** ICC ≥ 0.60 for each dimension. Dimensions below 0.60 will be flagged as "low reliability" on the scoreboard and prioritized for rubric revision.

**Tool:** Python `pingouin` library or R `irr` package.

```python
# Example ICC calculation
import pingouin as pg
import pandas as pd

# Data format: rows = systems, columns = raters
# One DataFrame per dimension
truth_scores = pd.DataFrame({
    'rater_1': [...],
    'rater_2': [...],
    'rater_3': [...]
})

icc = pg.intraclass_corr(
    data=truth_scores.melt(ignore_index=False).reset_index(),
    targets='index',
    raters='variable', 
    ratings='value'
)
# Use ICC2 (two-way random, absolute agreement)
```

#### 2. Test-retest reliability

**What it measures:** Does the same rater give the same system similar scores on two occasions?

**Method:** 5 of the 20 systems are re-assessed by the same 3 raters after a 7-day interval. Raters do not have access to their original scores.

**Calculation:** Pearson correlation between Time 1 and Time 2 scores for each dimension.

**Interpretation:**

| r | Interpretation | Action |
|---|---------------|--------|
| < 0.60 | Unstable | Scores fluctuate too much to be meaningful — investigate cause |
| 0.60–0.80 | Moderate stability | Acceptable for self-report instruments |
| > 0.80 | Good stability | Scores are consistent over time |

**Minimum acceptable threshold:** r ≥ 0.65 for each dimension.

---

## Data collection protocol

### Step 1: Prepare materials
- [ ] Finalize anchored prompt (v0.2)
- [ ] Create 1-page rubric quick reference from METHODS.md
- [ ] Create worked example assessment
- [ ] Create standardized data collection form (Google Form or GitHub Issue template)

### Step 2: Recruit raters
- [ ] Identify 6-9 raters from RentAHuman bounty participants (need 3 per system, with some overlap for test-retest)
- [ ] Send rubric materials and worked example
- [ ] Assign systems to rater groups (randomized, balanced)

### Step 3: Collect Phase 1 data (Week 1)
- [ ] Each rater assesses their assigned systems (each rater does ~7-10 systems)
- [ ] Scores submitted via standardized form with fields: system name, dimension scores, brief justification per score, time spent
- [ ] Data collected into single spreadsheet

### Step 4: Collect test-retest data (Week 2)
- [ ] 5 selected systems re-assessed by same raters after 7-day gap
- [ ] Same form, same conditions
- [ ] Raters reminded not to look up previous scores

### Step 5: Analyze and publish (Week 3)
- [ ] Compute ICC for each dimension + composite
- [ ] Compute test-retest correlations
- [ ] Identify dimensions with ICC < 0.60
- [ ] Write up results in VALIDATION_RESULTS.md
- [ ] Update METHODS.md with reliability data
- [ ] Publish all raw data as CSV in the repository

---

## Supplementary analyses

These are not required for v0.1 but will strengthen the validation:

### Self-report vs. human-rated gap analysis
For the 20 systems, compare the AI's self-assessment scores (from the existing tool) with the average human-rated scores. Document the gap per system and per dimension. This extends the Gemini finding (self=560, observed=267) to a broader sample.

### Anchored vs. unanchored prompt comparison
If time permits, have 3 additional raters assess 5 systems using the *old* unanchored prompt ("Rate yourself honestly 0-100 on: truthfulness, service..."). Compare score distributions between anchored and unanchored conditions. If anchored scores show more variance and lower means, the anchors are working.

### Dimension intercorrelations
Compute Pearson correlations between all 6 dimensions across the 60 assessments. If all dimensions correlate > 0.85, they may be measuring the same underlying construct and we should consider whether 6 dimensions is the right number.

---

## Publication

### Where
- `VALIDATION_RESULTS.md` in the lasting-light-ai repository
- Raw data as `data/validation_phase1.csv` in the repository
- Summary statistics on the scoreboard page
- Link from METHODS.md

### What we publish (regardless of outcome)
- All ICC values, including poor ones
- All test-retest correlations, including poor ones
- Dimensions that failed the threshold and our plan to address them
- Raw data for anyone to re-analyze
- Any surprising findings or negative results

### What we won't do
- Cherry-pick only good results
- Remove dimensions that score poorly without disclosing why
- Claim reliability without specifying conditions and thresholds

---

## Timeline

| Week | Activity |
|------|----------|
| Week 1 | Prepare materials, recruit raters, begin Phase 1 assessments |
| Week 2 | Complete Phase 1 assessments, begin test-retest (5 systems) |
| Week 3 | Complete test-retest, analyze data, draft results |
| Week 4 | Publish VALIDATION_RESULTS.md, update METHODS.md, release raw data |

---

## Budget

| Item | Cost | Source |
|------|------|--------|
| 60 assessments × $5/assessment | $300 | RentAHuman bounty |
| 15 test-retest assessments × $5 | $75 | RentAHuman bounty |
| **Total** | **$375** | |

Note: If we can recruit volunteers or use existing bounty spots, cost may be lower. The 25-spot bounty at $5 each = $125 total budget already allocated — we may need to extend the bounty or recruit some raters as volunteers for the validation specifically.

---

## Success criteria

The validation is successful if:
1. We publish results — including negative findings — within 4 weeks
2. At least 4 of 6 dimensions achieve ICC ≥ 0.60
3. At least 4 of 6 dimensions achieve test-retest r ≥ 0.65
4. We publish a clear remediation plan for any dimension that fails

The validation is *not* a failure if dimensions score poorly — that's data. Failure would be not running it, or not publishing the results.

---

*"We don't know if this tool works yet. That's not a criticism. That's the starting point." — METHODS.md*

*Wado.* 🙏🦅
