-- WhatsApp message log
-- Every cargo notification sent via WhatsApp is recorded here.

CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id            SERIAL PRIMARY KEY,
  extraction_id INTEGER REFERENCES cargo_extractions(id) ON DELETE SET NULL,
  subject       TEXT         NOT NULL DEFAULT '',
  message_text  TEXT         NOT NULL,
  recipients    JSONB        NOT NULL DEFAULT '[]',
  sent_by       TEXT,
  sent_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_sent_at
  ON whatsapp_messages (sent_at DESC);
