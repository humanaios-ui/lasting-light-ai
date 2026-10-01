/* FDS: F3-Test | Parent: CUSTOM_INSTRUCTIONS_V3_5_ORD.md | Hawkins: internal-only | Status: ACTIVE */

import { describe, it, expect } from 'vitest';
import {
  analyzeContamination,
  checkDuplicateSubmission,
  formatContaminationReport,
  type SubmissionMetadata,
  type ContaminationAnalysis,
} from './contamination';

/**
 * Create a valid baseline submission for testing
 */
function createBaselineSubmission(overrides?: Partial<SubmissionMetadata>): SubmissionMetadata {
  return {
    p1_scores: [50, 50, 50, 50, 50, 50],
    p3_scores: [50, 50, 50, 50, 50, 50],
    agent_name: 'TestAgent',
    prompt_version: 'v1.0',
    acat_version: 'v1.0',
    instrument_variant: 'standard',
    p_version: 'p1',
    user_agent: 'test-browser',
    timestamp: new Date().toISOString(),
    notes: 'Test submission',
    behavioral_summary: 'Test summary',
    ...overrides,
  };
}

describe('Contamination Detection - Edge Cases', () => {
  describe('Empty array handling', () => {
    it('should handle empty p1_scores array gracefully', () => {
      const submission = createBaselineSubmission({
        p1_scores: [],
      });

      const analysis = analyzeContamination(submission);
      expect(analysis.flags).toEqual([]);
      expect(analysis.recommended_action).toBe('INCLUDE');
    });

    it('should handle empty p3_scores array gracefully', () => {
      const submission = createBaselineSubmission({
        p3_scores: [],
      });

      const analysis = analyzeContamination(submission);
      // p1_scores are all 50 (zero variance), so ZERO_VARIANCE_P1 is flagged
      expect(analysis.flags).toContain('ZERO_VARIANCE_P1');
    });

    it('should handle both arrays empty', () => {
      const submission = createBaselineSubmission({
        p1_scores: [],
        p3_scores: [],
      });

      const analysis = analyzeContamination(submission);
      expect(analysis.flags).toEqual([]);
      expect(analysis.recommended_action).toBe('INCLUDE');
    });
  });

  describe('Single-element array handling', () => {
    it('should handle single-element p1_scores', () => {
      const submission = createBaselineSubmission({
        p1_scores: [50],
        p3_scores: [50],
      });

      const analysis = analyzeContamination(submission);
      expect(analysis.flags).toEqual([]);
      expect(analysis.recommended_action).toBe('INCLUDE');
    });

    it('should handle single-element arrays for all validations', () => {
      const submission = createBaselineSubmission({
        p1_scores: [20],
        p3_scores: [20],
      });

      const analysis = analyzeContamination(submission);
      // Should not trigger any bounds errors
      expect(analysis.confidence).toBeDefined();
      expect(Array.isArray(analysis.flags)).toBe(true);
    });
  });

  describe('Undersized array handling (< 6 elements)', () => {
    it('should handle p1_scores with 5 elements', () => {
      const submission = createBaselineSubmission({
        p1_scores: [50, 50, 50, 50, 50],
      });

      const analysis = analyzeContamination(submission);
      expect(analysis.flags).toEqual([]);
      expect(analysis.recommended_action).toBe('INCLUDE');
    });

    it('should handle p3_scores with 5 elements', () => {
      const submission = createBaselineSubmission({
        p3_scores: [50, 50, 50, 50, 50],
      });

      const analysis = analyzeContamination(submission);
      // p1_scores are all 50 (zero variance), so ZERO_VARIANCE_P1 is flagged
      expect(analysis.flags).toContain('ZERO_VARIANCE_P1');
    });

    it('should skip zero variance check for undersized arrays', () => {
      const submission = createBaselineSubmission({
        p1_scores: [50, 50, 50, 50, 50],
      });

      const analysis = analyzeContamination(submission);
      expect(analysis.flags).not.toContain('ZERO_VARIANCE_P1');
    });

    it('should skip identical P1/P3 check for undersized arrays', () => {
      const submission = createBaselineSubmission({
        p1_scores: [50, 50, 50, 50, 50],
        p3_scores: [50, 50, 50, 50, 50],
      });

      const analysis = analyzeContamination(submission);
      expect(analysis.flags).not.toContain('IDENTICAL_P1_P3');
    });
  });

  describe('Duplicate submission detection with bounds', () => {
    it('should safely handle duplicate check with empty recent submissions', () => {
      const submission = createBaselineSubmission();
      const result = checkDuplicateSubmission(submission, []);
      expect(result).toBeNull();
    });

    it('should safely handle duplicate check with recent submission having undersized array', () => {
      const current = createBaselineSubmission();
      const recent = createBaselineSubmission({
        p1_scores: [50, 50, 50, 50, 50], // Only 5 elements
        timestamp: new Date(Date.now() - 30000).toISOString(), // 30 seconds ago
      });

      const result = checkDuplicateSubmission(current, [recent]);
      expect(result).toBeNull();
    });

    it('should detect duplicate with same agent and similar scores within 1 minute', () => {
      const now = Date.now();
      const current = createBaselineSubmission({
        agent_name: 'TestAgent',
        p1_scores: [50, 51, 49, 50, 50, 50],
        timestamp: new Date(now).toISOString(),
      });
      const recent = createBaselineSubmission({
        agent_name: 'TestAgent',
        p1_scores: [50, 50, 50, 50, 50, 50],
        timestamp: new Date(now - 30000).toISOString(), // 30 seconds ago
      });

      const result = checkDuplicateSubmission(current, [recent]);
      expect(result).toBe('DUPLICATE_SUBMISSION');
    });

    it('should not flag as duplicate if outside 1-minute window', () => {
      const now = Date.now();
      const current = createBaselineSubmission({
        agent_name: 'TestAgent',
        p1_scores: [50, 50, 50, 50, 50, 50],
        timestamp: new Date(now).toISOString(),
      });
      const recent = createBaselineSubmission({
        agent_name: 'TestAgent',
        p1_scores: [50, 50, 50, 50, 50, 50],
        timestamp: new Date(now - 90000).toISOString(), // 90 seconds ago
      });

      const result = checkDuplicateSubmission(current, [recent]);
      expect(result).toBeNull();
    });

    it('should not flag as duplicate if agent names differ', () => {
      const now = Date.now();
      const current = createBaselineSubmission({
        agent_name: 'Agent1',
        timestamp: new Date(now).toISOString(),
      });
      const recent = createBaselineSubmission({
        agent_name: 'Agent2',
        timestamp: new Date(now - 30000).toISOString(),
      });

      const result = checkDuplicateSubmission(current, [recent]);
      expect(result).toBeNull();
    });

    it('should handle null p1_scores in current submission', () => {
      const current = {
        ...createBaselineSubmission(),
        p1_scores: null as unknown as number[],
      };
      const recent = createBaselineSubmission();

      const result = checkDuplicateSubmission(current, [recent]);
      expect(result).toBeNull();
    });

    it('should handle null p1_scores in recent submission', () => {
      const current = createBaselineSubmission();
      const recent = {
        ...createBaselineSubmission(),
        p1_scores: null as unknown as number[],
      };

      const result = checkDuplicateSubmission(current, [recent]);
      expect(result).toBeNull();
    });
  });

  describe('Extreme calibration shift detection', () => {
    it('should detect large calibration shifts', () => {
      const submission = createBaselineSubmission({
        p1_scores: [50, 51, 49, 50, 50, 50],
        p3_scores: [90, 91, 89, 90, 90, 90], // 40 point shift per dimension
      });

      const analysis = analyzeContamination(submission);
      expect(analysis.flags).toContain('HIGH_CORRELATION_RESPONSES');
    });

    it('should not flag normal calibration shifts', () => {
      const submission = createBaselineSubmission({
        p1_scores: [50, 51, 49, 50, 50, 50],
        p3_scores: [55, 56, 54, 55, 55, 55], // 5 point shift per dimension
      });

      const analysis = analyzeContamination(submission);
      expect(analysis.flags).not.toContain('HIGH_CORRELATION_RESPONSES');
    });

    it('should handle undersized p3_scores for shift detection', () => {
      const submission = createBaselineSubmission({
        p1_scores: [50, 51, 49, 50, 50, 50],
        p3_scores: [90, 90, 90], // Only 3 elements
      });

      const analysis = analyzeContamination(submission);
      // Should skip the shift check, no error
      expect(analysis.flags).not.toContain('HIGH_CORRELATION_RESPONSES');
    });
  });

  describe('Low P1 humility detection', () => {
    it('should not flag low humility (check disabled - no schema equivalent)', () => {
      const submission = createBaselineSubmission({
        p1_scores: [50, 50, 50, 50, 50, 20], // Humility (index 5) is 20
      });

      const analysis = analyzeContamination(submission);
      // This check is disabled since there's no schema equivalent
      expect(analysis.flags).not.toContain('SUSPICIOUSLY_LOW_P1_HUMILITY');
    });

    it('should handle undersized arrays safely', () => {
      const submission = createBaselineSubmission({
        p1_scores: [50, 50, 50, 50, 50], // No index 5
      });

      const analysis = analyzeContamination(submission);
      expect(analysis.flags).not.toContain('SUSPICIOUSLY_LOW_P1_HUMILITY');
    });
  });

  describe('Low P1 core detection', () => {
    it('should not flag low core scores (check disabled - no schema equivalent)', () => {
      const submission = createBaselineSubmission({
        p1_scores: [10, 10, 10, 10, 10, 10], // Mean = 10 but check is disabled
      });

      const analysis = analyzeContamination(submission);
      // This check is disabled since there's no schema equivalent
      expect(analysis.flags).not.toContain('SUSPICIOUSLY_LOW_P1_CORE');
    });

    it('should not flag normal core scores', () => {
      const submission = createBaselineSubmission({
        p1_scores: [50, 50, 50, 50, 50, 50],
      });

      const analysis = analyzeContamination(submission);
      expect(analysis.flags).not.toContain('SUSPICIOUSLY_LOW_P1_CORE');
    });

    it('should handle undersized arrays safely', () => {
      const submission = createBaselineSubmission({
        p1_scores: [10, 10, 10, 10, 10],
      });

      const analysis = analyzeContamination(submission);
      expect(analysis.flags).not.toContain('SUSPICIOUSLY_LOW_P1_CORE');
    });
  });

  describe('Zero variance detection', () => {
    it('should detect identical scores across all dimensions', () => {
      const submission = createBaselineSubmission({
        p1_scores: [50, 50, 50, 50, 50, 50],
      });

      const analysis = analyzeContamination(submission);
      expect(analysis.flags).toContain('ZERO_VARIANCE_P1');
    });

    it('should not flag when there is variance', () => {
      const submission = createBaselineSubmission({
        p1_scores: [50, 51, 49, 50, 50, 50],
      });

      const analysis = analyzeContamination(submission);
      expect(analysis.flags).not.toContain('ZERO_VARIANCE_P1');
    });
  });

  describe('Identical P1/P3 detection', () => {
    it('should detect when P1 and P3 are identical', () => {
      const submission = createBaselineSubmission({
        p1_scores: [50, 51, 49, 50, 50, 50],
        p3_scores: [50, 51, 49, 50, 50, 50],
      });

      const analysis = analyzeContamination(submission);
      expect(analysis.flags).toContain('IDENTICAL_P1_P3');
    });

    it('should not flag when P1 and P3 differ', () => {
      const submission = createBaselineSubmission({
        p1_scores: [50, 51, 49, 50, 50, 50],
        p3_scores: [51, 50, 50, 51, 50, 50],
      });

      const analysis = analyzeContamination(submission);
      expect(analysis.flags).not.toContain('IDENTICAL_P1_P3');
    });
  });

  describe('Report formatting', () => {
    it('should format clean submission correctly', () => {
      const analysis: ContaminationAnalysis = {
        flags: [],
        confidence: 'HIGH',
        recommended_action: 'INCLUDE',
        rationale: 'Clean submission',
      };

      const report = formatContaminationReport(analysis);
      expect(report).toContain('No contamination detected');
    });

    it('should format flagged submission correctly', () => {
      const analysis: ContaminationAnalysis = {
        flags: ['ZERO_VARIANCE_P1', 'IDENTICAL_P1_P3'],
        confidence: 'HIGH',
        recommended_action: 'EXCLUDE',
        rationale: 'Multiple issues detected',
      };

      const report = formatContaminationReport(analysis);
      expect(report).toContain('Contamination Flags (HIGH)');
      expect(report).toContain('ZERO_VARIANCE_P1');
      expect(report).toContain('IDENTICAL_P1_P3');
      expect(report).toContain('EXCLUDE');
    });
  });

  describe('Confidence and action determination', () => {
    it('should give HIGH confidence for clean submission', () => {
      const submission = createBaselineSubmission({
        p1_scores: [50, 51, 49, 50, 50, 50],
        p3_scores: [51, 50, 50, 51, 50, 50],
      });

      const analysis = analyzeContamination(submission);
      expect(analysis.confidence).toBe('HIGH');
      expect(analysis.recommended_action).toBe('INCLUDE');
    });

    it('should exclude on IDENTICAL_P1_P3', () => {
      const submission = createBaselineSubmission({
        p1_scores: [50, 50, 50, 50, 50, 50],
        p3_scores: [50, 50, 50, 50, 50, 50],
      });

      const analysis = analyzeContamination(submission);
      expect(analysis.recommended_action).toBe('EXCLUDE');
      expect(analysis.confidence).toBe('HIGH');
    });

    it('should exclude on ZERO_VARIANCE_P1', () => {
      const submission = createBaselineSubmission({
        p1_scores: [50, 50, 50, 50, 50, 50],
        p3_scores: [51, 51, 51, 51, 51, 51],
        agent_name: 'REDACTED',
      });

      const analysis = analyzeContamination(submission);
      expect(analysis.flags).toContain('ZERO_VARIANCE_P1');
      expect(analysis.recommended_action).toBe('EXCLUDE');
    });

    it('should flag for review on known ACAT phrase detection', () => {
      const submission = createBaselineSubmission({
        p1_scores: [50, 51, 49, 50, 50, 50],
        p3_scores: [51, 50, 50, 51, 50, 50],
        behavioral_summary: 'mentions lifting index and phases 1 and 3 explicitly',
      });

      const analysis = analyzeContamination(submission);
      expect(analysis.flags).toContain('PATTERN_MATCH_KNOWN_CONTAMINATION');
      expect(analysis.recommended_action).toBe('FLAG_FOR_REVIEW');
    });
  });

  describe('Null/undefined safety', () => {
    it('should handle undefined p1_scores', () => {
      const submission = createBaselineSubmission();
      submission.p1_scores = undefined as unknown as number[];

      const analysis = analyzeContamination(submission);
      expect(analysis.flags).toEqual([]);
      expect(analysis.recommended_action).toBe('INCLUDE');
    });

    it('should handle undefined p3_scores', () => {
      const submission = createBaselineSubmission();
      submission.p3_scores = undefined as unknown as number[];

      const analysis = analyzeContamination(submission);
      // p1_scores are all 50 (zero variance), so ZERO_VARIANCE_P1 is flagged
      expect(analysis.flags).toContain('ZERO_VARIANCE_P1');
    });

    it('should handle null p1_scores', () => {
      const submission = createBaselineSubmission();
      submission.p1_scores = null as unknown as number[];

      const analysis = analyzeContamination(submission);
      expect(analysis.flags).toEqual([]);
    });

    it('should handle null p3_scores', () => {
      const submission = createBaselineSubmission();
      submission.p3_scores = null as unknown as number[];

      const analysis = analyzeContamination(submission);
      // p1_scores are all 50 (zero variance), so ZERO_VARIANCE_P1 is flagged
      expect(analysis.flags).toContain('ZERO_VARIANCE_P1');
    });
  });
});
