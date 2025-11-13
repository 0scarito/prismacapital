-- Create a function to check if a user exists by email
-- This is a secure way to validate without exposing all user data
CREATE OR REPLACE FUNCTION public.check_user_exists_by_email(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_count INTEGER;
BEGIN
  -- Count users with this email in auth.users
  SELECT COUNT(*)
  INTO user_count
  FROM auth.users
  WHERE email = user_email;
  
  RETURN user_count > 0;
END;
$$;