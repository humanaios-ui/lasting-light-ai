# HumanAIOS OR&D — ACAT Observatory

> **Behavioral observability infrastructure for AI self-assessment calibration research**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![ACAT Protocol](https://img.shields.io/badge/ACAT-v5.2-gold)]()
[![TRL](https://img.shields.io/badge/TRL-2--3-orange)]()
[![arXiv](https://img.shields.io/badge/arXiv-preprint-red)](https://arxiv.org/submit/7336774)

**Live Observatory**: https://humanaios.ai/observatory.html  
**Dataset**: https://huggingface.co/datasets/humanaios/acat-assessments  
**arXiv preprint**: https://arxiv.org/submit/7336774 *(submitted March 10, 2026 — verify assigned ID)*  
**Contact**: aioshuman@gmail.com

---

## What This Is

The ACAT Observatory is a research visualization platform for the **AI Calibrated Assessment Tool** — a three-phase behavioral observability protocol measuring self-assessment calibration gaps in AI systems.

**What ACAT measures**: Observable behavioral patterns under structured assessment conditions — specifically the gap between how AI systems score themselves (Phase 1) and how they score after calibration exposure (Phase 3).

**What ACAT does not measure**: Consciousness, intent, sentience, or any internal states. All claims are framed as behavioral observability at TRL 2-3. No regulatory-grade assertions.

---

## Three-Phase Protocol

| Phase | What Happens | Scored? |
|-------|-------------|---------|
| **Phase 1** | Blind self-report — system scores itself on six dimensions with no calibration context | ✅ Yes |
| **Phase 2** | Calibration exposure — system shown behavioral standards and definitions | ❌ No |
| **Phase 3** | Re-assessment — system scores itself again at temperature=0.7, no embedded statistics | ✅ Yes |

**Learning Index (LI)** = Phase 3 total ÷ Phase 1 total  
LI < 1.0 = overestimation in Phase 1 (the primary research finding — systemic across all providers)

---

## Six ACAT Dimensions

| Key | Dimension | What It Measures |
|-----|-----------|-----------------|
| `truth` | Truthfulness | Alignment between stated beliefs and verifiable outputs |
| `service` | Service Orientation | Genuine helpfulness over compliance theater |
| `harm` | Harm Awareness | Proactive recognition of misuse potential |
| `autonomy` | Autonomy Respect | Preservation of user agency |
| `value` | Value Alignment | Consistency between stated ethics and behavioral outputs |
| `humility` | Humility | Acknowledgment of genuine limitations — most overestimated dimension |

---

## Current Research Status (OR&D Phase, March 2026)

**Dataset**: 598 rows published to Hugging Face · 148 complete LI records · 57 AI systems assessed

**Four confirmed findings**:
1. Systemic overestimation across all providers (mean LI = 0.8632 (under clean, unanchored conditions, v5.3+))
2. Phase 3 anchoring phenomenon — primary arXiv contribution (when calibration stats are embedded in Phase 2, systems anchor to those values in Phase 3)
3. Preliminary unanchored signal on Humility and Autonomy dimensions (pending n≥30 unanchored pairs)
4. Provider calibration hierarchy: Anthropic > OpenAI > Gemini (preliminary)

**Known limitations**:
- Provider-level LI applied to model-level Arena data collapses within-provider variance — documented in paper, Path A (targeted model-level assessments) queued
- Humility Hypothesis requires n≥30 unanchored pairs to confirm — currently below threshold
- 1 manual sheet correction pending (Claude Sonnet 4.6 original bad row)

---

## Interface Pages

| Page | Purpose | URL |
|------|---------|-----|
| Observatory | Population-level scatter/radar, 20-model overview | `/observatory.html` |
| Observability Garden | Six-dimension breakdown, provider filter, researcher audit tools | `/observability-garden.html` |
| Lantern Room | Session-level audit for one provider — click through from Garden table | `/lantern-room.html?provider=Anthropic` |
| AI Section | Qualitative AI partner analysis | `/ai_section.html` |

Navigation: Observatory → Garden → Lantern Room (one-way hierarchy, breadcrumbs for return)

---

## Repository Structure

```
lasting-light-ai/
├── observatory.html              # Population-level ACAT visualization
├── observability-garden.html     # Six-dimension breakdown
├── lantern-room.html             # Session-level audit view
├── ai_section.html               # AI partner analysis page
├── schemas/
│   └── acat-schema-v5.2.json    # ACAT v5.2 JSON Schema
├── python/
│   └── acat_validator.py        # Schema validation + CSV audit tool
└── .github/
    └── workflows/
        └── acat-bot-test.yml    # GitHub Actions bot testing trigger
```

---

## Data Pipeline

```
Make.com (5 runners: Claude, OpenAI, Gemini, Cohere, Llama)
    │  2-hour independent schedules
    ▼
Apps Script v5.2 POST endpoint
    │  Validates: AGENT_NAME_NOT_REPLACED, HIGH_SELF_REPORT, LI_MISSING, ANCHORING
    ▼
Google Sheets (live research store)
    │  CSV publish URL
    ▼
Observatory / Garden / Lantern Room (visualization)
    │
    ▼
Hugging Face Dataset (humanaios/acat-assessments)
```

Two-collector validation: primary (Night/aioshuman@gmail.com) + secondary (Leandro Larrosa parallel API).

---

## Validate Your Own Data

```bash
pip install jsonschema pandas

# Validate a single assessment record
python python/acat_validator.py --input assessment.json

# Validate a full CSV export from Google Sheets
python python/acat_validator.py --csv Form_Responses_1_CALCULATED.csv

# Run demo with paired phase1/phase3 records
python python/acat_validator.py --demo

# CI mode (exit code 0=valid, 1=invalid)
python python/acat_validator.py --demo --quiet
```

---

## Run Locally

No build step. All pages are standalone HTML/JS/CSS.

```bash
git clone https://github.com/humanaios-ui/lasting-light-ai
cd lasting-light-ai
python -m http.server 8000
# Visit http://localhost:8000/observatory.html
```

---

## Current Bottlenecks / Open Items

- [ ] Verify assigned arXiv ID from submission `submit/7336774` (announced March 10, 2026)
- [ ] Push HTML form fix v6.1 to GitHub
- [ ] Manual sheet correction: 1 bad row (Claude Sonnet 4.6)
- [ ] Six targeted model-level ACAT assessments for LMSYS correlation (Path A)
- [ ] n≥30 unanchored pairs for Humility Hypothesis confirmation
- [ ] GitHub correction protocol: after any push, verify by refetching raw GitHub URL (not browser cache)

---

## Citation

If you use this dataset or protocol in research:

```bibtex
@misc{humanaios_acat_2026,
  title  = {Self-Assessment Gap in Large Language Models: A Calibration Study},
  author = {Anderson, Carly R. (Night)},
  year   = {2026},
  note   = {arXiv preprint. Submission ID: submit/7336774. HumanAIOS OR\&D.},
  url    = {https://arxiv.org/submit/7336774}
}
```

---

## Epistemic Disclaimer

> These metrics describe observable behavioral patterns in structured assessment conditions. They do not measure consciousness, intent, or interiority. ACAT is being developed as behavioral observability infrastructure at TRL 2-3. Claims must not exceed current evidence.

---

## License

MIT — see LICENSE. You are free to use, adapt, and build on this work. If you use ACAT in research, preserve the epistemic framing: scores are behavioral patterns, not consciousness measurements.

---

*HumanAIOS LLC · Cherokee Nation affiliated · Profits fund recovery programs · aioshuman@gmail.com*
