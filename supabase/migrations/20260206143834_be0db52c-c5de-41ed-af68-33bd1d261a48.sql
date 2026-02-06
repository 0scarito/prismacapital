-- Add DELETE policy for gift_transfers (only pending transfers by sender)
CREATE POLICY "Users can delete their own pending gift transfers"
ON public.gift_transfers
FOR DELETE
TO authenticated
USING (
  auth.uid() = from_user_id 
  AND status = 'pending'
);

-- Add DELETE policy for partner_mandates (only draft mandates by partners)
CREATE POLICY "Partners can delete their own draft mandates"
ON public.partner_mandates
FOR DELETE
TO authenticated
USING (
  partner_id IN (
    SELECT partner_id 
    FROM profiles 
    WHERE id = auth.uid() 
    AND partner_id IS NOT NULL
  )
  AND status = 'draft'
);