-- ============================================
-- SHOPPING CART & GIFT TRANSFER SYSTEM
-- Run this SQL in your Supabase SQL Editor
-- ============================================

-- Create purchases table
CREATE TABLE IF NOT EXISTS public.purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  investment_id text NOT NULL,
  investment_name text NOT NULL,
  investment_type text NOT NULL,
  amount decimal(10, 2) NOT NULL,
  has_physical_card boolean DEFAULT false,
  physical_card_cost decimal(10, 2) DEFAULT 0,
  total_cost decimal(10, 2) NOT NULL,
  status text DEFAULT 'completed',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create gift_transfers table
CREATE TABLE IF NOT EXISTS public.gift_transfers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  to_email text NOT NULL,
  purchase_id uuid REFERENCES public.purchases(id) ON DELETE CASCADE NOT NULL,
  message text,
  status text DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  accepted_at timestamp with time zone
);

-- Enable RLS
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_transfers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for purchases
CREATE POLICY "Users can view their own purchases"
  ON public.purchases FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own purchases"
  ON public.purchases FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for gift_transfers
CREATE POLICY "Users can view their sent gifts"
  ON public.gift_transfers FOR SELECT
  USING (auth.uid() = from_user_id);

CREATE POLICY "Users can insert gift transfers"
  ON public.gift_transfers FOR INSERT
  WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "Users can view gifts sent to their email"
  ON public.gift_transfers FOR SELECT
  USING (
    to_email IN (
      SELECT email FROM auth.users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update gift status if it's theirs"
  ON public.gift_transfers FOR UPDATE
  USING (
    to_email IN (
      SELECT email FROM auth.users WHERE id = auth.uid()
    )
  );

-- ============================================
-- After running this SQL:
-- 1. The tables will be created
-- 2. Lovable will automatically regenerate TypeScript types
-- 3. All TypeScript errors will be resolved
-- ============================================
