-- Phase 2 Contamination Detection - Make columns nullable for backward compatibility
-- Modifies acat_assessments_v1 table to allow NULL values in contamination columns
-- Date: 2026-09-28

-- Make contamination_confidence nullable and convert to INTEGER (0-100 scale)
-- First, add new column with integer type
ALTER TABLE acat_assessments_v1
ADD COLUMN IF NOT EXISTS contamination_confidence_int INTEGER CHECK (contamination_confidence_int >= 0 AND contamination_confidence_int <= 100);

-- Update existing text values to integer (HIGH->80, MEDIUM->50, LOW->20)
UPDATE acat_assessments_v1
SET contamination_confidence_int = CASE
  WHEN contamination_confidence = 'HIGH' THEN 80
  WHEN contamination_confidence = 'MEDIUM' THEN 50
  WHEN contamination_confidence = 'LOW' THEN 20
  ELSE NULL
END
WHERE contamination_confidence IS NOT NULL;

-- Make contamination_flags nullable
ALTER TABLE acat_assessments_v1
ALTER COLUMN contamination_flags DROP NOT NULL,
ALTER COLUMN contamination_flags DROP DEFAULT;

-- Make contamination_action nullable
ALTER TABLE acat_assessments_v1
ALTER COLUMN contamination_action DROP NOT NULL,
ALTER COLUMN contamination_action DROP DEFAULT;

-- Drop old text-based contamination_confidence column and rename the new one
ALTER TABLE acat_assessments_v1
DROP COLUMN IF EXISTS contamination_confidence;

ALTER TABLE acat_assessments_v1
RENAME COLUMN contamination_confidence_int TO contamination_confidence;

-- Update column comments to reflect nullable status and new type
COMMENT ON COLUMN acat_assessments_v1.contamination_flags IS 'Array of contamination detection flags detected at submission time (e.g., ZERO_VARIANCE_P1, IDENTICAL_P1_P3). Nullable.';
COMMENT ON COLUMN acat_assessments_v1.contamination_action IS 'Recommended action: INCLUDE (no flags), FLAG_FOR_REVIEW (needs human review), or EXCLUDE (high-confidence contamination). Nullable.';
COMMENT ON COLUMN acat_assessments_v1.contamination_confidence IS 'Confidence level of contamination detection as integer 0-100 scale. Nullable.';
