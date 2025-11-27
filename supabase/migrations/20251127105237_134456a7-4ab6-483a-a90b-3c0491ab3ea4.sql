-- Create partner organizations table
CREATE TABLE IF NOT EXISTS public.partner_organizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('bank', 'insurance', 'wealth_manager', 'family_office', 'other')),
  contact_email TEXT NOT NULL,
  contact_person TEXT,
  status TEXT NOT NULL DEFAULT 'prospect' CHECK (status IN ('prospect', 'active', 'suspended', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create partner mandates table
CREATE TABLE IF NOT EXISTS public.partner_mandates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID NOT NULL REFERENCES public.partner_organizations(id) ON DELETE CASCADE,
  total_value NUMERIC NOT NULL,
  coupon_count INTEGER NOT NULL,
  product_mix JSONB, -- Stores distribution like {"gold": 50, "real_estate": 100}
  pricing_tier TEXT NOT NULL DEFAULT 'standard' CHECK (pricing_tier IN ('standard', 'premium', 'enterprise')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create partner coupons table (extends coupons for B2B tracking)
CREATE TABLE IF NOT EXISTS public.partner_coupons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mandate_id UUID REFERENCES public.partner_mandates(id) ON DELETE SET NULL,
  partner_id UUID NOT NULL REFERENCES public.partner_organizations(id) ON DELETE CASCADE,
  product_type TEXT NOT NULL,
  face_value NUMERIC NOT NULL,
  code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'in_stock' CHECK (status IN ('in_stock', 'distributed', 'redeemed', 'expired')),
  distributed_at TIMESTAMP WITH TIME ZONE,
  distributed_to_ref TEXT, -- Partner's internal client reference
  redeemed_at TIMESTAMP WITH TIME ZONE,
  redeemed_by_user_id UUID, -- End client who redeemed
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add partner_id to profiles table for partner users
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS partner_id UUID REFERENCES public.partner_organizations(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS is_partner_user BOOLEAN DEFAULT false;

-- Enable RLS
ALTER TABLE public.partner_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_mandates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_coupons ENABLE ROW LEVEL SECURITY;

-- RLS Policies for partner_organizations
CREATE POLICY "Partners can view their own organization"
  ON public.partner_organizations FOR SELECT
  USING (
    id IN (
      SELECT partner_id FROM public.profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Partners can update their own organization"
  ON public.partner_organizations FOR UPDATE
  USING (
    id IN (
      SELECT partner_id FROM public.profiles WHERE id = auth.uid()
    )
  );

-- RLS Policies for partner_mandates
CREATE POLICY "Partners can view their own mandates"
  ON public.partner_mandates FOR SELECT
  USING (
    partner_id IN (
      SELECT partner_id FROM public.profiles WHERE id = auth.uid()
    )
  );

-- RLS Policies for partner_coupons
CREATE POLICY "Partners can view their own coupons"
  ON public.partner_coupons FOR SELECT
  USING (
    partner_id IN (
      SELECT partner_id FROM public.profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Partners can update their own coupons"
  ON public.partner_coupons FOR UPDATE
  USING (
    partner_id IN (
      SELECT partner_id FROM public.profiles WHERE id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_partner_coupons_partner_id ON public.partner_coupons(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_coupons_mandate_id ON public.partner_coupons(mandate_id);
CREATE INDEX IF NOT EXISTS idx_partner_coupons_status ON public.partner_coupons(status);
CREATE INDEX IF NOT EXISTS idx_partner_mandates_partner_id ON public.partner_mandates(partner_id);
CREATE INDEX IF NOT EXISTS idx_profiles_partner_id ON public.profiles(partner_id);

-- Create function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_partner_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_partner_organizations_updated_at
  BEFORE UPDATE ON public.partner_organizations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_partner_updated_at();

CREATE TRIGGER update_partner_mandates_updated_at
  BEFORE UPDATE ON public.partner_mandates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_partner_updated_at();