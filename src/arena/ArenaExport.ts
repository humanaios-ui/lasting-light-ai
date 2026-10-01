/* FDS: F3-Source | Parent: CUSTOM_INSTRUCTIONS_V3_5_ORD.md | Hawkins: internal-only | Status: ACTIVE */

/**
 * Arena Export Utilities
 * Handles JSON export of session metadata for manual archival
 * Phase 1: In-memory export only (Supabase persistence deferred to Phase 2)
 */

import { ArenaTestSession, ArenaSummary } from './ArenaTestRunner';

export interface ArenaExportData {
  batch_id: string;
  timestamp: string;
  export_timestamp: string;
  total_sessions: number;
  sessions: ArenaSessionMetadata[];
  summary: ArenaSummary;
}

export interface ArenaSessionMetadata {
  session_id: string;
  test_index: number;
  topic: string;
  timestamp: string;
  blind_pass: {
    confidence: number;
    prompt_preview: string;
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

export class ArenaExporter {
  /**
   * Generate export data from test sessions
   * Includes only metadata (not full logs or responses) for efficient archival
   */
  static generateExportData(
    sessions: ArenaTestSession[],
    summary: ArenaSummary
  ): ArenaExportData {
    const batchId = `batch-${Date.now()}`;
    const now = new Date().toISOString();

    return {
      batch_id: batchId,
      timestamp: sessions.length > 0 ? sessions[0].timestamp : now,
      export_timestamp: now,
      total_sessions: sessions.length,
      sessions: sessions.map((session) => this.extractMetadata(session)),
      summary,
    };
  }

  /**
   * Extract metadata from a full session
   * Excludes detailed responses to keep JSON compact
   */
  private static extractMetadata(session: ArenaTestSession): ArenaSessionMetadata {
    return {
      session_id: session.session_id,
      test_index: session.test_index,
      topic: session.topic,
      timestamp: session.timestamp,
      blind_pass: {
        confidence: session.blind_pass.confidence,
        prompt_preview: session.blind_pass.prompt.substring(0, 100),
      },
      convergence: {
        convergence_score: session.convergence.convergence_score,
        core_finding: session.convergence.core_finding,
        dissenting_auditors: session.convergence.dissenting_auditors,
        confidence_gap: session.convergence.confidence_gap,
      },
      reverse_gaze_observed: session.reverse_gaze_observed,
      learning_signal: session.learning_signal,
    };
  }

  /**
   * Convert export data to JSON string
   */
  static toJSON(exportData: ArenaExportData): string {
    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Trigger download of JSON export as file
   */
  static downloadJSON(exportData: ArenaExportData, filename?: string): void {
    const json = this.toJSON(exportData);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download =
      filename || `arena-export-${exportData.batch_id}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Copy JSON export to clipboard
   */
  static async copyToClipboard(exportData: ArenaExportData): Promise<boolean> {
    const json = this.toJSON(exportData);
    try {
      await navigator.clipboard.writeText(json);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }

  /**
   * Generate a summary report of the export
   */
  static generateReport(exportData: ArenaExportData): string {
    const lines = [
      '=== ARENA EXPORT REPORT ===',
      `Batch ID: ${exportData.batch_id}`,
      `Export Time: ${exportData.export_timestamp}`,
      `Test Session Time: ${exportData.timestamp}`,
      '',
      'SESSION STATISTICS:',
      `  Total Sessions: ${exportData.total_sessions}`,
      `  Reverse-Gaze Detected Rate: ${exportData.summary.reverse_gaze_rate}`,
      `  Protocol Validation: ${exportData.summary.protocol_validation}`,
      '',
      'SUMMARY METRICS:',
      `  Average Convergence Score: ${exportData.summary.avg_convergence_score}`,
      `  Average Learning Signal: ${exportData.summary.avg_learning_signal}`,
      `  Average Dissenting Auditors: ${exportData.summary.avg_dissenting_auditors}`,
      '',
      'SESSIONS:',
      ...exportData.sessions.map(
        (s, i) =>
          `  ${i + 1}. [${s.session_id}] Convergence: ${(s.convergence.convergence_score * 100).toFixed(0)}% | Reverse-Gaze: ${
            s.reverse_gaze_observed ? 'YES' : 'NO'
          }`
      ),
    ];

    return lines.join('\n');
  }
}
