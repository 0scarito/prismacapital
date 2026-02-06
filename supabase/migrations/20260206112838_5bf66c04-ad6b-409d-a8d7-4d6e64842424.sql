-- Add verification tracking columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS verified_name TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS kyc_status TEXT DEFAULT 'none',
ADD COLUMN IF NOT EXISTS kyc_verified_at TIMESTAMPTZ DEFAULT NULL;

-- Add constraint for kyc_status values
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_kyc_status_check 
CHECK (kyc_status IN ('none', 'pending', 'verified', 'failed'));

-- Update existing verified users to have proper kyc_status
UPDATE public.profiles 
SET kyc_status = 'verified', kyc_verified_at = updated_at
WHERE eid_personal_number IS NOT NULL AND kyc_status = 'none';

-- Add comments for documentation
COMMENT ON COLUMN public.profiles.verified_name IS 'Legal name from KYC document verification';
COMMENT ON COLUMN public.profiles.kyc_status IS 'KYC verification status: none, pending, verified, failed';
COMMENT ON COLUMN public.profiles.kyc_verified_at IS 'Timestamp when KYC verification was completed';