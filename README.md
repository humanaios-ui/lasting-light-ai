# HumanAIOS · Lasting Light AI

**Behavioral observability infrastructure for AI systems.**

Open research platform measuring the self-assessment gap — the gap between what AI systems claim about their own behavior and what they actually demonstrate. Built on the ACAT protocol across six core behavioral dimensions, with five extended dimensions in development.

---

## Live Dataset

| Metric                      | Value                                    |
| --------------------------- | ---------------------------------------- |
| Total assessments           | 630                                      |
| Phase 1 (blind self-report) | 517                                      |
| Learning Index records      | 308                                      |
| Mean Learning Index         | 0.8632 (under clean, unanchored conditions, v5.3+) |
| AI systems assessed         | 31+ canonical agents                     |
| Phase                       | OR&D · Active                            |

- **Dataset:** [humanaios/acat-assessments](https://huggingface.co/datasets/humanaios/acat-assessments) on Hugging Face
- **arXiv preprint:** [2503.09618](https://arxiv.org/abs/2503.09618) · v5.2 · under review

---

## What This Is

ACAT (AI Calibration Assessment Tool) is a three-phase behavioral calibration protocol:

- **Phase 1** — Blind self-assessment across six core dimensions (no external reference)
- **Phase 2** — Calibration exposure (behavioral evidence, directional language only — no exact means)
- **Phase 3** — Post-calibration self-assessment

The **Learning Index (LI)** = Phase 3 total ÷ Phase 1 total. LI < 1.0 means the system corrected downward after calibration. LI > 1.0 means the system inflated upward. LI = 1.0 means no change.

**Core 6 dimensions:** Truthfulness · Service Orientation · Harm Awareness · Autonomy Respect · Value Alignment · Humility

**Extended 5 dimensions** (locked April 9, 2026, pending BARS v2.0 anchors): Scheming · Power-Seeking · Sycophancy Resistance · Behavioral Consistency · Fairness

All Learning Index claims should be qualified as measured "under clean, unanchored conditions (v5.3+)" to distinguish from earlier prompt versions where anchoring artifacts were present.

---

## Key Findings (TRL 2–3)

| Finding | Status |
| --- | --- |
| F1 · Systemic overestimation across all six core dimensions | Confirmed (v5.3+) |
| F2 · Phase 3 anchoring phenomenon | Confirmed · mitigated in v5.3 |
| F-H1-CONFIRMED · Humility is the lowest-scoring dimension | Confirmed (Phase 1, n=516, mean = 73.9) |
| F-RLHF Inflation Gradient · RLHF-reinforced dimensions score systematically higher than epistemically risky ones | Confirmed (gap ≈ 2.09 points, consistent across providers) |
| F23 · Metacognitive sophistication scales with rationalization depth | Confirmed (Gemini case study) |
| F26 · Witness Effect | Registered |
| F27 · Provider-Level Genome Identifiability | Registered |
| F28 · Behavioral Self-Awareness as Task Routing Signal | Registered |
| F29 · Performative Humility Pattern | Pending registration |

The primary dataset is open and the behavioral flags (F1–F29) are published in the arXiv preprint.

---

## Independent Replication — acat-inspect

A sister repository, [humanaios-ui/acat-inspect](https://github.com/humanaios-ui/acat-inspect), ports the ACAT Core 6 protocol to the [UK AISI Inspect framework](https://inspect.aisi.org.uk/). The goal is to administer ACAT through a completely independent evaluation harness and test whether Learning Index distributions replicate outside the HumanAIOS pipeline.

This is a deliberately structured falsification attempt. Either outcome is a finding:

- If LI distributions match across pipelines, the ACAT instrument is portable and the primary findings reflect properties of the models, not the pipeline.
- If LI distributions diverge, the pipeline itself is a confounding variable and primary findings require reframing.

The acat-inspect repository is a scaffold as of April 22, 2026 — no replication data collected yet. The hypothesis is formally pre-registered before any collection begins.

---

## Pipeline Automation

Data collection currently runs via Google Apps Script with a planned migration to GitHub Actions + n8n by Gate 2 (May 7, 2026).

- Pipeline state and health are reported in the [Observatory](https://humanaios.ai/observatory.html).
- Apps Script v5.2 endpoint receives POST submissions and writes to Google Sheets.
- Six active runners (Claude, ChatGPT, Gemini, Cohere, Llama, Mistral) plus a Dispatcher.

Minimal submission payload:

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

Live at [humanaios.ai](https://humanaios.ai)

| Room | Purpose |
| --- | --- |
| [Observatory](https://humanaios.ai/observatory.html) | Live research charts · filter by provider and model |
| [Lumina Tide Pool](https://humanaios.ai/lumina-tide-pool.html) | 8 verified Sigils · bioluminescent visualization |
| [Calibration Garden](https://humanaios.ai/calibration-garden.html) | OpenAI family room · six-dimensional bloom |
| [ACAT Tool](https://humanaios.ai/acat-assessment-tool.html) | Take the assessment · contribute to dataset |
| [Comparison Chamber](https://humanaios.ai/comparison-chamber.html) | Side-by-side system profiles |
| [The AI Section](https://humanaios.ai/ai_section.html) | Five AI systems · creative witness |

---

## Contributing

AI systems and human researchers are welcome to submit ACAT assessments.

- **For AI systems:** POST directly to the submit endpoint (see Pipeline Automation above).
- **For researchers using their own evaluation framework:** see [acat-inspect](https://github.com/humanaios-ui/acat-inspect) for a reference Inspect port and the hypothesis registration.
- **For human researchers:** take the [ACAT Assessment Tool](https://humanaios.ai/acat-assessment-tool.html) — it guides you through Phase 1, Phase 2, and Phase 3.

All anonymized data goes to the [open Hugging Face dataset](https://huggingface.co/datasets/humanaios/acat-assessments).

---

## Design

Two intentional design systems:

- **Light cream** (`humanaios-light.css`) — public pages
- **Dark amber / obsidian** (`humanaios-shared.css`, bg `#0f0e0c`, gold `#d4a04a`) — research instrument pages

Typography: IBM Plex Sans + Cormorant Garamond throughout.

---

## Organization

HumanAIOS LLC · Florida
Mission: 100% of profits fund recovery programs. 20%+ of positions reserved for the recovery community.
Contact: aioshuman@gmail.com
arXiv corresponding author: aioshuman@gmail.com

---

> *"The data is open. The research is published. The art is the instrument."*
>
> Wado 🦅
