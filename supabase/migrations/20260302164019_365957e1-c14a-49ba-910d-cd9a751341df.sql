-- Add selective DELETE policies for user-owned tables

-- Allow users to delete used or expired coupons
CREATE POLICY "Users can delete used or expired coupons"
ON public.coupons FOR DELETE
TO authenticated
USING (auth.uid() = user_id AND (status = 'used' OR (expires_at IS NOT NULL AND expires_at < now())));

-- Allow users to delete cashed-out portfolio holdings
CREATE POLICY "Users can delete cashed out holdings"
ON public.portfolio_holdings FOR DELETE
TO authenticated
USING (auth.uid() = user_id AND status = 'cashed_out');
