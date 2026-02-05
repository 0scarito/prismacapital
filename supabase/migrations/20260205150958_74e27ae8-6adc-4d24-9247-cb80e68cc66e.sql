-- Add column to store eID identity for user linking
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS eid_personal_number TEXT UNIQUE;

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_profiles_eid_personal_number 
ON profiles(eid_personal_number) 
WHERE eid_personal_number IS NOT NULL;