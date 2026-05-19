-- Stores Baileys WhatsApp session auth state (credentials + signal keys)
-- Each row is one key/value pair; "creds" row = main auth credentials
CREATE TABLE IF NOT EXISTS whatsapp_session (
  key        TEXT PRIMARY KEY,
  value      JSONB         NOT NULL,
  updated_at TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);
