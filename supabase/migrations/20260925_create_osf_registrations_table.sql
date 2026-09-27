-- OSF Registration Management Table
-- Tracks OAuth tokens and registration submissions to Open Science Framework
-- Date: 2026-09-25

CREATE TABLE IF NOT EXISTS osf_registrations (
  id BIGSERIAL PRIMARY KEY,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_type TEXT DEFAULT 'Bearer',
  expires_in INTEGER,
  scope TEXT,
  state TEXT,
  registration_id TEXT,
  registration_url TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for quick token lookups
CREATE INDEX IF NOT EXISTS idx_osf_registrations_created_at ON osf_registrations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_osf_registrations_registration_id ON osf_registrations(registration_id);

-- Add comment
COMMENT ON TABLE osf_registrations IS 'Stores OAuth tokens and registration metadata for OSF integration';
COMMENT ON COLUMN osf_registrations.access_token IS 'OSF OAuth access token (sensitive, keep private)';
COMMENT ON COLUMN osf_registrations.registration_id IS 'OSF registration ID (e.g., abc123)';
COMMENT ON COLUMN osf_registrations.registration_url IS 'Full OSF registration URL (e.g., https://api.osf.io/v2/registrations/abc123/)';
