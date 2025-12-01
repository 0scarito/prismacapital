-- Fix Issue #1: Partner Coupons Cross-Organization Access
-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Wealth managers can view all partner coupons" ON partner_coupons;
DROP POLICY IF EXISTS "Wealth managers can update partner coupons" ON partner_coupons;

-- Create secure policies that filter by partner organization
CREATE POLICY "Partners can view own organization coupons"
ON partner_coupons FOR SELECT
TO authenticated
USING (
  partner_id IN (
    SELECT partner_id 
    FROM profiles 
    WHERE id = auth.uid() 
    AND partner_id IS NOT NULL
  )
);

CREATE POLICY "Partners can update own organization coupons"
ON partner_coupons FOR UPDATE
TO authenticated
USING (
  partner_id IN (
    SELECT partner_id 
    FROM profiles 
    WHERE id = auth.uid() 
    AND partner_id IS NOT NULL
  )
)
WITH CHECK (
  partner_id IN (
    SELECT partner_id 
    FROM profiles 
    WHERE id = auth.uid() 
    AND partner_id IS NOT NULL
  )
);

-- Fix Issue #3: Profile Data Exposure
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;

-- Create restrictive policy - users can only view their own profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Keep the wealth manager policy for legitimate business needs
-- (This is already in place: "Wealth managers can view all profiles")

-- Add WITH CHECK to profiles UPDATE to prevent privilege escalation
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id
  -- Prevent users from changing their role or partner association
  AND is_partner_user IS NOT DISTINCT FROM (SELECT is_partner_user FROM profiles WHERE id = auth.uid())
  AND partner_id IS NOT DISTINCT FROM (SELECT partner_id FROM profiles WHERE id = auth.uid())
);