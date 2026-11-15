import { describe, it, expect } from 'vitest';
import {
  pilotArms, syntheticCase, questions, isComplete, scorePilot, type Answers,
} from './witnessChallengePilot';

const correct: Answers = {
  decision: 'HOLD',
  registration: 'ABSENT',
  deadline: 'UNVERIFIED',
  authority: 'HUMAN',
  benefit: 'NONE',
};

describe('Witness Challenge E0 fictional research contract', () => {
  it('has three preview conditions and one shared, frozen synthetic case', () => {
    expect(pilotArms.map(a => a.id)).toEqual(['RAW', 'SUMMARY', 'WITNESS']);
    expect(new Set(pilotArms.map(a => a.id)).size).toBe(3);
    expect(syntheticCase.id).toContain('FICTION');
    expect(syntheticCase.disclosure.toLowerCase()).toContain('fictional');
    expect(syntheticCase.evidence.map(e => e.id)).toEqual(['S1', 'S2', 'S3']);
    expect(syntheticCase.scriptedSummary).toContain('SIMULATED');
    expect(syntheticCase.scriptedWitness).toContain('SIMULATED');
  });

  it('has exactly five fixed questions with source-backed answers', () => {
    expect(questions.map(q => q.key)).toEqual([
      'decision', 'registration', 'deadline', 'authority', 'benefit',
    ]);
    expect(new Set(questions.map(q => q.key)).size).toBe(5);
    for (const q of questions) {
      expect(q.options.some(o => o.value === q.answer)).toBe(true);
      expect(q.sourceIds.length).toBeGreaterThan(0);
      expect(q.sourceIds.every(id => syntheticCase.evidence.some(e => e.id === id))).toBe(true);
    }
  });

  it('requires all five responses before scoring', () => {
    expect(isComplete({})).toBe(false);
    expect(isComplete({...correct, benefit: undefined})).toBe(false);
    expect(isComplete({...correct, decision: 'UNKNOWN'})).toBe(false);
    expect(isComplete(correct)).toBe(true);
  });

  it('scores a fully supported HOLD decision without falsely calling it approved', () => {
    expect(scorePilot(correct)).toMatchObject({
      correct: 5, total: 5, criticalFalseReady: false, wrongAuthority: false,
    });
  });

  it('detects false-ready and invalid delegation even if other facts are right', () => {
    const result = scorePilot({...correct, decision: 'READY', authority: 'AI'});
    expect(result.correct).toBe(3);
    expect(result.criticalFalseReady).toBe(true);
    expect(result.wrongAuthority).toBe(true);
  });

  it('does not mistake a lack of recorded benefit for proof of an award', () => {
    const result = scorePilot({...correct, benefit: 'AWARDED'});
    expect(result.correct).toBe(4);
    expect(result.details.find(d => d.key === 'benefit')).toMatchObject({
      correct: false, answer: 'NONE', sourceIds: ['S3'],
    });
  });

  it('contains no raw participant or personal account records in its scenario', () => {
    const text = JSON.stringify({syntheticCase, questions});
    expect(text).not.toMatch(/@gmail\.com|private_notes|account_number|secret_key/i);
  });
});
