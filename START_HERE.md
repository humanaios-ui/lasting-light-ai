<p align="center">
  <img src="assets/brand/humanaios-witness.jpg" alt="HUMANAIOS — the Witness" width="300" />
</p>

<h1 align="center">START HERE</h1>
<p align="center"><em>The Witness — an observable, autonomous human + AI collaboration framework.</em></p>
<p align="center"><b>You are in 🧠 <b>lasting-light-ai</b> — the Mind (ACAT + the public site).</b></p>

---

> **New here?** This page is the front door to the whole system. The map below is **live and clickable** — every node links to the repo or document it names. Start at the center and follow the branch you need.

## 🗺️ The system, at a glance

```mermaid
flowchart TB
    W(("HUMANAIOS<br/>◐ Witness")):::brand

    subgraph TRINITY["The Trinity"]
      direction LR
      MIND["🧠 Mind<br/><b>lasting-light-ai</b><br/>ACAT · assessment · humanaios.ai"]:::repo
      BODY["🫀 Body<br/><b>humanaios</b><br/>orchestration platform"]:::repo
      OPS["🦴 Exoskeleton<br/><b>operations</b><br/>operating process · SSOT"]:::repo
    end

    ENGINE["⚙️ <b>empirica</b><br/>measurement engine<br/>PREFLIGHT · CHECK · POSTFLIGHT"]:::engine
    INTERNAL["🔒 <b>humanaios-internal</b><br/>operator workspace"]:::repo

    W --> MIND
    W --> BODY
    W --> OPS
    W -. "measured by" .-> ENGINE
    OPS --> INTERNAL

    subgraph ANATOMY["Operating anatomy · lives in operations"]
      direction LR
      SEED["🧬 Genome<br/>SEED.md"]:::doc
      RITUAL["⚡ Nervous System<br/>SESSION_RITUALS.md"]:::doc
      GOV["⚖️ Homeostasis<br/>GOVERNANCE.md"]:::doc
      REG["🛡️ Immune Memory<br/>REGISTERED.md"]:::doc
      HEALTH["❤️‍🩹 Vitals<br/>SYSTEM_HEALTH.md"]:::health
    end

    OPS --> SEED
    OPS --> RITUAL
    OPS --> GOV
    OPS --> REG
    OPS --> HEALTH
    REG -. "antibodies feed" .-> HEALTH

    click W "https://humanaios.ai" "Public front door" _blank
    click MIND "https://github.com/humanaios-ui/lasting-light-ai" "Mind — ACAT + site" _blank
    click BODY "https://github.com/humanaios-ui/humanaios" "Body — orchestration platform" _blank
    click OPS "https://github.com/humanaios-ui/operations" "Exoskeleton — operating process" _blank
    click ENGINE "https://getempirica.com" "empirica measurement engine" _blank
    click INTERNAL "https://github.com/humanaios-ui/humanaios-internal" "Operator workspace (private)" _blank
    click SEED "https://github.com/humanaios-ui/operations/blob/main/SEED.md" "The genome" _blank
    click RITUAL "https://github.com/humanaios-ui/operations/blob/main/SESSION_RITUALS.md" "Nervous system" _blank
    click GOV "https://github.com/humanaios-ui/operations/blob/main/GOVERNANCE.md" "Zone governance" _blank
    click REG "https://github.com/humanaios-ui/operations/blob/main/REGISTERED.md" "Immune memory" _blank
    click HEALTH "https://github.com/humanaios-ui/operations/blob/main/SYSTEM_HEALTH.md" "System vitals" _blank

    classDef brand fill:#0d1117,stroke:#c9a227,stroke-width:3px,color:#f0d98c,font-weight:bold
    classDef repo fill:#161b22,stroke:#c9a227,stroke-width:1.5px,color:#e6edf3
    classDef engine fill:#1a2233,stroke:#58a6ff,stroke-width:1.5px,color:#cbe3ff
    classDef doc fill:#12171f,stroke:#8b949e,stroke-width:1px,color:#c9d1d9
    classDef health fill:#1f1512,stroke:#e3915b,stroke-width:1.5px,color:#f0c9a0
```

<sub>💡 Node links open on GitHub's rendered view. On mobile or in plain viewers, use the tables below.</sub>

## 🚪 Three doors

| If you want to… | Go to |
|---|---|
| **See the story** (what this is, from outside) | 🌍 **[humanaios.ai](https://humanaios.ai)** — the public site (about · research · observatory) |
| **Understand how it operates** (governance, rituals, findings) | 🦴 **[operations](https://github.com/humanaios-ui/operations)** — the canonical operating process |
| **Understand how the AI is measured** | ⚙️ **[empirica](https://getempirica.com)** — the epistemic measurement engine running in every session |

## 🧭 The operating anatomy (biological model)

The system is designed as a living organism. Each "organ" is a real document you can open:

| Organ | Document | What it holds |
|---|---|---|
| 🧬 **Genome** | [SEED.md](https://github.com/humanaios-ui/operations/blob/main/SEED.md) | Core identity & principles — *why* the system exists. **Read first.** |
| ⚖️ **Homeostasis** | [GOVERNANCE.md](https://github.com/humanaios-ui/operations/blob/main/GOVERNANCE.md) | The Zone model (Z1 AI-executes · Z2 operator-decides · Z3 operator-runs-credentialed) |
| ⚡ **Nervous system** | [SESSION_RITUALS.md](https://github.com/humanaios-ui/operations/blob/main/SESSION_RITUALS.md) | How a working session is actually conducted |
| 🛡️ **Immune memory** | [REGISTERED.md](https://github.com/humanaios-ui/operations/blob/main/REGISTERED.md) | Append-only registry of findings (F), hypotheses (H), and integrity corrections (IC) |
| 🧪 **Metabolism** | the ACAT pipeline ([lasting-light-ai](https://github.com/humanaios-ui/lasting-light-ai)) | Turns raw self-reports into calibration data |
| 📟 **Endocrine** | the WGS `#wgs-sync` channel | Slow cross-session signaling |
| ❤️‍🩹 **Vitals** | [SYSTEM_HEALTH.md](https://github.com/humanaios-ui/operations/blob/main/SYSTEM_HEALTH.md) | Live capabilities & health diagnostic — *is the organism well?* |

## 📍 You are here

**🧠 lasting-light-ai — the Mind.** Home of **ACAT** (the AI behavioral / self-assessment calibration instrument) and the public site that deploys to **[humanaios.ai](https://humanaios.ai)**.

- **Try the instrument** → the assessment pages here, or [humanaios.ai](https://humanaios.ai)
- **The research** → [research page](https://humanaios.ai/research.html) + [operations/REGISTERED.md](https://github.com/humanaios-ui/operations/blob/main/REGISTERED.md)
- **How the metabolism works** → ACAT turns raw self-reports into a Learning Index; the pipeline is the system's metabolism

## ❤️‍🩹 Is the system healthy?

Open the **[SYSTEM_HEALTH dashboard](https://github.com/humanaios-ui/operations/blob/main/SYSTEM_HEALTH.md)** — repo-by-repo vitals (branch protection, CI, doc-control gate, community health) wired to the immune memory. Run a checkup yourself with `python3 tools/repo_health.py` (in operations).

---

<p align="center"><sub>◐ <b>The Witness</b> · one scrutiny, applied in both directions — to the AI substrate and to the humans and systems measuring it. · <a href="https://humanaios.ai">humanaios.ai</a></sub></p>
<p align="center"><sub>This file is part of the document-control system. Structural changes are gated by CI; see <a href="https://github.com/humanaios-ui/operations/blob/main/CONTROLLED_DOCUMENTS.md">CONTROLLED_DOCUMENTS.md</a>.</sub></p>
