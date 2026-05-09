-- Run this in the Supabase SQL Editor
-- Table: driver_profiles

CREATE TABLE IF NOT EXISTS driver_profiles (
  id                SERIAL PRIMARY KEY,
  user_id           INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  phone             TEXT,
  whatsapp          TEXT,
  country           TEXT,
  availability      TEXT NOT NULL DEFAULT 'available',
  license_cats      TEXT[] NOT NULL DEFAULT '{}',
  years_exp         INTEGER,
  languages         TEXT[] NOT NULL DEFAULT '{}',
  work_type         TEXT,
  preferred_routes  TEXT[] NOT NULL DEFAULT '{}',
  bio               TEXT,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS driver_profiles_user_id_idx ON driver_profiles (user_id);
