-- Blocklist of message_ids that were locally deleted
-- Prevents re-import on next sync
CREATE TABLE IF NOT EXISTS email_deletions (
  message_id TEXT PRIMARY KEY,
  deleted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
