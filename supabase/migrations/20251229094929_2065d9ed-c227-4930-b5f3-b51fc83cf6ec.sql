-- Add comprehensive fields to partner_mandates for legal and practical aspects
ALTER TABLE public.partner_mandates
ADD COLUMN IF NOT EXISTS name text,
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS contract_reference text,
ADD COLUMN IF NOT EXISTS terms_accepted_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS risk_disclosure_accepted boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS regulatory_compliance_confirmed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS start_date date,
ADD COLUMN IF NOT EXISTS end_date date,
ADD COLUMN IF NOT EXISTS investment_objectives text,
ADD COLUMN IF NOT EXISTS risk_tolerance text DEFAULT 'moderate',
ADD COLUMN IF NOT EXISTS notes text,
ADD COLUMN IF NOT EXISTS activated_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS cancelled_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS cancellation_reason text;

-- Add RLS policy for wealth managers to insert mandates for their organization
CREATE POLICY "Partners can insert their own mandates"
ON public.partner_mandates
FOR INSERT
WITH CHECK (
  partner_id IN (
    SELECT profiles.partner_id
    FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.partner_id IS NOT NULL
  )
);

-- Add RLS policy for wealth managers to update their own mandates
CREATE POLICY "Partners can update their own mandates"
ON public.partner_mandates
FOR UPDATE
USING (
  partner_id IN (
    SELECT profiles.partner_id
    FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.partner_id IS NOT NULL
  )
)
WITH CHECK (
  partner_id IN (
    SELECT profiles.partner_id
    FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.partner_id IS NOT NULL
  )
);

-- Create a function to generate unique contract reference numbers
CREATE OR REPLACE FUNCTION public.generate_contract_reference()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  ref_year text;
  ref_sequence text;
  new_reference text;
BEGIN
  ref_year := to_char(now(), 'YYYY');
  ref_sequence := lpad(nextval('mandate_reference_seq')::text, 6, '0');
  new_reference := 'PC-MAN-' || ref_year || '-' || ref_sequence;
  RETURN new_reference;
END;
$$;

-- Create sequence for contract references
CREATE SEQUENCE IF NOT EXISTS mandate_reference_seq START WITH 1;