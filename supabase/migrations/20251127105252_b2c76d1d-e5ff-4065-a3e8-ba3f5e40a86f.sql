-- Fix search_path security warnings for existing functions
ALTER FUNCTION public.update_partner_updated_at() SET search_path = 'public';
ALTER FUNCTION public.handle_new_user() SET search_path = 'public';
ALTER FUNCTION public.handle_new_user_wallet() SET search_path = 'public';
ALTER FUNCTION public.update_holdings_updated_at() SET search_path = 'public';