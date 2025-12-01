-- Fix the partner_organizations INSERT policy to avoid accessing auth.users directly
DROP POLICY IF EXISTS "Wealth managers can create their own organization" ON public.partner_organizations;

-- Create a more secure policy that only checks role and doesn't try to access auth.users
CREATE POLICY "Wealth managers can create their own organization"
ON public.partner_organizations
FOR INSERT
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'wealth_manager'::app_role)
);