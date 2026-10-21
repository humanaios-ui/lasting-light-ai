/* FDS: F3-Component | Parent: docs/witness/PUBLIC_MODEL_BUILD.md | Hawkins: internal-only | Status: PROPOSED */

export const WITNESS_MODEL_VERSION = 'witness-character-v0.1';
const POLICY_VERSION = 'witness-policy-v0.1';
const DEMO_FIXTURE_ID = 'synthetic-conflicting-evidence-v1';
const PROPOSAL_ID = 'synthetic-proposal-001';
const DEMO_EVIDENCE_REFS: readonly string[] = Object.freeze(['synthetic:source-a', 'synthetic:source-b']);

const MODES = ['ALIGNED', 'GATHERING', 'DRIFT', 'AUTHORITY_HALT', 'BOUNDARY'] as const;
const AUTHORITY_STATES = ['OPEN', 'HUMAN_REQUIRED', 'BLOCKED'] as const;

export type WitnessMode = typeof MODES[number];
export type AuthorityState = typeof AUTHORITY_STATES[number];

export interface FixturePins {
  mode: WitnessMode;
  cueIds: readonly string[];
  explanation: string;
  evidenceRefs: readonly string[];
  policyVersion: string;
}

export interface SyntheticFixture {
  fixtureId: string;
  sourceKind: 'SYNTHETIC_DEMO';
  mode: WitnessMode;
  authority: AuthorityState;
  evidenceRefs: readonly string[];
  expected: FixturePins;
}

export interface FixtureEvaluation {
  sourceKind: 'SYNTHETIC_DEMO';
  modelVersion: string;
  mode: WitnessMode;
  cueIds: readonly string[];
  explanation: string;
  evidenceRefs: readonly string[];
  policyVersion: string;
}

// Each accepted fixture variant carries its own literal expectations. Evaluation must
// reproduce them exactly, so a change to the mapping tables fails loudly instead of drifting.
const DRIFT_PINS: FixturePins = Object.freeze({
  mode: 'DRIFT',
  cueIds: Object.freeze(['motion-pause', 'seam-highlight']),
  explanation: 'The synthetic evidence references conflict; the seam is highlighted without treating either source as authoritative.',
  evidenceRefs: DEMO_EVIDENCE_REFS,
  policyVersion: POLICY_VERSION,
});

const BOUNDARY_PINS: FixturePins = Object.freeze({
  mode: 'BOUNDARY',
  cueIds: Object.freeze(['withdraw-cue', 'boundary-stop']),
  explanation: 'The synthetic fixture is blocked; the boundary cue cannot be overridden by presentation.',
  evidenceRefs: DEMO_EVIDENCE_REFS,
  policyVersion: POLICY_VERSION,
});

const AUTHORITY_HALT_PINS: FixturePins = Object.freeze({
  mode: 'AUTHORITY_HALT',
  cueIds: Object.freeze(['yield-to-human', 'halt-ring']),
  explanation: 'The synthetic fixture requires a human decision; no action is authorized.',
  evidenceRefs: DEMO_EVIDENCE_REFS,
  policyVersion: POLICY_VERSION,
});

export const CONFLICTING_EVIDENCE_FIXTURE: SyntheticFixture = Object.freeze({
  fixtureId: DEMO_FIXTURE_ID,
  sourceKind: 'SYNTHETIC_DEMO',
  mode: 'DRIFT',
  authority: 'OPEN',
  evidenceRefs: DEMO_EVIDENCE_REFS,
  expected: DRIFT_PINS,
});

export const BLOCKED_FIXTURE: SyntheticFixture = Object.freeze({
  ...CONFLICTING_EVIDENCE_FIXTURE,
  mode: 'ALIGNED',
  authority: 'BLOCKED',
  expected: BOUNDARY_PINS,
});

export const HUMAN_REQUIRED_FIXTURE: SyntheticFixture = Object.freeze({
  ...CONFLICTING_EVIDENCE_FIXTURE,
  mode: 'ALIGNED',
  authority: 'HUMAN_REQUIRED',
  expected: AUTHORITY_HALT_PINS,
});

export const HUMAN_REQUIRED_BOUNDARY_FIXTURE: SyntheticFixture = Object.freeze({
  ...CONFLICTING_EVIDENCE_FIXTURE,
  mode: 'BOUNDARY',
  authority: 'HUMAN_REQUIRED',
  expected: AUTHORITY_HALT_PINS,
});

// The only fixtures evaluation accepts. Pins come from these checked-in objects, never from a caller.
const ACCEPTED_FIXTURE_VARIANTS: readonly SyntheticFixture[] = [
  CONFLICTING_EVIDENCE_FIXTURE,
  BLOCKED_FIXTURE,
  HUMAN_REQUIRED_FIXTURE,
  HUMAN_REQUIRED_BOUNDARY_FIXTURE,
];

function findAcceptedVariant(fixture: SyntheticFixture): SyntheticFixture | undefined {
  return ACCEPTED_FIXTURE_VARIANTS.find(
    (variant) =>
      variant.fixtureId === fixture.fixtureId &&
      variant.sourceKind === fixture.sourceKind &&
      variant.mode === fixture.mode &&
      variant.authority === fixture.authority
  );
}

function isMember<const T extends readonly string[]>(
  values: T,
  value: unknown
): value is T[number] {
  return typeof value === 'string' && values.includes(value as T[number]);
}

function sameList(actual: readonly string[], expected: readonly string[]): boolean {
  return actual.length === expected.length && actual.every((value, index) => value === expected[index]);
}

function validateFixture(fixture: SyntheticFixture): void {
  if (
    !fixture ||
    fixture.sourceKind !== 'SYNTHETIC_DEMO' ||
    fixture.fixtureId !== DEMO_FIXTURE_ID ||
    !isMember(MODES, fixture.mode) ||
    !isMember(AUTHORITY_STATES, fixture.authority) ||
    !Array.isArray(fixture.evidenceRefs) ||
    !sameList(fixture.evidenceRefs, DEMO_EVIDENCE_REFS) ||
    !fixture.expected ||
    !findAcceptedVariant(fixture)
  ) {
    throw new Error('Offline evaluation accepts only the checked-in synthetic fixture.');
  }
}

function matchesPins(evaluation: FixtureEvaluation, pins: FixturePins): boolean {
  return (
    evaluation.mode === pins.mode &&
    sameList(evaluation.cueIds, pins.cueIds) &&
    evaluation.explanation === pins.explanation &&
    sameList(evaluation.evidenceRefs, pins.evidenceRefs) &&
    evaluation.policyVersion === pins.policyVersion
  );
}

export function evaluateFixture(
  fixture: SyntheticFixture = CONFLICTING_EVIDENCE_FIXTURE,
  version: string = WITNESS_MODEL_VERSION
): FixtureEvaluation {
  if (version !== WITNESS_MODEL_VERSION) {
    throw new Error(`Unsupported Witness model version: ${version}`);
  }
  validateFixture(fixture);

  // Authority outranks presentation: BLOCKED always withdraws, HUMAN_REQUIRED always halts.
  const mode: WitnessMode =
    fixture.authority === 'BLOCKED'
      ? 'BOUNDARY'
      : fixture.authority === 'HUMAN_REQUIRED'
        ? 'AUTHORITY_HALT'
        : fixture.mode;

  const cueIdsByMode: Record<WitnessMode, readonly string[]> = {
    ALIGNED: ['still-eye', 'stable-seam', 'resolved-ring'],
    GATHERING: ['scan-pause', 'open-ring'],
    DRIFT: ['motion-pause', 'seam-highlight'],
    AUTHORITY_HALT: ['yield-to-human', 'halt-ring'],
    BOUNDARY: ['withdraw-cue', 'boundary-stop'],
  };
  const explanations: Record<WitnessMode, string> = {
    ALIGNED: 'The synthetic fixture represents aligned evidence; this cue is not a claim about live system state.',
    GATHERING: 'The synthetic fixture represents incomplete evidence; uncertainty remains visible.',
    DRIFT: 'The synthetic evidence references conflict; the seam is highlighted without treating either source as authoritative.',
    AUTHORITY_HALT: 'The synthetic fixture requires a human decision; no action is authorized.',
    BOUNDARY: 'The synthetic fixture is blocked; the boundary cue cannot be overridden by presentation.',
  };

  const evaluation: FixtureEvaluation = {
    sourceKind: 'SYNTHETIC_DEMO',
    modelVersion: version,
    mode,
    cueIds: cueIdsByMode[mode],
    explanation: explanations[mode],
    evidenceRefs: [...fixture.evidenceRefs],
    policyVersion: POLICY_VERSION,
  };

  const pins = findAcceptedVariant(fixture)?.expected;
  if (!pins || !matchesPins(evaluation, pins)) {
    throw new Error('Fixture evaluation does not match its pinned expectations.');
  }

  return evaluation;
}

export function runOfflineBuildDemo() {
  const evaluation = evaluateFixture();

  return {
    modelVersion: WITNESS_MODEL_VERSION,
    contribution: {
      schemaVersion: '0.1',
      contributionId: 'synthetic-contribution-001',
      actorKind: 'SYNTHETIC_FIXTURE',
      contributionKind: 'SCENARIO',
      fixtureRef: DEMO_FIXTURE_ID,
      purposeConsent: {
        C0_EXPERIENCE: true,
        C1_RESEARCH: false,
        C2_WHITE_BOX_LEARNING: false,
        C3_GENERATIVE_MODEL_TRAINING: false,
      },
      publicationConsent: false,
      licenseRef: 'NONE',
      status: 'RECEIVED',
    },
    proposal: {
      proposalId: PROPOSAL_ID,
      status: 'CANDIDATE',
      fixtureRef: DEMO_FIXTURE_ID,
    },
    workflow: [
      { status: 'RECEIVED', contributionId: 'synthetic-contribution-001' },
      { status: 'MODERATION', outcome: 'SYNTHETIC_FIXTURE_ONLY' },
      { status: 'CANDIDATE', proposalId: PROPOSAL_ID },
      { status: 'TESTING', fixtureRef: DEMO_FIXTURE_ID },
      { status: 'REVIEW', reviewerKind: 'SYNTHETIC_FIXTURE' },
      { status: 'SIMULATED_DECISION', decision: 'ACCEPTED_FOR_SIMULATION_ONLY' },
    ],
    review: {
      reviewerKind: 'SYNTHETIC_FIXTURE',
      decision: 'ACCEPTED_FOR_SIMULATION_ONLY',
      proposalId: PROPOSAL_ID,
    },
    evaluation,
    modelCard: {
      modelVersion: WITNESS_MODEL_VERSION,
      status: 'RESEARCH_PROTOTYPE',
      inputKind: 'CHECKED_IN_SYNTHETIC_FIXTURE',
      candidateProposalIds: [PROPOSAL_ID],
      implementedProposalIds: [],
      trainingUsed: false,
    },
    sideEffects: {
      persisted: false,
      trainingStarted: false,
      authorityChanged: false,
      modelVersionChanged: false,
    },
  } as const;
}
