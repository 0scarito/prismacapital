-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('client', 'wealth_manager');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get user role (returns first role)
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- RLS Policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own roles during signup"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Update profiles RLS to allow wealth managers to view all profiles
CREATE POLICY "Wealth managers can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'wealth_manager'));

-- Update partner_coupons RLS to use new role system
DROP POLICY IF EXISTS "Partners can view their own coupons" ON public.partner_coupons;
DROP POLICY IF EXISTS "Partners can update their own coupons" ON public.partner_coupons;

CREATE POLICY "Wealth managers can view all partner coupons"
ON public.partner_coupons
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'wealth_manager'));

CREATE POLICY "Wealth managers can update partner coupons"
ON public.partner_coupons
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'wealth_manager'));

-- Create trigger to auto-assign client role if no role is set
CREATE OR REPLACE FUNCTION public.ensure_user_has_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user already has a role
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = NEW.id) THEN
    -- Assign default 'client' role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'client');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER ensure_user_role_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_user_has_role();