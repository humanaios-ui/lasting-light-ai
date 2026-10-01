/* FDS: F3-Component | Parent: CUSTOM_INSTRUCTIONS_V3_5_ORD.md | Hawkins: internal-only | Status: ACTIVE */

import { logAudit } from './validation';

// Pseudonymous submission storage and retrieval

// Cryptographically secure UUID v4 generator
function uuidv4(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
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
  try {
    localStorage.setItem(STORAGE_KEYS.PARTICIPANT_ID, newId);
  } catch (error) {
    logAudit('STORAGE_QUOTA_ERROR', {
      error: error instanceof Error ? error.message : String(error),
      operation: 'setPseudonym',
    });
    return newId;
  }

  // Also create participant record
  const participant: Participant = {
    id: newId,
    created_at: Date.now(),
    opted_into_identity: false,
  };
  const participants = getAllParticipants();
  participants.push(participant);
  try {
    localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(participants));
  } catch (error) {
    logAudit('STORAGE_QUOTA_ERROR', {
      error: error instanceof Error ? error.message : String(error),
      operation: 'setPseudonym_participants',
    });
  }

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
  try {
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
  } catch (error) {
    logAudit('STORAGE_QUOTA_ERROR', {
      error: error instanceof Error ? error.message : String(error),
      operation: 'submitResponse',
      submissionId: submission.id,
    });
  }

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
  if (!stored) return [];

  try {
    return JSON.parse(stored);
  } catch (error) {
    logAudit('GET_ALL_SUBMISSIONS_PARSE_ERROR', {
      error: error instanceof Error ? error.message : String(error),
      dataLength: stored.length,
    });
    return [];
  }
}

export function getAllParticipants(): Participant[] {
  const stored = localStorage.getItem(STORAGE_KEYS.PARTICIPANTS);
  if (!stored) return [];

  try {
    return JSON.parse(stored);
  } catch (error) {
    logAudit('GET_ALL_PARTICIPANTS_PARSE_ERROR', {
      error: error instanceof Error ? error.message : String(error),
      dataLength: stored.length,
    });
    return [];
  }
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
