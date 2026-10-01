# Contamination Review System - Quick Reference

## Trigger Workflow

### Manual (GitHub UI)
```
GitHub Actions → Contamination Review Pipeline → Run workflow
Input: submission_source = manual
```

### Command Line
```bash
gh workflow run contamination-review.yml -f submission_source=manual
./scripts/trigger-contamination-review.sh
```

### Repository Dispatch (Webhook)
```bash
curl -X POST https://api.github.com/repos/OWNER/REPO/dispatches \
  -H "Authorization: token TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -d '{"event_type":"data-submission","client_payload":{"submission_source":"api"}}'
```

## Log Entry Format

```
2026-09-28T10:30:45.123Z | 550e8400-e29b-41d4-a716-446655440000 | EXCLUDE | HIGH
```

## Database Queries

### Recent Review Runs
```sql
SELECT github_run_id, entries_processed, status, run_timestamp
FROM contamination_review_runs
ORDER BY run_timestamp DESC LIMIT 10;
```

### Flagged Assessments
```sql
SELECT acat_assessment_id, review_action, confidence_level, decision_rationale
FROM contamination_assessments
WHERE review_action IN ('FLAG_FOR_REVIEW', 'EXCLUDE')
ORDER BY reviewed_at DESC;
```

### Assessment History
```sql
SELECT reviewed_at, review_action, confidence_level
FROM contamination_assessments
WHERE acat_assessment_id = 'YOUR_UUID'
ORDER BY reviewed_at DESC;
```

## Files Reference

| File | Purpose | Used For |
|------|---------|----------|
| `.github/workflows/contamination-review.yml` | Main workflow | Automation |
| `lib/contamination-review.ts` | Integration library | Custom code |
| `scripts/trigger-contamination-review.sh` | Manual trigger | CLI operations |
| `logs/contamination_review_log.txt` | Immutable log | Audit trail |
| `schemas/contamination-review.schema.json` | Validation schema | Data validation |

## Environment Setup

```bash
# Set GitHub Secrets
gh secret set SUPABASE_URL --body "https://your-project.supabase.co"
gh secret set SUPABASE_ANON_KEY --body "your-key"
gh secret set SUPABASE_SERVICE_ROLE_KEY --body "your-key"

# Or set locally
export SUPABASE_URL=...
export SUPABASE_ANON_KEY=...
export SUPABASE_SERVICE_ROLE_KEY=...
```

## Quick Status Checks

```bash
# Check workflow status
gh run list -w contamination-review.yml

# View latest run
gh run view --latest -w contamination-review.yml

# Check database tables
# (via Supabase dashboard or psql)
SELECT COUNT(*) FROM contamination_assessments;
SELECT COUNT(*) FROM contamination_review_runs;

# View log entries
tail -20 logs/contamination_review_log.txt
git log -p logs/contamination_review_log.txt | head -50
```

## Actions & Confidence

| Action | Meaning |
|--------|---------|
| INCLUDE | No contamination, approved |
| FLAG_FOR_REVIEW | Needs human review |
| EXCLUDE | Contamination detected, rejected |
| REVERT | Undo previous decision |

| Confidence | Meaning |
|------------|---------|
| HIGH | Automated or obvious detection |
| MEDIUM | Pattern-based detection |
| LOW | Single signal detection |

## Troubleshooting

### Workflow not running?
1. Check GitHub Actions is enabled
2. Verify secrets are configured
3. Check repository is accessible
4. View workflow logs: `gh run view --log RUN_ID`

### No data in log?
1. Check assessments have contamination_action != 'INCLUDE'
2. Query Supabase directly
3. Check workflow logs for fetch errors
4. Verify database credentials

### Database won't update?
1. Verify SERVICE_ROLE_KEY has write permissions
2. Check table existence: `\d contamination_assessments`
3. Review Supabase activity logs
4. Check RLS policies are correct

## Integration Example

```typescript
import ContaminationReviewManager from './lib/contamination-review';

const manager = new ContaminationReviewManager(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Fetch contaminated assessments
const assessments = await manager.fetchContaminatedAssessments(100);

// Create log entries
const entries = manager.createLogEntries(assessments);
const formatted = manager.formatLogEntries(entries);

formatted.forEach(line => console.log(line));
```

## Documentation Map

- **Full System Guide:** `CONTAMINATION_REVIEW_SYSTEM.md`
- **Setup & Deploy:** `CONTAMINATION_REVIEW_SETUP.md`
- **Implementation:** `IMPLEMENTATION_SUMMARY.md`
- **Quick Ref:** This file
- **JSON Schema:** `schemas/contamination-review.schema.json`

## Support

1. Check documentation files
2. Review GitHub Actions logs
3. Query Supabase dashboard
4. Inspect Git log: `git log logs/contamination_review_log.txt`
5. Test database directly via Supabase SQL editor

---

**Last Updated:** 2026-09-28
