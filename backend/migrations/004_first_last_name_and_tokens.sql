-- ── Migration 004: split full_name → first_name + last_name ─────────────────
-- Run this against your database before deploying the updated backend.

-- 1. Add new name columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name  VARCHAR(100);

-- 2. Migrate existing data: first word → first_name, rest → last_name
UPDATE users
SET
  first_name = SPLIT_PART(TRIM(full_name), ' ', 1),
  last_name  = TRIM(SUBSTRING(TRIM(full_name) FROM POSITION(' ' IN TRIM(full_name))));

-- Edge case: if full_name had no space, last_name will be empty string — that's fine
UPDATE users SET last_name  = '' WHERE last_name  IS NULL;
UPDATE users SET first_name = '' WHERE first_name IS NULL;

-- 3. Make them NOT NULL
ALTER TABLE users ALTER COLUMN first_name SET NOT NULL;
ALTER TABLE users ALTER COLUMN last_name  SET NOT NULL;

-- 4. Email verification token columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verification_token_hash VARCHAR(64);
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verification_expires_at TIMESTAMPTZ;

-- 5. Password reset token columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_token_hash  VARCHAR(64);
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_expires_at  TIMESTAMPTZ;

-- 6. Index for fast token lookups
CREATE INDEX IF NOT EXISTS idx_users_email_verification_token ON users (email_verification_token_hash) WHERE email_verification_token_hash IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_password_reset_token      ON users (password_reset_token_hash)  WHERE password_reset_token_hash  IS NOT NULL;

-- NOTE: full_name column is kept for now but is no longer written by the app.
-- You can drop it later:  ALTER TABLE users DROP COLUMN full_name;
