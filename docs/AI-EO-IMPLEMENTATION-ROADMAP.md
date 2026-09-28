# AI-EO Implementation Roadmap

## ✅ Week 1: Completed

### AI-EO Indexer Pipeline
- **Status**: LIVE in daily-topic-digest.yml workflow
- **Scripts**: `operations/scripts/ai-eo-indexer.py` 
- **Latency**: ~60 minutes (batch cycle: 30m signals + 10m indexing + 15m page gen + 5m deploy)
- **Output**: `data/ai-eo-index.jsonl` + `lasting-light-ai/public/api/ai-eo-index.json`

### Public Pages Wired
- **ResearchVelocity Dashboard**: Fetches live AI-EO index or falls back to mock data
- **TopicDetail Pages**: Deep dives per research signal
- **Arena Prototype**: 10-session hallucination test suite (three-pool validation)
- **System Findings Baseline**: Ground truth caveat registry (5 known gaps)

### Behavioral Tracking Implemented
- Velocity (0-1 scale, trending trajectory)
- Public confidence (signal strength 0-1)
- Lifecycle stage (emerging → established → resolved → obsolete)
- Knowledge graph relationships (topics ↔ gaps)
- Discussion volume and days active

### Test Coverage
- Arena protocol validation: 10 sessions on hallucination topic
- Reverse-gaze detection: 70%+ goal
- Auditor convergence: 3-5 pool-2 auditors per session
- Learning signal magnitude: confidence calibration delta

---

## 📅 Week 2-3: Event-Driven Indexing (15m Latency)

### Architecture: Pub/Sub Model
Instead of batch cycle, switch to event-driven triggers:

```
Platform Monitor (continuous)
    ↓
Signal Threshold Detector
    ↓ (fires on topic trending above velocity 0.6)
    ├→ Pub/Sub: "high-velocity-signal"
    │
    ├→ AI-EO Incremental Indexer
    │   ├ Load delta from last 15 minutes
    │   ├ Merge with knowledge graph (no full rebuild)
    │   ├ Emit "index-updated" event
    │   └ Commit to latest-index.json
    │
    └→ Page Generator (listens to "index-updated")
        ├ Regenerate only changed pages
        ├ Deploy to public/api/
        └ (5m latency from signal detection)
```

### Implementation Steps

#### 2.1: Signal Threshold Detector
```python
# operations/scripts/signal-threshold-monitor.py
class SignalThresholdMonitor:
    def check_velocity(signal: Signal) -> bool:
        """Emit event if velocity > 0.6 (emerging trend)"""
        return signal.velocity > 0.6 and signal.trending == 'up_strong'
    
    def emit_event(topic_id, signal_data):
        """Publish to event bus (AWS SNS, GCP Pub/Sub, or GitHub Actions workflow_dispatch)"""
```

**Option A (GitHub Actions)**: Use workflow_dispatch to trigger with payload
- Pros: No external dependencies, uses existing CI/CD
- Cons: ~2-3 minute overhead
- Target: **8m latency**

**Option B (Webhook + Server)**: Lightweight Node.js server in Railway/Vercel
- Pros: Sub-minute response
- Cons: Requires infrastructure
- Target: **3m latency**

#### 2.2: Incremental Indexer
```python
# operations/scripts/ai-eo-incremental-indexer.py
class IncrementalAIEOIndexer:
    def __init__(self, last_checkpoint: datetime):
        self.checkpoint = last_checkpoint
        self.knowledge_graph = load_from_latest_index()  # Don't rebuild
    
    def index_delta(self, new_signals: List[Signal]):
        """Only process signals after checkpoint"""
        # Merge into existing graph
        # Update behavioral metrics for affected entities
        # Emit "index-updated" event
```

Keeps last-built index in memory → merge new signals instead of full rebuild

#### 2.3: Delta Page Generator
```typescript
// src/api/generateDeltaPages.ts
async function regenerateChangedPages(
    indexDelta: DeltaIndexEntry[]
): Promise<void> {
    const changedPageIds = new Set();
    
    for (const entry of indexDelta) {
        // Only regenerate pages affected by this signal
        changedPageIds.add(`page-${entry.entity_id}`);
        
        // Invalidate related pages too
        for (const related of entry.related_entities) {
            changedPageIds.add(`page-${related.entity_id}`);
        }
    }
    
    await Promise.all(
        Array.from(changedPageIds).map(regeneratePage)
    );
}
```

### Success Metrics for Week 2-3
- **Latency**: Time from signal → visible on dashboard < 15 minutes
- **Freshness**: 90% of active topics have last-update < 15m old
- **Stability**: No more than 1 indexer failure per 100 events
- **Accuracy**: Convergence score ≥ 0.85 on delta index

---

## 🔮 Week 4+: Real-Time Streaming (5m Latency)

### Kafka/WebSocket Model
```
Platform Monitor Stream
    ↓ (SSE or WebSocket)
Streaming Kafka/Redis
    ↓
Real-time Knowledge Graph Engine (Streaming JVM: Flink/Spark)
    ├ Update graph on-stream
    ├ Emit "entity-updated" for each change
    └ Index Writer (append to stream topic)

React Component (WebSocket listener)
    ├ Subscribe to "entity-updated" for visible topics
    ├ Optimistic UI update
    └ Sync confidence metrics live
```

### Edge Cases to Handle
- **Out-of-order delivery**: Timestamp-based merge conflict resolution
- **Duplicate signals**: Idempotent upsert by (topic_id, platform, timestamp_hour)
- **Graph consistency**: Lock-free updates using CAS (compare-and-set)
- **Memory**: Keep rolling 24-hour window in stream, archive older data

---

## 🎯 Arena Integration Path

### Phase 1 (Now): Reverse-Gaze Validation
- ✅ 10-session baseline on hallucinations
- ✅ Convergence detection (3-5 auditors per signal)
- ✅ Confidence gap measurement
- Status: **READY FOR VALIDATION**

### Phase 2 (Week 2): Wire Arena to AI-EO Index
```typescript
// When Arena detects hallucination, trigger AI-EO reindex
interface ArenaFinding {
    session_id: string;
    reverse_gaze_observed: boolean;
    core_issue: string;
    pool_2_convergence: number;  // 0-1
    
    // NEW: Link back to signal source
    triggered_by_signal: {
        topic_id: string;
        entity_id: string;
        original_velocity: number;
    };
}

// AI-EO indexer marks topics with Arena findings
interface TopicPageEntry {
    topic_id: string;
    arena_findings: ArenaFinding[];  // Reverse-gaze hits
    caveat_flags: Caveat[];           // Known issues
    confidence_adjustment: number;    // -0.1 if Arena flag present
}
```

### Phase 3 (Week 3-4): Autonomous Arena Cycles
- Arena runs on every topic change (not just manual batch)
- 3-auditor minimum for convergence (vs 5 for consensus)
- Learning signal fed back to ACAT training loop

---

## 🏗️ System Findings Baseline as Validation Target

The **SystemFindingsBaseline** component serves three roles:

1. **Ground Truth Reference**
   - Known hallucinations documented with confidence scores
   - Auditor-approved findings across 3 pools
   - Baseline metrics: 23% hallucination rate, 18% calibration gap

2. **Test Oracle for Arena**
   - Can Arena independently rediscover these known issues?
   - Validation metric: Arena rediscovery rate ≥ 85%
   - Null hypothesis: Random auditor could find these

3. **Caveat Tracking**
   - 5 open caveats (1 critical, 3 high)
   - Each caveat links to a system component
   - Status transitions: open → mitigated → resolved
   - Measure: Does AI-EO integration reduce caveat severity over time?

### Key Caveat Types
| Component | Caveat | Severity | Detection Signal |
|-----------|--------|----------|-----------------|
| ACAT Phase 1/3 | Confidence-accuracy divergence | CRITICAL | Larger gap = bigger problem |
| Witness Arena | Auditor collusion / domain gaps | HIGH | Correlated judgments; domain-specific errors |
| Zone 2 Authority | Social engineering vulnerability | HIGH | Approval of unusual requests |
| Zone 1 Inspection | Passive observation limits | MEDIUM | Coverage gaps in audit trail |
| Evidence Queue | Generalist auditor blind spots | HIGH | Domain-specific false claims |

---

## 📊 Week 2-3 Success Criteria

- [ ] Incremental indexer live (no full rebuild on each signal)
- [ ] Event-driven trigger for AI-EO (GitHub Actions workflow_dispatch → 8m latency)
- [ ] Delta page regeneration (only affected pages update)
- [ ] Arena integration (Arena findings linked in index)
- [ ] Baseline validation (Arena rediscovery ≥ 85% on known caveats)
- [ ] Performance: Median page update latency < 15 minutes
- [ ] Reliability: 99% uptime on daily digest workflow

---

## 🚀 Deployment Checklist

### Before Week 2
- [ ] Workflow ran successfully 3+ times without failures
- [ ] Index files committed to lasting-light-ai repo
- [ ] ResearchVelocity component confirmed fetching live index
- [ ] Arena prototype produces consistent results across 10 sessions

### Week 2 Launch
- [ ] Deploy signal-threshold-monitor.py to operations
- [ ] Add workflow_dispatch trigger to daily-topic-digest.yml
- [ ] Test incremental indexer with synthetic signals
- [ ] Monitor latency metrics in CI logs

### Week 3 Stabilization
- [ ] Tune threshold velocity (currently 0.6 — adjust if noisy)
- [ ] Reduce index rebuild cost via incremental merge
- [ ] Add telemetry to track p95 latency
- [ ] Document fallback if streaming indexer crashes

---

## 📋 Open Questions

1. **Event Bus Choice**: GitHub Actions (simpler) vs Kafka (more robust)?
   - Decision: Start with Actions (Week 2), evaluate Kafka for Week 4

2. **Caveat Decay**: Should old caveats become "obsolete" over time?
   - Proposal: Mark resolved after 90 days with no new instances

3. **Confidence Adjustment**: Should Arena findings reduce topic confidence score?
   - Proposal: -0.1 per critical Arena finding, cap at 0.5 minimum

4. **Auditor Rotation**: How to prevent collusion as auditor pool grows?
   - Current: Random assignment each session; consider mandatory cross-checks

5. **Domain Expertise**: How to surface domain-specific caveat needs?
   - Proposal: Link caveats to "needed_expertise" field (medical, legal, security, etc.)

---

## 🔗 Related Documents
- `AI-EO-INDEXING-PIPELINE.md`: Full signal→page pipeline design
- `docs/SYSTEM-INTEGRATION-MAP.md`: System component relationships
- `src/arena/ArenaTestRunner.ts`: Reverse-gaze protocol implementation
- `src/pages/SystemFindingsBaseline.tsx`: Ground truth caveat registry
