import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

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
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("Missing authorization header");
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      console.error("Authentication error:", authError);
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Payment verification request from user: ${user.id}`);

    const { sessionId } = await req.json();

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const metadata = session.metadata;
      const userId = metadata?.user_id;
      
      // Validate that the authenticated user matches the session user
      if (userId !== user.id) {
        console.error(`User mismatch: authenticated ${user.id}, session ${userId}`);
        return new Response(
          JSON.stringify({ error: "Unauthorized: You can only verify your own payments" }),
          {
            status: 403,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const items = JSON.parse(metadata?.items || "[]");
      const giftRecipient = metadata?.gift_recipient;

      console.log(`Processing payment for user ${userId}: ${items.length} items`);

      // Create purchases and portfolio holdings
      for (const item of items) {
        // Create purchase record
        const { data: purchase, error: purchaseError } = await supabaseClient
          .from("purchases")
          .insert({
            user_id: userId,
            investment_id: item.id,
            investment_name: item.name,
            amount: item.amount,
            has_physical_card: item.hasPhysicalCard || false,
            total_cost: item.amount + (item.hasPhysicalCard ? 15 : 0),
            status: "completed",
          })
          .select()
          .single();

        if (purchaseError) throw purchaseError;

        // Create portfolio holding
        const { error: holdingError } = await supabaseClient
          .from("portfolio_holdings")
          .insert({
            user_id: userId,
            purchase_id: purchase.id,
            investment_id: item.id,
            investment_name: item.name,
            amount: item.amount,
            purchase_price: item.amount,
            current_value: item.amount,
            status: giftRecipient ? "gifted" : "active",
          });

        if (holdingError) throw holdingError;

        // Create transaction record
        const { error: transactionError } = await supabaseClient
          .from("transactions")
          .insert({
            user_id: userId,
            type: "purchase",
            amount: -item.amount,
            description: `Purchase of ${item.name}`,
          });

        if (transactionError) throw transactionError;

        // If gift, create gift transfer
        if (giftRecipient) {
          const { error: giftError } = await supabaseClient
            .from("gift_transfers")
            .insert({
              from_user_id: userId,
              purchase_id: purchase.id,
              to_email: giftRecipient,
              message: `Gift of ${item.name}`,
              status: "pending",
            });

          if (giftError) throw giftError;
        }
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    return new Response(JSON.stringify({ success: false, status: session.payment_status }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return new Response(JSON.stringify({ error: "Payment verification failed. Please try again." }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
