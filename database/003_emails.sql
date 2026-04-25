-- Run this in the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS emails (
  id           SERIAL PRIMARY KEY,
  message_id   TEXT UNIQUE NOT NULL,
  from_address TEXT NOT NULL,
  from_name    TEXT NOT NULL DEFAULT '',
  subject      TEXT NOT NULL DEFAULT '(no subject)',
  received_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  body_text    TEXT NOT NULL DEFAULT '',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS email_attachments (
  id           SERIAL PRIMARY KEY,
  email_id     INTEGER NOT NULL REFERENCES emails(id) ON DELETE CASCADE,
  filename     TEXT NOT NULL,
  content_type TEXT NOT NULL DEFAULT 'application/pdf',
  file_data    BYTEA NOT NULL,
  size_bytes   INTEGER,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cargo_extractions (
  id                   SERIAL PRIMARY KEY,
  email_id             INTEGER NOT NULL REFERENCES emails(id) ON DELETE CASCADE,
  attachment_id        INTEGER REFERENCES email_attachments(id) ON DELETE SET NULL,
  status               TEXT NOT NULL DEFAULT 'pending'
                         CHECK (status IN ('pending','extracting','extracted','failed','sent')),
  extracted_json       JSONB,
  raw_text             TEXT,
  whatsapp_message_sid TEXT,
  whatsapp_sent_at     TIMESTAMPTZ,
  error_message        TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS emails_received_idx ON emails (received_at DESC);
CREATE INDEX IF NOT EXISTS extractions_email_idx ON cargo_extractions (email_id);
