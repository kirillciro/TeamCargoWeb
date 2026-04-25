-- Run this in the Supabase SQL Editor

ALTER TABLE emails
  ADD COLUMN IF NOT EXISTS folder    TEXT    NOT NULL DEFAULT 'INBOX',
  ADD COLUMN IF NOT EXISTS is_read   BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS body_html TEXT;

ALTER TABLE cargo_extractions
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_emails_folder ON emails(folder);
CREATE INDEX IF NOT EXISTS idx_emails_unread ON emails(folder, is_read) WHERE is_read = false;
