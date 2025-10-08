-- Create market_prices table to store current prices for each investment
CREATE TABLE IF NOT EXISTS public.market_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  investment_id text NOT NULL UNIQUE,
  investment_name text NOT NULL,
  investment_type text NOT NULL, -- 'crypto', 'commodity', 'etf', 'startup', 'real_estate', 'private_equity'
  current_price numeric NOT NULL,
  currency text NOT NULL DEFAULT 'EUR',
  price_source text NOT NULL, -- 'api' or 'manual'
  last_updated timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create price_history table for historical price tracking
CREATE TABLE IF NOT EXISTS public.price_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  investment_id text NOT NULL,
  price numeric NOT NULL,
  currency text NOT NULL DEFAULT 'EUR',
  recorded_at timestamp with time zone DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_market_prices_investment_id ON public.market_prices(investment_id);
CREATE INDEX IF NOT EXISTS idx_market_prices_type ON public.market_prices(investment_type);
CREATE INDEX IF NOT EXISTS idx_price_history_investment_id ON public.price_history(investment_id);
CREATE INDEX IF NOT EXISTS idx_price_history_recorded_at ON public.price_history(recorded_at DESC);

-- Enable RLS
ALTER TABLE public.market_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for market_prices (read-only for all authenticated users)
CREATE POLICY "Anyone can view market prices"
  ON public.market_prices
  FOR SELECT
  USING (true);

-- RLS Policies for price_history (read-only for all authenticated users)
CREATE POLICY "Anyone can view price history"
  ON public.price_history
  FOR SELECT
  USING (true);

-- Function to update market_prices updated_at timestamp
CREATE OR REPLACE FUNCTION update_market_prices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on market_prices
CREATE TRIGGER update_market_prices_timestamp
  BEFORE UPDATE ON public.market_prices
  FOR EACH ROW
  EXECUTE FUNCTION update_market_prices_updated_at();

-- Insert initial manual prices for startups, real estate, and private equity
INSERT INTO public.market_prices (investment_id, investment_name, investment_type, current_price, price_source) VALUES
  ('startup-1', 'Tech Startup Alpha', 'startup', 1.00, 'manual'),
  ('startup-2', 'Green Energy Ventures', 'startup', 1.00, 'manual'),
  ('startup-3', 'HealthTech Innovation', 'startup', 1.00, 'manual'),
  ('real-estate-1', 'Paris Residential Portfolio', 'real_estate', 1.00, 'manual'),
  ('real-estate-2', 'Berlin Commercial Complex', 'real_estate', 1.00, 'manual'),
  ('real-estate-3', 'Amsterdam Mixed-Use Development', 'real_estate', 1.00, 'manual'),
  ('private-equity-1', 'European Growth Fund', 'private_equity', 1.00, 'manual'),
  ('private-equity-2', 'Tech Buyout Portfolio', 'private_equity', 1.00, 'manual'),
  ('private-equity-3', 'Consumer Brands Fund', 'private_equity', 1.00, 'manual')
ON CONFLICT (investment_id) DO NOTHING;