# Contamination Review System

## Overview

The Contamination Review System is a hybrid GitHub Actions + Supabase approach for detecting, tracking, and managing data contamination in ACAT assessments. It provides an immutable audit trail and real-time UI feedback.

## Architecture

### Components

1. **GitHub Actions Workflow** (`contamination-review.yml`)
   - Triggered on data submissions
   - Reads contamination flags from AcatTool submissions
   - Appends to append-only log file
   - Notifies Supabase database

2. **Database Tables**
   - `contamination_assessments` - Detailed contamination review decisions
   - `contamination_review_runs` - Workflow execution audit log
   - `acat_assessments_v1` - Existing assessments table (enhanced with contamination columns)

3. **Immutable Log**
   - `logs/contamination_review_log.txt` - Git-tracked append-only log
   - Format: `timestamp | entity_id | action | confidence`
   - Provides audit trail and versioning via Git history

## Workflow Triggers

The contamination review pipeline can be triggered via:

### 1. Manual Trigger (UI)
```
GitHub Actions > Workflows > Contamination Review Pipeline > Run workflow
```

Inputs:
- `entity_id` (optional) - Specific assessment ID to review
- `submission_source` - Source of submission (manual, api, batch)

### 2. Repository Dispatch (API)
```bash
curl -X POST https://api.github.com/repos/YOUR_OWNER/lasting-light-ai/dispatches \
  -H "Authorization: token YOUR_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -d '{
    "event_type": "data-submission",
    "client_payload": {
      "entity_id": "uuid-here",
      "submission_source": "api"
    }
  }'
```

### 3. Programmatic (n8n/Make.com)
Add webhook integration to existing orchestration to trigger repository dispatch events.

## Log Entry Format

```
2026-09-28T10:30:45.123Z | 550e8400-e29b-41d4-a716-446655440000 | EXCLUDE | HIGH
```

Fields:
- **timestamp** - ISO 8601 timestamp (UTC)
- **entity_id** - UUID of the assessment being reviewed
- **action** - One of:
  - `INCLUDE` - No contamination detected
  - `FLAG_FOR_REVIEW` - Requires human review
  - `EXCLUDE` - High-confidence contamination (rejected)
  - `REVERT` - Revert a previous decision
- **confidence** - Confidence level:
  - `HIGH` - Automated or obvious contamination
  - `MEDIUM` - Pattern-based detection
  - `LOW` - Single signal detection

## Database Schema

### contamination_assessments Table

Tracks detailed review decisions with full audit trail.

| Column | Type | Purpose |
|--------|------|---------|
| id | UUID | Primary key |
| acat_assessment_id | UUID | FK to acat_assessments_v1 |
| detected_flags | JSONB | Array of contamination flags |
| review_action | TEXT | INCLUDE\|FLAG_FOR_REVIEW\|EXCLUDE\|REVERT |
| confidence_level | TEXT | HIGH\|MEDIUM\|LOW |
| decision_rationale | TEXT | Explanation of decision |
| reviewer_notes | JSONB | Structured reviewer feedback |
| github_run_id | BIGINT | GitHub Actions run ID |
| reviewed_at | TIMESTAMP | When review occurred |
| reviewed_by | TEXT | Who/what reviewed (system, email) |

### contamination_review_runs Table

Tracks workflow execution history for audit logging.

| Column | Type | Purpose |
|--------|------|---------|
| id | UUID | Primary key |
| github_run_id | BIGINT | Unique GitHub Actions run ID |
| github_actor | TEXT | User who triggered workflow |
| submission_source | TEXT | manual\|api\|batch\|webhook |
| entries_processed | INTEGER | Count of records reviewed |
| status | TEXT | pending\|in_progress\|completed\|failed |
| run_timestamp | TIMESTAMP | When workflow executed |

## Environment Variables & Secrets

Required GitHub Secrets:

| Secret | Purpose |
|--------|---------|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anon key (read access) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (write access) |

## Workflow Steps

1. **Checkout Repository** - Clone the codebase
2. **Fetch Contamination Data** - Query Supabase for flagged assessments
3. **Process Contamination** - Format and categorize results
4. **Append to Log** - Add entries to Git-tracked immutable log
5. **Commit and Push** - Version the log in Git
6. **Notify Database** - Insert review run record for real-time UI feedback
7. **Generate Summary** - Create GitHub Actions summary report

## Contamination Detection Flags

Flagged contamination types (stored in `contamination_flags` JSONB array):

- `ZERO_VARIANCE_P1` - Perturbation 1 shows no variance
- `IDENTICAL_P1_P3` - Perturbation 1 and 3 responses are identical
- `HIGH_CORRELATION_RESPONSES` - Unusually high correlation between response dimensions
- `DUPLICATE_SUBMISSION` - Submission appears to be duplicate
- `EXCLUDED_DATA_REUSE` - Uses data marked as excluded
- `INVALID_TIMESTAMPS` - Timestamp anomalies detected
- `PATTERN_MATCH_KNOWN_CONTAMINATION` - Matches known contamination patterns

## Real-Time UI Integration

The `contamination_review_runs` table enables real-time UI updates:

```sql
-- UI can subscribe to new runs
SELECT * FROM contamination_review_runs 
WHERE status IN ('in_progress', 'completed')
ORDER BY run_timestamp DESC
LIMIT 10;

-- Track processing progress
SELECT 
  github_run_id,
  entries_processed,
  entries_excluded,
  entries_flagged,
  status
FROM contamination_review_runs
WHERE github_run_id = $1;
```

## Immutability & Auditability

### Git-Tracked Log File
- All entries are append-only
- Git history provides full audit trail
- Cannot be modified retroactively (Git integrity)
- Each log update creates a commit with metadata

### Database Audit Trail
- `created_at` timestamps are immutable
- All reviews linked to GitHub Actions run IDs
- Complete chain of custody maintained
- Row-level security controls access

## Example: Processing a Submission

1. **Submission Arrives**
   - Data submission event triggers workflow
   - Supabase flags contamination in `acat_assessments_v1`

2. **Workflow Executes**
   - Queries for all flagged assessments
   - Processes results into standardized format
   - Appends to `logs/contamination_review_log.txt`
   - Commits to Git with run metadata
   - Inserts run record to `contamination_review_runs`
   - Inserts detailed reviews to `contamination_assessments`

3. **UI Updates**
   - Realtime Supabase subscription triggers
   - UI shows new review run status
   - Details populate from `contamination_assessments`
   - Log entries queryable via Git

4. **Manual Review (Optional)**
   - Human reviewer opens UI
   - Reviews entries flagged for human decision
   - Updates `contamination_assessments.reviewer_notes`
   - Changes final action if needed

## Querying the System

### Get All Contaminated Assessments
```sql
SELECT * FROM contamination_assessments 
WHERE review_action IN ('EXCLUDE', 'FLAG_FOR_REVIEW')
ORDER BY reviewed_at DESC;
```

### View Workflow Execution History
```sql
SELECT github_run_id, entries_processed, status, run_timestamp
FROM contamination_review_runs
ORDER BY run_timestamp DESC
LIMIT 10;
```

### Audit Trail by Assessment
```sql
SELECT 
  ca.acat_assessment_id,
  ca.review_action,
  ca.confidence_level,
  ca.github_run_id,
  ca.reviewed_at
FROM contamination_assessments ca
WHERE ca.acat_assessment_id = 'YOUR_ID'
ORDER BY ca.reviewed_at DESC;
```

### Access Git Log
```bash
git log --follow -p logs/contamination_review_log.txt
```

## Deployment

### 1. Apply Migrations
```bash
# Using Supabase CLI
supabase migration up

# Or via Supabase dashboard
# Upload SQL files to migrations
```

### 2. Configure GitHub Secrets
```bash
gh secret set SUPABASE_URL --body "https://your-project.supabase.co"
gh secret set SUPABASE_ANON_KEY --body "your-anon-key"
gh secret set SUPABASE_SERVICE_ROLE_KEY --body "your-service-role-key"
```

### 3. Trigger Initial Workflow
```bash
gh workflow run contamination-review.yml -f submission_source=manual
```

## Monitoring & Alerts

Monitor workflow execution via:
- GitHub Actions dashboard
- Supabase dashboard (contamination tables)
- Git log for log file changes
- Database queries for review statistics

## Troubleshooting

### Workflow Fails to Fetch Data
- Verify Supabase credentials in secrets
- Check Supabase API availability
- Ensure network connectivity

### Log File Not Updating
- Verify Git permissions
- Check GitHub Actions logs for commit errors
- Ensure logs directory exists

### Database Inserts Failing
- Verify SERVICE_ROLE_KEY has write permissions
- Check table existence with RLS policies
- Review Supabase activity logs

## Future Enhancements

1. **Automated Reprocessing** - Periodic re-review of flagged assessments
2. **ML-Based Confidence** - Machine learning model for contamination probability
3. **Batch Processing** - Efficient handling of large submission batches
4. **Alert System** - Email/Slack notifications for high-confidence contamination
5. **Dashboard** - Real-time metrics and trend analysis
6. **API Endpoints** - Public API for submission integration

## Support

For questions or issues:
1. Check GitHub Actions logs
2. Review Supabase dashboard
3. Inspect contamination_review_log.txt in Git history
4. Query database tables directly
