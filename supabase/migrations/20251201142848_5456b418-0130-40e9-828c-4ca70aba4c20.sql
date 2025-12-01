-- First, clean up duplicate roles - keep only the most recent role for each user
DELETE FROM public.user_roles
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) as rn
    FROM public.user_roles
  ) t
  WHERE rn > 1
);

-- Add a unique constraint to prevent multiple roles per user
ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_role_key;
ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_unique UNIQUE (user_id);

-- Update the trigger to check if role already exists before inserting
CREATE OR REPLACE FUNCTION public.ensure_user_has_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only insert if user doesn't already have a role
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = NEW.id) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'client');
  END IF;
  RETURN NEW;
END;
$$;