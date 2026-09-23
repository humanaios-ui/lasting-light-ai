/* FDS: F3-Component | Parent: CUSTOM_INSTRUCTIONS_V3_5_ORD.md | Hawkins: internal-only | Status: ACTIVE */

// Pseudonymous submission storage and retrieval

// Simple UUID v4 generator
function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export interface ContributionEnvelope {
  intent: {
    goal: string;
    why_matters: string;
  };
  interpretation: {
    framing: string;
    assumptions: string[];
    uncertainty: string[];
    confidence: 'LOW' | 'MEDIUM' | 'HIGH';
  };
  contribution: {
    observations: string[];
    evidence_refs: string[];
    inferences: string[];
    disagreements: string[];
    proposed_next_step: string;
  };
  boundaries: {
    can_contact: boolean;
    can_cite: boolean;
    opted_into_identity: boolean;
  };
}

export interface Submission {
  id: string;
  participant_id: string;
  regime: 'A' | 'B' | 'C';
  problem_id: string;
  timestamp: number;
  envelope?: ContributionEnvelope;
  synthesis?: string;
  confidence?: number;
  evidence_refs?: string[];
  recommendation?: string;
  boundaries?: {
    can_contact: boolean;
    can_cite: boolean;
    opted_into_identity: boolean;
  };
  exported_from_github?: boolean;
}

export interface Participant {
  id: string;
  created_at: number;
  opted_into_identity: boolean;
  identity_key?: string;
  exported_from_github?: boolean;
}

const STORAGE_KEYS = {
  PARTICIPANT_ID: 'humanaios_experiment_participant_id',
  SUBMISSIONS: 'humanaios_experiment_submissions',
  PARTICIPANTS: 'humanaios_experiment_participants',
};

// Generate or retrieve pseudonymous participant ID
export function getPseudonym(): string {
  const stored = localStorage.getItem(STORAGE_KEYS.PARTICIPANT_ID);
  if (stored) return stored;

  const newId = uuidv4();
  localStorage.setItem(STORAGE_KEYS.PARTICIPANT_ID, newId);

  // Also create participant record
  const participant: Participant = {
    id: newId,
    created_at: Date.now(),
    opted_into_identity: false,
  };
  const participants = getAllParticipants();
  participants.push(participant);
  localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(participants));

  return newId;
}

// Submit a response to a regime
export function submitResponse(
  regime: 'A' | 'B' | 'C',
  problemId: string,
  data: Partial<Submission>
): Submission {
  const submission: Submission = {
    id: uuidv4(),
    participant_id: getPseudonym(),
    regime,
    problem_id: problemId,
    timestamp: Date.now(),
    ...data,
    exported_from_github: false,
  } as Submission;

  const submissions = getAllSubmissions();
  submissions.push(submission);
  localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));

  return submission;
}

// Get all submissions for a regime and problem
export function getSubmissionsForRegime(regime: 'A' | 'B' | 'C', problemId: string): Submission[] {
  const submissions = getAllSubmissions();
  return submissions.filter(s => s.regime === regime && s.problem_id === problemId)
    .sort((a, b) => a.timestamp - b.timestamp);
}

// Get submissions for Regime A (show synthesis answers)
export function getRegimeAResponses(problemId: string): Submission[] {
  return getSubmissionsForRegime('A', problemId)
    .filter(s => s.synthesis); // Only show completed syntheses
}

// Get all submissions (for dashboard)
export function getAllSubmissions(): Submission[] {
  const stored = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
  return stored ? JSON.parse(stored) : [];
}

export function getAllParticipants(): Participant[] {
  const stored = localStorage.getItem(STORAGE_KEYS.PARTICIPANTS);
  return stored ? JSON.parse(stored) : [];
}

// Get metrics for a regime
export function getMetricsForRegime(regime: 'A' | 'B' | 'C', problemId: string) {
  const submissions = getSubmissionsForRegime(regime, problemId);
  return {
    submission_count: submissions.length,
    unique_participants: new Set(submissions.map(s => s.participant_id)).size,
    avg_confidence: submissions.length > 0
      ? submissions.reduce((sum, s) => sum + (s.confidence || 0), 0) / submissions.length
      : 0,
    last_submission: submissions[submissions.length - 1]?.timestamp || null,
  };
}

// Clear all data (for testing)
export function clearAllData(): void {
  localStorage.removeItem(STORAGE_KEYS.PARTICIPANT_ID);
  localStorage.removeItem(STORAGE_KEYS.SUBMISSIONS);
  localStorage.removeItem(STORAGE_KEYS.PARTICIPANTS);
}
