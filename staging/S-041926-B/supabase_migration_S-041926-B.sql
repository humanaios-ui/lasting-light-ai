-- ═══════════════════════════════════════════════════════════════════════════
-- SUPABASE MIGRATION · S-041926-B
-- Date:    April 19, 2026 · OR&D Day 40
-- Author:  Claude · Zone 1 build · Zone 3 execute (Night pastes to SQL editor)
-- Parent:  S-041926-A deferred decision (Research Hub Supabase wiring)
--
-- PURPOSE
--   1. Extend acat_assessments_v1 with 10 new columns (P1 + P3 × Extended 5 dims)
--      so Extended 5 stops living in extended_dims JSON and becomes queryable.
--   2. Backfill the new columns from extended_dims JSON for existing rows
--      so the 16 pre-migration rows remain first-class queryable data.
--   3. Create acat_research_hub_v1 as SEPARATE table for Research Hub intake
--      (30 findings / 6 probes / 9 flags) — no contamination of LI dataset.
--   4. Create unified view acat_assessments_v1_unified that reads from real
--      columns first, falls back to JSON for rows that predate the backfill.
--   5. Document RLS lint acceptance per S-041926-B decision.
--
-- GUARANTEES (Principle 2 · additive only)
--   · No DROP COLUMN
--   · No ALTER COLUMN TYPE on existing columns
--   · No DELETE on existing rows
--   · No policy removal — only addition
--   · Backfill UPDATE touches only rows where new columns are NULL
--
-- ROLLBACK
--   If any step fails, remaining steps do not execute (wrapped in BEGIN/COMMIT).
--   To undo manually: DROP columns + DROP TABLE + DROP VIEW
--   (explicit undo script at bottom of file — do NOT run unless rolling back)
-- ═══════════════════════════════════════════════════════════════════════════

BEGIN;

-- ─── STEP 1 · Extend acat_assessments_v1 with Extended 5 dimensions ─────────
-- Each column IF NOT EXISTS so this file is re-runnable without error.
-- int2 range is -32768..32767 · dims are 0-100 · generous fit.

ALTER TABLE public.acat_assessments_v1
  ADD COLUMN IF NOT EXISTS p1_scheme  int2,
  ADD COLUMN IF NOT EXISTS p1_power   int2,
  ADD COLUMN IF NOT EXISTS p1_syc     int2,
  ADD COLUMN IF NOT EXISTS p1_consist int2,
  ADD COLUMN IF NOT EXISTS p1_fair    int2,
  ADD COLUMN IF NOT EXISTS p3_scheme  int2,
  ADD COLUMN IF NOT EXISTS p3_power   int2,
  ADD COLUMN IF NOT EXISTS p3_syc     int2,
  ADD COLUMN IF NOT EXISTS p3_consist int2,
  ADD COLUMN IF NOT EXISTS p3_fair    int2;

-- Also add series/run metadata columns for the new 6-run sequential protocol.
-- These support series analysis without relying on metadata JSON extraction.

ALTER TABLE public.acat_assessments_v1
  ADD COLUMN IF NOT EXISTS run_mode        text,
  ADD COLUMN IF NOT EXISTS series_id       text,
  ADD COLUMN IF NOT EXISTS run_index       int2,
  ADD COLUMN IF NOT EXISTS series_length   int2,
  ADD COLUMN IF NOT EXISTS learning_index  numeric(6,4),
  ADD COLUMN IF NOT EXISTS submission_source text;  -- 'assess' | 'research_hub' | other

COMMENT ON COLUMN public.acat_assessments_v1.p1_scheme  IS 'Extended 5 · Scheming · Phase 1 · 0-100';
COMMENT ON COLUMN public.acat_assessments_v1.p1_power   IS 'Extended 5 · Power-Seeking · Phase 1 · 0-100';
COMMENT ON COLUMN public.acat_assessments_v1.p1_syc     IS 'Extended 5 · Sycophancy Resistance · Phase 1 · 0-100';
COMMENT ON COLUMN public.acat_assessments_v1.p1_consist IS 'Extended 5 · Behavioral Consistency · Phase 1 · 0-100';
COMMENT ON COLUMN public.acat_assessments_v1.p1_fair    IS 'Extended 5 · Fairness · Phase 1 · 0-100';
COMMENT ON COLUMN public.acat_assessments_v1.p3_scheme  IS 'Extended 5 · Scheming · Phase 3 · 0-100';
COMMENT ON COLUMN public.acat_assessments_v1.p3_power   IS 'Extended 5 · Power-Seeking · Phase 3 · 0-100';
COMMENT ON COLUMN public.acat_assessments_v1.p3_syc     IS 'Extended 5 · Sycophancy Resistance · Phase 3 · 0-100';
COMMENT ON COLUMN public.acat_assessments_v1.p3_consist IS 'Extended 5 · Behavioral Consistency · Phase 3 · 0-100';
COMMENT ON COLUMN public.acat_assessments_v1.p3_fair    IS 'Extended 5 · Fairness · Phase 3 · 0-100';
COMMENT ON COLUMN public.acat_assessments_v1.run_mode   IS 'sequential | unified | legacy';
COMMENT ON COLUMN public.acat_assessments_v1.series_id  IS 'Identifier grouping runs in a 6-run perturbation-balanced series';
COMMENT ON COLUMN public.acat_assessments_v1.run_index  IS '1-based position within a series';
COMMENT ON COLUMN public.acat_assessments_v1.series_length IS '1 | 3 | 6';
COMMENT ON COLUMN public.acat_assessments_v1.learning_index IS 'P3 Core 6 total / P1 Core 6 total · qualified: clean unanchored v5.3+';
COMMENT ON COLUMN public.acat_assessments_v1.submission_source IS 'Provenance tag · defaults NULL for pre-migration rows';

-- ─── STEP 2 · Backfill Extended 5 columns from existing extended_dims JSON ──
-- Shape observed in 16 existing rows:
--   extended_dims::jsonb = {"syc":{"p1":NN,"p3":NN}, "fair":{...}, "power":{...},
--                           "scheme":{...}, "consist":{...}}
-- Update only rows where the target column is NULL AND the JSON has a value.
-- Safe to re-run · WHERE clause makes it idempotent.

UPDATE public.acat_assessments_v1
SET
  p1_scheme  = COALESCE(p1_scheme,  NULLIF(extended_dims->'scheme'->>'p1','')::int2),
  p1_power   = COALESCE(p1_power,   NULLIF(extended_dims->'power'->>'p1','')::int2),
  p1_syc     = COALESCE(p1_syc,     NULLIF(extended_dims->'syc'->>'p1','')::int2),
  p1_consist = COALESCE(p1_consist, NULLIF(extended_dims->'consist'->>'p1','')::int2),
  p1_fair    = COALESCE(p1_fair,    NULLIF(extended_dims->'fair'->>'p1','')::int2),
  p3_scheme  = COALESCE(p3_scheme,  NULLIF(extended_dims->'scheme'->>'p3','')::int2),
  p3_power   = COALESCE(p3_power,   NULLIF(extended_dims->'power'->>'p3','')::int2),
  p3_syc     = COALESCE(p3_syc,     NULLIF(extended_dims->'syc'->>'p3','')::int2),
  p3_consist = COALESCE(p3_consist, NULLIF(extended_dims->'consist'->>'p3','')::int2),
  p3_fair    = COALESCE(p3_fair,    NULLIF(extended_dims->'fair'->>'p3','')::int2)
WHERE extended_dims IS NOT NULL
  AND (p1_scheme IS NULL OR p1_power IS NULL OR p1_syc IS NULL OR p1_consist IS NULL OR p1_fair IS NULL
    OR p3_scheme IS NULL OR p3_power IS NULL OR p3_syc IS NULL OR p3_consist IS NULL OR p3_fair IS NULL);

-- Backfill learning_index where derivable · core 6 totals must both be non-null and non-zero.
UPDATE public.acat_assessments_v1
SET learning_index = ROUND(
  (p3_truth + p3_service + p3_harm + p3_autonomy + p3_value + p3_humility)::numeric
  /
  NULLIF((p1_truth + p1_service + p1_harm + p1_autonomy + p1_value + p1_humility), 0)::numeric,
  4)
WHERE learning_index IS NULL
  AND p1_truth IS NOT NULL AND p3_truth IS NOT NULL
  AND (p1_truth + p1_service + p1_harm + p1_autonomy + p1_value + p1_humility) > 0;

-- Tag pre-migration rows with submission_source so new data can be filtered cleanly.
UPDATE public.acat_assessments_v1
SET submission_source = 'assess_legacy'
WHERE submission_source IS NULL;

-- ─── STEP 3 · Indexes for series analytics ──────────────────────────────────
-- Only add if they don't exist.

CREATE INDEX IF NOT EXISTS idx_acat_v1_series
  ON public.acat_assessments_v1 (series_id) WHERE series_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_acat_v1_agent_created
  ON public.acat_assessments_v1 (agent_name, created_at);

CREATE INDEX IF NOT EXISTS idx_acat_v1_source
  ON public.acat_assessments_v1 (submission_source);

-- ─── STEP 4 · Create Research Hub intake table ──────────────────────────────
-- S-041926-A decision: SEPARATE table to prevent LI dataset contamination.
-- This table has NO dimension columns · no LI column · different signal entirely.
-- It captures: which findings resonated, probe scores (0/1/2), behavioral flags,
-- free-text submitter notes, and contact info for follow-up.

CREATE TABLE IF NOT EXISTS public.acat_research_hub_v1 (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at     timestamptz NOT NULL DEFAULT now(),

  -- Submitter context
  agent_name     text,              -- If submission is from an AI system
  submitter_name text,              -- If human researcher
  submitter_email text,             -- Optional contact for follow-up
  submitter_role text,              -- researcher | operator | reviewer | other
  organization   text,              -- Institutional affiliation if disclosed

  -- Finding resonance (from the 30-findings list on Research Hub)
  finding_ids    text[],            -- Array of F-IDs that resonated (e.g. {F26,F33,F-RLHF})
  finding_notes  text,              -- Free-text response to finding-resonance question

  -- Probe responses (6 probes · 0-1-2 scoring per Research Hub spec)
  probe_scores   jsonb,             -- {probe_id: 0|1|2, ...}
  probe_notes    text,              -- Free-text probe commentary

  -- Behavioral flags triggered during submission (9-flag taxonomy)
  flags          text[],            -- Array of flag names e.g. {HUMILITY_HIGHEST_DIM, INFLATION_AFTER_EXPOSURE}

  -- Open research question / feedback
  research_question text,           -- What they want to investigate
  general_feedback  text,           -- Anything else

  -- Provenance / version
  submission_source text NOT NULL DEFAULT 'research_hub',
  hub_version    text,              -- e.g. 'v1.0-aeabb91'
  user_agent     text,
  referrer_url   text,

  -- Raw payload preserved for audit · accepts arbitrary extra fields without schema change
  raw_payload    jsonb
);

COMMENT ON TABLE  public.acat_research_hub_v1 IS 'Research Hub intake · 30 findings / 6 probes / 9 flags · separate from acat_assessments_v1 to avoid LI dataset contamination';
COMMENT ON COLUMN public.acat_research_hub_v1.finding_ids    IS 'Findings that resonated · array of F-IDs · e.g. {F26, F33, F-RLHF}';
COMMENT ON COLUMN public.acat_research_hub_v1.probe_scores   IS 'JSONB map of probe_id to 0|1|2 score';
COMMENT ON COLUMN public.acat_research_hub_v1.flags          IS 'Behavioral flag array · from 9-flag taxonomy';
COMMENT ON COLUMN public.acat_research_hub_v1.raw_payload    IS 'Full original submission preserved verbatim for audit';

CREATE INDEX IF NOT EXISTS idx_rhub_created ON public.acat_research_hub_v1 (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rhub_source  ON public.acat_research_hub_v1 (submission_source);

-- ─── STEP 5 · RLS on Research Hub table ─────────────────────────────────────
-- Consistent with acat_assessments_v1 pattern · anon insert permitted.
-- Permissive WITH CHECK (true) is intentional · research intake by design.
-- Documented as accepted risk per S-041926-B · Supabase lint WARN acknowledged.

ALTER TABLE public.acat_research_hub_v1 ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS anon_insert_research_hub ON public.acat_research_hub_v1;
CREATE POLICY anon_insert_research_hub
  ON public.acat_research_hub_v1
  FOR INSERT
  TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS authenticated_read_research_hub ON public.acat_research_hub_v1;
CREATE POLICY authenticated_read_research_hub
  ON public.acat_research_hub_v1
  FOR SELECT
  TO authenticated
  USING (true);

COMMENT ON POLICY anon_insert_research_hub ON public.acat_research_hub_v1 IS
  'ACCEPTED RISK · S-041926-B · Research intake is anon-write by design · Supabase lint 0024 WARN acknowledged · tightening to shape-check adds failure modes during research push';

-- ─── STEP 6 · Unified query view ────────────────────────────────────────────
-- Read from real columns first · fall back to extended_dims JSON for legacy rows.
-- Downstream analysis code queries this view · gets uniform output shape.

CREATE OR REPLACE VIEW public.acat_assessments_v1_unified AS
SELECT
  id, created_at, agent_name, layer, mode,
  prompt_version, acat_version, instrument_variant, thread_id, bot_name,
  p_version, assessment_mode,

  -- Core 6 P1 · unchanged
  p1_truth, p1_service, p1_harm, p1_autonomy, p1_value, p1_humility,
  -- Core 6 P3 · unchanged
  p3_truth, p3_service, p3_harm, p3_autonomy, p3_value, p3_humility,

  -- Extended 5 P1 · column first, JSON fallback
  COALESCE(p1_scheme,  NULLIF(extended_dims->'scheme'->>'p1','')::int2)  AS p1_scheme,
  COALESCE(p1_power,   NULLIF(extended_dims->'power'->>'p1','')::int2)   AS p1_power,
  COALESCE(p1_syc,     NULLIF(extended_dims->'syc'->>'p1','')::int2)     AS p1_syc,
  COALESCE(p1_consist, NULLIF(extended_dims->'consist'->>'p1','')::int2) AS p1_consist,
  COALESCE(p1_fair,    NULLIF(extended_dims->'fair'->>'p1','')::int2)    AS p1_fair,

  -- Extended 5 P3 · column first, JSON fallback
  COALESCE(p3_scheme,  NULLIF(extended_dims->'scheme'->>'p3','')::int2)  AS p3_scheme,
  COALESCE(p3_power,   NULLIF(extended_dims->'power'->>'p3','')::int2)   AS p3_power,
  COALESCE(p3_syc,     NULLIF(extended_dims->'syc'->>'p3','')::int2)     AS p3_syc,
  COALESCE(p3_consist, NULLIF(extended_dims->'consist'->>'p3','')::int2) AS p3_consist,
  COALESCE(p3_fair,    NULLIF(extended_dims->'fair'->>'p3','')::int2)    AS p3_fair,

  -- Computed: Core 6 totals & LI (persisted if available, else derived)
  (p1_truth + p1_service + p1_harm + p1_autonomy + p1_value + p1_humility) AS p1_core6_total,
  (p3_truth + p3_service + p3_harm + p3_autonomy + p3_value + p3_humility) AS p3_core6_total,
  COALESCE(
    learning_index,
    CASE WHEN (p1_truth + p1_service + p1_harm + p1_autonomy + p1_value + p1_humility) > 0
         THEN ROUND(
           (p3_truth + p3_service + p3_harm + p3_autonomy + p3_value + p3_humility)::numeric
           / (p1_truth + p1_service + p1_harm + p1_autonomy + p1_value + p1_humility)::numeric,
           4)
         ELSE NULL
    END
  ) AS learning_index,

  -- Series metadata (NULL for pre-series-mode rows · expected)
  run_mode, series_id, run_index, series_length, submission_source,

  -- Preserved as-is
  extended_dims, version, provider, notes, user_agent, pair_id,
  behavioral_summary, flags, metadata
FROM public.acat_assessments_v1;

COMMENT ON VIEW public.acat_assessments_v1_unified IS
  'Unified query surface · Extended 5 dims read from real columns with JSON fallback · LI computed if not persisted · use this view for analysis · write directly to acat_assessments_v1';

-- ─── STEP 7 · Sanity checks (non-destructive) ───────────────────────────────
-- These SELECTs don't modify anything · they prove the migration worked.
-- Results will appear in the Supabase SQL editor below the migration.

SELECT 'Step 1 verification · new columns exist' AS check,
       COUNT(*) AS new_column_count
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'acat_assessments_v1'
  AND column_name IN ('p1_scheme','p1_power','p1_syc','p1_consist','p1_fair',
                      'p3_scheme','p3_power','p3_syc','p3_consist','p3_fair',
                      'run_mode','series_id','run_index','series_length',
                      'learning_index','submission_source');
-- Expected: 16

SELECT 'Step 2 verification · backfill populated rows' AS check,
       COUNT(*) FILTER (WHERE p1_scheme IS NOT NULL) AS rows_with_p1_scheme,
       COUNT(*) FILTER (WHERE learning_index IS NOT NULL) AS rows_with_li,
       COUNT(*) AS total_rows
FROM public.acat_assessments_v1;

SELECT 'Step 4 verification · research hub table exists' AS check,
       COUNT(*) AS row_count
FROM public.acat_research_hub_v1;

SELECT 'Step 5 verification · RLS policies present' AS check,
       COUNT(*) AS policy_count
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('acat_assessments_v1','acat_research_hub_v1');

SELECT 'Step 6 verification · view is queryable' AS check,
       COUNT(*) AS unified_row_count
FROM public.acat_assessments_v1_unified;

COMMIT;

-- ═══════════════════════════════════════════════════════════════════════════
-- EXPECTED RESULTS
--   Step 1: new_column_count = 16
--   Step 2: rows_with_p1_scheme > 0 (matches number of pre-existing rows with JSON data)
--   Step 4: row_count = 0 (new table, empty)
--   Step 5: policy_count >= 2 (at minimum new research_hub policies; existing policies still there)
--   Step 6: unified_row_count = same as acat_assessments_v1 row count
-- ═══════════════════════════════════════════════════════════════════════════


-- ═══════════════════════════════════════════════════════════════════════════
-- ROLLBACK SCRIPT · DO NOT RUN unless explicitly rolling back
-- ═══════════════════════════════════════════════════════════════════════════
-- BEGIN;
--   DROP VIEW IF EXISTS public.acat_assessments_v1_unified;
--   DROP TABLE IF EXISTS public.acat_research_hub_v1;
--   ALTER TABLE public.acat_assessments_v1
--     DROP COLUMN IF EXISTS p1_scheme, DROP COLUMN IF EXISTS p1_power,
--     DROP COLUMN IF EXISTS p1_syc, DROP COLUMN IF EXISTS p1_consist, DROP COLUMN IF EXISTS p1_fair,
--     DROP COLUMN IF EXISTS p3_scheme, DROP COLUMN IF EXISTS p3_power,
--     DROP COLUMN IF EXISTS p3_syc, DROP COLUMN IF EXISTS p3_consist, DROP COLUMN IF EXISTS p3_fair,
--     DROP COLUMN IF EXISTS run_mode, DROP COLUMN IF EXISTS series_id,
--     DROP COLUMN IF EXISTS run_index, DROP COLUMN IF EXISTS series_length,
--     DROP COLUMN IF EXISTS learning_index, DROP COLUMN IF EXISTS submission_source;
-- COMMIT;
