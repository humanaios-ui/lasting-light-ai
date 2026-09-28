/**
 * Arena Export Tests
 * Verifies JSON export functionality for manual archival
 */

import { ArenaTestRunner } from './ArenaTestRunner';
import { ArenaExporter } from './ArenaExport';

async function testExportFunctionality() {
  console.log('=== ARENA EXPORT TEST START ===\n');

  // Run a small batch of test sessions
  console.log('Running 10-session batch...');
  const runner = new ArenaTestRunner();
  const sessions = await runner.runBatch(10, 'llm-hallucinations');
  const summary = runner.generateSummary();

  console.log(`Completed ${sessions.length} sessions\n`);

  // Generate export data
  console.log('Generating export data...');
  const exportData = ArenaExporter.generateExportData(sessions, summary);

  // Verify export structure
  console.log('Verifying export structure:');
  console.log(`  - Batch ID: ${exportData.batch_id}`);
  console.log(`  - Export timestamp: ${exportData.export_timestamp}`);
  console.log(`  - Total sessions in export: ${exportData.total_sessions}`);
  console.log(`  - Sessions with metadata: ${exportData.sessions.length}`);

  // Verify all sessions have required metadata
  const allSessionsHaveMetadata = exportData.sessions.every(
    (s) =>
      s.session_id &&
      s.test_index !== undefined &&
      s.topic &&
      s.timestamp &&
      s.blind_pass &&
      s.convergence &&
      s.reverse_gaze_observed !== undefined &&
      s.learning_signal !== undefined
  );

  console.log(`  - All sessions have complete metadata: ${allSessionsHaveMetadata ? 'YES' : 'NO'}`);

  // Test JSON serialization
  console.log('\nTesting JSON serialization...');
  const json = ArenaExporter.toJSON(exportData);
  const jsonSize = new Blob([json]).size;
  console.log(`  - JSON size: ${(jsonSize / 1024).toFixed(2)} KB`);
  console.log(`  - JSON is valid: ${json.length > 0 ? 'YES' : 'NO'}`);

  // Verify JSON can be parsed back
  console.log('\nTesting JSON deserialization...');
  try {
    const parsed = JSON.parse(json);
    console.log(`  - Parse successful: YES`);
    console.log(`  - Batch ID matches: ${parsed.batch_id === exportData.batch_id ? 'YES' : 'NO'}`);
    console.log(`  - Session count matches: ${parsed.total_sessions === exportData.total_sessions ? 'YES' : 'NO'}`);
  } catch (e) {
    console.log(`  - Parse error: ${e}`);
  }

  // Test report generation
  console.log('\nGenerating export report...');
  const report = ArenaExporter.generateReport(exportData);
  const reportLines = report.split('\n').length;
  console.log(`  - Report lines: ${reportLines}`);
  console.log(`  - Report contains batch ID: ${report.includes(exportData.batch_id) ? 'YES' : 'NO'}`);
  console.log(`  - Report contains metrics: ${report.includes('Convergence Score') ? 'YES' : 'NO'}`);

  // Display the report
  console.log('\n=== EXPORT REPORT ===\n');
  console.log(report);

  console.log('\n=== ARENA EXPORT TEST COMPLETE ===');
  console.log(`\nSummary:`);
  console.log(`  - Export contains ${exportData.total_sessions} sessions`);
  console.log(`  - Reverse-gaze detection rate: ${exportData.summary.reverse_gaze_rate}`);
  console.log(`  - Protocol validation: ${exportData.summary.protocol_validation}`);
  console.log(`  - JSON size suitable for archival: ${jsonSize < 1000000 ? 'YES' : 'NO'} (${(jsonSize / 1024).toFixed(2)} KB)`);

  return exportData;
}

// Run test if executed directly
if (typeof window === 'undefined' && import.meta.url === `file://${process.argv[1]}`) {
  testExportFunctionality().catch(console.error);
}

export { testExportFunctionality };
