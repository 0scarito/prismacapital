-- Add kyc_provider column to track which service verified each user
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS kyc_provider TEXT DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.kyc_provider IS 'KYC provider that verified the user: onfido, voveid, etc.';