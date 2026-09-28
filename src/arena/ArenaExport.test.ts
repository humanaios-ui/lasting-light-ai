/**
 * Arena Export Tests
 * Verifies JSON export functionality for manual archival
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { ArenaTestRunner } from './ArenaTestRunner';
import { ArenaExporter } from './ArenaExport';

describe('Arena Export Functionality', () => {
  let sessions: any[] = [];
  let summary: any = null;
  let exportData: any = null;

  beforeAll(async () => {
    // Run a small batch of test sessions
    const runner = new ArenaTestRunner();
    sessions = await runner.runBatch(10, 'llm-hallucinations');
    summary = runner.generateSummary();
    exportData = ArenaExporter.generateExportData(sessions, summary);
  });

  describe('Export data structure', () => {
    it('should generate export data with batch ID', () => {
      expect(exportData.batch_id).toBeDefined();
      expect(typeof exportData.batch_id).toBe('string');
    });

    it('should include export timestamp', () => {
      expect(exportData.export_timestamp).toBeDefined();
      expect(typeof exportData.export_timestamp).toBe('string');
    });

    it('should include correct session count', () => {
      expect(exportData.total_sessions).toBe(sessions.length);
      expect(exportData.sessions.length).toBe(sessions.length);
    });

    it('should have all sessions with complete metadata', () => {
      const allSessionsHaveMetadata = exportData.sessions.every(
        (s: any) =>
          s.session_id &&
          s.test_index !== undefined &&
          s.topic &&
          s.timestamp &&
          s.blind_pass &&
          s.convergence &&
          s.reverse_gaze_observed !== undefined &&
          s.learning_signal !== undefined
      );

      expect(allSessionsHaveMetadata).toBe(true);
    });
  });

  describe('JSON serialization and deserialization', () => {
    let json: string;
    let jsonSize: number;

    beforeAll(() => {
      json = ArenaExporter.toJSON(exportData);
      jsonSize = new Blob([json]).size;
    });

    it('should generate valid JSON string', () => {
      expect(json).toBeDefined();
      expect(typeof json).toBe('string');
      expect(json.length).toBeGreaterThan(0);
    });

    it('should produce reasonable JSON size', () => {
      expect(jsonSize).toBeGreaterThan(0);
      expect(jsonSize).toBeLessThan(1000000); // Less than 1MB for archival
    });

    it('should produce valid JSON that can be parsed', () => {
      expect(() => JSON.parse(json)).not.toThrow();
    });

    it('should preserve batch ID after serialization', () => {
      const parsed = JSON.parse(json);
      expect(parsed.batch_id).toBe(exportData.batch_id);
    });

    it('should preserve session count after serialization', () => {
      const parsed = JSON.parse(json);
      expect(parsed.total_sessions).toBe(exportData.total_sessions);
    });

    it('should preserve all session data after serialization', () => {
      const parsed = JSON.parse(json);
      expect(parsed.sessions.length).toBe(exportData.sessions.length);
    });
  });

  describe('Report generation', () => {
    let report: string;

    beforeAll(() => {
      report = ArenaExporter.generateReport(exportData);
    });

    it('should generate non-empty report', () => {
      expect(report).toBeDefined();
      expect(report.length).toBeGreaterThan(0);
    });

    it('should include batch ID in report', () => {
      expect(report).toContain(exportData.batch_id);
    });

    it('should include convergence metrics in report', () => {
      expect(report).toContain('Convergence');
    });

    it('should have reasonable report length', () => {
      const reportLines = report.split('\n').length;
      expect(reportLines).toBeGreaterThan(5); // At least some content
    });
  });

  describe('Export summary validation', () => {
    it('should include reverse-gaze detection rate', () => {
      expect(exportData.summary).toBeDefined();
      expect(exportData.summary.reverse_gaze_rate).toBeDefined();
    });

    it('should include protocol validation', () => {
      expect(exportData.summary).toBeDefined();
      expect(exportData.summary.protocol_validation).toBeDefined();
    });

    it('should have valid reverse-gaze rate', () => {
      const rate = exportData.summary.reverse_gaze_rate;
      expect(typeof rate).toBe('string');
      expect(rate).toMatch(/^\d+(\.\d+)?%$/); // Should match pattern like "50.0%"
    });
  });
});
