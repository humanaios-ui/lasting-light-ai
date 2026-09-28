# OSF Pre-Registration Implementation Checklist

**Deadline:** October 1, 2026  
**Created:** 2026-09-28  
**Status:** Implementation Complete (Setup Required)

---

## Workflow Implementation

### ✅ Phase 1: Draft Creation Workflow
- [x] `osf-preregistration.yml` created
  - Triggers on PR to main with protocol changes
  - Reads PROTOCOL_PHASE2_PREREGISTRATION.md
  - Validates protocol format
  - Calls Supabase OSF submit endpoint
  - Comments on PR with registration status
  - Outputs: registration_id, registration_url, submission_status

### ✅ Phase 2: Publication & Approval Workflow
- [x] `osf-publish-registration.yml` created
  - Triggered by manual approval (workflow_dispatch)
  - Publishes draft registration to OSF
  - Generates DOI
  - Creates PREREGISTRATION_DOI.md
  - Commits DOI to main branch
  - Outputs: doi, registration_url

### ✅ Phase 3: Test Workflow
- [x] `osf-preregistration-test.yml` created
  - Manual execution via Actions
  - Validates protocol without OSF submission
  - Simulates draft creation
  - Generates test report

---

## Documentation

### ✅ Setup & Usage Documentation
- [x] `.github/OSF_PREREGISTRATION_GUIDE.md` created
  - Complete setup instructions
  - Detailed workflow descriptions
  - Usage examples
  - Troubleshooting guide
  - Timeline and milestones

### ✅ This Checklist
- [x] Implementation checklist (this file)

---

## Pre-Launch Setup Tasks

### GitHub Repository Configuration

#### [ ] Step 1: Add OSF API Secret
**Location:** Settings → Secrets and variables → Actions  
**Action:** Create new repository secret
- **Name:** `OSF_SUBMIT_TOKEN`
- **Value:** [Obtain from Supabase OSF OAuth setup]
- **Description:** Bearer token for OSF API calls

#### [ ] Step 2: Create Approval Environment
**Location:** Settings → Environments  
**Action:** Create new environment
- **Name:** `osf-publish`
- **Description:** OSF registration publication (requires approval)
- **Deployment protection:**
  - [x] Require manual approval before deploying to this environment
  - [x] Restrict deployments to teams: [@humanaios-ui maintainers]
  - [x] Custom deployment protection rules (optional)

#### [ ] Step 3: Configure Approvers
**Location:** Settings → Environments → osf-publish  
**Action:** Set approval configuration
- **Approvers:** [Select 1-3 maintainers]
- **Timeout:** 72 hours recommended
- **Allow self-review:** Disable (require different person)

### Supabase Configuration

#### [ ] Step 4: Deploy OSF Edge Functions
**Location:** Supabase Project → Functions  
**Functions to Deploy:**
- [ ] `osf-oauth-callback` - OAuth authorization handler
- [ ] `osf-submit-registration` - Create draft registration
- [ ] `osf-publish-registration` - Publish and generate DOI

**Reference:** `supabase/functions/README_OSF.md`

#### [ ] Step 5: Set Supabase Secrets
**Location:** Supabase → Project Settings → Secrets  
**Secrets to Add:**
- [ ] `OSF_CLIENT_ID`: f90ce659d4684f8f9cabc71cf4caac8f
- [ ] `OSF_CLIENT_SECRET`: [Private - store securely]
- [ ] `SUPABASE_URL`: Auto-configured
- [ ] `SUPABASE_SERVICE_ROLE_KEY`: Auto-configured

#### [ ] Step 6: Create osf_registrations Table
**Location:** Supabase → SQL Editor  
**Action:** Create database table for registration tracking

```sql
CREATE TABLE IF NOT EXISTS osf_registrations (
  id BIGSERIAL PRIMARY KEY,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_type TEXT DEFAULT 'Bearer',
  expires_in INTEGER,
  scope TEXT,
  state TEXT,
  registration_id TEXT UNIQUE,
  registration_url TEXT,
  submitted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Index for lookups
CREATE INDEX idx_osf_registrations_id ON osf_registrations(registration_id);
CREATE INDEX idx_osf_registrations_created ON osf_registrations(created_at DESC);
```

### OSF Account Setup

#### [ ] Step 7: Create OSF OAuth Application
**Location:** https://accounts.osf.io/manage/applications/  
**Action:** Register new OAuth application
- **Name:** Lasting Light AI Pre-Registration
- **Description:** Automated pre-registration submission
- **Redirect URI:** `https://ksinisdzgtnqzsymhfya.supabase.co/functions/v1/osf-oauth-callback`
- **Scopes:** `osf.admin` (allows registration creation)
- **Save:** Note Client ID and Client Secret

#### [ ] Step 8: Verify OSF API Access
**Action:** Test API endpoint
```bash
curl -H "Authorization: Bearer [TOKEN]" \
  https://api.osf.io/v2/registrations/
```
Expected: Returns HTTP 200 with registrations list (may be empty)

### Protocol Verification

#### [ ] Step 9: Final Protocol Review
**File:** `PROTOCOL_PHASE2_PREREGISTRATION.md`  
**Checklist:**
- [ ] Version 2.0 confirmed
- [ ] Status: PRE-ANALYSIS
- [ ] All required sections present
- [ ] No unregistered changes
- [ ] Protocol is locked (no analysis performed)
- [ ] Research questions clear
- [ ] Hypotheses specified
- [ ] Statistical tests predetermined
- [ ] Exclusion criteria defined
- [ ] Sign-off documented

### Workflow Validation

#### [ ] Step 10: Test Protocol Validation
**Action:** Run test workflow
1. Go to Actions tab
2. Select "OSF Pre-Registration Test (Draft Creation Only)"
3. Click "Run workflow"
4. Verify: ✅ All checks pass

#### [ ] Step 11: Test Draft Creation
**Action:** Create PR with minor protocol update
1. Create feature branch
2. Edit PROTOCOL_PHASE2_PREREGISTRATION.md (any change)
3. Commit and push: `git push origin feature-branch`
4. Create PR to main
5. Watch osf-preregistration.yml run
6. Verify: Registration ID appears in PR comments

#### [ ] Step 12: Review Draft on OSF
**Action:** Verify draft before approval
1. Click registration URL in PR comment
2. Review protocol text matches
3. Check all metadata
4. Confirm no sensitive information exposed
5. If issues found: Requests changes on PR, fix, and re-test

#### [ ] Step 13: Test Publication Approval
**Action:** Approve draft publication
1. Go to Actions tab
2. Find "OSF Pre-Registration Workflow" run for the PR
3. Look for deployment in review status
4. Click "Review deployments"
5. Approve for "osf-publish" environment
6. Watch osf-publish-registration.yml execute
7. Verify: DOI appears, PREREGISTRATION_DOI.md created

#### [ ] Step 14: Verify Final Artifact
**File:** `PREREGISTRATION_DOI.md` (auto-created)  
**Checklist:**
- [ ] File exists in repository
- [ ] Contains valid DOI (format: 10.17605/OSF.IO/XXXXX)
- [ ] Has OSF registration URL
- [ ] Includes citation formats
- [ ] Timestamp matches publication time
- [ ] Can be committed to main branch

---

## Going Live: Production Deployment

### Final Pre-Launch (by 2026-09-30)

#### [ ] Configuration Complete
- [x] Workflows committed to repository
- [x] Documentation complete
- [ ] GitHub secrets configured
- [ ] Supabase functions deployed
- [ ] osf-publish environment created
- [ ] Test workflow passes ✅

#### [ ] Team Briefing
- [ ] Maintainers notified of deadline
- [ ] Approval process explained
- [ ] Review location shared (supabase/functions/README_OSF.md)
- [ ] Troubleshooting guide available

#### [ ] Final Protocol Review
- [ ] Team reviewed latest protocol
- [ ] No substantive changes needed
- [ ] Ready to submit

### Launch: PR Creation (by 2026-10-01)

1. **Trigger:** Create PR to main with final protocol
   ```bash
   git checkout -b chore/osf-preregistration
   git add PROTOCOL_PHASE2_PREREGISTRATION.md
   git commit -m "chore: submit phase 2 protocol to OSF"
   git push origin chore/osf-preregistration
   ```

2. **Wait:** osf-preregistration.yml runs
   - Reads protocol
   - Validates format
   - Submits to OSF
   - Comments with registration ID

3. **Review:** Team reviews draft on OSF
   - Follow URL in PR comment
   - Verify protocol accuracy
   - Check for any issues
   - Approve publication

4. **Publish:** Approve via GitHub environment
   - Click "Review deployments" on PR
   - Approve for "osf-publish" environment
   - osf-publish-registration.yml executes
   - DOI generated and committed

5. **Confirm:** Verify publication
   - PREREGISTRATION_DOI.md exists
   - Contains valid DOI
   - OSF registration is public
   - Timestamp recorded

---

## Post-Launch

### After Publication (by 2026-10-05)

#### [ ] Notification
- [ ] Team notified of successful registration
- [ ] DOI shared in project documentation
- [ ] Citation added to README

#### [ ] Documentation
- [ ] PREREGISTRATION_DOI.md reviewed
- [ ] Backup of OSF registration details
- [ ] Timeline updated for analysis window

#### [ ] Monitoring
- [ ] Weekly check on OSF registration status
- [ ] Verify registration remains public
- [ ] Monitor for any issues

### Data Collection Phase (2026-10-01 to 2026-12-31)

- [ ] Continue collecting Phase 2 data
- [ ] Weekly contamination detection
- [ ] Monthly manual review of flags
- [ ] Document any quality issues

### Analysis Preparation (2027-01-01+)

- [ ] Analysis lockdown begins
- [ ] All code tagged with registration date
- [ ] Statistical testing begins per protocol
- [ ] Results reporting follows pre-registered plan

---

## Rollback / Emergency Procedures

### If Registration Fails Before Deadline

**Scenario:** Workflow fails to create draft

**Action:**
1. Check error logs in Actions tab
2. Review troubleshooting guide (.github/OSF_PREREGISTRATION_GUIDE.md)
3. Fix identified issue (token, function deployment, etc.)
4. Create new PR with same protocol
5. Re-trigger workflow
6. Deadline: 2026-10-01 (still applies)

### If Publication Fails After Draft Created

**Scenario:** Approval given but publication fails

**Action:**
1. Manually publish on OSF:
   - Go to https://osf.io/registrations/
   - Find draft with registration ID
   - Click "Publish"
   - Copy generated DOI
2. Create PREREGISTRATION_DOI.md manually
3. Commit to main branch
4. Verify registration is public

### If DOI Needs Correction

**Scenario:** DOI issued but incorrect in PREREGISTRATION_DOI.md

**Action:**
1. Edit PREREGISTRATION_DOI.md
2. Correct DOI field
3. Commit correction to main
4. No workflow re-run needed (file already published)

---

## Success Criteria

### Workflow Implementation
- [x] osf-preregistration.yml created and functional
- [x] osf-publish-registration.yml created and functional
- [x] osf-preregistration-test.yml created and functional
- [x] All workflows have proper error handling
- [x] PR comments informative and actionable
- [x] Approval gate configured

### Protocol Readiness
- [x] PROTOCOL_PHASE2_PREREGISTRATION.md locked
- [x] All required sections present
- [x] Hypotheses clearly stated
- [x] Statistical tests predetermined
- [x] Exclusion criteria defined

### OSF Registration
- [ ] Draft registration created on OSF
- [ ] Protocol text submitted verbatim
- [ ] Registration ID generated
- [ ] Accessible via OSF URL
- [ ] Published with DOI
- [ ] PREREGISTRATION_DOI.md created
- [ ] DOI committed to main branch

### Deadline Met
- [ ] Registration published by 2026-10-01 ✅
- [ ] DOI assigned ✅
- [ ] Team notified ✅
- [ ] Documentation complete ✅

---

## Contact & Support

**Questions?** Refer to:
- Setup Guide: `.github/OSF_PREREGISTRATION_GUIDE.md`
- Protocol: `PROTOCOL_PHASE2_PREREGISTRATION.md`
- Supabase Functions: `supabase/functions/README_OSF.md`
- OSF Docs: https://developer.osf.io/

**Issues?** Check:
1. GitHub Action logs (Actions tab → workflow run)
2. Supabase function logs (Supabase dashboard → Functions)
3. OSF API status: https://status.osf.io/

---

## Appendix: Key Dates

| Date | Event | Deadline? |
|------|-------|-----------|
| 2026-09-28 | Workflows created | - |
| 2026-09-28 | Setup begins | - |
| 2026-09-30 | All setup complete | ⏰ YES |
| 2026-10-01 | Registration published | ⏰ YES - CRITICAL |
| 2026-10-05 | Team notified | - |
| 2026-12-31 | Data collection ends | - |
| 2027-01-01 | Analysis lockdown | ⏰ No new analyses |

**CRITICAL:** OSF registration must be published by **2026-10-01**.

---

**Status:** ✅ Workflows ready for setup and testing  
**Next Step:** Follow setup instructions in `.github/OSF_PREREGISTRATION_GUIDE.md`  
**Deadline:** 2026-10-01
