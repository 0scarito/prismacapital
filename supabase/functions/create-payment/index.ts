import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const paymentItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  amount: z.number().min(100).max(1000000),
  hasPhysicalCard: z.boolean().optional(),
});

const requestSchema = z.object({
  items: z.array(paymentItemSchema).min(1).max(10),
  giftRecipient: z.string().email().max(255).optional().nullable(),
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (!user?.email) {
      throw new Error("User not authenticated");
    }

    // SECURITY: Server-side KYC verification check
    // This prevents bypassing the frontend-only check
    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("eid_personal_number, kyc_status")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      return new Response(
        JSON.stringify({ 
          error: "Could not verify user profile",
          code: "PROFILE_ERROR"
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    // Check if user has completed KYC verification
    if (!profile?.eid_personal_number || profile?.kyc_status !== 'verified') {
      console.log("User KYC not verified:", { 
        userId: user.id, 
        hasEid: !!profile?.eid_personal_number,
        kycStatus: profile?.kyc_status 
      });
      return new Response(
        JSON.stringify({ 
          error: "Identity verification required. Please complete KYC verification before making purchases.",
          code: "KYC_REQUIRED"
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 403,
        }
      );
    }

    console.log("KYC verified for user:", { userId: user.id, kycStatus: profile.kyc_status });

    const body = await req.json();
    
    // Validate request body
    const validation = requestSchema.safeParse(body);
    if (!validation.success) {
      return new Response(
        JSON.stringify({ error: "Invalid request data. Please check your inputs." }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
    
    const { items, giftRecipient } = validation.data;

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Check for existing customer
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Create line items for Stripe checkout
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name,
          description: item.description || `Investment in ${item.name}`,
        },
        unit_amount: Math.round(item.amount * 100), // Convert to cents
      },
      quantity: 1,
    }));

    // Add physical card costs if applicable
    items.forEach((item: any) => {
      if (item.hasPhysicalCard) {
        lineItems.push({
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Physical NFC Card for ${item.name}`,
              description: 'Physical investment card with NFC technology',
            },
            unit_amount: 1500, // €15.00
          },
          quantity: 1,
        });
      }
    });

    const metadata: any = {
      user_id: user.id,
      items: JSON.stringify(items),
    };

    if (giftRecipient) {
      metadata.gift_recipient = giftRecipient;
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: lineItems,
      mode: "payment",
      success_url: `${req.headers.get("origin")}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/checkout?payment=canceled`,
      metadata,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    return new Response(JSON.stringify({ error: "Payment processing failed. Please try again." }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
