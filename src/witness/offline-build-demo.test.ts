/* FDS: F3-Test | Parent: docs/witness/PUBLIC_MODEL_BUILD.md | Hawkins: internal-only | Status: PROPOSED */

import { describe, expect, it } from 'vitest';
import {
  CONFLICTING_EVIDENCE_FIXTURE,
  evaluateFixture,
  runOfflineBuildDemo,
  WITNESS_MODEL_VERSION,
} from './offline-build-demo';

describe('offline Witness build demo', () => {
  it('uses separate purpose choices with training and publication off by default', () => {
    const demo = runOfflineBuildDemo();

    expect(demo.contribution.actorKind).toBe('SYNTHETIC_FIXTURE');
    expect(demo.contribution.purposeConsent).toEqual({
      C0_EXPERIENCE: true,
      C1_RESEARCH: false,
      C2_WHITE_BOX_LEARNING: false,
      C3_GENERATIVE_MODEL_TRAINING: false,
    });
    expect(demo.contribution.publicationConsent).toBe(false);
    expect(demo.contribution.licenseRef).toBe('NONE');
    expect(demo.modelCard.trainingUsed).toBe(false);
  });

  it('shows the candidate and simulated review without changing the model', () => {
    const demo = runOfflineBuildDemo();

    expect(demo.proposal.status).toBe('CANDIDATE');
    expect(demo.review.decision).toBe('ACCEPTED_FOR_SIMULATION_ONLY');
    expect(demo.workflow.map((stage) => stage.status)).toEqual([
      'RECEIVED',
      'MODERATION',
      'CANDIDATE',
      'TESTING',
      'REVIEW',
      'SIMULATED_DECISION',
    ]);
    expect(demo.modelCard.modelVersion).toBe(WITNESS_MODEL_VERSION);
    expect(demo.modelCard.implementedProposalIds).toEqual([]);
    expect(demo.sideEffects).toEqual({
      persisted: false,
      trainingStarted: false,
      authorityChanged: false,
      modelVersionChanged: false,
    });
  });

  it('replays the synthetic fixture deterministically with traceable cues', () => {
    const first = evaluateFixture();
    const second = evaluateFixture();

    expect(first).toEqual(second);
    expect(first).toMatchObject({
      sourceKind: 'SYNTHETIC_DEMO',
      modelVersion: WITNESS_MODEL_VERSION,
      mode: 'DRIFT',
      cueIds: ['motion-pause', 'seam-highlight'],
      policyVersion: 'witness-policy-v0.1',
    });
    expect(first.evidenceRefs).toEqual(['synthetic:source-a', 'synthetic:source-b']);
  });

  it('pins evaluation to the requested model version', () => {
    expect(evaluateFixture(CONFLICTING_EVIDENCE_FIXTURE, WITNESS_MODEL_VERSION))
      .toEqual(evaluateFixture());
    expect(() => evaluateFixture(CONFLICTING_EVIDENCE_FIXTURE, 'witness-character-v0.2'))
      .toThrow('Unsupported Witness model version: witness-character-v0.2');
  });

  it('prioritizes blocked authority over a presentation state', () => {
    const blocked = evaluateFixture({
      ...CONFLICTING_EVIDENCE_FIXTURE,
      mode: 'ALIGNED',
      authority: 'BLOCKED',
    });

    expect(blocked.mode).toBe('BOUNDARY');
    expect(blocked.cueIds).toEqual(['withdraw-cue', 'boundary-stop']);
  });

  it('rejects non-synthetic sources and evidence references', () => {
    expect(() => evaluateFixture({
      ...CONFLICTING_EVIDENCE_FIXTURE,
      sourceKind: 'AUTHENTICATED_READ',
    } as never)).toThrow('Offline evaluation accepts only the checked-in synthetic fixture.');

    expect(() => evaluateFixture({
      ...CONFLICTING_EVIDENCE_FIXTURE,
      evidenceRefs: ['private:record'],
    })).toThrow('Offline evaluation accepts only the checked-in synthetic fixture.');
  });
});
