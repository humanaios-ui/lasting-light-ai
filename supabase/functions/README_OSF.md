# OSF Integration Functions

Supabase Edge Functions for automated pre-registration submission to Open Science Framework (OSF).

## Functions

### 1. `osf-oauth-callback`
**Purpose:** Handles OAuth authorization flow with OSF

**Flow:**
1. User clicks "Connect OSF" button
2. Redirected to OSF login: `https://accounts.osf.io/oauth2/authorize/?client_id=...`
3. User approves access
4. OSF redirects to this function with `code` parameter
5. Function exchanges code for access token
6. Token stored in `osf_registrations` table
7. User redirected back to governance page

**Deployed at:**
```
https://ksinisdzgtnqzsymhfya.supabase.co/functions/v1/osf-oauth-callback
```

**URL to trigger OAuth flow:**
```
https://accounts.osf.io/oauth2/authorize/?
  client_id=f90ce659d4684f8f9cabc71cf4caac8f&
  response_type=code&
  redirect_uri=https://ksinisdzgtnqzsymhfya.supabase.co/functions/v1/osf-oauth-callback&
  scope=osf.admin&
  state=[optional-state-param]
```

### 2. `osf-submit-registration`
**Purpose:** Submits pre-registration to OSF and fills in protocol fields

**Endpoint:**
```
POST https://ksinisdzgtnqzsymhfya.supabase.co/functions/v1/osf-submit-registration
```

**Request payload:**
```json
{
  "title": "ACAT Phase 2: Calibration Integrity Under Perturbation",
  "description": "AI system behavioral integrity assessment with contamination detection",
  "category": "research",
  "protocolText": "Full text of PROTOCOL_PHASE2_PREREGISTRATION.md"
}
```

**Response:**
```json
{
  "success": true,
  "registration_id": "abc123",
  "registration_url": "https://api.osf.io/v2/registrations/abc123/",
  "doi": "10.17605/OSF.IO/ABC123"
}
```

## Setup Steps

### Step 1: Sync local files with repository
```bash
cd /Users/andersonfamily/github/lasting-light-ai
git fetch origin
git pull origin claude/humanaios-witness-homepage-dknfmr
```

### Step 2: Create Supabase table (see step 3 instructions)

### Step 3: Set environment variables (see main instructions)

### Step 4: Deploy functions
```bash
supabase functions deploy osf-oauth-callback
supabase functions deploy osf-submit-registration
```

## Environment Variables Required

Store these in Supabase → Settings → Secrets:
- `OSF_CLIENT_ID` (safe to share): `f90ce659d4684f8f9cabc71cf4caac8f`
- `OSF_CLIENT_SECRET` (keep private): [provided separately]
- `SUPABASE_URL` (auto-configured)
- `SUPABASE_SERVICE_ROLE_KEY` (auto-configured)

## Database Schema

**Table:** `osf_registrations`
- `id` (BIGSERIAL) - Primary key
- `access_token` (TEXT) - OSF OAuth token
- `refresh_token` (TEXT, nullable) - For token refresh
- `token_type` (TEXT) - Bearer
- `expires_in` (INTEGER) - Token expiry in seconds
- `scope` (TEXT) - OAuth scopes granted
- `state` (TEXT, nullable) - CSRF state parameter
- `registration_id` (TEXT, nullable) - OSF registration ID
- `registration_url` (TEXT, nullable) - OSF API URL for registration
- `submitted_at` (TIMESTAMP, nullable) - When registration was submitted
- `created_at` (TIMESTAMP) - When token was created
- `updated_at` (TIMESTAMP) - Last update time

## Usage Flow

```
User Interface
    ↓
[Connect to OSF] button
    ↓
osf-oauth-callback (handles auth)
    ↓
Token stored in osf_registrations
    ↓
[Submit Pre-Registration] button
    ↓
osf-submit-registration (creates registration)
    ↓
OSF generates DOI: 10.17605/OSF.IO/...
    ↓
Registration locked, analysis can begin 2027-01-01
```

## Error Handling

| Scenario | Error | Solution |
|----------|-------|----------|
| No token found | "No valid OSF token found" | Click "Connect OSF" first |
| Token expired | "Unauthorized" | Re-authenticate via Connect button |
| Registration failed | Details from OSF API | Check protocol payload format |
| Database error | Insert/update failed | Check osf_registrations table exists |

## Security Notes

⚠️ **CRITICAL:**
- `OSF_CLIENT_SECRET` is private - never commit to repo
- Store only in Supabase secrets, not in code
- `access_token` in database is sensitive - restrict access via RLS
- Consider adding Row Level Security (RLS) policies

## Testing Locally

```bash
# Start local Supabase
supabase start

# Deploy functions locally
supabase functions deploy osf-oauth-callback --local
supabase functions deploy osf-submit-registration --local

# Test callback (should return success HTML)
curl "http://localhost:54321/functions/v1/osf-oauth-callback?code=test-code"

# Test submission
curl -X POST http://localhost:54321/functions/v1/osf-submit-registration \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Registration",
    "description": "Test description",
    "category": "research",
    "protocolText": "Full protocol text here"
  }'
```

## Support

For issues:
1. Check Supabase function logs: `supabase functions list`
2. Review OSF API docs: https://developer.osf.io/
3. Verify OAuth app settings: https://accounts.osf.io/manage/applications/
