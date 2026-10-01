-- Contamination Review Runs Table
-- Tracks GitHub Actions workflow executions and their outcomes
-- Date: 2026-09-28

CREATE TABLE IF NOT EXISTS contamination_review_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- GitHub Actions integration
  github_run_id BIGINT NOT NULL UNIQUE,
  github_run_url TEXT,
  github_actor TEXT,
  github_ref TEXT,

  -- Run metadata
  run_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  submission_source TEXT CHECK (submission_source IN ('manual', 'api', 'batch', 'webhook')),

  -- Results
  entries_processed INTEGER DEFAULT 0,
  entries_excluded INTEGER DEFAULT 0,
  entries_flagged INTEGER DEFAULT 0,
  entries_reverted INTEGER DEFAULT 0,

  -- Status tracking
  status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')) DEFAULT 'pending',
  error_message TEXT,

  -- Audit trail
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_review_runs_github_run_id
  ON contamination_review_runs(github_run_id DESC);

CREATE INDEX IF NOT EXISTS idx_review_runs_timestamp
  ON contamination_review_runs(run_timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_review_runs_status
  ON contamination_review_runs(status);

CREATE INDEX IF NOT EXISTS idx_review_runs_submission_source
  ON contamination_review_runs(submission_source);

-- Table comments
COMMENT ON TABLE contamination_review_runs IS 'Audit log of contamination review workflow executions with GitHub Actions integration';

COMMENT ON COLUMN contamination_review_runs.github_run_id IS 'GitHub Actions workflow run ID (unique)';
COMMENT ON COLUMN contamination_review_runs.github_run_url IS 'Direct URL to GitHub Actions workflow run';
COMMENT ON COLUMN contamination_review_runs.github_actor IS 'User who triggered the workflow (if manual)';
COMMENT ON COLUMN contamination_review_runs.github_ref IS 'Git reference (branch/tag) the workflow ran on';
COMMENT ON COLUMN contamination_review_runs.submission_source IS 'How submissions were triggered: manual, api, batch, or webhook';
COMMENT ON COLUMN contamination_review_runs.entries_processed IS 'Total contamination records reviewed';
COMMENT ON COLUMN contamination_review_runs.entries_excluded IS 'Records marked for exclusion';
COMMENT ON COLUMN contamination_review_runs.entries_flagged IS 'Records flagged for human review';
COMMENT ON COLUMN contamination_review_runs.entries_reverted IS 'Previous decisions that were reverted';
COMMENT ON COLUMN contamination_review_runs.status IS 'Workflow status: pending, in_progress, completed, or failed';
COMMENT ON COLUMN contamination_review_runs.error_message IS 'Error details if workflow failed';

-- Enable RLS for security
ALTER TABLE contamination_review_runs ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow authenticated users to read runs
CREATE POLICY contamination_review_runs_read_policy
  ON contamination_review_runs
  FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policy: Allow service role to insert runs (GitHub Actions workflow only)
CREATE POLICY contamination_review_runs_insert_policy
  ON contamination_review_runs
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- RLS Policy: Allow service role to update runs for status tracking
CREATE POLICY contamination_review_runs_update_policy
  ON contamination_review_runs
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);
