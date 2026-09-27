# AI-EO Indexing Pipeline: Operations → Public Research Observatory

**Status:** Design v0.1  
**Date:** 2026-09-27  
**Scope:** Batch digest prototype → Real-time evolution  

---

## Overview

**AI-EO** (AI-driven Discoverability Optimization) transforms operational signals into a knowledge and behavioral graph that drives auto-generated research pages. Operations are the input; public research discovery is the output.

```
Platform Monitor   Gap Detector    Arena Evidence    Caveat Registry
       ↓                ↓                ↓                 ↓
     Signals         Findings      Audit Trail       Ground Truth
       └────────────────┴────────────────┴─────────────────┘
                         ↓
                   Signal Indexing Layer
                   (Extract entities, relationships, behaviors)
                         ↓
                   Knowledge Graph + Behavioral Graph
                         ↓
                   Index Entry Generation
                   (Topic nodes, Gap nodes, Finding nodes, Response nodes)
                         ↓
                   Page Template Mapping
                   (Which template? What data feeds it?)
                         ↓
                   Public Research Pages
                   (Auto-generated, updated on each digest run)
```

---

## 1. Signal Indexing Layer

**Input:** Operations data (JSONL files, API responses)  
**Output:** Normalized index entries with metadata

### 1.1 Signal Normalization

Every operation produces indexable entities:

```python
class IndexedSignal:
    entity_type: str  # "topic", "gap", "finding", "response", "evidence"
    entity_id: str    # topic-001, gap-gpt4-hallucination, etc.
    source: str       # "platform-monitor", "gap-detector", "arena", "caveat-registry"
    timestamp: str    # ISO 8601
    confidence: float # 0.0-1.0
    
    # Core content
    title: str
    description: str
    
    # Relationships to other entities
    relates_to: List[str]  # [entity_id, ...]
    discovered_by: List[str]  # Which systems found this
    
    # Behavioral signals
    trending_trajectory: str  # "up_strong", "up", "stable", "down"
    velocity: float  # Rate of change (0-1)
    recency: int  # Minutes since last update
    
    # Public visibility
    public_confidence: float  # 0.0-1.0 (should we show this?)
    caveat_count: int  # How many caveats/warnings?
    evidence_strength: str  # "consensus", "contested", "emerging", "anomaly"
```

### 1.2 Indexing Rules

**From Platform Monitor (signals.jsonl):**
```
Signal → Topic Entity
├─ entity_id: "topic-{topic_slug}"
├─ title: "{topic_title}"
├─ trending_trajectory: "{from signal}"
├─ velocity: {discussion_volume_change_rate}
├─ confidence: {signal_strength}
└─ relates_to: [linked topics, similar discussions]
```

**From Gap Detector (gaps.json):**
```
Gap → Gap Entity + Finding Entities
├─ entity_id: "gap-{gap_id}"
├─ title: "Gap in {research_area}"
├─ description: "{gap_description}"
├─ relates_to: [topics that trigger this gap]
├─ velocity: {how fast gap is growing}
├─ evidence_strength: "consensus" or "contested"
└─ For each response:
    └─ Response Entity (links back to gap)
```

**From Arena Evidence Graph:**
```
Arena Finding → Finding Entity + Evidence Node
├─ entity_id: "finding-{arena-finding-id}"
├─ title: "{machine observation}"
├─ source: "arena-pool-{pool_number}"
├─ confidence: {arena_confidence_score}
├─ relates_to: [topics, gaps it addresses]
└─ evidence_strength: {from arena audit result}
```

**From Caveat Registry:**
```
Caveat → Caveat Entity (warning node)
├─ entity_id: "caveat-{caveat_id}"
├─ title: "{caveat text}"
├─ severity: "critical" | "high" | "medium" | "low"
├─ relates_to: [entities affected]
└─ applies_to_pages: [page_ids where caveat should appear]
```

---

## 2. Knowledge Graph Structure

**Entities:** Nodes in the graph  
**Relations:** Edges between nodes

### 2.1 Entity Types

```
TOPIC
  ├─ id: "topic-{slug}"
  ├─ label: "Topic Title"
  ├─ signal_strength: float
  ├─ trending_trajectory: str
  ├─ key_concerns: [str]
  └─ urls: [str]

GAP
  ├─ id: "gap-{id}"
  ├─ label: "Research Gap Title"
  ├─ research_area: str
  ├─ severity: "critical" | "high" | "medium"
  ├─ discovered_on: [date, ...]
  └─ status: "open" | "in_progress" | "closed"

FINDING
  ├─ id: "finding-{arena_id}"
  ├─ label: "Machine Observation"
  ├─ confidence: float
  ├─ pool_origin: int (1, 2, or 3)
  ├─ audit_result: "approved" | "contested" | "pending"
  └─ evidence_nodes: [node_ids]

RESPONSE
  ├─ id: "response-{id}"
  ├─ label: "Research Response"
  ├─ status: "proposed" | "in_progress" | "validated" | "deployed"
  ├─ addresses_gaps: [gap_ids]
  └─ maturity: float (0-1)

CAVEAT
  ├─ id: "caveat-{id}"
  ├─ label: "Caveat/Warning"
  ├─ severity: "critical" | "high" | "medium" | "low"
  └─ affects: [entity_ids]
```

### 2.2 Relation Types

```
DISCOVERS (Signal → Topic)
  Represents: Platform detected discussion

ADDRESSES (Response → Gap)
  Represents: Research response targets a gap

TRIGGERS (Topic → Gap)
  Represents: Signal volume raises gap urgency

SUPPORTS (Finding → Gap)
  Represents: Arena evidence supports gap existence

CONTRADICTS (Finding → Finding)
  Represents: Arena findings in conflict (evidence_strength="contested")

UPDATES (newer_entity → older_entity)
  Represents: Entity has been superseded

WARNS (Caveat → Entity)
  Represents: Caveat applies to entity

CONVERGES (Finding → Finding)
  Represents: Multiple independent audits confirm same thing
```

---

## 3. Behavioral Graph Structure

**Tracks how entities change over time**

### 3.1 Behavioral Dimensions

```python
class EntityBehavior:
    entity_id: str
    timestamp: str
    
    # Trajectory
    trending_trajectory: str  # up_strong, up, stable, down
    velocity: float  # Rate of change (0-1)
    
    # Engagement
    discussion_volume: int  # From platform monitor
    response_count: int  # Responses to gap
    finding_count: int  # New arena findings
    
    # Confidence
    public_confidence: float  # How certain are we?
    expert_confidence: float  # Arena audit confidence
    caveat_impact: float  # How much do caveats reduce confidence?
    
    # Maturity
    status: str  # Lifecycle stage
    days_since_discovery: int
    lifecycle_stage: str  # "emerging", "established", "resolved", "obsolete"
```

### 3.2 Behavioral Events

```
Emerging → Established → Resolved
  (topic grows → stable discussion → addressed)

Proposed → In Progress → Validated → Deployed
  (response lifecycle)

Open → In Progress → Closed
  (gap lifecycle)

Pending → Approved / Contested / Deferred
  (arena finding audit result)

Low Confidence → High Confidence (via Arena audits)
Low Confidence → Marked Caveat (via Caveat Registry)
```

---

## 4. Signal-to-Page Mapping

**How indexed signals become discoverable research pages**

### 4.1 Page Templates

| Page Type | Triggered By | Data Source | Refresh |
|-----------|--------------|-------------|---------|
| **Topic Overview** | Topic entity | Platform signals + related gaps/findings | Per digest |
| **Gap Analysis** | Gap entity | Gap detector + related topics + responses | Per digest |
| **Finding** | Finding entity | Arena evidence node | Per digest |
| **Research Velocity** | All entities | Behavioral graph (trending + recency) | Per digest |
| **Evidence Trail** | Finding + audits | Evidence graph nodes + convergence | Per digest |
| **Response Tracker** | Response entity | Gap + response status + findings | Per digest |

### 4.2 Topic Overview Page (`/topics/{topic_id}`)

```
Triggered by: TOPIC entity with signal_strength > threshold

Data feed:
├─ Title, trending_trajectory, key_concerns (from Topic entity)
├─ Discussion volume, sentiment (from Platform signals)
├─ Related gaps (from TRIGGERS relations)
├─ Arena findings (from SUPPORTS relations)
├─ Responses in flight (from Response entities)
├─ Caveats (from WARNS relations)
└─ Behavioral chart (from Behavioral graph history)

Refreshed: Every digest run (when platform-monitor runs)
Public confidence: Min(signal_strength, min(related_gaps.confidence))
```

### 4.3 Gap Analysis Page (`/gaps/{gap_id}`)

```
Triggered by: GAP entity with severity > "low"

Data feed:
├─ Gap title, description, severity (from Gap entity)
├─ Triggering topics (from TRIGGERS relations)
├─ Related findings (from SUPPORTS relations)
├─ Proposed responses (from ADDRESSES relations)
├─ Response maturity (from Response entities)
├─ Caveats (from WARNS relations)
└─ Lifecycle timeline (from Behavioral graph)

Refreshed: Every digest run
Public confidence: Based on arena audit convergence + caveat count
Visible: YES if confidence > 0.60 AND no "critical" caveats
```

### 4.4 Research Velocity Page (`/research-velocity`)

```
Data feed:
├─ Top trending topics (BEHAVIORAL: velocity desc, recency asc)
├─ Emerging gaps (GAP: trending_trajectory="up_strong")
├─ In-progress responses (RESPONSE: status="in_progress")
├─ Recent findings (FINDING: recency < 24h)
└─ Contested evidence (FINDING: evidence_strength="contested")

Sort order: velocity DESC, recency ASC, public_confidence DESC

Refreshed: Every digest run
Shows: Real-time research priorities based on behavioral signals
```

### 4.5 Evidence Trail Page (`/topics/{topic_id}/evidence`)

```
Data feed:
├─ Topic entity (header)
├─ All SUPPORTS relations (findings from Arena)
├─ Evidence graph nodes (source → audit → result)
├─ Convergence metrics (how many audits agree?)
├─ Divergence events (contested findings)
├─ Caveat warnings
└─ Timeline of discoveries

Refreshed: When arena produces new findings
Shows: How we know what we know (evidence transparency)
```

---

## 5. Batch Processing Pipeline (Daily Digest)

**Current implementation: Batch, updates 1-2x daily**

```
+─────────────────────────────────────────────────────────────┐
│ PHASE 1: Data Collection (30 min)                           │
├─────────────────────────────────────────────────────────────┤
│ 1. platform-monitor.py runs                                 │
│    └─ Outputs: data/public-discourse-signals.jsonl          │
│ 2. gap-detector.py runs                                     │
│    └─ Outputs: data/research-gaps.json                      │
│ 3. arena produces new findings (separate trigger)           │
│    └─ Outputs: updates to evidence graph                    │
│ 4. caveat-registry updates (manual or automated)            │
│    └─ Outputs: updates to caveat list                       │
└─────────────────────────────────────────────────────────────┘
                           ↓
+─────────────────────────────────────────────────────────────┐
│ PHASE 2: Indexing (10 min)                                  │
├─────────────────────────────────────────────────────────────┤
│ 1. Load signals.jsonl → normalize to Topic entities         │
│ 2. Load gaps.json → normalize to Gap entities               │
│ 3. Load arena findings → normalize to Finding entities      │
│ 4. Load caveat registry → normalize to Caveat entities      │
│ 5. Build relations between entities                         │
│    (TRIGGERS, SUPPORTS, ADDRESSES, WARNS, etc.)            │
│ 6. Output: index/knowledge-graph.jsonl                      │
│ 7. Build behavioral change events                           │
│ 8. Output: index/behavioral-graph.jsonl                     │
└─────────────────────────────────────────────────────────────┘
                           ↓
+─────────────────────────────────────────────────────────────┐
│ PHASE 3: Page Generation (15 min)                           │
├─────────────────────────────────────────────────────────────┤
│ For each entity in knowledge graph:                         │
│   1. Determine page type (topic, gap, finding, etc.)        │
│   2. Gather data from entity + related entities             │
│   3. Check public_confidence threshold                      │
│   4. Generate HTML/JSON page                                │
│   5. Write to public/{page_type}/{entity_id}/index.html     │
│                                                              │
│ Special pages:                                              │
│   - /research-velocity (aggregated trending)                │
│   - /evidence-explorer (graph visualization)                │
│   - /caveats (all active warnings)                          │
│   - /homepage (featured research)                           │
└─────────────────────────────────────────────────────────────┘
                           ↓
+─────────────────────────────────────────────────────────────┐
│ PHASE 4: Deployment (5 min)                                 │
├─────────────────────────────────────────────────────────────┤
│ 1. Validate all pages (JSON schema, links, caveats)         │
│ 2. Generate sitemap.xml                                     │
│ 3. Generate search index (for site search)                  │
│ 4. Commit to git (data/public-pages.tar.gz)                 │
│ 5. Deploy to Cloudflare Pages via GitHub Actions            │
│ 6. Invalidate CDN cache (new content live)                  │
└─────────────────────────────────────────────────────────────┘

Total time: ~60 minutes per digest run
Frequency: Proposed: 2x daily (9 AM, 9 PM UTC)
```

---

## 6. Public Site Structure

**Research Observatory frontend**

```
humanaios.ai/
├─ /                              [Homepage] Featured research, latest findings
├─ /research-topics               [Directory] All indexed topics
│  └─ /{topic_id}/                [Topic page] Deep dive into topic
│     └─ /evidence                [Evidence] Audit trail for topic
├─ /research-gaps                 [Directory] All open gaps
│  └─ /{gap_id}/                  [Gap page] Gap analysis + responses
├─ /research-velocity             [Real-time] Trending topics, emerging gaps
├─ /findings                      [Directory] Arena findings
│  └─ /{finding_id}/              [Finding] Audit trail, convergence
├─ /evidence-explorer             [Interactive] Knowledge graph visualization
├─ /responses                     [Directory] Research responses by status
├─ /caveats                       [Directory] All active warnings
├─ /methodology                   [Static] How AI-EO works
└─ /api/
   ├─ /index.json                 [Knowledge graph export]
   ├─ /behavioral-graph.json      [Behavioral data for dashboards]
   ├─ /search?q={query}           [Full-text search]
   └─ /topics/{topic_id}          [Topic data endpoint]
```

---

## 7. Data Structures

### 7.1 Index Entry (public/data/ai-eo-index.jsonl)

```json
{
  "entity_id": "topic-llm-hallucinations",
  "entity_type": "topic",
  "version": "0.1",
  "created_at": "2026-09-27T00:00:00Z",
  "updated_at": "2026-09-27T22:00:00Z",
  
  "title": "LLM Hallucination Risks",
  "description": "Emerging discourse on hallucination detection and mitigation",
  
  "indexing_metadata": {
    "source": "platform-monitor",
    "source_platforms": ["twitter", "reddit", "hackernews"],
    "confidence": 0.87,
    "public_visibility": true,
    "trending_trajectory": "up_strong",
    "velocity": 0.73,
    "recency_minutes": 45
  },
  
  "content": {
    "key_concerns": ["prompt injection", "factual drift", "authorization bypass"],
    "discussion_volume": 1247,
    "sentiment_distribution": {
      "concerned": 0.62,
      "constructive": 0.28,
      "skeptical": 0.10
    },
    "urls": [
      "https://twitter.com/search?q=llm+hallucination",
      "https://reddit.com/r/MachineLearning/..."
    ]
  },
  
  "relations": {
    "triggers_gaps": ["gap-hallucination-detection", "gap-factual-grounding"],
    "related_topics": ["topic-ai-safety", "topic-llm-alignment"],
    "arena_findings": ["finding-arena-001-halluci", "finding-arena-002-drift"],
    "response_status": ["response-001-in_progress", "response-002-proposed"],
    "caveats": ["caveat-unverified-claims", "caveat-platform-bias"]
  },
  
  "pages_generated": [
    "/topics/topic-llm-hallucinations",
    "/topics/topic-llm-hallucinations/evidence",
    "/research-velocity (featured)"
  ]
}
```

### 7.2 Behavioral Timeline (public/data/behavioral-history.jsonl)

```json
{
  "entity_id": "topic-llm-hallucinations",
  "timestamp": "2026-09-27T22:00:00Z",
  "behavior_snapshot": {
    "trending_trajectory": "up_strong",
    "velocity": 0.73,
    "discussion_volume": 1247,
    "discussion_volume_change": 245,
    "days_since_discovery": 3,
    "lifecycle_stage": "emerging",
    "public_confidence": 0.87,
    "expert_confidence": 0.91,
    "caveat_impact": -0.04,
    "related_gaps_count": 2,
    "arena_findings_count": 2,
    "responses_in_flight": 2
  }
}
```

---

## 8. Growth Path: Batch → Real-time

### Phase 1 (Current): Batch Digest
- ✅ Daily digest (2x daily)
- ✅ All pages generated from latest data
- Latency: 1-2 hours from signal to public page

### Phase 2 (Week 3): Event-Driven Updates
- New arena finding → immediately generated finding page
- New gap → immediately generated gap page
- Caveats → immediately reflected in affected pages
- Latency: <15 minutes

### Phase 3 (Week 4+): Real-time Streaming
- Platform signals → index updated continuously
- Behavioral graph → real-time trending calculation
- Research velocity page → live updates
- Latency: <5 minutes
- Tech: WebSocket subscriptions, incremental index updates

---

## 9. AI-EO Success Metrics

| Metric | Batch Target | Real-time Target |
|--------|--------------|------------------|
| **Index freshness** | <2h | <5m |
| **Pages generated per digest** | 15-25 | 50+ |
| **Public confidence accuracy** | >0.85 | >0.90 |
| **Evidence convergence detection** | 3+ audits | 2+ audits |
| **False positive rate** | <5% | <3% |
| **Page load time** | <2s | <1s |
| **Monthly site views** | 500+ | 2000+ |
| **Research time savings** | 2h/day | 4h/day |

---

## 10. Implementation Roadmap

### Week 1 (Parallel with Arena Prototype)
- [ ] Design AI-EO indexing pipeline (DONE)
- [ ] Implement signal normalization (Platform Monitor → IndexedSignal)
- [ ] Build knowledge graph builder (entities + relations)
- [ ] Create behavioral graph tracker
- [ ] Prototype 3 page templates (Topic, Gap, Research Velocity)
- [ ] Wire into daily digest workflow

### Week 2
- [ ] Deploy AI-EO public site to staging
- [ ] Connect all 4 data sources (signals, gaps, findings, caveats)
- [ ] Add evidence trail pages
- [ ] Implement confidence scoring
- [ ] Test page generation pipeline

### Week 3
- [ ] Launch AI-EO on production (humanaios.ai/research-velocity, /topics, /gaps)
- [ ] Add evidence explorer (interactive graph)
- [ ] Event-driven page updates (arena findings, new gaps)
- [ ] Search functionality

### Week 4+
- [ ] Real-time signal indexing
- [ ] Live behavioral graph updates
- [ ] Research velocity as true real-time dashboard
- [ ] Expand to research team internal Observatory

---

## References

- **Platform Monitor:** `/home/user/operations/scripts/platform-monitor.py`
- **Gap Detector:** `/home/user/operations/scripts/gap-detector.py`
- **Arena Evidence:** `/home/user/lasting-light-ai/docs/SYSTEM-INTEGRATION-MAP.md` (System 4)
- **Caveat Registry:** `/home/user/lasting-light-ai/docs/SYSTEM-INTEGRATION-MAP.md` (System 3)
- **Daily Digest Workflow:** `.github/workflows/daily-topic-digest.yml`
