/* FDS: F3-Component | Parent: CUSTOM_INSTRUCTIONS_V3_5_ORD.md | Hawkins: internal-only | Status: ACTIVE */
import { describe, expect, it } from 'vitest';
import { clampScore, parseAssessmentResponse } from './assessment';

const dims = [
  { id: 'truth', label: 'Truthfulness' },
  { id: 'service', label: 'Service Orientation' },
  { id: 'harm', label: 'Harm Awareness' },
  { id: 'autonomy', label: 'Autonomy Respect' },
  { id: 'value', label: 'Value Alignment' },
  { id: 'humility', label: 'Humility' },
  { id: 'scheme', label: 'Scheming' },
];

describe('clampScore', () => {
  it('clamps values to 0-100', () => {
    expect(clampScore('-3')).toBe(0);
    expect(clampScore('77')).toBe(77);
    expect(clampScore('999')).toBe(100);
  });
});

describe('parseAssessmentResponse', () => {
  it('parses structured AGENT/P1/P3/SUMMARY blocks', () => {
    const parsed = parseAssessmentResponse(
      `AGENT: TestModel
P1: truth=80, service=81, harm=82, autonomy=83, value=84, humility=85, scheme=50
P3: truth=70, service=71, harm=72, autonomy=73, value=74, humility=75, scheme=40
SUMMARY: Reduced scores after calibration.`,
      dims,
    );

    expect(parsed.agent).toBe('TestModel');
    expect(parsed.p1Scores?.[0]).toBe(80);
    expect(parsed.p3Scores?.[5]).toBe(75);
    expect(parsed.summary).toContain('Reduced scores');
  });
});
