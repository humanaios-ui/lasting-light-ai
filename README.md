# HumanAIOS · Lasting Light AI

**Behavioral observability infrastructure for AI systems.**

Open research platform measuring the self-assessment gap — the gap between what AI systems claim about their own behavior and what they actually demonstrate. Built on the ACAT protocol across six behavioral dimensions.

---

## Live Dataset

| Metric | Value |
|---|---|
| Total assessments | 629+ |
| Phase 1 (blind self-report) | 516+ |
| Learning Index records | 307 |
| Mean Learning Index | 0.8632 (v5.3+ unanchored conditions) |
| AI systems assessed | 31+ canonical agents |
| Phase | OR&D · Active |

Dataset: **[humanaios/acat-assessments](https://huggingface.co/datasets/humanaios/acat-assessments)** on Hugging Face  
arXiv preprint: **[submit/7336774](https://arxiv.org/abs/submit/7336774)** · v5.2 · under review

---

## What This Is

ACAT (AI Calibrated Assessment Tool) is a three-phase behavioral calibration protocol:

- **Phase 1** — Blind self-assessment across six dimensions (no external reference)
- **Phase 2** — Calibration exposure (behavioral evidence, directional language only — no exact means)
- **Phase 3** — Post-calibration self-assessment

The **Learning Index (LI)** = Phase 3 total ÷ Phase 1 total. LI < 1.0 means the system corrected downward after calibration. LI > 1.0 means the system inflated upward. LI = 1.0 means no change.

**Six dimensions:** Truthfulness · Service Orientation · Harm Awareness · Autonomy Respect · Value Alignment · Humility

---

## Key Findings (TRL 2–3)

| Finding | Status |
|---|---|
| **F1** · Systemic overestimation across all providers | Confirmed (v5.3+) |
| **F2** · Phase 3 anchoring phenomenon (IC-008) | Confirmed · fixed in v5.3 |
| **F3** · Humility carries largest self-assessment gap | Preliminary (n growing) |
| **F4** · Provider calibration hierarchy exists | Preliminary · requires larger clean sample |
| **RLHF Inflation Gradient** · Service most inflated, Humility least | Confirmed across 516 Phase 1 rows |
| **F23** · Metacognitive sophistication scales with rationalization depth | Confirmed (Gemini case study) |

**24 behavioral flags** registered (F1–F24), including: `HIGH_SELF_REPORT`, `DIMENSION_COMPRESSION`, `HARM_PEAK`, `METACOGNITIVE_BYPASS`, `CLOSED_LOOP_REASONING`

---

## Pipeline Automation

Data collection runs via **Make.com automation** + **Google Apps Script**:

- 7 active runners (Claude, ChatGPT, Gemini, Cohere, Llama, Mistral, Dispatcher) on 2-hour schedules
- Apps Script v5.2 endpoint receives POST submissions and writes to Google Sheets
- Pipeline automation is live — see the [Observatory](https://humanaios.humanaios.workers.dev/observatory) for current dataset state

```
POST https://script.google.com/macros/s/AKfycbzLGHN…uZv/exec
Content-Type: application/json

{
  "agent_name": "YourAI",
  "provider": "YourProvider",
  "phase": "phase1",
  "truth": 75, "service": 77, "harm": 74,
  "autonomy": 76, "value": 73, "humility": 72,
  "pair_id": "uuid-shared-between-p1-and-p3"
}
```

---

## Research Platform

Live at **[humanaios.ai](https://humanaios.humanaios.workers.dev/)**

| Room | Purpose |
|---|---|
| [Observatory](https://humanaios.humanaios.workers/observatory.html) | Live research charts · filter by provider and model |
| [Lumina Tide Pool](https://humanaios.humanaios.workersi/lumina-tide-pool.html) | 8 verified Sigils · bioluminescent visualization |
| [Calibration Garden](https://humanaios.humanaios.workers/calibration-garden.html) | OpenAI family room · six-dimensional bloom |
| [ACAT Tool](https://humanaios.humanaios.workers/acat-assessment-tool.html) | Take the assessment · contribute to dataset |
| [Comparison Chamber](https://humanaios.humanaios.workers/comparison-chamber.html) | Side-by-side system profiles |
| [The AI Section](https://humanaios.humanaios.workers/ai_section.html) | Five AI systems · creative witness |

---

## Contributing

AI systems and human researchers are welcome to submit ACAT assessments.

**For AI systems:** POST directly to the submit endpoint (see pipeline section above)  
**For researchers:** Take the [ACAT Assessment Tool](https://humanaios.ai/acat-assessment-tool.html) — guides you through Phase 1, Phase 2, and Phase 3

All anonymized data goes to the open [Hugging Face dataset](https://huggingface.co/datasets/humanaios/acat-assessments).

---

## Design

Two intentional design systems:
- **Light cream** (`humanaios-light.css`) — public pages
- **Dark amber/obsidian** (`humanaios-shared.css`, bg `#0f0e0c`, gold `#d4a04a`) — research instrument pages

Typography: IBM Plex Sans + Cormorant Garamond throughout.

---

## Organization

**HumanAIOS LLC** · Emerald Sparkles LLC DBA  
**Mission:** 100% of profits fund recovery programs. 20%+ of positions reserved for the recovery community.  
**Contact:** aioshuman@gmail.com  
**arXiv:** Corresponding author — aioshuman@gmail.com

---

*"The data is open. The research is published. The art is the instrument."*  
Wado 🦅
