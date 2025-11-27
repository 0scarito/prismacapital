-- Fix remaining search_path security warnings
ALTER FUNCTION public.update_market_prices_updated_at() SET search_path = 'public';
ALTER FUNCTION public.update_wallet_updated_at() SET search_path = 'public';