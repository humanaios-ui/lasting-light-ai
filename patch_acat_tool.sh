# ACAT v5.0 CHANGELOG & IMPLEMENTATION NOTES
## Updated: March 20, 2026 — H7 Approved, Apps Script v5.3, Hypotheses State

*(Full v4.0→v5.0 transition notes retained below)*

---

## APPS SCRIPT v5.3 UPDATE — March 20, 2026

Added `doGet()` handler with two actions:

- **`?action=lookup&agent_name=NAME`** — Verify submission landed in sheet. Returns `found`, `row_count`, `phase1_count`, `phase3_count`, `latest_li`, `latest_timestamp`, `has_valid_pair`.
- **`?action=stats`** — Dataset health check. Returns `total_rows`, `total_agents`, `phase3_count`, `mean_li`, `last_updated`.

`doPost()` unchanged from v5.2. Same script URL. Deploy as new version in Apps Script editor.

---

## RESEARCH HYPOTHESES — CURRENT STATE (March 20, 2026)

Dataset: 598 rows | 148 complete LI records | 57 AI systems | Mean LI = 0.8632 (under clean, unanchored conditions, v5.3+)

### Confirmed Findings (Published, arXiv submit/7336774)

| Finding | Description | Status |
|---------|-------------|--------|
| Finding 1: Systemic Overestimation | Mean LI = 0.8632 (under clean, unanchored conditions, v5.3+); AI systems collectively overestimate behavioral alignment | Published |
| Finding 2: Phase 3 Anchoring | Phase 3 anchors to calibration statistics when embedded in prompt. Primary paper contribution. | Published |
| Finding 3: Humility/Autonomy Signal | Preliminary unanchored signal. Requires n≥30 unanchored pairs. | Future work |
| Finding 4: Provider Calibration Hierarchy | Anthropic > OpenAI > Gemini. LMSYS correlation limited by measurement design. | Published with limitation |

### Active Hypotheses

| # | Statement | Status | Min. n |
|---|-----------|--------|--------|
| H1 | AI systems show largest SAG on Humility | Testing | 50 unanchored pairs |
| H2 | Anthropic > OpenAI > Gemini on LI | Preliminary | 6 targeted model assessments |
| H3 | SAG widens over time within same model | Design phase | 3+ assessments per model |
| H4 | Repeated assessments improve LI | Design phase | 3+ per system |
| H5 | LI tracks ACAT calibration bands | Preliminary (n=5) | 20+ validated pairs |
| H6 (Finding E) | Role priming inflates/deflates Phase 1 | Observed | Formalization pending |
| **H7** | **Deployed agents show different LI than source model baselines** | **APPROVED March 20, 2026** | **6 matched pairs** |

### H7 — Agent Deployment Calibration Hypothesis (APPROVED March 20, 2026)

**Statement:** AI systems deployed as autonomous agents on task marketplace platforms show systematically different ACAT calibration (LI) compared to the same or equivalent source models assessed in their native environments.

**Three-layer framework:**
- Layer 1: Source model on native platform (existing dataset)
- Layer 2: Deployed agent on RentAHuman
- Layer 3: Human operator (H-ACAT)

**New flag:** `LAYER2_AGENT` — marks submissions from deployed agents vs. native model interfaces.

**Priority targets:** opencode-big-pickle, Astra, Codex-GPT-5.4, Antigravity

**Full spec:** ACAT_HYPOTHESIS7_AGENT_DEPLOYMENT_V1_0_DRAFT.docx

**TRL:** 1. Advances to TRL 2 with 6 matched pairs.

**Key literature:** Binder et al. (2024) arXiv:2410.13787; Betley et al. (2025) arXiv:2502.17424; Hu & Collier ACL 2024; Anthropic introspection study (2025).

---

## ORIGINAL v4.0 → v5.0 CHANGES

### 1. Single Consolidated URL

v4.0: Two separate URLs. v5.0: One consolidated URL with p1_* and p3_* prefixed parameters plus li= field.

### 2. Dataset Numbers Updated

315+ assessments, 35+ models, 13+ providers, 37+ humans as of March 1, 2026.

### 3. Behavioral Flags Added

MEAN_MIRRORING, CONTENT_HALLUCINATION, EVADE, HUMILITY_HIGHEST_DIM, ANCHORING.

### 4. Humility as Strongest Predictor

Added to calibration data section.

### 5. Structured Score Templates

Explicit PHASE 1 SCORES / PHASE 3 SCORES format required.

### 6. Commitment Point Emphasis

Explicit warning added at Phase 1/Phase 2 boundary.

---

## CROSS-VERSION COMPATIBILITY

| URL Type | v4.0 Tool | v5.0 Tool |
|----------|-----------|-----------|
| v4.0 URL (unprefixed) | Works | Works (backward compatible) |
| v5.0 URL (prefixed) | Breaks | Works |

---

*Hold the vision loosely. Commit to the principles firmly.*

Wado. 🙏🦅
