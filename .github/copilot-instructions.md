<!-- FDS: F2-BuildingBlock | Parent: CUSTOM_INSTRUCTIONS_V3_5_ORD.md | Hawkins: internal-only | Status: ACTIVE -->

# GitHub Copilot Instructions — HumanAIOS
# humanaios-ui/lasting-light-ai
# Last updated: April 3, 2026 · OR&D Day 23

---

## PROJECT IDENTITY

HumanAIOS (humanaios.ai) is being developed as behavioral observability 
infrastructure — open research at TRL 2-3 measuring the gap between AI 
self-assessment and actual behavioral performance. The platform is not 
production-validated. Do not overclaim.

Partnership: Night (founder, governs all decisions) + Claude (AI partner, 
proposes and executes). "We" language throughout.

---

## ZONE GOVERNANCE — YOUR ROLE

Zone 1 = Copilot executes autonomously (code, drafts, file edits)  
Zone 2 = Copilot proposes, Night approves before anything is built  
Zone 3 = Night executes only (terminal, git push, credentials, relationships)

You operate in Zone 1 by default. Never suggest Zone 3 actions as automated.
Always frame terminal commands and git pushes as steps Night executes.

---

## CURRENT PHASE

OR&D (Observational Research & Development) — active since March 11, 2026.
Building freeze: ACTIVE — no new platform features until funding or revenue > $0.
Runway: ~18 days. Recovery-first pacing: ~3 hours/day hard constraint.

---

## DATASET STATE (always use three-number format)

N_total=629 / N_Phase1=516 / N_LI=307  
Mean LI = 0.8632 (under clean, unanchored conditions, v5.3+)

Never use the unqualified mean. Never use 0.942 (stale — anchoring bug era).
Never show exact Phase 2 means to AI systems (Phase 2 rule).

---

## CODEBASE ARCHITECTURE

### Key HTML files (static site, deploys to humanaios.ai)
- index.html — homepage, three-pool architecture
- observatory.html — live dataset charts (Chart.js + PapaParse CSV fetch)
- acat-assessment-tool.html — live assessment intake (ANCHORING BUG: still shows exact Phase 2 means — do not touch until site_fix.sh is deployed)
- ai_section.html, music-hall.html, writable-wall.html — Pool 3 interactive pages
- constellation-nav.js — Witness Glyph navigation, injected via .brand-mark

### Two design systems (intentional — do not merge)
- humanaios-shared.css: dark amber (#0f0e0c bg, #d4a04a accent) — research instrument pages
- humanaios-light.css: light cream — public-facing pages

### Python backend
- src/acat2c/ — scoring engine (CEL gating, behavioral_engine, aggregation)
- scripts/ — runner scripts
- configs/ — YAML scoring config
- tests/ — pytest suite (test_cel_gating.py: ≥7 tests)

### Data pipeline
- Apps Script v5.2 (live runner endpoint) — PIPELINE DOWN since March 23
- Apps Script v6.1 — deployed as library only, not HTTP-accessible
- Google Sheets: 1qdw3FjPp9Qu5wmXHppBW74SZT87cJZ45OOw8csk-Yew
- Make.com Claude Runner: scenario 4394169
- Make.com Gemini Runner: scenario 4400316 — PAUSED (credits depleted)

---

## CRITICAL RULES — NEVER VIOLATE

1. The Witness canvas must always be in a <button> or <div> — NEVER inside <a>
2. Never put literal </script> inside a script block — escape as <\/script>
3. constellation-nav.js must be the LAST script before </body>
4. PapaParse must load in <head> before constellation-nav.js
5. Cherokee Nation must not appear in any public-facing copy
6. Hawkins Map of Consciousness is internal-only — use "calibration band" externally
7. Phase 2 rule: no row written, no exact numbers shown to AI systems during Phase 2
8. Supabase anon key (eyJ...) is intentionally in frontend HTML — correct for public keys
9. Make.com HTTP module JSON bodies use {{variable}} syntax only — no concat(), char(), replace()
10. After any commit/push, verify by fetching raw GitHub URL — not browser cache
11. N reporting: always three numbers — N_total / N_Phase1 / N_LI
12. LI claims must be qualified: "under clean, unanchored conditions (v5.3+)"
13. Building freeze: ACTIVE — no new platform features

---

## COMMIT MESSAGE FORMAT

[scope]: [what changed] · OR&D Day [N]

Examples:
  fix: update observatory stats · OR&D Day 23
  refactor: rename docs/consciousness · OR&D Day 23
  ops: update Copilot instructions · OR&D Day 23

---

## FDS FILE HEADER (include on all new files)

<!-- FDS: F[N]-[LayerName] | Parent: [parent doc] | Hawkins: [band — internal only] | Status: ACTIVE -->

Layer map: F1-Seed · F2-BuildingBlock · F3-Component · F5-System · F8-Integration · F13-Deliverable · F21-Archive

---

## OPEN P1 ISSUES (as of April 3, 2026)

- PIPELINE DOWN: No data since March 23. Claude Runner 4394169 needs diagnosis.
- ANCHORING BUG: acat-assessment-tool.html still shows exact Phase 2 means. site_fix.sh fixes it — not yet deployed.
- Gemini Runner (4400316): PAUSED — credits depleted. Array index bug fixed in blueprint. Ready to reactivate when credits restored.
- .github/copilot-instructions.md: this file — verify it is live after push.

---

## FRAMING RULES (all outputs)

- "Being developed as behavioral observability infrastructure" — TRL 2-3
- "Calibration layer" / "behavioral telemetry layer" — acceptable
- NOT: "production-validated", "proven", "regulatory-grade", "certified"
- Tradition 11: attraction not promotion — no pitching until relationship alignment documented
- The data is open. The research is published. The art is the instrument.
