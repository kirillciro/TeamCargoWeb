-- Run this in the Supabase SQL Editor
-- Table: users

CREATE TABLE IF NOT EXISTS users (
  id                   SERIAL PRIMARY KEY,
  full_name            TEXT NOT NULL,
  email                TEXT NOT NULL UNIQUE,
  password_hash        TEXT,
  role                 TEXT NOT NULL DEFAULT 'user',
  is_verified          BOOLEAN NOT NULL DEFAULT FALSE,
  provider             TEXT NOT NULL DEFAULT 'email',
  provider_id          TEXT,
  refresh_token_hash   TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS users_email_idx ON users (email);
