-- Add date of birth to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS date_of_birth DATE;
