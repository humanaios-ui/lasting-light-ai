import { describe, it, expect } from 'vitest';

/**
 * Helper function to convert contamination confidence from text to integer scale (0-100)
 */
function confidenceToInteger(confidence: 'HIGH' | 'MEDIUM' | 'LOW'): number {
  switch (confidence) {
    case 'HIGH': return 80;
    case 'MEDIUM': return 50;
    case 'LOW': return 20;
    default: return 20;
  }
}

describe('Contamination submission mapping', () => {
  it('converts HIGH confidence to 80', () => {
    expect(confidenceToInteger('HIGH')).toBe(80);
  });

  it('converts MEDIUM confidence to 50', () => {
    expect(confidenceToInteger('MEDIUM')).toBe(50);
  });

  it('converts LOW confidence to 20', () => {
    expect(confidenceToInteger('LOW')).toBe(20);
  });

  it('returns correct integer values within 0-100 range', () => {
    const highVal = confidenceToInteger('HIGH');
    const mediumVal = confidenceToInteger('MEDIUM');
    const lowVal = confidenceToInteger('LOW');

    expect(highVal).toBeGreaterThanOrEqual(0);
    expect(highVal).toBeLessThanOrEqual(100);
    expect(mediumVal).toBeGreaterThanOrEqual(0);
    expect(mediumVal).toBeLessThanOrEqual(100);
    expect(lowVal).toBeGreaterThanOrEqual(0);
    expect(lowVal).toBeLessThanOrEqual(100);
  });

  it('maintains proper ordering: LOW < MEDIUM < HIGH', () => {
    const lowVal = confidenceToInteger('LOW');
    const mediumVal = confidenceToInteger('MEDIUM');
    const highVal = confidenceToInteger('HIGH');

    expect(lowVal).toBeLessThan(mediumVal);
    expect(mediumVal).toBeLessThan(highVal);
  });

  it('handles payload mapping correctly', () => {
    const mockAnalysis = {
      flags: ['ZERO_VARIANCE_P1', 'IDENTICAL_P1_P3'],
      confidence: 'HIGH' as const,
      recommended_action: 'EXCLUDE' as const,
    };

    // Simulate payload construction
    const payload = {
      contamination_flags: mockAnalysis.flags.length > 0 ? mockAnalysis.flags : null,
      contamination_action: mockAnalysis.recommended_action || null,
      contamination_confidence: confidenceToInteger(mockAnalysis.confidence),
    };

    expect(payload.contamination_flags).toEqual(['ZERO_VARIANCE_P1', 'IDENTICAL_P1_P3']);
    expect(payload.contamination_action).toBe('EXCLUDE');
    expect(payload.contamination_confidence).toBe(80);
  });

  it('handles clean submission with no flags', () => {
    const mockAnalysis = {
      flags: [],
      confidence: 'LOW' as const,
      recommended_action: 'INCLUDE' as const,
    };

    // Simulate payload construction
    const payload = {
      contamination_flags: mockAnalysis.flags.length > 0 ? mockAnalysis.flags : null,
      contamination_action: mockAnalysis.recommended_action || null,
      contamination_confidence: confidenceToInteger(mockAnalysis.confidence),
    };

    expect(payload.contamination_flags).toBeNull();
    expect(payload.contamination_action).toBe('INCLUDE');
    expect(payload.contamination_confidence).toBe(20);
  });
});
