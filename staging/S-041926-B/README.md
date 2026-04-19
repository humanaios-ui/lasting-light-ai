# Staging · S-041926-B

**Date:** April 19, 2026 · OR&D Day 40
**Pattern:** Single-repo staging branch (alongside main)
**Gate:** 1 (April 21 · 2 days)

## What's on this branch vs main

- **`public/assess.html`** — REPLACED with v1.1 (schema-harmonized, paste-parser workflow, 6-run sequential default)
- **`staging/S-041926-B/supabase_migration_S-041926-B.sql`** — reference copy of the migration that was run separately in the Supabase SQL editor
- **`staging/S-041926-B/README.md`** — this file

## What changed in assess.html v1.1

- Paste-response workflow eliminates manual score transcription
- Sequential mode default (3 prompts per run) — higher research fidelity than unified
- 6-run series with deterministic perturbation balance (P1,P2,P3,P1,P2,P3)
- Perturbation locked at Copy Prompt time (fixes silent mismatch bug in prior versions)
- Payload field names match live Supabase schema exactly (`p1_truth` not `truth`, etc.)
- Extended 5 dims land in real columns (after migration S-041926-B was executed)
- `flags` sent as JSON array (matches live row format)
- `submission_source='assess'` tag distinguishes new rows from research_hub and legacy

## What changed in Supabase (separate migration, already run)

- 10 new columns on `acat_assessments_v1` for Extended 5 × P1/P3
- 6 metadata columns: `run_mode`, `series_id`, `run_index`, `series_length`, `learning_index`, `submission_source`
- Backfill populated Extended 5 columns from `extended_dims` JSON for existing rows
- New table `acat_research_hub_v1` for Research Hub intake (separate from LI dataset)
- Unified view `acat_assessments_v1_unified` — column-first with JSON fallback
- All additive — no existing columns dropped or type-changed

## Test before merging

1. Visit the staging-branch raw URL (printed by deploy script)
2. Run ONE assessment end-to-end through the paste-parser flow
3. Verify the row appears in Supabase `acat_assessments_v1` with:
   - `p1_scheme`, `p1_power`, etc. populated (not just in `extended_dims` JSON)
   - `submission_source = 'assess'`
   - `series_id` and `run_index` populated
   - `flags` as JSON array

## Merge to main (after Gate 1 reviewer sign-off)

```bash
cd ~/Desktop/Lasting-light-ai
git checkout main
git pull origin main
git merge --no-ff staging/S-041926-B -m "merge: S-041926-B · assess v1.1 · 11-D schema harmonization"
git push origin main
```

## Rollback (if needed after merge)

```bash
cd ~/Desktop/Lasting-light-ai
git revert <merge-commit-sha>  # reverts the merge cleanly
git push origin main
```

The SQL migration rollback block is commented at the bottom of the SQL file — do not run unless explicitly undoing the schema change.

## Parent lineage

- Parent session: S-041926-A (Research Hub rebuild · Supabase wiring deferred)
- This session:   S-041926-B (schema harmonization · assess.html v1.1 · staging deploy)
- Next gate:      Gate 1 · April 21 · 2 days
