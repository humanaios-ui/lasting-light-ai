# Week 2-3: Event-Driven Indexing Implementation

**Status**: In Progress  
**Target Latency**: 15 minutes (vs 60m batch)  
**Architecture**: Signal Detection → Event Emission → Incremental Merge → Delta Page Regen

---

## Architecture Overview

```
High-Velocity Signal Detection (continuous)
    ↓
    Signal Threshold Detector (velocity > 0.6, trending up)
    ↓ [emits event via GitHub Actions workflow_dispatch]
    ├→ Event Bus: Pub/Sub (GitHub Actions)
    │   └ Latency: ~2-3 minutes overhead
    │
    ├→ AI-EO Incremental Indexer
    │   ├ Load checkpoint from previous run
    │   ├ Load delta signals since checkpoint
    │   ├ Merge into existing knowledge graph (no full rebuild)
    │   ├ Update behavioral metrics for affected entities
    │   └ Emit "index-updated" event
    │   └ Latency: ~10 minutes
    │
    └→ Delta Page Generator (listens to "index-updated")
        ├ Identify affected pages (transitive closure)
        ├ Regenerate only changed pages
        ├ Deploy to public/api/
        └ Latency: ~2-3 minutes
        
Total Pipeline Latency: ~15 minutes from signal detection to visible dashboard update
```

---

## Implemented Components

### 1. Signal Threshold Monitor
**File**: `operations/scripts/signal-threshold-monitor.py`

**Responsibility**:
- Continuously monitor AI-EO index for high-velocity topics
- Detect signals where velocity > 0.6 AND trending_trajectory ∈ {up, up_strong}
- Emit GitHub Actions workflow_dispatch event to trigger incremental indexing

**Key Features**:
- Loads latest AI-EO index from `lasting-light-ai/public/api/ai-eo-index.json`
- Batches all detected signals into single event (efficiency)
- Logs all detections with velocity and trending metadata
- Gracefully handles missing index (falls back to no-op)

**Usage**:
```bash
python3 operations/scripts/signal-threshold-monitor.py
```

**Output**:
- Logs to `operations/logs/signal-threshold-monitor.log`
- Triggers GitHub Actions workflow if signals detected
- Returns exit code 0 (always, unless fatal error)

---

### 2. AI-EO Incremental Indexer
**File**: `operations/scripts/ai-eo-incremental-indexer.py`

**Responsibility**:
- Load checkpoint from previous index run
- Load only platform signals after checkpoint time
- Merge delta signals into existing knowledge graph
- Update behavioral metrics for affected entities
- Write updated index without full rebuild

**Key Features**:
- Maintains checkpoint file for incremental tracking
- Loads existing index as baseline knowledge graph
- Merges deltas by updating entity metrics only
- Avoids expensive graph reconstruction
- Handles missing index gracefully (full rebuild fallback)

**Checkpoint Structure**:
```json
{
  "last_index_time": "2026-09-28T01:30:00Z",
  "last_merge_count": 42
}
```

**Usage**:
```bash
python3 operations/scripts/ai-eo-incremental-indexer.py
```

**Output**:
- `operations/data/latest-index.json`: Merged index (checkpoint copy)
- `operations/data/ai-eo-index.jsonl`: JSONL format for analysis
- Logs to `operations/logs/ai-eo-incremental-indexer.log`
- Updates checkpoint file with current timestamp

---

### 3. Delta Page Generator
**File**: `lasting-light-ai/src/api/generateDeltaPages.ts`

**Responsibility**:
- Identify all pages affected by delta index entries
- Regenerate only pages that changed (transitive closure)
- Avoid full rebuild of all pages

**Key Functions**:
- `identifyAffectedPages()`: Map delta entries to page IDs (including related entities)
- `regeneratePage()`: Render single page from entity data
- `regenerateChangedPages()`: Orchestrate parallel page regeneration
- `emitIndexUpdatedEvent()`: Notify subscribers of index update completion

**Transitive Closure**:
When a topic changes:
- Regenerate its topic detail page
- Regenerate all related gap pages (links back)

When a gap changes:
- Regenerate its gap page
- Regenerate all related topic pages (references gap)

**Usage**:
```typescript
import { regenerateChangedPages } from './src/api/generateDeltaPages';

const indexData = JSON.parse(readFileSync('ai-eo-index.json', 'utf8'));
const results = await regenerateChangedPages(indexData.entries, './public/api');
```

**CLI Usage**:
```bash
npx ts-node src/api/generateDeltaPages.ts path/to/ai-eo-index.json ./public/api
```

---

## Workflow Integration

### Updated `daily-topic-digest.yml`

**New Dispatch Inputs**:
```yaml
trigger: batch | signal-threshold-monitor
signal_count: number (event-driven only)
signal_ids: comma-separated IDs (event-driven only)
```

**New Steps**:

1. **Signal Threshold Monitor** (event-driven only)
   - Runs: `when trigger == 'signal-threshold-monitor'`
   - Detects high-velocity signals
   - Logs to artifact

2. **Incremental Indexer** (event-driven only)
   - Runs: `when trigger == 'signal-threshold-monitor'`
   - Merges delta signals
   - Updates checkpoint

3. **Delta Page Generator** (event-driven only)
   - Runs: `when trigger == 'signal-threshold-monitor'`
   - Regenerates affected pages only
   - Deploys to public/api/

**Invocation from Signal Monitor**:
```bash
gh workflow run daily-topic-digest.yml \
  --repo humanaios-ui/operations \
  -f trigger=signal-threshold-monitor \
  -f signal_count=3 \
  -f signal_ids="topic-1,topic-2,topic-3"
```

---

## Success Metrics (Week 2-3)

### Latency Targets
- ✅ Checkpoint loading: < 1 minute
- ✅ Delta signal fetch: < 2 minutes
- ✅ Merge operation: < 5 minutes
- ✅ Page regeneration: < 3 minutes
- ✅ **Total end-to-end**: < 15 minutes (vs 60m batch)

### Reliability Targets
- [ ] Checkpoint consistency: 99.9% (no data loss on crash)
- [ ] Index correctness: Convergence score stays ≥ 0.85 on delta vs full rebuild
- [ ] Page coverage: All affected pages regenerated (transitive closure)
- [ ] Failure resilience: Graceful fallback to batch mode on error

### Performance Targets
- [ ] Merge efficiency: Process 100+ signals in < 5 minutes
- [ ] Memory: Keep existing index in memory (no reload from disk per signal)
- [ ] Disk I/O: Write checkpoint + index < 2 operations per run

### Testing
- [ ] Unit tests for checkpoint logic
- [ ] Integration test: Full merge pipeline with synthetic signals
- [ ] Load test: 50+ signals in single run
- [ ] Failure scenario: Lost checkpoint, stale index, missing signals file

---

## Next Steps (Week 3)

### 1. Integrate Arena Findings into Index
```typescript
interface TopicPageEntry {
  topic_id: string;
  arena_findings: ArenaFinding[];  // NEW
  caveat_flags: Caveat[];
  confidence_adjustment: number;   // -0.1 if Arena flag present
}
```

**Workflow**:
- Arena detects hallucination on topic
- Creates finding record with core_issue, convergence_score
- Indexer merges finding into topic entry
- Dashboard displays caveat warning

### 2. Autonomous Arena Cycles on Index Update
- Trigger Arena validation when any topic changes
- Run 3-auditor minimum (vs 5 for consensus)
- Feed learning signal back to ACAT training loop

### 3. Performance Optimization
- Profile checkpoint load time
- Optimize merge algorithm for large signal batches
- Add telemetry for p95 latency

### 4. Documentation & Training
- Write runbook for event-driven mode
- Document checkpoint recovery procedures
- Create monitoring dashboard for pipeline latency

---

## Testing Strategy

### Unit Tests
- Checkpoint serialization/deserialization
- Delta signal filtering by timestamp
- Entity merge logic (no overwrites on conflict)
- Transitive page closure calculation

### Integration Tests
- Full event flow: signal detection → merge → page regen
- Checkpoint recovery (restart mid-run)
- Large batch handling (100+ signals)
- Concurrent run prevention

### Performance Tests
- Merge time vs signal count (linear scaling)
- Page regeneration parallelism (batch size)
- Memory usage under load

### Failure Scenarios
- Missing checkpoint (fallback to no-op or full rebuild)
- Corrupted index file (retry with previous checkpoint)
- Signal file too large (stream processing, not full load)
- GitHub Actions rate limit (backoff and retry)

---

## Deployment Checklist

- [ ] Signal threshold monitor tested in isolation
- [ ] Incremental indexer produces same results as full rebuilder (for known datasets)
- [ ] Delta page generator identified all affected pages correctly
- [ ] Workflow dispatch successfully triggered from signal monitor
- [ ] Checkpoint file persists across runs
- [ ] All three stages log correctly to artifacts
- [ ] Total latency measured and under 15 minutes
- [ ] Rollback procedure documented (revert to batch mode)

---

## Monitoring & Observability

### Key Metrics to Track
- Signal detection rate (topics/hour exceeding threshold)
- Event emission success rate (% of detections that trigger workflow)
- Merge execution time (seconds)
- Page regeneration time per entity (ms)
- Index file size growth (checkpoint vs full)
- Error rates at each stage

### Dashboards
1. **Event Latency**: Time from signal detection to index update
2. **Checkpoint Health**: Age of latest checkpoint, last successful merge
3. **Page Coverage**: Number of pages regenerated per event
4. **Reliability**: % of events completing without error

### Alerts
- Checkpoint not updated in > 24 hours
- Event latency exceeds 20 minutes
- Merge failure rate > 5%
- Missing signals file

---

## Architecture Decision: GitHub Actions vs Kafka

**Decision**: Start with GitHub Actions workflow_dispatch (Option A)

**Rationale**:
- ✅ No external infrastructure (uses existing CI/CD)
- ✅ Native GitHub integration (already have secrets, tokens)
- ✅ Simple event payloads (just signal IDs)
- ⚠️ ~2-3 minute overhead (acceptable for 15m target)
- ⚠️ Rate limits on workflow_dispatch (can be worked around with batching)

**Future Migration** (Week 4+):
If latency becomes critical or event volume grows:
- Deploy lightweight Node.js server on Railway
- Webhook endpoint receives events from signal monitor
- Publishes to Redis Pub/Sub for incremental indexer
- Target: 3-5 minute total latency

---

## References
- Week 1 Roadmap: `docs/AI-EO-IMPLEMENTATION-ROADMAP.md`
- Full Indexing Pipeline: `docs/AI-EO-INDEXING-PIPELINE.md`
- Arena Integration: `docs/SYSTEM-INTEGRATION-MAP.md`
