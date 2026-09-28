# OSF Pre-Registration Workflow Guide

## Overview

This guide covers the automated OSF pre-registration workflow that manages the registration of Phase 2 behavioral integrity study protocol.

**Deadline:** October 1, 2026

**Reference Protocol:** [PROTOCOL_PHASE2_PREREGISTRATION.md](../PROTOCOL_PHASE2_PREREGISTRATION.md)

## Quick Start

### Phase 1: Test the Integration (Manual)

1. Go to **Actions** tab
2. Select **"OSF Pre-Registration Test (Draft Creation Only)"**
3. Click **"Run workflow"** 
4. Confirm protocol validation passes ✅

### Phase 2: Create Draft Registration (Automatic)

1. Create a PR updating `PROTOCOL_PHASE2_PREREGISTRATION.md`
2. The `osf-preregistration.yml` workflow automatically:
   - Reads the protocol file
   - Validates protocol format
   - Submits to OSF to create draft registration
   - Posts status to PR comments
   - Awaits approval

### Phase 3: Publish Registration (Manual Approval)

1. Review the draft registration on OSF
2. In GitHub, approve via the **osf-publish** environment
3. The `osf-publish-registration.yml` workflow:
   - Publishes registration to OSF
   - Generates DOI
   - Creates PREREGISTRATION_DOI.md
   - Commits DOI to main branch

## Detailed Workflow Descriptions

### 1. OSF Pre-Registration Workflow (`osf-preregistration.yml`)

**Trigger:** PR to `main` branch with changes to `PROTOCOL_PHASE2_PREREGISTRATION.md`

**What It Does:**

1. **Reads Protocol**
   - Loads full text of PROTOCOL_PHASE2_PREREGISTRATION.md
   - Escapes for JSON payload

2. **Validates Protocol**
   - Checks for required sections:
     - Research Question & Hypotheses
     - Sample Definition & Eligibility
     - Data Collection Procedures
     - Primary Analysis Plan
     - Statistical test
   - Fails if any section missing

3. **Submits to OSF**
   - Calls Supabase Edge Function: `osf-submit-registration`
   - Sends protocol as draft registration
   - Receives draft registration ID and URL

4. **Comments on PR**
   - Posts registration status
   - Shows registration ID and URL
   - Outlines next steps

5. **Requires Approval**
   - Workflow awaits approval via GitHub environment
   - Posts approval instructions

**Outputs:**
- `registration_id`: OSF registration identifier
- `registration_url`: Link to OSF registration
- `submission_status`: "success" or "failed"

**Environment Variables:**
- `SUPABASE_URL`: https://ksinisdzgtnqzsymhfya.supabase.co
- `OSF_SUBMIT_ENDPOINT`: /functions/v1/osf-submit-registration

**Secrets Required:**
- `OSF_SUBMIT_TOKEN`: Bearer token for OSF API (Supabase function)

### 2. OSF Publish Registration Workflow (`osf-publish-registration.yml`)

**Trigger:** Manual workflow dispatch (via approval gate)

**What It Does:**

1. **Validates Inputs**
   - Checks registration ID is valid (not "draft")
   - Exits if validation fails

2. **Publishes to OSF**
   - Calls Supabase Edge Function: `osf-publish-registration`
   - Converts draft to published registration
   - OSF generates DOI automatically

3. **Creates DOI Documentation**
   - Generates PREREGISTRATION_DOI.md
   - Includes citation formats
   - Links to protocol and OSF registration

4. **Commits to Repository**
   - Uses `EndBug/add-and-commit@v9` action
   - Commits PREREGISTRATION_DOI.md to main
   - Sets author as "OSF Pre-Registration Bot"

5. **Notifies Team**
   - Posts success message with DOI
   - Provides next steps and timeline

**Inputs:**
- `registration_id` (required): OSF registration ID from draft
- `pr_number` (optional): PR number for reference
- `doi` (optional): Pre-provided DOI (if available)

**Outputs:**
- `doi`: DOI assigned by OSF (format: 10.17605/OSF.IO/XXXXX)
- `registration_url`: Permanent OSF registration URL

**Environment:**
- `osf-publish`: Requires manual approval before execution

**Secrets Required:**
- `OSF_SUBMIT_TOKEN`: Bearer token for OSF API

### 3. OSF Test Workflow (`osf-preregistration-test.yml`)

**Trigger:** Manual workflow dispatch (Actions tab)

**What It Does:**

1. **Validates Protocol File**
   - Checks file exists
   - Verifies all required sections present
   - Checks metadata (version, status, lock status)

2. **Simulates Draft Creation**
   - Generates mock registration ID
   - Displays what would happen
   - Does NOT submit to OSF

3. **Generates Test Report**
   - Lists all validation checks
   - Shows configuration requirements
   - Outlines setup steps

**Purpose:** Verify integration works before production use

**Options:**
- `test_mode`: 
  - `true` (default): Dry-run, no OSF submission
  - `false`: Not available (use production workflow instead)

## Setup Instructions

### Step 1: Generate OSF API Token

1. Go to OSF: https://osf.io/ (log in)
2. Settings → OAuth Applications
3. Create new application:
   - Name: "Lasting Light AI Pre-Registration"
   - Redirect URL: https://github.com/humanaios-ui/lasting-light-ai
   - Scope: `osf.admin`
4. Copy **Client ID** and **Client Secret**
5. In Supabase:
   - Settings → Secrets → Create Secret
   - Name: `OSF_CLIENT_SECRET`
   - Value: [paste Client Secret]

### Step 2: Deploy Supabase Edge Functions

The following functions must be deployed to your Supabase project:
- `osf-oauth-callback` - Handles OAuth flow
- `osf-submit-registration` - Creates draft registration
- `osf-publish-registration` - Publishes registration and generates DOI

See [supabase/functions/README_OSF.md](../supabase/functions/README_OSF.md) for deployment details.

### Step 3: Add GitHub Secret

1. GitHub Repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `OSF_SUBMIT_TOKEN`
4. Value: [Supabase Edge Function bearer token or OSF API token]
5. Click "Add secret"

### Step 4: Create GitHub Environment

1. GitHub Repository → Settings → Environments
2. Click "New environment"
3. Name: `osf-publish`
4. Add deployment protection rules:
   - Require manual approval before deploying to this environment
   - Approvers: [select maintainers]
   - (Optional) Timeout: 72 hours
5. Click "Configure protection rules"

**Note:** This environment is where approval happens. Only maintainers should be approvers.

### Step 5: Verify Protocol File

Ensure `PROTOCOL_PHASE2_PREREGISTRATION.md` contains all required sections:
- Phase 2 Pre-Registration Protocol (header)
- Research Question & Hypotheses
- Sample Definition & Eligibility
- Data Collection Procedures
- Primary Analysis Plan
- Secondary Analysis Plan
- Exclusion & Specification Decisions
- Software & Reproducibility
- Version Control & Change Log
- Conflicts of Interest & Funding
- References & External Standards
- Approval & Sign-Off

## Usage Workflow

### Creating Pre-Registration

```
1. Create feature branch
   git checkout -b chore/osf-preregistration

2. Make any final updates to PROTOCOL_PHASE2_PREREGISTRATION.md
   (ensure all required sections are present)

3. Commit changes
   git add PROTOCOL_PHASE2_PREREGISTRATION.md
   git commit -m "chore: finalize phase 2 protocol for OSF registration"

4. Push branch and create PR to main
   git push origin chore/osf-preregistration

5. GitHub automatically triggers osf-preregistration.yml
   → Watch Actions tab for workflow status
   → Workflow will comment on PR with registration details
   → Registration ID will be shown in PR comments
```

### Approving Publication

```
1. Review the draft registration on OSF
   - Click URL posted in PR comment
   - Verify protocol text matches
   - Check all fields are correct

2. Approve via GitHub environment
   - Go to Actions tab
   - Select most recent "OSF Pre-Registration Workflow" run
   - Scroll to "Deployments" section
   - Review deployment (osf-publish environment)
   - Click "Approve and deploy"
   
   OR via workflow dispatch:
   - Actions → "OSF Publish Registration (Manual Approval)"
   - Click "Run workflow"
   - Enter registration ID (from PR comment)
   - Click "Run workflow"

3. Monitor publication workflow
   - osf-publish-registration.yml executes
   - Waits for approval (if set)
   - Publishes to OSF
   - Generates DOI
   - Commits PREREGISTRATION_DOI.md to main
   - PR will be merged once publication completes

4. Verify publication
   - Check OSF registration is public
   - DOI appears in PREREGISTRATION_DOI.md
   - GitHub commit includes DOI details
```

## Troubleshooting

### Test Workflow Fails

**Problem:** "Protocol file not found"
- **Solution:** Ensure file is at repository root: `PROTOCOL_PHASE2_PREREGISTRATION.md`

**Problem:** "Missing required sections"
- **Solution:** 
  1. Open `PROTOCOL_PHASE2_PREREGISTRATION.md`
  2. Search for missing section name
  3. Add missing section to protocol
  4. Re-run workflow

### Draft Creation Fails

**Problem:** "OSF submission experienced an issue"
- **Solution:**
  1. Verify `OSF_SUBMIT_TOKEN` is set in GitHub secrets
  2. Confirm Supabase Edge Functions are deployed
  3. Check Supabase function logs for errors
  4. Verify network access to OSF API

**Problem:** "Unauthorized" or "403"
- **Solution:**
  1. Regenerate OSF API token
  2. Update `OSF_SUBMIT_TOKEN` secret in GitHub
  3. Re-run workflow

### Publication Fails

**Problem:** "Valid registration ID required"
- **Solution:** Use registration ID from PR comment (starts with "abc123" or similar, not "draft")

**Problem:** "DOI generation failed"
- **Solution:**
  1. Check OSF status: https://status.osf.io/
  2. Manually publish on OSF and update DOI file
  3. Commit PREREGISTRATION_DOI.md with manual DOI

### Approval Gate Not Working

**Problem:** "Approval button not available"
- **Solution:**
  1. Check GitHub environment exists: Settings → Environments → osf-publish
  2. Verify you're an approver (Settings → Environments → osf-publish → Approvers)
  3. Refresh page
  4. Use workflow dispatch instead: Actions → "OSF Publish Registration (Manual Approval)"

## Timeline & Milestones

| Date | Milestone | Status |
|------|-----------|--------|
| 2026-09-28 | Workflows created | ✅ Complete |
| 2026-09-28 | Setup instructions | ✅ Complete |
| 2026-09-28 | Test workflow | ✅ Ready |
| 2026-10-01 | **DEADLINE** | ⏰ OSF registration must be published |
| 2026-12-31 | Data collection ends | - |
| 2027-01-01 | Analysis lockdown | - |

**URGENT:** Registration must be published by **2026-10-01**.

## Key Files

| File | Purpose |
|------|---------|
| `PROTOCOL_PHASE2_PREREGISTRATION.md` | Pre-registration protocol (immutable after submission) |
| `PREREGISTRATION_DOI.md` | DOI and citation information (created after publication) |
| `.github/workflows/osf-preregistration.yml` | Draft creation workflow |
| `.github/workflows/osf-publish-registration.yml` | Publication and approval workflow |
| `.github/workflows/osf-preregistration-test.yml` | Test/validation workflow |
| `supabase/functions/osf-oauth-callback` | OAuth callback handler |
| `supabase/functions/osf-submit-registration` | Draft submission function |
| `supabase/functions/osf-publish-registration` | Publication function |

## Security Notes

⚠️ **CRITICAL:**

1. **Never commit OSF tokens** to repository
2. **Store tokens only in:**
   - GitHub Actions secrets (OSF_SUBMIT_TOKEN)
   - Supabase secrets (OSF_CLIENT_SECRET)
3. **Approval gate required** before publication
4. **Only maintainers** should be approvers

## Support

- **OSF API Docs:** https://developer.osf.io/
- **GitHub Actions Docs:** https://docs.github.com/en/actions
- **Supabase Docs:** https://supabase.com/docs
- **Protocol Reference:** [PROTOCOL_PHASE2_PREREGISTRATION.md](../PROTOCOL_PHASE2_PREREGISTRATION.md)

## FAQ

**Q: Can I test without submitting to OSF?**
A: Yes! Run "OSF Pre-Registration Test" workflow from Actions tab. It validates everything without OSF submission.

**Q: What happens if I approve publication by mistake?**
A: Once published, OSF registration is immutable. You must file a formal amendment on OSF if changes are needed.

**Q: When is the deadline?**
A: October 1, 2026. Registration must be published by then to meet compliance requirements.

**Q: Can I update the protocol after registration?**
A: Only with formal amendment filed on OSF. Unregistered changes must be clearly labeled as exploratory in publications.

**Q: What if the workflow fails?**
A: Check the workflow logs, troubleshooting section above, and re-run. Manual fallback available - contact team for assistance.

---

**Last Updated:** 2026-09-28  
**Status:** Ready for use (deadline: 2026-10-01)
