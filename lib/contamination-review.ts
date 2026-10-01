/* FDS: F3-Library | Parent: CUSTOM_INSTRUCTIONS_V3_5_ORD.md | Hawkins: internal-only | Status: ACTIVE */

/**
 * Contamination Review Integration Library
 * Provides utilities for integrating contamination detection with GitHub Actions
 * and Supabase database
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

export type ContaminationAction = 'INCLUDE' | 'FLAG_FOR_REVIEW' | 'EXCLUDE' | 'REVERT';
export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type SubmissionSource = 'manual' | 'api' | 'batch' | 'webhook';

export interface ContaminationAssessment {
  id?: string;
  acat_assessment_id: string;
  detected_flags: string[];
  review_action: ContaminationAction;
  confidence_level: ConfidenceLevel;
  decision_rationale?: string;
  reviewer_notes?: Record<string, any>;
  github_run_id?: number;
  reviewed_by?: string;
}

export interface ContaminationReviewRun {
  id?: string;
  github_run_id: number;
  github_run_url?: string;
  github_actor?: string;
  github_ref?: string;
  run_timestamp?: Date;
  submission_source: SubmissionSource;
  entries_processed: number;
  entries_excluded?: number;
  entries_flagged?: number;
  entries_reverted?: number;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  error_message?: string;
}

export interface LogEntry {
  timestamp: string;
  entity_id: string;
  action: ContaminationAction;
  confidence: ConfidenceLevel;
}

/**
 * Contamination Review Manager
 * Handles database operations and workflow integration
 */
export class ContaminationReviewManager {
  private supabase: SupabaseClient;
  private githubRunId: number;

  constructor(
    supabaseUrl: string,
    supabaseKey: string,
    githubRunId?: number
  ) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.githubRunId = githubRunId || 0;
  }

  /**
   * Fetch assessments with contamination flags that need review
   */
  async fetchContaminatedAssessments(
    limit: number = 100,
    action?: ContaminationAction
  ) {
    try {
      let query = this.supabase
        .from('acat_assessments_v1')
        .select('id, contamination_flags, contamination_action, contamination_confidence, created_at')
        .neq('contamination_action', 'INCLUDE')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (action) {
        query = query.eq('contamination_action', action);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Supabase error: ${error.message}`);
      }

      return data || [];
    } catch (err) {
      console.error('Failed to fetch contaminated assessments:', err);
      throw err;
    }
  }

  /**
   * Create log entries from assessments
   */
  createLogEntries(assessments: any[]): LogEntry[] {
    return assessments.map(assessment => ({
      timestamp: new Date(assessment.created_at).toISOString(),
      entity_id: assessment.id,
      action: assessment.contamination_action,
      confidence: assessment.contamination_confidence
    }));
  }

  /**
   * Format log entries as strings
   */
  formatLogEntries(entries: LogEntry[]): string[] {
    return entries.map(
      entry => `${entry.timestamp} | ${entry.entity_id} | ${entry.action} | ${entry.confidence}`
    );
  }

  /**
   * Parse log entry string into structured object
   */
  static parseLogEntry(line: string): LogEntry | null {
    const match = line.match(/^(\S+T\S+Z) \| ([a-f0-9-]+) \| (\w+) \| (\w+)$/);
    if (!match) return null;

    return {
      timestamp: match[1],
      entity_id: match[2],
      action: match[3] as ContaminationAction,
      confidence: match[4] as ConfidenceLevel
    };
  }

  /**
   * Create contamination assessment record
   */
  async createAssessment(assessment: ContaminationAssessment) {
    try {
      const { data, error } = await this.supabase
        .from('contamination_assessments')
        .insert({
          ...assessment,
          github_run_id: this.githubRunId || assessment.github_run_id,
          reviewed_at: new Date().toISOString(),
          reviewed_by: assessment.reviewed_by || 'system'
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create assessment: ${error.message}`);
      }

      return data;
    } catch (err) {
      console.error('Failed to create contamination assessment:', err);
      throw err;
    }
  }

  /**
   * Bulk create contamination assessments
   */
  async createAssessmentsBatch(assessments: ContaminationAssessment[]) {
    try {
      const withMetadata = assessments.map(a => ({
        ...a,
        github_run_id: this.githubRunId || a.github_run_id,
        reviewed_at: new Date().toISOString(),
        reviewed_by: a.reviewed_by || 'system'
      }));

      const { data, error } = await this.supabase
        .from('contamination_assessments')
        .insert(withMetadata)
        .select();

      if (error) {
        throw new Error(`Failed to create assessments batch: ${error.message}`);
      }

      return data || [];
    } catch (err) {
      console.error('Failed to create contamination assessments batch:', err);
      throw err;
    }
  }

  /**
   * Create or update review run record
   */
  async logReviewRun(run: ContaminationReviewRun) {
    try {
      const { data, error } = await this.supabase
        .from('contamination_review_runs')
        .insert({
          ...run,
          github_run_id: this.githubRunId || run.github_run_id,
          run_timestamp: run.run_timestamp || new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to log review run: ${error.message}`);
      }

      return data;
    } catch (err) {
      console.error('Failed to log review run:', err);
      throw err;
    }
  }

  /**
   * Update review run status
   */
  async updateReviewRunStatus(
    githubRunId: number,
    status: 'in_progress' | 'completed' | 'failed',
    updates?: Partial<ContaminationReviewRun>
  ) {
    try {
      const { data, error } = await this.supabase
        .from('contamination_review_runs')
        .update({
          status,
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('github_run_id', githubRunId)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update review run: ${error.message}`);
      }

      return data;
    } catch (err) {
      console.error('Failed to update review run status:', err);
      throw err;
    }
  }

  /**
   * Get review run by GitHub run ID
   */
  async getReviewRun(githubRunId: number) {
    try {
      const { data, error } = await this.supabase
        .from('contamination_review_runs')
        .select('*')
        .eq('github_run_id', githubRunId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new Error(`Failed to fetch review run: ${error.message}`);
      }

      return data;
    } catch (err) {
      console.error('Failed to get review run:', err);
      throw err;
    }
  }

  /**
   * Get recent review runs
   */
  async getRecentReviewRuns(limit: number = 10) {
    try {
      const { data, error } = await this.supabase
        .from('contamination_review_runs')
        .select('*')
        .order('run_timestamp', { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error(`Failed to fetch recent runs: ${error.message}`);
      }

      return data || [];
    } catch (err) {
      console.error('Failed to get recent review runs:', err);
      throw err;
    }
  }

  /**
   * Trigger GitHub Actions workflow via repository dispatch
   */
  async triggerWorkflow(
    githubToken: string,
    owner: string,
    repo: string,
    entityId?: string,
    source: SubmissionSource = 'api'
  ) {
    try {
      const url = `https://api.github.com/repos/${owner}/${repo}/dispatches`;

      const payload: Record<string, any> = {
        event_type: 'data-submission',
        client_payload: {
          submission_source: source
        }
      };

      if (entityId) {
        payload.client_payload.entity_id = entityId;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`GitHub API error: ${response.status} ${errorBody}`);
      }

      return {
        success: true,
        message: `Workflow triggered successfully for ${owner}/${repo}`
      };
    } catch (err) {
      console.error('Failed to trigger workflow:', err);
      throw err;
    }
  }

  /**
   * Process and store assessment batch
   */
  async processAssessmentBatch(
    assessments: any[],
    run: ContaminationReviewRun
  ) {
    try {
      // Create log entries
      const logEntries = this.createLogEntries(assessments);

      // Log review run
      const runRecord = await this.logReviewRun(run);

      // Create contamination assessments
      const assessmentRecords = await this.createAssessmentsBatch(
        logEntries.map(entry => ({
          acat_assessment_id: entry.entity_id,
          detected_flags: [],
          review_action: entry.action,
          confidence_level: entry.confidence,
          github_run_id: runRecord.github_run_id
        }))
      );

      return {
        run: runRecord,
        assessments: assessmentRecords,
        logEntries
      };
    } catch (err) {
      console.error('Failed to process assessment batch:', err);
      throw err;
    }
  }
}

/**
 * Export log utilities
 */
export const LogUtil = {
  /**
   * Parse contamination_review_log.txt file
   */
  parseLogFile(content: string): LogEntry[] {
    return content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'))
      .map(line => ContaminationReviewManager.prototype.constructor.parseLogEntry(line))
      .filter((entry): entry is LogEntry => entry !== null);
  },

  /**
   * Format entries for log file
   */
  formatForFile(entries: LogEntry[]): string {
    return entries
      .map(entry => `${entry.timestamp} | ${entry.entity_id} | ${entry.action} | ${entry.confidence}`)
      .join('\n');
  }
};

export default ContaminationReviewManager;
