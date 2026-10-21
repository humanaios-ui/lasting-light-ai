<!-- FDS: F2-BuildingBlock | Parent: Issue #64 / docs/witness/PUBLIC_MODEL_BUILD.md | Hawkins: internal-only | Status: PROPOSED -->

# Witness Contribution-to-Model Provenance

**Status:** Proposed PB0 design. This is not an operational collection policy, production schema, consent receipt, or authorization to accept public data. Contract ownership must be reconciled with the Operations participation contract before collection or voting weight is assigned.

## Separate records and authorities

Do not collapse these concepts into one “contribution” record:

| Record | Purpose | May change live behavior? |
|---|---|---|
| `Experience` | Read-only demo or challenge interaction | No |
| `Feedback` | Suggestion, critique, or scenario proposal | No |
| `Evaluation` | Response to a version-pinned synthetic test | No |
| `ModelUpdate` | Reviewed version-controlled policy/cue change | Only after human-governed merge/admission and release gates |
| `TrainingExample` | Eligible, licensed, consented record for separately approved training research | No automatic effect; training/release is a new gated process |
| `Ratification` | Independent human authorization under the applicable governance contract | The only authority-bearing decision in this chain |

The public contributor is not an authority. A contribution, evaluation result, review receipt, or accepted proposal is not a ratification.

## Proposed public contribution contract

The following fields describe the intended boundary, not a ready-to-run JSON Schema. A later validator must use enums, opaque references, explicit per-purpose booleans, bounded field sizes, and strict unknown-field handling. Do not copy sample values as trusted data or expose private moderation fields in public receipts.

```text
PublicContributionV0
  schema_version: fixed supported version
  contribution_id: opaque server-issued identifier
  actor_kind: HUMAN | AI_WITH_HUMAN_PRINCIPAL
  accountable_human_ref: scoped reference when actor_kind is AI_WITH_HUMAN_PRINCIPAL
  contribution_kind: CHARACTER_CUE | SCENARIO | REPAIR | EVALUATION | ACCESSIBILITY | CODE
  text_or_asset_ref: sanitized bounded text or approved asset reference
  fixture_ref: allowlisted synthetic scenario, when applicable
  purpose_consent:
    C0_EXPERIENCE: boolean
    C1_RESEARCH: boolean
    C2_WHITE_BOX_LEARNING: boolean
    C3_GENERATIVE_MODEL_TRAINING: boolean
  participation_contract_ref: purpose-specific receipt
  retention_choice: explicit approved policy reference
  publication_consent: boolean
  attribution_choice: private | anonymous | named (only if offered)
  license_ref: explicit approved choice or NONE
  status: server-controlled lifecycle state
  provenance: approved source kind, server receipt time, validator version
```

Consent does not imply publication or a reuse license; publication does not imply training. C3 and any modality-specific permission are independent and off by default. An experience-only choice can never become training consent. A no-account reader need not contribute. No camera, microphone, sensor, or personal history is needed or accepted in the initial text-only proposal.

## Lifecycle and decision semantics

```text
RECEIVED → MODERATION → CANDIDATE → TESTING → REVIEW
                                      ├→ ACCEPTED
                                      ├→ REJECTED
                                      └→ DEFERRED
```

Statuses are server-controlled, append-only decision events in a future authorized system. A public receipt should expose only an opaque reference, safe status, and redacted reason. It must not expose the raw submission, reporter identity, abuse signals, private reviewer notes, or private rights records. “Accepted” means eligible for the next governed implementation step, not merged, promoted, or ratified.

PB0 uses the visibly distinct `ACCEPTED_FOR_SIMULATION_ONLY` result for its in-code fixture. It is deliberately not a state in the public lifecycle above and cannot be interpreted as admission.

Moderation outcomes include `REJECT`, `QUARANTINE`, and `DELETE`; retain only privacy-safe audit metadata necessary under an approved retention policy. Prompt injection, PII, private third-party data, impersonation, harassment, unlicensed material, invalid consent, and flooding must fail safe or be quarantined. Moderation is not a truth or quality oracle.

## Consent, access, and revocation

- Capture separate, versioned consent for each declared purpose before any remote retention.
- Keep identity/accountability and private moderation records separate from public outcomes.
- Make public attribution an independent opt-in; default to no public attribution.
- Enforce scoped access to private receipts and make any receipt lookup non-enumerable and rate-limited.
- Provide a documented withdrawal/deletion path and record its effect on each downstream use.
- A withdrawn/revoked record cannot newly enter an approved training corpus. Do not promise removal of influence from trained weights without a demonstrated, evaluated process.
- If legal, privacy, license, or retention status is uncertain, quarantine and exclude from reuse pending accountable review.

PB0 has no stored contributions or revocation workflow because its contribution and decision are fixed synthetic code fixtures. Its `C3_GENERATIVE_MODEL_TRAINING`, publication, and license choices are false/none.

## Provenance graph

```text
contribution_id
  → proposal_id
  → test_case_ids + pinned fixture/version
  → moderation receipt + consent/rights references (private as needed)
  → independent review receipt + decision rationale
  → commit SHA
  → character_model_version
  → signed artifact manifest
  → public model card + changelog entry
```

Rejected, deferred, unchanged, or withdrawn proposals must not silently affect behavior. Public output may show a redacted decision and reason without exposing sensitive content. A proposal that has no code commit and no resulting model version is not a model update.

A future review receipt should bind at least: proposal and test identifiers; reviewed source/provenance reference; consent and rights disposition; reviewer role and accountable human; decision and reason code; review timestamp; target/base version; and, if accepted for implementation, resulting commit and test outcome. A model card must identify intended use, limitations, inputs/data sources, version changes, contributor rights, quantitative evaluation, uncertainty, known failure modes, and rollback target.

## Review and promotion gates

1. Validate schema, allowed fixture reference, size, purpose consent, publication/license choice, and actor declaration server-side.
2. Quarantine uncertain rights, privacy, provenance, or abuse cases; keep private review data access-scoped.
3. Have an independent reviewer classify the proposal and link synthetic tests; do not treat crowd agreement as evidence.
4. For a candidate behavior change, test replay against the previous version, state/cue consistency, false certainty, accessibility and relevant abuse cases.
5. Require authenticated human-governed admission; AI contributors require an accountable human principal for any consequential acceptance.
6. Merge only through the protected repository process; bind the commit, test results, model version, model card, artifact manifest, and rollback plan.
7. Publish a safe changelog with accepted, rejected, and deferred rationales; preserve disagreement and avoid popularity-based rankings.

No LLM may set renderer authority state or invoke privileged services. A future language model may propose a bounded explanation only; an independent validator must ensure text stays within the authorized state, cited evidence, uncertainty, and policy.

## Training boundary

Training is zero by default and is not part of PB0–PB3. Any later C3 research requires a new approved proposal, explicit purpose and modality permissions, documented provenance and reuse license, retention/deletion policy, privacy filtering, deduplication, contamination controls, held-out evaluation, and a funded accountable plan. Compare against the non-training deterministic baseline before training. Require independent human release review and a model card. Do not market “unlearning” unless the method and limits have been demonstrated.
