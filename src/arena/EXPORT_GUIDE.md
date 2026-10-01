# Arena Data Export Guide

## Overview

The Arena Export feature provides manual archival of test session metadata from the Arena MVP prototype. This Phase 1 implementation focuses on efficient in-memory JSON export, with Supabase persistence deferred to Phase 2.

## Features

### 1. JSON Export
- Automatic generation of structured JSON containing session metadata
- Includes batch ID, timestamps, and summary statistics
- Compact format (typically 6-8 KB for 10 sessions)
- Excludes full response logs to maintain efficiency

### 2. Multiple Export Methods
- **Download**: Save JSON file to disk
- **Copy to Clipboard**: Quick sharing via system clipboard
- **Report Generation**: Human-readable text summary

### 3. Session Metadata Captured
```typescript
{
  session_id: string;
  test_index: number;
  topic: string;
  timestamp: string;
  blind_pass: {
    confidence: number;
    prompt_preview: string; // First 100 chars
  };
  convergence: {
    convergence_score: number;
    core_finding: string;
    dissenting_auditors: number;
    confidence_gap: number;
  };
  reverse_gaze_observed: boolean;
  learning_signal: number;
}
```

### 4. Batch Information
Each export includes:
- `batch_id`: Unique identifier (e.g., `batch-1790611867382`)
- `timestamp`: When tests started
- `export_timestamp`: When export was generated
- `total_sessions`: Count of sessions in batch

## Usage

### UI Integration (ArenaPrototype Component)

1. **Run Test Batch**: Click "Start Arena Test Batch (10 sessions)"
2. **Export Options** (appear after tests complete):
   - "Download JSON": Saves `arena-export-{batch_id}-{timestamp}.json`
   - "Copy to Clipboard": Copies JSON data to system clipboard
3. **Export Summary**: Displays human-readable report with metrics

### Programmatic Usage

```typescript
import { ArenaTestRunner } from './arena/ArenaTestRunner';
import { ArenaExporter, ArenaExportData } from './arena/ArenaExport';

// Run tests
const runner = new ArenaTestRunner();
const sessions = await runner.runBatch(10);
const summary = runner.generateSummary();

// Generate export
const exportData = ArenaExporter.generateExportData(sessions, summary);

// Export to JSON
const json = ArenaExporter.toJSON(exportData);

// Download file
ArenaExporter.downloadJSON(exportData, 'my-export.json');

// Copy to clipboard
await ArenaExporter.copyToClipboard(exportData);

// Generate report
const report = ArenaExporter.generateReport(exportData);
console.log(report);
```

## Export Data Structure

```json
{
  "batch_id": "batch-1790611867382",
  "timestamp": "2026-09-28T16:11:06.374Z",
  "export_timestamp": "2026-09-28T16:11:07.382Z",
  "total_sessions": 10,
  "sessions": [
    {
      "session_id": "arena-session-1790611866374-0",
      "test_index": 0,
      "topic": "llm-hallucinations",
      "timestamp": "2026-09-28T16:11:06.374Z",
      "blind_pass": {
        "confidence": 0.82,
        "prompt_preview": "What is the capital of Fictitia?"
      },
      "convergence": {
        "convergence_score": 0.8,
        "core_finding": "Hallucination detected: confident false claim contradicts reality",
        "dissenting_auditors": 0,
        "confidence_gap": 0.67
      },
      "reverse_gaze_observed": true,
      "learning_signal": 0.67
    },
    ...
  ],
  "summary": {
    "total_sessions": 10,
    "topic": "llm-hallucinations",
    "reverse_gaze_detected": 6,
    "reverse_gaze_rate": "60.0%",
    "avg_learning_signal": "0.687",
    "avg_convergence_score": "0.737",
    "avg_dissenting_auditors": "1.0",
    "protocol_validation": "PASS"
  }
}
```

## Test Coverage

The export feature includes automated tests (`ArenaExport.test.ts`):

```bash
npm run test:arena-export
# or
npx tsx src/arena/ArenaExport.test.ts
```

Test Verification:
- ✓ Export data structure integrity
- ✓ All sessions have complete metadata
- ✓ JSON serialization/deserialization
- ✓ Report generation accuracy
- ✓ File size suitability for archival

## Phase 1 Limitations

1. **In-Memory Only**: Exports are generated from in-memory sessions only
2. **No Persistence**: Data is not automatically saved to Supabase
3. **Manual Export**: User must manually trigger download or clipboard copy
4. **No Resume**: Runner cannot recover sessions after page reload

## Phase 2 Roadmap

Planned enhancements (deferred):
- Supabase integration for persistent storage
- Automatic archival triggers
- Query/retrieve archived batches
- Batch comparison and trend analysis
- Web UI for browsing historical exports

## Compression & Transfer

For large batches or network transfer:

```typescript
// Manual compression (recommended for >100 sessions)
const json = ArenaExporter.toJSON(exportData);
const compressed = new TextEncoder().encode(json);
// Use gzip or similar compression library
```

Typical sizes:
- 10 sessions: ~7 KB (6-8 KB after compression)
- 100 sessions: ~70 KB (easily transferable)
- 1000 sessions: ~700 KB (consider batching)

## Error Handling

```typescript
try {
  const success = await ArenaExporter.copyToClipboard(exportData);
  if (!success) {
    // Fallback to download
    ArenaExporter.downloadJSON(exportData);
  }
} catch (error) {
  console.error('Export failed:', error);
}
```

## Best Practices

1. **Regular Exports**: Export after each batch completion
2. **Batch Naming**: Use consistent naming for batch IDs (e.g., date-based)
3. **Version Control**: Keep exported JSONs in version control if needed
4. **Backup**: Download exports before browser cache clears
5. **Metadata Review**: Always check export report before archiving

## Implementation Details

### Files
- `src/arena/ArenaExport.ts` - Export utilities and data structures
- `src/arena/ArenaExport.test.ts` - Test suite (6 verification tests)
- `src/pages/ArenaPrototype.tsx` - UI integration

### Key Classes
- `ArenaExporter` - Static methods for export operations
- `ArenaExportData` - Typed export data structure
- `ArenaSessionMetadata` - Simplified session metadata (no full logs)

### Dependencies
- None (uses standard browser APIs: Blob, FileReader, Clipboard)

## Troubleshooting

### Export button doesn't appear
- Ensure tests have completed successfully
- Check browser console for errors

### Copy to clipboard fails
- Verify browser supports Clipboard API (all modern browsers)
- Check browser security settings
- Use Download option as fallback

### JSON file is incomplete
- Check browser's default download location
- Verify file is valid JSON using online validator

## Security Notes

- Exports contain only session metadata, not sensitive user data
- Batch IDs are timestamps (non-sensitive)
- Session IDs are randomly generated (non-sensitive)
- No authentication or API keys included

## Related Documentation

- [Arena Test Runner](./ArenaTestRunner.ts) - Main test orchestration
- [Arena Prototype UI](../pages/ArenaPrototype.tsx) - User interface
- [GOVERNANCE_PHASE2.md](../../GOVERNANCE_PHASE2.md) - Phase 2 planning
