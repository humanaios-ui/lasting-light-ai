-- Contamination Assessments Table
-- Tracks detailed contamination review decisions with full audit trail
-- Date: 2026-09-28

CREATE TABLE IF NOT EXISTS contamination_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign key to the assessment being reviewed
  acat_assessment_id UUID NOT NULL REFERENCES acat_assessments_v1(id) ON DELETE CASCADE,

  -- Contamination detection metadata
  detected_flags JSONB DEFAULT '[]' NOT NULL,

  -- Review decision
  review_action TEXT NOT NULL CHECK (review_action IN ('INCLUDE', 'FLAG_FOR_REVIEW', 'EXCLUDE', 'REVERT')) DEFAULT 'INCLUDE',
  confidence_level TEXT NOT NULL CHECK (confidence_level IN ('HIGH', 'MEDIUM', 'LOW')) DEFAULT 'LOW',

  -- Decision rationale (audit trail)
  decision_rationale TEXT,
  reviewer_notes JSONB DEFAULT '{}' NOT NULL,

  -- Tracking
  reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  reviewed_by TEXT DEFAULT 'system',

  -- GitHub Actions integration
  github_run_id BIGINT,
  github_run_url TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_contamination_acat_assessment_id
  ON contamination_assessments(acat_assessment_id);

CREATE INDEX IF NOT EXISTS idx_contamination_review_action
  ON contamination_assessments(review_action);

CREATE INDEX IF NOT EXISTS idx_contamination_confidence
  ON contamination_assessments(confidence_level);

CREATE INDEX IF NOT EXISTS idx_contamination_reviewed_at
  ON contamination_assessments(reviewed_at DESC);

CREATE INDEX IF NOT EXISTS idx_contamination_flags
  ON contamination_assessments USING GIN (detected_flags);

CREATE INDEX IF NOT EXISTS idx_contamination_github_run_id
  ON contamination_assessments(github_run_id);

-- Table comments
COMMENT ON TABLE contamination_assessments IS 'Detailed audit trail of contamination detection and review decisions with GitHub Actions integration';

COMMENT ON COLUMN contamination_assessments.acat_assessment_id IS 'Reference to the assessment under review';
COMMENT ON COLUMN contamination_assessments.detected_flags IS 'Array of detected contamination flags (e.g., ZERO_VARIANCE_P1, IDENTICAL_P1_P3)';
COMMENT ON COLUMN contamination_assessments.review_action IS 'Final decision: INCLUDE (approved), FLAG_FOR_REVIEW (needs human review), EXCLUDE (rejected), or REVERT (undo previous decision)';
COMMENT ON COLUMN contamination_assessments.confidence_level IS 'HIGH (automated), MEDIUM (pattern-based), or LOW (single signal)';
COMMENT ON COLUMN contamination_assessments.decision_rationale IS 'Text explanation of the review decision';
COMMENT ON COLUMN contamination_assessments.reviewer_notes IS 'JSON object with structured reviewer feedback and metadata';
COMMENT ON COLUMN contamination_assessments.reviewed_by IS 'ID of reviewer (system, user email, or service)';
COMMENT ON COLUMN contamination_assessments.github_run_id IS 'GitHub Actions workflow run ID for full traceability';
COMMENT ON COLUMN contamination_assessments.github_run_url IS 'URL to the GitHub Actions workflow run';

-- Enable RLS for security
ALTER TABLE contamination_assessments ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow authenticated users to read contamination assessments
CREATE POLICY contamination_assessments_read_policy
  ON contamination_assessments
  FOR SELECT
  USING (true);

-- RLS Policy: Allow service role to insert contamination assessments
CREATE POLICY contamination_assessments_insert_policy
  ON contamination_assessments
  FOR INSERT
  WITH CHECK (true);

-- RLS Policy: Allow updates only for review_action and reviewer_notes
CREATE POLICY contamination_assessments_update_policy
  ON contamination_assessments
  FOR UPDATE
  USING (true)
  WITH CHECK (true);
