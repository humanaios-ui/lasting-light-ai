<!-- FDS: F2-BuildingBlock | Parent: Issue #64 / docs/architecture/SYSTEM_DESIGN.md | Hawkins: internal-only | Status: PROPOSED -->

# Public Witness Model Build — PB0

**Status:** Proposed research/prototype design. PB0 is offline and synthetic-only. This document does not authorize a public contribution form, enrollment, personal-data collection, production deployment, model training, hardware, or a change to the active build freeze.

## Purpose and boundary

The Witness Character Model v0 is a versioned behavioral specification, deterministic state-to-cue director, validated mappings, optional separately reviewed language interface, and synthetic evaluation corpus. It is not a newly trained foundation model. Public participation is a design goal, but public data collection is not authorized by this prototype.

Public input may become a proposal or a synthetic test case. It cannot directly change state, evidence, authority, permissions, model weights, or the live site. Only separately reviewed and human-governed code changes can alter behavior. `WITNESS_IS_NOT_THE_AUTHORITY` and `ADAPTATION_SERVES_COMPREHENSION_NOT_COMPLIANCE` remain binding design constraints for this work; this repository does not establish their governance ownership.

PB0 includes design documents and a local deterministic demo over a checked-in synthetic fixture. Its simulated review result is not a human review, admission, merge, or release. The demo writes no data and cannot call an API.

## Repository inventory at inspection

Inspected revision: `b2a7cbb77e1792fd3e148294a82532ca76c1171d`. File observations below describe that revision; they are not runtime or deployment verification.

These labels distinguish implemented source, synthetic/demo data, static surfaces, and documentation. No source inspection in this pass proves a deployed/reachable live Witness path, so none is classified as verified LIVE. The renderer and duplicated static glyphs are legacy/obsolete candidates, but no evidence establishes that they are safe to delete or definitively obsolete.

| Surface | Observed implementation and evidence | Classification / limit |
|---|---|---|
| `src/components/WitnessCanvas.tsx` | Hero imports and renders this canvas; it draws the bilateral skull and initializes `liveScores`, `targetLI`, and `meanLI` from literals at lines 19–21. | Implemented React visual with embedded synthetic/demo values; no authorized live-state adapter established here. |
| `src/components/MiniWitnessCanvas.tsx` | Canvas uses a fixed `meanLI` at line 14; `WitnessNav.tsx:156–167` renders it inside a button. | Implemented small-format visual with demo values; the navigation does not supply canonical Witness state. |
| `public/witness-nav.js` | Contains embedded score and LI values around lines 252–253 and renders the glyph. | Legacy static navigation/glyph implementation with synthetic/demo values; not confirmed obsolete. |
| `public/witness.html` | Page text at lines 644 and 725 calls its state demonstration-driven and describes Evidence Graph integration as future work; an example query is commented near line 1438. | Static/demo surface; no active Evidence Graph flow established by the inspected code. |
| `public/witness-arena.html` | Standalone HTML/CSS page; no contribution endpoint or verified state adapter found in the inspected page. | Static reference/exploration surface, not evidence of a live participation system. |
| `witness-renderer.html` | Initializes scores and LI from literals at lines 31–33, then attempts a fetch to a configured Apps Script URL around lines 273–284. | Legacy endpoint-wired renderer with synthetic fallback values. A fetch in source is not proof that the endpoint is reachable, fresh, authorized, or currently supplying data; not confirmed obsolete. |
| `docs/WITNESS-VOICE.md` | Identifies itself as a research/prototype specification (lines 1–9); includes pseudocode and proposed API examples. | Documented-only design, not proof that sonification or its API is implemented. |
| `src/lib/storage.ts` / `src/pages/Experiment.tsx` | The separate Constitutional Experiment writes participants and submissions to browser `localStorage` (`storage.ts:68–100, 110–138`); the Experiment page uses its pseudonym hook. | Existing browser-local experiment path, not a shared Witness contribution service. Do not reuse it as a public submission store without a separate review. |

The inventory does not establish a Witness contribution API, shared moderation queue, public receipt lookup, authenticated reviewer workflow, or validated deployment path. No public-input contribution path is introduced in PB0. These findings are source inspection only; deployment status, endpoint uptime, and external governance contracts require independent verification before a later phase.

## Participation and consent design

Anonymous, no-login reading is a future public-experience requirement. PB0 adds only a local synthetic demo and does not implement a participant-facing interface. If a later, separately authorized phase adds collection, it must ask for purpose-specific consent before accepting or retaining a contribution:

| Purpose | Meaning | Default |
|---|---|---|
| `C0_EXPERIENCE` | Use within an interactive experience | Off unless explicitly selected |
| `C1_RESEARCH` | Use in specified research | Off |
| `C2_WHITE_BOX_LEARNING` | Use in transparent policy/behavior analysis | Off |
| `C3_GENERATIVE_MODEL_TRAINING` | Eligibility for separately reviewed training research | Off; independent opt-in required |

Purpose choices are separate booleans, not one broad “participate” permission. Publication, attribution/credit, and license are separate choices. No C0/C1/C2 choice implies C3. Refusal cannot block anonymous reading. The PB0 fixture has no participant, no personal information, no publication permission, and no training permission.

An AI-assisted or AI-authored contribution must be labeled as such. Any consequential acceptance requires an accountable human principal and independent human review; an asserted identity alone is not verification. Votes or submission counts are not authority and cannot outweigh evidence or protected governance.

## PB0 offline flow

`src/witness/offline-build-demo.ts` implements one checked-in synthetic scenario:

1. A synthetic contribution records the fixture reference, separate purpose flags, and no publication/license grant.
2. The fixture-only moderation stage identifies the record as synthetic.
3. A candidate proposal points to the scenario; it does not alter model behavior.
4. Deterministic evaluation maps only the synthetic state to cue IDs, explanation, policy version, and synthetic evidence references. `BLOCKED` and `HUMAN_REQUIRED` take precedence over presentation cues.
5. A simulated decision is labeled `ACCEPTED_FOR_SIMULATION_ONLY`; it is not an actual admission or approval.
6. The demonstration model card lists the candidate as unimplemented and preserves the baseline version.

The demo has no network, UI route, storage, participant-controlled input, model invocation, training, identity, or authority-changing side effect. Its function is a reproducible test artifact, not a public submission workflow.

## Proposed future system boundary

```text
Read-only public explanation / synthetic challenges
        |
Explicit purpose + retention + publication/license choices
        |  (only after separate authorization)
Server-side validation, privacy review, abuse controls, moderation
        |                         \-> reject / quarantine / delete
Pseudonymous receipt and private moderation record
        |
Versioned proposal → synthetic test cases → independent review
        |
Human-governed admission → reviewed policy/code change → signed artifact
        |
Versioned model card, public changelog, regression and rollback

Separate future proposal only:
C3 + modality opt-in → eligible/licensed curation → reproducible training
→ privacy/holdout/abuse evaluation → independent human release approval
```

No endpoint or datastore is proposed for immediate implementation. Any later endpoint must first be reconciled with existing backend and participation contracts; it must not create a parallel store by default. Authentication, authorization, CSRF protection, idempotency, rate/size limits, output encoding, scoped receipts, privacy separation, and deletion/revocation are required before remote writes.

## Threats and safeguards to carry into PB1+

| Threat | Required boundary |
|---|---|
| Prompt injection or instructions embedded in proposals | Treat text/assets as untrusted data; quarantine and review; never pass public content to privileged tools or state-authority code. |
| PII, private third-party content, impersonation, harassment, or unlicensed likeness/voice | Minimize collection; privacy/rights screening; quarantine, reject, or delete; keep private moderation details out of public receipts. |
| Sybil activity, duplicates, coordinated voting, capture, or trainer poisoning | Deduplicate and monitor abuse; votes are advisory only; no count-based automatic promotion or training. |
| Consent mismatch or later withdrawal | Record each purpose and publication/license choice independently; enforce revocation against future use and approved-corpus eligibility; do not claim trained-weight influence can be removed without a demonstrated method. |
| Model drift, over-attachment, or compliance optimization | Keep cues traceable to authorized state; optimize comprehension rather than compliance, persuasion, dependency, or consent conversion; provide a stop/revoke path. |
| Authority confusion or fabricated evidence | `WITNESS_IS_NOT_THE_AUTHORITY`; fail closed on unavailable/invalid state; style and optional language cannot set authority or invent evidence. |
| Cultural or accessibility harm | Text parity, keyboard access, visible uncertainty and minority disagreement; no inferred culture/health/vulnerability; cultural motifs require rights-holder approval. |

## Evaluation and promotion

Each synthetic fixture must pin its expected mode, cue IDs, explanation, provenance references, and policy version. Replay must be deterministic. A/B evaluation must label both variants as simulated, provide equivalent text, and separately measure comprehension and perceived certainty; friendliness alone is not success. Report response distributions and uncertainty, not only a pooled preference or vote count. Improvements in comprehension must not increase false certainty.

Later promotion requires a reviewed change proposal, linked tests and consent/provenance receipts where applicable, regression against the prior version, an accountable human approval, an artifact manifest, a versioned model card, and a tested rollback. An accepted suggestion does not change the model until that complete path is approved. Fine-tuning or weight changes are out of scope and require a new proposal, C3 and modality-specific consent, licensed/provenance-tracked data curation, holdout/privacy/abuse evaluation, cost approval, model card, and independent human signoff.

## Phase boundary

- **PB0 (this change):** inventory, contract/provenance design, and offline synthetic demo/tests only.
- **PB1 (separate release authorization):** accessible static explanation and bounded text contribution prototype; remote persistence remains off until privacy/legal/admin approval.
- **PB2:** preregistered, explicitly consented evaluation only after protocol and deployment authorization.
- **PB3:** governed, versioned deterministic behavior changes with traceability, tests, model card, and rollback.
- **PB4:** optional training research only under a new proposal and independent review.
- **Physical expression:** separate safety approval; never part of the public learning loop.

No public contribution, enrollment, collection, training, or deployment is authorized by this document or by the PB0 demo.
