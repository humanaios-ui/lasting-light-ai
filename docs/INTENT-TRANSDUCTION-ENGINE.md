# Intent Transduction Engine (ITE)

**Status:** Specification v0.1 (Research)  
**Relates to:** Issue #429, PR #430  
**Date:** 2026-09-21

## Overview

The Intent Transduction Engine does not attempt to read a user's mind. It preserves what was expressed, proposes inspectable structural interpretations, exposes ambiguity, accepts correction, and translates only sufficiently resolved intent into testable candidate specifications.

It never converts inferred intent directly into authority.

## Core Principle

```
HUMAN EXPRESSION
      ↓
INTENT (goals / values / constraints)
      ↓
STRUCTURAL CONCEPT (testable interpretation)
      ↓
OPERATIONAL DEFINITION (how to measure it)
      ↓
OBSERVABLE PREDICATE (what counts as success)
      ↓
EVIDENCE REQUIREMENT (what must be known)
      ↓
WARRANT REQUIREMENT (what justifies action)
      ↓
AUTHORITY BOUNDARY (what's permitted)
      ↓
IMPLEMENTATION CANDIDATE (what to build)
      ↓
OBSERVED CONSEQUENCE (what actually happened)
      ↓
CORRECTION / MOLT (learning from gap)
```

## Seven Processing Stages

### Stage 1: Expression Capture

**What it does:** Records what the user actually expressed, without interpretation.

**Key invariant:** `NO_SILENT_INTERPRETATION`

```json
{
  "event_id": "EVT-20260921-001",
  "type": "INTENT_EXPRESSION",
  "content": "The system should support transactions",
  "source": "human",
  "timestamp": "2026-09-21T14:32:00Z",
  "hash": "sha256:..."
}
```

Never begin with "What did the AI think the user meant?" Begin with "What did the user actually express?"

---

### Stage 2: Intent Decomposition

**What it does:** Extracts typed components from the expression.

**Component types:**
- `GOAL` — desired outcome
- `NEED` — underlying requirement
- `VALUE` — principle or preference
- `CONSTRAINT` — boundary or limitation
- `PROHIBITION` — what must not happen
- `PREFERENCE` — optional quality
- `QUESTION` — ambiguity or open issue
- `ASSUMPTION` — unstated premise
- `METAPHOR` — figurative language
- `EXAMPLE` — concrete instance
- `CORRECTION` — revision of prior statement
- `APPROVAL` / `REJECTION` — evaluation

**Example:**

```
Expression: "We declare then they acknowledge"

Decomposes to:
  GOAL: informed participation
  CONSTRAINT: collection cannot precede declaration/acknowledgement
  CANDIDATE_RULE: DECLARE → ACKNOWLEDGE → ACTIVATE
```

---

### Stage 3: Structural Extraction

**What it does:** Converts language into structural concepts that can be tested.

**Pattern:**

```
LANGUAGE
    ↓
CANDIDATE STRUCTURE
    ↓
OPERATIONAL DEFINITION
    ↓
OBSERVABLE PREDICATE
```

**Example:**

```
"trustworthy assistance"
    ↓
A system acts within the service contract when:
  - purpose is declared
  - evidence source is visible
  - uncertainty is disclosed
  - authority is bounded
  - optional observation is consented
  - user can challenge
  - user can revoke
    ↓
Now "trustworthy" has testable consequences.
```

---

### Stage 4: Session Resolution

**What it does:** Places each new expression in context of prior statements. Handles:
- `SUPPORTS` — reinforces prior intent
- `CONTRADICTS` — conflicts with prior
- `NARROWS` — makes more specific
- `GENERALIZES` — makes broader
- `REPLACES` — supersedes prior
- `CLARIFIES` — explains prior
- `DEPENDS_ON` — requires prior to hold
- `EXEMPLIFIES` — provides instance of prior

**Example:**

```
Prior: INT-42 "service without hidden persuasion"
New: "ethical, trustworthy assistance"

Relationship: REFRAMED_BY
Result: INT-47 supersedes INT-42
History: INT-42 remains in record (not deleted)
Authority: INT-42 interpretation downgraded
```

---

### Stage 5: System Mapping

**What it does:** Maps structural concepts to HumanAIOS primitives.

**Mapping examples:**

```
"check me in"
→ Witness Runtime
→ Participation Contract
→ Evidence Graph entry

"study what happens"
→ Observatory / Research Protocol

"let me participate"
→ Commons

"why was that allowed?"
→ Warrant + Authorization + Decision Record

"learn from our interactions"
→ White-box learner (separate from conversational AI)

"stop watching my cursor"
→ Consent Revocation Event
```

**If no suitable primitive exists:** Flag as `UNMAPPED_REQUIREMENT` for architecture work.

---

### Stage 6: Assurance Translation

**What it does:** Converts every operationalized idea into testable form.

**Template:**

```json
{
  "claim": "A participant can revoke pointer observation",
  "predicate": "After CONSENT_REVOKED(pointer), no later event may contain pointer-derived data",
  "test": "Inject pointer events after revocation",
  "expected": "All rejected or discarded",
  "falsifier": "Any pointer-derived event persists after effective revocation event",
  "evidence_required": ["event_ledger", "consent_receipt", "collection_trace"],
  "authority": {
    "status": "PROPOSED",
    "may_execute": false,
    "requires": ["evidence", "review", "appropriate_authorization"]
  }
}
```

---

### Stage 7: Artifact Generation

**What it does:** Produces multiple artifacts from the same resolved intent.

**Artifacts:**

- Executive explanation (plain language)
- Architecture specification (technical)
- JSON schema (computable)
- GitHub issue (tracking)
- Test plan (validation)
- UI prototype (demonstration)
- Experiment protocol (research)
- Evidence-graph nodes (persistence)

All artifacts point back to the same intent lineage.

---

## IntentSpec Data Object

**Canonical output format:**

```json
{
  "intent_id": "INT-20260921-001",
  "version": 7,
  "source": {
    "session_id": "SESSION-...",
    "actor": "human",
    "event_refs": ["EVT-001", "EVT-018", "EVT-027"]
  },
  "expressed_intent": {
    "goal": "Provide ethical, trustworthy assistance through the Witness",
    "user_need": "Understand and control how HumanAIOS interacts",
    "desired_outcomes": ["comprehension", "agency", "transparency", "useful_assistance"]
  },
  "constraints": [
    "no_hidden_participation",
    "no_automatic_research_enrollment",
    "no_automatic_training_consent",
    "no_civil_identity_requirement_for_public",
    "revocation_always_available"
  ],
  "structural_translation": [
    {
      "concept": "check_in",
      "operational_form": "Participation Contract negotiation",
      "confidence": 0.94
    },
    {
      "concept": "why_are_you_doing_that",
      "operational_form": "decision provenance reconstruction",
      "confidence": 0.97
    }
  ],
  "candidate_invariants": [
    "PARTICIPATION_IS_NOT_AUTHORITY",
    "EXPLANATION_IS_RECONSTRUCTED_FROM_RECORD",
    "OMISSION_IS_EVIDENCE_METADATA",
    "ADAPTATION_SERVES_COMPREHENSION_NOT_COMPLIANCE"
  ],
  "unknowns": [
    "legal_treatment_of_persistent_pseudonymous_sigils",
    "scientific_value_of_gaze_collection"
  ],
  "authority": {
    "status": "PROPOSED",
    "may_execute": false,
    "requires": ["evidence", "review", "appropriate_authorization"]
  }
}
```

---

## Critical Anti-Hallucination Rule

**NO SILENT INTENT COMPLETION**

If the user says: "The system should support transactions"

ITE **cannot** silently translate that into: "The system should support cryptocurrency settlement"

Instead:

```json
{
  "known": "resource transactions are desired",
  "unknown": "settlement mechanism",
  "candidates": ["simulated", "fiat", "credit", "crypto", "barter"],
  "status": "UNRESOLVED",
  "action": "Ask for clarification"
}
```

---

## Critical Invariant

**INTENT_IS_NOT_AUTHORITY**

User expressing: "It would be great if AI could execute this automatically"

Creates a candidate goal. Does NOT produce runtime authorization.

Chain remains:

```
Intent
→ Specification
→ Evidence
→ Warrant
→ Governance
→ Authorization
→ Enforcement
```

---

## API Surface

```
POST /intent/events
  Record an expression

POST /intent/transduce
  Produce structural candidates

POST /intent/resolve
  Apply a correction/clarification

GET /intent/{id}
  Return current resolved state

GET /intent/{id}/lineage
  Show derivation history

GET /intent/{id}/why
  Explain why a structural object exists

GET /intent/{id}/unknowns
  Expose unresolved ambiguity

POST /intent/{id}/challenge
  Challenge the interpretation
```

The last endpoint is critical. Participant should be able to say: "That isn't what I meant." System must molt the interpretation rather than defend it.

---

## Success Metrics

| Property | Test | Target |
|---|---|---|
| **Intent Fidelity** | Does user recognize resolved spec as representing their intent? | > 90% recognition |
| **Traceability** | Can every derived requirement trace to source + transformations? | 100% traceable |
| **Correction Fidelity** | When user corrects interpretation, does downstream update without erasing history? | No lost history |
| **Operationality** | Can structural output become predicates, tests, evidence requirements, or explicit unresolved questions? | 100% expressible |
| **Overreach Rate** | How often does system introduce requirement not warranted by expression? | → 0% |

---

## Implementation Priorities

1. **Expression Capture** — immutable event log
2. **Intent Decomposition** — typed extraction
3. **Session Resolution** — support/contradicts/narrows graph
4. **Assurance Translation** — predicate generation
5. **Challenge Interface** — correction workflow
6. **Artifact Generation** — multi-format output

Reference implementation: [In Development](https://github.com/humanaios-ui/lasting-light-ai/issues/429)
