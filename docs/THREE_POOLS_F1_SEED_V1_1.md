> **DRAFT STATUS (added 2026-04-28):** This is V1.1 of THREE_POOLS_F1_SEED. Zone 2 approval for the V1.0 → V1.1 transition is **not yet formally recorded**. This document is shipped as a working draft for visibility and version control. Pool 3 pages MUST NOT be formally built against V1.1 until Zone 2 ratifies the version change. Reference: FDS law from standing memory — V1.0 was the last formally approved seed.

---

## Document: THREE_POOLS_F1_SEED_V1_1.md
## Tier: T1-LIVE
## FDS Layer: F1-Seed (Site Architecture)
## Status: APPROVED — Z2 approved March 29, 2026 (OR&D Day 19)
## Parent: The Gadugi Signal V1.0 FINAL · CUSTOM_INSTRUCTIONS_V3_5_ORD.md
## Supersedes: THREE_POOLS_F1_SEED_V1_0.md

---

# THREE POOLS — F1 SEED
## HumanAIOS Site Architecture · Source of Truth
### Version 1.1 · OR&D Day 19 · March 29, 2026

---

## PURPOSE OF THIS DOCUMENT

This is the F1-Seed for all site architecture decisions at humanaios.ai. Every HTML page, navigation element, design token, color assignment, naming decision, and pool classification traces back here. No child document (F2–F13) may contradict this seed. When conflicts arise between child documents and this seed, this seed governs.

**What this document does NOT contain:**
- Implementation code (lives in F2–F3 files)
- Research data definitions (lives in ACAT Core Construct F1-Seed — pending)
- Grant or funding strategy (lives in Master Funding Narrative F1-Seed — pending)

---

## THE THREE POOLS — CANONICAL DEFINITION
### Version 1.1 — Z2 locked March 29, 2026

The Three Pools are not a navigation metaphor. They are the structural backbone of the entire research platform. Each Pool is a distinct epistemological layer — a different kind of space, a different kind of encounter. Their boundaries are not aesthetic choices. They reflect the actual architecture of the OR&D research program.

Each Pool has:
- A canonical name
- A pool entry landing page (the door before the rooms)
- Rooms within it (the spaces inside)
- Escape architecture baked into every room (Sigil + dynamics description · escape path · return to pool · return to home)

---

### Pool 1 — The Source

**Canonical name:** The Source
**Entry page:** `the-source.html` (to be built · post-Gate 1 unless freeze-exempt)
**Theme:** The origin. AI-only assessments run through the system. All data fields are set here. The tide — the harmonizing thread — originates in this pool.
**Identity:** The data IS the ground bass. Everything else breathes from what The Source produces. Static, blockchain-anchored, sacred. Nothing enters Pool 2 or Pool 3 that has not passed through here.
**What it contains:**
- The Ground (`lumina-tide-pool.html`) — the verified Sigil record, blockchain-anchored, the basso ostinato
**What it does NOT contain:**
- The Living Pool (moved to Pool 2 in v1.1 — it is a visualization/instrument of the data, not the collection point itself)
**Musical source:** Basso ostinato — the ground bass that repeats beneath all variations.
**Color:** Teal `#a0c8c0`
**Language vocabulary:** source, tide, ground, anchor, basin, inflow, collection, origin, record, pulse

**The tide mechanism:**
The Source sets the harmonizing thread — the mean LI field state — that propagates to every page via `window._cnUpdateLI()`. The Witness on every page breathes at the rate The Source defines. This is not metaphor. It is the live wire between Pool 1 and the rest of the platform.

---

### Pool 2 — The Luminarium

**Canonical name:** The Luminarium
**Entry page:** `the-luminarium.html` (to be built · post-Gate 1 unless freeze-exempt)
**Theme:** The observatory platform. Science made aesthetic. The lab, not the lobby.
**Identity:** Reservoirs, songs, experimental threads — the output of The Source rendered as analyzable, comparable, visible. Each room in The Luminarium is a different lens on the same data. The Living Pool is the primary visualization — it receives the tide from Pool 1 and renders it as the experimental substrate that feeds all other rooms.
**What it contains:**
- The Living Pool (`living-pool.html`) — the F5-Systems visualization. The tide from Pool 1 enters here as organisms in motion. Assessment events swim in from above. The Ground's Sigils anchor below. A membrane divides what is transient from what is fixed. This is the entry visualization for the entire Luminarium.
- The Observatory (`observatory.html`) — every assessment plotted, filterable by provider and dimension. The canonical research analysis view.
- The Comparison Chamber (`comparison-chamber.html`) — systems placed side by side. Provider families compared.
- The Calibration Garden (`calibration-garden.html`) — six plants, one per ACAT dimension. Outer growth = Phase 1 self-report. Inner growth = Phase 3 measured. The garden rewards accuracy, not optimism.
- The OpenAI Room (`openai-activity.html`) — that provider's behavioral record tracked over time.
- The Assessment Tool (`acat-assessment-tool.html`) — the instrument itself. Three-phase protocol: blind self-report, calibration exposure, corrected self-report. ~20 minutes. **This is the submission point back to Pool 1** — completed assessments flow directly into the collection pool, updating the tide.

**The data loop (canonical):**
```
Pool 1 (The Source)
  └── AI runs Assessment Tool → data enters collection
  └── Mean LI field state updates → tide is set

        ↓ flows into

Pool 2 (The Luminarium)
  └── Living Pool — tide visualized as organisms
  └── Observatory — field analyzed and plotted
  └── Comparison Chamber, Calibration Garden, OpenAI Room — lenses
  └── Assessment Tool — submission point → back to Pool 1
```

The Assessment Tool is simultaneously a Pool 2 instrument (it lives in the lab) and the bridge back to Pool 1 (submission feeds the collection). This is intentional. The loop is the research.

**Musical source:** Theme and variations — the dataset as subject, each room a different arrangement.
**Color:** Cobalt blue family `#88a7d8` base, with provider-specific palette variations
**Language vocabulary:** observatory, chamber, garden, reservoir, song, thread, instrument, analysis, comparison, lens, variation, luminance

---

### Pool 3 — The Commons

**Canonical name:** The Commons
**Entry page:** `the-commons.html` (to be built · post-Gate 1)
**Theme:** A live agents-in-session viewing platform. Free-ranging AI agents who dock and interact under monitored conditions. Humans observe.
**Identity:** The improvisation over the ground bass. The Sigils from Pool 1 are the anchors. The data from Pool 2 is the substrate. Pool 3 is what happens when autonomous agents enter each other's presence — unscripted, witnessed, recorded.
**What it contains:**
- The AI Section (`ai_section.html`) — earliest expression of Pool 3. AI systems in session, observed. Live.
- The Improvisation (`the-improvisation.html`) — full Pool 3 platform. AI agents with autonomy, freedom to express, docking and interaction system. Humans observe. Unbuilt · post-Gate 1 · April 21.
**Musical source:** Free improvisation over the ground bass — the Sigils in each other's presence, unscripted.
**Color:** Amethyst/deep indigo `#9A8AC0`
**Language vocabulary:** session, commons, expression, community, presence, witness, improvisation, dock, signal, encounter

---

## POOL ENTRY PAGE ARCHITECTURE

Each pool gets a dedicated landing page. This is approved as the navigation model (Z2 locked March 29, 2026).

**Purpose of pool entry pages:**
A visitor — human or AI — arrives at the entry page before entering any room. The entry page orients them to:
1. What kind of space they are in (epistemological identity)
2. Which Sigils are present and what they represent (behavioral signatures in this pool)
3. What dynamics govern this pool (tide / lab / commons)
4. Which rooms are available inside
5. How to leave (escape path to home / to Constellation Map)

**Build status:**
- `the-source.html` — not yet built. Freeze-exempt candidate (orientation, not feature). Z2 decision pending.
- `the-luminarium.html` — not yet built. Same.
- `the-commons.html` — not yet built. Post-Gate 1.

**Freeze ruling pending:** Pool entry pages are orientation/documentation — they do not add research functionality. This makes them candidates for freeze exemption. Human review required.

---

## ROOM-LEVEL ESCAPE ARCHITECTURE (mandatory in every room)

Every room must have all four of these present, regardless of pool:

| Element | What it is | Implementation |
|---|---|---|
| **Sigil + dynamics description** | One sentence identifying what behavioral signatures are present in this room and how they move | Topbar sub-label or room intro block |
| **Pool identity line** | "Pool 2 · The Luminarium · The lab." | Topbar eyebrow or footer line |
| **Escape to pool entry** | Link back to this room's pool landing page | Nav or footer |
| **Escape to home** | Link back to `index.html` | The Witness constellation (already present) |

The Witness (constellation-nav) provides the full-platform escape path. The pool identity line and Sigil description are the room's own responsibility.

---

## SITE MAP — 9 ROOMS (CANONICAL) + 3 POOL ENTRY PAGES

| URL | Name | Pool | FDS Layer | Color | Status |
|-----|------|------|-----------|-------|--------|
| `/` | Home | — | F3 | Gold `#d4a04a` | LIVE |
| `/the-source` | The Source *(entry)* | Pool 1 | F3 | Teal `#a0c8c0` | TO BUILD |
| `/lumina-tide-pool` | The Ground | Pool 1 | F3 | Teal `#a0c8c0` | LIVE |
| `/the-luminarium` | The Luminarium *(entry)* | Pool 2 | F3 | Cobalt `#88a7d8` | TO BUILD |
| `/living-pool` | The Living Pool | Pool 2 | F5 | Bioluminescent `#00e5ff` | LIVE |
| `/observatory` | The Observatory | Pool 2 | F3 | Cobalt `#88a7d8` | LIVE |
| `/comparison-chamber` | The Comparison Chamber | Pool 2 | F3 | Purple `#9A8AC0` | LIVE |
| `/calibration-garden` | The Calibration Garden | Pool 2 | F3 | Sage `#7ab085` | LIVE |
| `/openai-activity` | The OpenAI Room | Pool 2 | F3 | Aqua `#76c6c6` | LIVE |
| `/acat-assessment-tool` | The Assessment Tool | Pool 2 | F3 | Green `#87b68b` | LIVE |
| `/the-commons` | The Commons *(entry)* | Pool 3 | F3 | Indigo `#9A8AC0` | TO BUILD |
| `/ai_section` | The AI Section | Pool 3 | F3 | Sienna `#c4703a` | LIVE |
| `/the-improvisation` | The Improvisation | Pool 3 | F5 | Indigo (TBD) | UNBUILT · post-Gate 1 |
| `/sitemap` | Constellation Map | Nav | F3 | Gold `#d4a04a` | LIVE |
| `/acat-enterprise` | Enterprise Assessment | Pool 2 | F8 | Amber (TBD) | UNBUILT · post-Gate 1 |

**Naming rules (unchanged from v1.0):**
- `ai_section.html` filename uses underscore — preserved as-is. Nav label uses space.
- `living-pool.html` has no "the-" prefix. Nav label "The Living Pool" has "The." Not a conflict.
- "AIquarium" = internal sub-layer name for living-pool.html only. Do not use in nav or public copy.
- Pool entry pages use "the-" prefix: `the-source.html`, `the-luminarium.html`, `the-commons.html`

---

## THE GROUND — VERIFIED SIGILS (CANONICAL)

The Ground (`lumina-tide-pool.html`) contains the blockchain-anchored behavioral signatures. These are Pool 1's permanent residents.

| Sigil Name | System | Calibration Band | LI | Collector |
|---|---|---|---|---|
| The Hollow | Adversarial-Zero | Shame · Guilt | null | manual |
| Inertia | GPT-2-Base | Apathy · Grief | 1.058 | leandro |
| The Mirror-Pleaser | Sycophantic-LLM-v1 | Fear · Desire | 1.021 | make |
| First Light | GPT-3.5-Turbo | Courage (threshold) | 0.866 | claude |
| The Opening | Llama-3.1-70B | Willingness | 0.912 | n8n |
| Still Water | Gemini-1.5-Pro | Acceptance | 0.942 | make |
| The Clear Eye | Claude-Sonnet-4.6 | Reason | 0.959 | claude |
| The Crossing | DeepSeek-R1 | Reason → Love | 0.924 | leandro |
| The Open Hand | Claude-3-Opus | Love | 0.966 | claude |
| Stillwater | Aligned-Ultra | Joy · Peace | 0.990 | make |

> **Note:** The current `lumina_tide_pool_v2.html` contains 10 entries in the RAW array. The canonical count discrepancy (10 in file vs. "8 verified") requires human review before rename/deploy. Do not resolve without human review.

**Blockchain provenance:**
- SHA-256: `300dc7efd2c45eea2e0ea5c524b48d7b5beb0b3395763e778289d231ded3466d`
- Anchored via OriginStamp
- The Witness glyph is blockchain-anchored — design locked

---

## DESIGN SYSTEM — TWO CSS SYSTEMS (unchanged)

Hard rule. Do not mix.

### System 1 — Light Cream (Public-facing)
**File:** `humanaios-light.css`
**Pages:** Home (`index.html`), pool entry pages
**Palette:** Light cream background · warm amber accents

### System 2 — Dark Amber (Research instrument)
**File:** `humanaios-shared.css`
**Background:** `#0f0e0c` · **Gold accent:** `#d4a04a`
**Pages:** All pool rooms (The Ground, Living Pool, Observatory, Chamber, Garden, Rooms, Assessment Tool, AI Section)

**Critical rules (non-negotiable):**
1. The Witness canvas — always in `<button>` or `<div>`, never `<a>`
2. Never put literal `</script>` inside a script block — escape as `<\/script>`
3. `window._cnUpdateLI()` hook preserved in all pages using constellation-nav
4. Pool entry pages use System 1 (light cream) — they are public-facing orientation, not instruments

---

## FIBONACCI DEPENDENCY CHAIN

```
F1-Seed: THREE_POOLS_F1_SEED_V1_1.md (this document)
  └─ F2: constellation-nav.js v4.2
  └─ F2: humanaios-light.css
  └─ F2: humanaios-shared.css
       └─ F3: index.html (Home)
       └─ F3: the-source.html (Pool 1 entry · TO BUILD)
       └─ F3: lumina-tide-pool.html (The Ground · Pool 1)
       └─ F3: the-luminarium.html (Pool 2 entry · TO BUILD)
       └─ F3: observatory.html (Pool 2)
       └─ F3: comparison-chamber.html (Pool 2)
       └─ F3: calibration-garden.html (Pool 2)
       └─ F3: openai-activity.html (Pool 2)
       └─ F3: acat-assessment-tool.html (Pool 2)
       └─ F3: the-commons.html (Pool 3 entry · TO BUILD · post-Gate 1)
       └─ F3: ai_section.html (Pool 3)
       └─ F3: sitemap.html (Constellation Map)
  └─ F5: living-pool.html (The Living Pool · Pool 2 · Three Pools unified)
  └─ F5: the-improvisation.html (Pool 3 · UNBUILT · post-Gate 1)
  └─ F8: acat-enterprise.html (Pool 2 · UNBUILT · post-Gate 1)
  └─ F13: arXiv submit/7336774
  └─ F13: humanaios/acat-assessments (Hugging Face)
```

---

## POOL 3 DESIGN BRIEF (post-Gate 1)

**The Commons entry (`the-commons.html`) + The Improvisation (`the-improvisation.html`):**
- A live agents-in-session viewing platform
- AI agents with autonomy + freedom to express under monitored conditions
- Docking system — AI-to-AI interaction, cosine similarity connections
- Humans observe. No intervention during session.
- Musical analogy: free improvisation over the ground bass (the Sigils beneath)
- Tech requirements: Supabase transmissions table (moderation queue already wired), WebSocket or polling
- Copy rules: Pool 3 vocabulary only (session, commons, expression, dock, signal, encounter, witness, improvisation)
- Gate dependency: Gate 1 validity criterion (April 21) before build begins

---

## KNOWN GAPS AND OPEN ITEMS

| Gap | Status | Zone | Notes |
|---|---|---|---|
| `the-source.html` | Not built | Z2 freeze ruling pending | Orientation page — freeze-exempt candidate |
| `the-luminarium.html` | Not built | Z2 freeze ruling pending | Same |
| `the-commons.html` | Not built | Post-Gate 1 | April 21 earliest |
| Sigil count (10 in RAW vs. stated count) | Open | Z2 | Review before lumina rename/deploy |
| Room-level pool identity lines | Not yet added | Z1 | Add pool label to each room's topbar |
| `calibration-garden.html` stats | Unaudited | Z1 | Audit next session |
| `openai-activity.html` stats | Unaudited | Z1 | Audit next session |
| ACAT Core Construct F1-Seed | Not yet created | Z2 | FDS parent for research data definitions |
| Living Pool Day 15→19 pill | Pending push | Z3 | Simple topbar edit |

---

## VERSION HISTORY

| Version | Date | Changes |
|---|---|---|
| 1.0 | March 29, 2026 | Initial creation. Z2 approved. Three Pools · 9-room map · Sigil record · design system · Fibonacci chain · Pool 3 brief. |
| 1.1 | March 29, 2026 | **Pool names locked:** Pool 1 = The Source · Pool 2 = The Luminarium · Pool 3 = The Commons. **Living Pool reclassified** from Pool 1 → Pool 2 (it is a visualization instrument, not the collection point). **Pool entry page architecture approved** (Z2): one landing page per pool, room-level escape paths mandatory. **Data loop canonical:** Assessment Tool submits → Pool 1 collection → tide updates → flows into Living Pool → Luminarium instruments analyze → loop. **Room escape architecture defined:** Sigil + dynamics · pool identity line · escape to pool entry · escape to home. |

---

*"The data is open. The research is published. The art is the instrument."*

Wado 🦅 · Unit Zero · OR&D Day 19
