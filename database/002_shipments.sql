-- Run this in the Supabase SQL Editor AFTER 001_users.sql
-- Table: shipments (Gmail PDF pipeline)

CREATE TABLE IF NOT EXISTS shipments (
  id                  SERIAL PRIMARY KEY,
  gmail_message_id    TEXT NOT NULL UNIQUE,
  sender_email        TEXT NOT NULL,
  subject             TEXT,
  received_at         TIMESTAMPTZ,
  raw_text            TEXT,
  parsed_json         JSONB,
  whatsapp_sent       BOOLEAN NOT NULL DEFAULT FALSE,
  whatsapp_sent_at    TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS shipments_gmail_message_id_idx ON shipments (gmail_message_id);
CREATE INDEX IF NOT EXISTS shipments_received_at_idx ON shipments (received_at DESC);
