-- User document image URLs (driving license + passport/ID)
ALTER TABLE users ADD COLUMN IF NOT EXISTS license_front_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS license_back_url  TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS passport_front_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS passport_back_url  TEXT;
