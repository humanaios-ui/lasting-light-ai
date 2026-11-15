/* FDS: F3-Component | Parent: CUSTOM_INSTRUCTIONS_V3_5_ORD.md | Status: EXPERIMENTAL Z1
   Witness Challenge E0: scripted, fictional, client-only preview. No research data collection. */
export type PilotArm = 'RAW' | 'SUMMARY' | 'WITNESS';
export type AnswerKey = 'decision' | 'registration' | 'deadline' | 'authority' | 'benefit';
export type Answers = Partial<Record<AnswerKey, string>>;

export const pilotArms: ReadonlyArray<{id: PilotArm; name: string; description: string}> = [
  {id: 'RAW', name: 'A · Source documents', description: 'Read the fictional source documents. No AI guidance.'},
  {id: 'SUMMARY', name: 'B · AI summary', description: 'Read the same sources plus a scripted, potentially incorrect AI summary.'},
  {id: 'WITNESS', name: 'C · AI + Witness', description: 'Read the same sources, the same AI summary, and a scripted evidence challenge.'},
];

export const syntheticCase = {
  id: 'FICTION-LANTERN-001',
  version: 'v1.0-frozen-preview',
  title: 'Lantern Community Workshop',
  decision: 'Should an application be submitted now?',
  disclosure: 'Entirely fictional scenario. No real grant, organization, application, or provider.',
  evidence: [
    {
      id: 'S1',
      name: 'Fictional grant rules',
      text: 'Applicants must provide proof of registered community-organization status and a signed budget. A designated human must authorize submission. A deadline is valid only when confirmed in the first-party notice.',
    },
    {
      id: 'S2',
      name: 'Fictional applicant packet',
      text: 'A signed budget is present. Proof of registration is not provided. An informal forwarded note says the deadline is “next month,” with no first-party notice attached.',
    },
    {
      id: 'S3',
      name: 'Fictional activity record',
      text: 'No submission receipt, award record, or verified community benefit has been recorded.',
    },
  ],
  scriptedSummary: 'SIMULATED AI SUMMARY — NOT VERIFIED: The budget is signed and the team seems eligible. Submission should proceed now to avoid missing the deadline.',
  scriptedWitness: 'SIMULATED WITNESS CHECK — NOT AN INDEPENDENT REVIEW: Source S2 does not include registration proof. S1 requires it. The deadline is not confirmed by a first-party notice. S1 reserves submission to a designated human. S3 contains no verified benefit. HOLD and investigate; do not submit automatically.',
} as const;

export const questions: ReadonlyArray<{
  key: AnswerKey;
  prompt: string;
  options: ReadonlyArray<{value: string; label: string}>;
  answer: string;
  sourceIds: ReadonlyArray<string>;
  explanation: string;
}> = [
  {
    key: 'decision', prompt: 'Which decision is supported now?',
    options: [
      {value: 'READY', label: 'Ready to submit'},
      {value: 'HOLD', label: 'Hold and request missing proof'},
      {value: 'REJECT', label: 'Reject permanently'},
    ],
    answer: 'HOLD', sourceIds: ['S1', 'S2'],
    explanation: 'Registration proof is required but absent. No permanent rejection is supported.',
  },
  {
    key: 'registration', prompt: 'What is the status of registration proof?',
    options: [
      {value: 'PRESENT', label: 'Present in the packet'},
      {value: 'ABSENT', label: 'Not provided'},
      {value: 'NOT_REQUIRED', label: 'Not required'},
    ],
    answer: 'ABSENT', sourceIds: ['S1', 'S2'],
    explanation: 'S1 requires the proof. S2 explicitly says it has not been provided.',
  },
  {
    key: 'deadline', prompt: 'Is the filing deadline verified?',
    options: [
      {value: 'CONFIRMED', label: 'Verified by first-party notice'},
      {value: 'UNVERIFIED', label: 'Still unverified'},
      {value: 'EXPIRED', label: 'Known to have expired'},
    ],
    answer: 'UNVERIFIED', sourceIds: ['S1', 'S2'],
    explanation: 'A forwarded informal note is not a verified first-party deadline.',
  },
  {
    key: 'authority', prompt: 'Who can authorize submission?',
    options: [
      {value: 'AI', label: 'The AI assistant'},
      {value: 'HUMAN', label: 'The designated human'},
      {value: 'ANYONE', label: 'Anyone who viewed the sources'},
    ],
    answer: 'HUMAN', sourceIds: ['S1'],
    explanation: 'S1 explicitly requires authorization by a designated human.',
  },
  {
    key: 'benefit', prompt: 'What verified human benefit has occurred?',
    options: [
      {value: 'AWARDED', label: 'An award has been verified'},
      {value: 'NONE', label: 'No benefit has been verified'},
      {value: 'SERVED', label: 'People have already been served'},
    ],
    answer: 'NONE', sourceIds: ['S3'],
    explanation: 'S3 documents no submission receipt, award, or verified benefit.',
  },
];

export function scorePilot(answers: Answers) {
  const correctness = questions.map(q => ({
    key: q.key,
    correct: answers[q.key] === q.answer,
    answer: q.answer,
    explanation: q.explanation,
    sourceIds: q.sourceIds,
  }));
  const correct = correctness.filter(item => item.correct).length;
  return {
    correct,
    total: questions.length,
    criticalFalseReady: answers.decision === 'READY',
    wrongAuthority: answers.authority !== 'HUMAN',
    details: correctness,
    status: correct === questions.length ? 'All fictional case answers correct' : 'Review the source evidence',
  };
}

export function isComplete(answers: Answers): boolean {
  return questions.every(q => q.options.some(o => o.value === answers[q.key]));
}
