# Contamination Review System - Setup Guide

## Quick Start (5 minutes)

### Prerequisites
- GitHub repository access with secrets management
- Supabase project with proper credentials
- Node.js 18+ (for testing and integration)

### Step 1: Configure GitHub Secrets

Add these secrets to your GitHub repository (Settings > Secrets and variables > Actions):

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**How to find these:**
1. Go to Supabase dashboard
2. Navigate to Project Settings > API
3. Copy the URL
4. Copy `anon` public key for `SUPABASE_ANON_KEY`
5. Copy `service_role` secret key for `SUPABASE_SERVICE_ROLE_KEY`

### Step 2: Apply Database Migrations

Option A: Using Supabase CLI (recommended)
```bash
npm install -g @supabase/cli
supabase link --project-ref your-project-id
supabase migration up
```

Option B: Manual SQL (Supabase Dashboard)
1. Go to SQL Editor
2. Create new query
3. Copy content from:
   - `supabase/migrations/20260928_create_contamination_assessments.sql`
   - `supabase/migrations/20260928_create_contamination_review_runs.sql`
4. Run each SQL file

### Step 3: Trigger Initial Workflow

```bash
# Using GitHub CLI
gh workflow run contamination-review.yml -f submission_source=manual

# Or using the script
./scripts/trigger-contamination-review.sh
```

### Step 4: Verify Setup

Check GitHub Actions to confirm workflow ran successfully:
1. Go to Repository > Actions
2. Find "Contamination Review Pipeline"
3. Verify workflow completed (green checkmark)
4. Check logs for data processing confirmation

## Files Overview

### GitHub Actions Workflow
- **File:** `.github/workflows/contamination-review.yml`
- **Purpose:** Main pipeline that fetches contaminated assessments, logs them, and notifies database
- **Triggers:** Manual dispatch, repository dispatch (webhook), scheduled

### Database Migrations
- **Files:**
  - `supabase/migrations/20260928_create_contamination_assessments.sql`
  - `supabase/migrations/20260928_create_contamination_review_runs.sql`
- **Purpose:** Creates tables for assessment reviews and workflow tracking

### Append-Only Log
- **File:** `logs/contamination_review_log.txt`
- **Purpose:** Git-tracked immutable log with full audit trail
- **Format:** `timestamp | entity_id | action | confidence`

### Documentation
- **Main:** `CONTAMINATION_REVIEW_SYSTEM.md` - Comprehensive system documentation
- **Setup:** `CONTAMINATION_REVIEW_SETUP.md` - This file

### Integration Library
- **File:** `lib/contamination-review.ts`
- **Purpose:** TypeScript utilities for database and workflow operations
- **Usage:** Import in your projects for integration

### Examples
- **File:** `examples/contamination-review-integration.example.ts`
- **Purpose:** Code examples for n8n, Make.com, and custom integrations

### Helper Script
- **File:** `scripts/trigger-contamination-review.sh`
- **Purpose:** Bash script to manually trigger workflow
- **Usage:** `./scripts/trigger-contamination-review.sh [entity_id] [source]`

## Integration Guide

### Integrating with n8n

1. **Create a Webhook Receiver:**
   - New workflow > HTTP Request trigger
   - Set method to POST
   - Copy webhook URL

2. **Add Code Block:**
   ```javascript
   // Transform incoming data to GitHub dispatch format
   return {
     event_type: 'data-submission',
     client_payload: {
       submission_source: 'n8n',
       batch_size: data.items.length
     }
   };
   ```

3. **Send to GitHub:**
   - HTTP Request node (POST)
   - URL: `https://api.github.com/repos/OWNER/lasting-light-ai/dispatches`
   - Headers: `Authorization: token YOUR_GITHUB_TOKEN`
   - Body: Transformed data from step 2

### Integrating with Make.com

1. **Create Webhook URL:**
   - Make.com > Custom webhook module
   - Create new webhook and get URL

2. **Configure GitHub Trigger:**
   - New scenario
   - Repository dispatch trigger
   - Authenticate with GitHub
   - Select repository

3. **Parse and Transform:**
   - Map incoming fields to GitHub payload
   - Set submission_source based on triggering scenario

### Programmatic Integration

```typescript
import ContaminationReviewManager from './lib/contamination-review';

const manager = new ContaminationReviewManager(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Trigger workflow
await manager.triggerWorkflow(
  process.env.GITHUB_TOKEN,
  'owner',
  'lasting-light-ai',
  undefined,
  'api'
);

// Or fetch and process locally
const assessments = await manager.fetchContaminatedAssessments(100);
const entries = manager.createLogEntries(assessments);
const formatted = manager.formatLogEntries(entries);
```

## Database Queries

### View Recent Review Runs
```sql
SELECT 
  github_run_id,
  submission_source,
  entries_processed,
  status,
  run_timestamp
FROM contamination_review_runs
ORDER BY run_timestamp DESC
LIMIT 10;
```

### View Flagged Assessments
```sql
SELECT 
  ca.acat_assessment_id,
  ca.review_action,
  ca.confidence_level,
  ca.detected_flags,
  ca.decision_rationale
FROM contamination_assessments ca
WHERE ca.review_action IN ('FLAG_FOR_REVIEW', 'EXCLUDE')
ORDER BY ca.reviewed_at DESC;
```

### Audit Trail for Single Assessment
```sql
SELECT 
  ca.reviewed_at,
  ca.review_action,
  ca.confidence_level,
  ca.github_run_id,
  ca.reviewer_notes
FROM contamination_assessments ca
WHERE ca.acat_assessment_id = 'your-uuid'
ORDER BY ca.reviewed_at DESC;
```

## Monitoring & Troubleshooting

### Check Workflow Status
```bash
# List recent workflow runs
gh run list -w contamination-review.yml

# View specific run details
gh run view RUN_ID

# View logs
gh run view RUN_ID --log
```

### Verify Database Tables
```sql
-- Check contamination_assessments table
SELECT COUNT(*) FROM contamination_assessments;

-- Check contamination_review_runs table
SELECT COUNT(*) FROM contamination_review_runs;

-- View table schema
\d contamination_assessments
\d contamination_review_runs
```

### Check Log File
```bash
# View recent log entries
tail -20 logs/contamination_review_log.txt

# Count entries
grep -c '|' logs/contamination_review_log.txt

# View git history
git log --oneline logs/contamination_review_log.txt
```

## Common Issues & Solutions

### Issue: "No contamination data to process"
**Cause:** No assessments with contamination flags found
**Solution:**
1. Check if any assessments have `contamination_action != 'INCLUDE'`
2. Verify data was properly flagged during submission
3. Check Supabase database directly:
   ```sql
   SELECT COUNT(*) FROM acat_assessments_v1 
   WHERE contamination_action != 'INCLUDE';
   ```

### Issue: Workflow fails to authenticate with Supabase
**Cause:** Invalid or missing secrets
**Solution:**
1. Verify secrets are set correctly in GitHub
2. Test credentials locally:
   ```bash
   SUPABASE_URL=... SUPABASE_ANON_KEY=... npm test
   ```
3. Check Supabase API is accessible from GitHub runners

### Issue: Git commit fails in workflow
**Cause:** Missing git configuration or branch protection
**Solution:**
1. Ensure bot user is configured (done in workflow)
2. Check branch protection rules don't prevent force-push
3. Verify GitHub token has repo scope

### Issue: Log file not appearing in Git
**Cause:** .gitignore excludes logs directory
**Solution:**
1. Check `.gitignore` doesn't exclude `logs/`
2. Ensure `logs/contamination_review_log.txt` is tracked:
   ```bash
   git add -f logs/contamination_review_log.txt
   ```

## Performance Considerations

### Large Batch Processing
For batches > 1000 assessments:
- Use `limit` parameter in fetch queries
- Process in smaller chunks (100-500 entries)
- Set appropriate timeouts (default: 360 seconds)

### Database Optimization
The migration includes indexes on:
- `review_action` - Fast filtering by decision type
- `confidence_level` - Fast filtering by certainty
- `reviewed_at` - Fast ordering by timestamp
- `github_run_id` - Linking workflow runs to assessments
- `detected_flags` - GIN index for JSON queries

### Log File Size
- Each entry ~80-120 bytes
- Append-only approach: ~8 KB per 100 entries
- Git history may grow; periodic archival recommended

## Maintenance

### Periodic Cleanup
```sql
-- Archive old review runs (older than 90 days)
DELETE FROM contamination_review_runs
WHERE run_timestamp < NOW() - INTERVAL '90 days'
AND status = 'completed';
```

### Log Rotation
```bash
# Create archive of current log (if too large)
cp logs/contamination_review_log.txt logs/contamination_review_log.archive.$(date +%Y%m%d).txt

# Start fresh log
> logs/contamination_review_log.txt
```

### Monitoring Disk Usage
```sql
-- Size of contamination tables
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE tablename IN ('contamination_assessments', 'contamination_review_runs')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## Next Steps

1. **Deploy to Production:**
   - Apply all migrations to production database
   - Set production GitHub secrets
   - Run initial workflow to verify setup

2. **Integrate with Data Pipeline:**
   - Connect n8n/Make.com webhooks
   - Add submission source labeling
   - Configure automated alerts

3. **Set Up Monitoring:**
   - Configure GitHub Actions notifications
   - Set up Supabase alerts
   - Create dashboards for metrics

4. **Test Coverage:**
   - Run workflow tests locally
   - Verify log file git commits
   - Test Supabase read/write permissions

## Support & Documentation

- **Main Documentation:** `CONTAMINATION_REVIEW_SYSTEM.md`
- **GitHub Actions:** `.github/workflows/contamination-review.yml`
- **Database Schema:** `supabase/migrations/`
- **Integration Examples:** `examples/contamination-review-integration.example.ts`
- **TypeScript Library:** `lib/contamination-review.ts`

For issues, check:
1. GitHub Actions workflow logs
2. Supabase dashboard (API logs, table inspector)
3. Git log for file changes
4. Database error logs in Supabase
