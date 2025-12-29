-- Create a secure function to link a new partner organization to a wealth manager's profile
-- This bypasses RLS to allow initial partner_id assignment during org creation
CREATE OR REPLACE FUNCTION public.create_partner_organization_for_wealth_manager(
  org_name text,
  org_email text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_org_id uuid;
  calling_user_id uuid;
BEGIN
  -- Get the calling user's ID
  calling_user_id := auth.uid();
  
  -- Verify user has wealth_manager role
  IF NOT has_role(calling_user_id, 'wealth_manager') THEN
    RAISE EXCEPTION 'Only wealth managers can create partner organizations';
  END IF;
  
  -- Check if user already has a partner organization
  IF EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = calling_user_id 
    AND partner_id IS NOT NULL
  ) THEN
    RAISE EXCEPTION 'User already has a partner organization';
  END IF;
  
  -- Create the organization
  INSERT INTO partner_organizations (name, type, contact_email, status)
  VALUES (org_name, 'wealth_manager', org_email, 'active')
  RETURNING id INTO new_org_id;
  
  -- Update the profile with the new partner_id
  UPDATE profiles
  SET partner_id = new_org_id,
      is_partner_user = true,
      updated_at = now()
  WHERE id = calling_user_id;
  
  RETURN new_org_id;
END;
$$;