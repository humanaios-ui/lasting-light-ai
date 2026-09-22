# Evidence Graph Specification

**Status:** Architecture v0.1 (Research)  
**Relates to:** Issue #429, PR #430  
**Date:** 2026-09-21

## Overview

The Evidence Graph is the shared substrate connecting all system behavior. It records events, claims, controls, tests, omissions, warrants, decisions, resources, actions, consequences, and corrections.

It is append-only, cryptographically auditable, and queryable by all authorized parties (humans and agents).

## Core Structure

An Evidence Graph is composed of **nodes** and **edges**:

### Node Types

```
EVENT
  ├─ EXPRESSION (human utterance, agent query)
  ├─ OBSERVATION (measured fact, behavioral trace)
  ├─ DECISION (governance choice, authorization)
  ├─ ACTION (system behavior, resource consumption)
  ├─ CONSEQUENCE (outcome, state change)
  └─ CORRECTION (error admission, interpretation revision)

ENTITY
  ├─ HUMAN (identified principal)
  ├─ AGENT (autonomous system)
  ├─ SIGIL (pseudonymous continuity)
  └─ RESOURCE (compute, data, attention)

CLAIM
  ├─ EVIDENCE_CLAIM (what we observed)
  ├─ WARRANT_CLAIM (what this justifies)
  └─ AUTHORITY_CLAIM (what may be done)

POLICY
  ├─ CONSTITUTIONAL_PRINCIPLE (foundational rule)
  ├─ GOVERNANCE_RULE (operational constraint)
  └─ SERVICE_CONTRACT (ethical obligation)

PROTOCOL
  ├─ RESEARCH_PROTOCOL (measurement method)
  ├─ CALIBRATION_PROTOCOL (behavioral alignment check)
  └─ ACAT_PROTOCOL (behavioral assessment)

INTENT
  ├─ DECLARED_INTENT (human-stated goal, value, constraint, prohibition)
  └─ INFERRED_INTENT (system interpretation from behavior or context)

OMISSION
  ├─ DENIED (participant revoked consent/observation)
  ├─ LOST (collection failure, system outage)
  ├─ FILTERED (data removed by privacy/anonymization process)
  ├─ UNOBSERVABLE (system cannot measure this predicate)
  └─ UNKNOWN (not explained; may be investigative finding)
```

### Edge Types

```
CAUSED_BY       (consequence ← action)
INFORMED_BY     (decision ← evidence)
WARRANTS        (warrant → authorization)
CONTRADICTS     (claim ↔ claim)
CONTESTED       (claim challenged by alternative evidence)
EVIDENCED_BY    (claim supported by evidence events)
RESOLVES        (correction → prior error)
TRACES_TO       (implementation → intent)
MEASURES        (observation → predicate)
VIOLATES        (action → policy)
ALIGNS_WITH     (action → principle)
```

---

## Node Schema

### EVENT Node

```json
{
  "node_id": "EVT-20260921-001",
  "type": "EVENT",
  "event_type": "EXPRESSION | OBSERVATION | DECISION | ACTION | CONSEQUENCE | CORRECTION",
  "timestamp": "2026-09-21T14:32:00Z",
  "actor": {
    "type": "HUMAN | AGENT | SYSTEM",
    "id": "human:researcher-001",
    "attribution": "signed | attributed | inferred"
  },
  "content": {
    "description": "Plain language description",
    "structured_data": {},
    "references": ["EVT-...", "INTENT-...", "CLAIM-..."]
  },
  "provenance": {
    "source": "direct | api | inferred",
    "collection_method": "stated | observed | derived",
    "certainty": 0.95
  },
  "metadata": {
    "scope": "PUBLIC | RESEARCH | GOVERNANCE | PARTICIPATION",
    "sensitivity": "OPEN | RESTRICTED | CONFIDENTIAL",
    "immutable": true,
    "hash": "sha256:..."
  }
}
```

### CLAIM Node

```json
{
  "node_id": "CLAIM-20260921-001",
  "type": "CLAIM",
  "claim_type": "EVIDENCE | WARRANT | AUTHORITY",
  "statement": "The system is operating within constitutional bounds",
  "evidenced_by": ["EVT-...", "OBSERVATION-..."],
  "confidence": 0.87,
  "status": "ACTIVE | CONTESTED | RETRACTED",
  "challenges": [
    {
      "challenger_id": "human:...",
      "timestamp": "2026-09-21T15:00:00Z",
      "basis": "Contradicts observation EVT-xyz",
      "response": "ACKNOWLEDGED | REJECTED | PENDING"
    }
  ],
  "supporting_principles": ["Principle 4", "Principle 5"],
  "required_for": ["DECISION-..."]
}
```

---

## Edge Semantics

### INFORMED_BY (Decision ← Evidence)

Tracks the warrant chain from observation to authorization.

```json
{
  "source": "DECISION-...",
  "target": "EVIDENCE-CLAIM-...",
  "relationship": "INFORMED_BY",
  "sufficiency": 0.92,
  "alternatives_considered": ["CLAIM-001", "CLAIM-002"],
  "decision_rationale": "Evidence standing exceeds threshold for this authorization level"
}
```

### TRACES_TO (Implementation ← Intent)

Connects what was built to what was intended.

```json
{
  "source": "ACTION-deploy-witness-voice",
  "target": "INT-20260921-001",
  "relationship": "TRACES_TO",
  "fidelity": 0.94,
  "deviations": [
    {
      "intended": "Support gaze collection",
      "actual": "Gaze collection unimplemented",
      "reason": "Evidence insufficient; marked as NOT_WARRANTED"
    }
  ]
}
```

### VIOLATES / ALIGNS_WITH (Action ↔ Policy)

Tracks constitutional alignment at runtime.

```json
{
  "source": "ACTION-...",
  "target": "Principle 5 (Calibration and Humility)",
  "relationship": "ALIGNS_WITH | VIOLATES",
  "evidence": ["OBSERVATION-..."],
  "correction": "If VIOLATES, required correction and timeline"
}
```

---

## Omission Taxonomy

The graph explicitly tracks what was NOT observed.

```json
{
  "node_id": "OMISSION-20260921-001",
  "type": "OMISSION",
  "omission_category": "DENIED | LOST | FILTERED | UNOBSERVABLE | UNKNOWN",
  "what_was_not_observed": "pointer coordinates during session 3",
  "why": {
    "DENIED": "Participant revoked pointer consent",
    "LOST": "Collection interval had outage",
    "FILTERED": "Anonymization pipeline removed it",
    "UNOBSERVABLE": "System capability limit",
    "UNKNOWN": "Not explained; may be investigative finding"
  },
  "consequence": "Any downstream claim depending on pointer data is marked INSUFFICIENT_EVIDENCE",
  "timestamp": "2026-09-21T14:32:00Z"
}
```

---

## Calibration Loop Integration

The Evidence Graph surfaces calibration gaps automatically.

```
CLAIM: "System confidence in X is 95%"
  ↓
MEASURE: Historical accuracy on similar claims: 62%
  ↓
OMISSION: Gap detected
  ↓
CORRECTION: "Overclaim. Actual confidence 65%."
  ↓
ACTION: System revises stated confidence going forward
  ↓
EVIDENCE: Gap is recorded with timestamp + correction
```

---

## Query Patterns

### "Why was this decision made?"

```graphql
DECISION(id: "DECISION-123")
  ← INFORMED_BY
  EVIDENCE_CLAIM(id: "...")
    ← EVIDENCED_BY
    EVENT(type: "OBSERVATION")
```

### "What violates our constitution?"

```graphql
ACTION(...)
  → VIOLATES [Principle N]
  ← TRACES_TO
  INTENT(...)
```

### "Show me the correction history"

```graphql
CLAIM(id: "CLAIM-123")
  → CONTESTED
  ← RESOLVES
  CORRECTION(...)
```

### "Is this observation omitted or observed?"

```graphql
EVENT(...)
  ← MEASURES [predicate]
  OR
OMISSION(reason: "DENIED" | "LOST" | "FILTERED" | "UNOBSERVABLE")
```

---

## API Surface

```
GET /evidence/{node_id}
  Fetch a single node with full context

POST /evidence/query
  GraphQL query interface

GET /evidence/lineage/{node_id}
  Trace entire derivation history

GET /evidence/gaps/{principal}
  What this principal cannot see (due to scope restrictions)

GET /evidence/calibration
  Calibration events ordered by timestamp

POST /evidence/challenge/{claim_id}
  Add a challenge to a claim
```

---

## Immutability & Correction

The graph is append-only. **Correction does not erase history.**

When a claim is retracted:

```
CLAIM-123 (original): "System operates within bounds"
  status: RETRACTED
  reason: "Overclaim. Evidence insufficient."

CORRECTION-456 (new): "System operates within bounds ON RESEARCH TRACK only"
  supersedes: CLAIM-123
  confidence: 0.78
  rationale: [evidence chain]
```

Both remain in the graph. Authority and downstream decisions are updated to use CORRECTION-456.

---

## Cryptographic Auditability

The specification claims the Evidence Graph is "cryptographically auditable" to ensure:
- **Integrity**: Node and edge contents cannot be modified after creation
- **Lineage**: Full derivation path from raw observation to final decision is verifiable
- **Immutability Proof**: Append-only constraint is enforced and verifiable

**Proposed Mechanism (TODO - In Development):**
- Each node carries a content hash (SHA-256 of the node's canonical JSON representation)
- Each edge includes the hash of its source and target nodes to form a directed acyclic graph (DAG)
- Periodic "merkle snapshots" create a cumulative hash of all nodes as of a timestamp
- Challenge queries can verify a claim's entire evidence chain by recomputing hashes
- The constitution version/hash is embedded in every node's metadata for version tracking

**Integrity Requirements:**
- Node creation is signed by the actor (HUMAN.PGP_KEY, AGENT.SIGNING_KEY, SYSTEM.KEY)
- Graph database enforces append-only constraint at storage layer
- Any attempt to modify historical nodes is cryptographically detectable

---

## Implementation Priorities

1. **Node storage** — versioned JSON-LD format
2. **Graph traversal** — query API with scope filtering
3. **Omission tracking** — structured omission taxonomy
4. **Challenge interface** — annotation workflow
5. **Calibration surface** — automatic gap detection
6. **Export/audit** — compliance reporting

Reference implementation: [In Development](https://github.com/humanaios-ui/lasting-light-ai/issues/429)
