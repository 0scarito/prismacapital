-- Fix Issue #4: Missing WITH CHECK on INSERT Policies
-- This adds defense-in-depth to prevent insertion of records with arbitrary user_id values

-- Fix portfolio_holdings INSERT policy
DROP POLICY IF EXISTS "Users can insert their own holdings" ON portfolio_holdings;

CREATE POLICY "Users can insert their own holdings"
ON portfolio_holdings FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Fix purchases INSERT policy
DROP POLICY IF EXISTS "Users can insert own purchases" ON purchases;

CREATE POLICY "Users can insert own purchases"
ON purchases FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Fix wallets INSERT policy (adding for completeness)
DROP POLICY IF EXISTS "Users can insert their own wallet" ON wallets;

CREATE POLICY "Users can insert their own wallet"
ON wallets FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Fix transactions INSERT policy
DROP POLICY IF EXISTS "Users can insert their own transactions" ON transactions;

CREATE POLICY "Users can insert their own transactions"
ON transactions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Fix coupons INSERT policy
DROP POLICY IF EXISTS "Users can insert own coupons" ON coupons;

CREATE POLICY "Users can insert own coupons"
ON coupons FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);