-- Allow wealth managers to insert their own partner organization during onboarding
CREATE POLICY "Wealth managers can create their own organization"
ON public.partner_organizations
FOR INSERT
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'wealth_manager'::app_role)
  AND contact_email IN (
    SELECT email FROM auth.users WHERE id = auth.uid()
  )
);