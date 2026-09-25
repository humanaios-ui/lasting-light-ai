-- Phase 2 Contamination Detection Schema Migration
-- Adds contamination metadata columns to acat_assessments_v1 table
-- Date: 2026-09-24

ALTER TABLE acat_assessments_v1
ADD COLUMN IF NOT EXISTS contamination_flags JSONB DEFAULT '[]' NOT NULL,
ADD COLUMN IF NOT EXISTS contamination_action TEXT CHECK (contamination_action IN ('INCLUDE', 'FLAG_FOR_REVIEW', 'EXCLUDE')) DEFAULT 'INCLUDE' NOT NULL,
ADD COLUMN IF NOT EXISTS contamination_confidence TEXT CHECK (contamination_confidence IN ('HIGH', 'MEDIUM', 'LOW')) DEFAULT 'LOW' NOT NULL;

-- Create index on contamination_action for efficient filtering during monthly reviews
CREATE INDEX IF NOT EXISTS idx_acat_contamination_action ON acat_assessments_v1(contamination_action);

-- Create index on contamination_flags for querying specific flag patterns
CREATE INDEX IF NOT EXISTS idx_acat_contamination_flags ON acat_assessments_v1 USING GIN (contamination_flags);

-- Add comment documenting the new columns
COMMENT ON COLUMN acat_assessments_v1.contamination_flags IS 'Array of contamination detection flags detected at submission time (e.g., ZERO_VARIANCE_P1, IDENTICAL_P1_P3)';
COMMENT ON COLUMN acat_assessments_v1.contamination_action IS 'Recommended action: INCLUDE (no flags), FLAG_FOR_REVIEW (needs human review), or EXCLUDE (high-confidence contamination)';
COMMENT ON COLUMN acat_assessments_v1.contamination_confidence IS 'Confidence level of contamination detection: HIGH (automated/obvious), MEDIUM (patterns), or LOW (single signal)';
