import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

// No CORS headers - this is a server-to-server webhook only
// Stripe webhooks should never be called from a browser

serve(async (req) => {
  // Reject CORS preflight - webhooks don't need browser access
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 405 }); // Method Not Allowed
  }

  // Only accept POST requests
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      console.error("No Stripe signature provided");
      return new Response(JSON.stringify({ error: "No signature provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const body = await req.text();
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!webhookSecret) {
      console.error("Webhook secret not configured");
      return new Response(JSON.stringify({ error: "Webhook configuration error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Verify webhook signature - this is the security boundary
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    
    console.log("Webhook event received:", event.type);

    // Handle checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log("Processing completed session:", session.id);

      if (session.payment_status === "paid") {
        const metadata = session.metadata;
        const userId = metadata?.user_id;
        const items = JSON.parse(metadata?.items || "[]");
        const giftRecipient = metadata?.gift_recipient;

        console.log("Creating records for user:", userId, "Items:", items.length);

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

          if (purchaseError) {
            console.error("Purchase error:", purchaseError);
            throw purchaseError;
          }

          console.log("Purchase created:", purchase.id);

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

          if (holdingError) {
            console.error("Holding error:", holdingError);
            throw holdingError;
          }

          console.log("Portfolio holding created");

          // Create transaction record
          const { error: transactionError } = await supabaseClient
            .from("transactions")
            .insert({
              user_id: userId,
              type: "purchase",
              amount: -item.amount,
              description: `Purchase of ${item.name}`,
            });

          if (transactionError) {
            console.error("Transaction error:", transactionError);
            throw transactionError;
          }

          console.log("Transaction recorded");

          // If gift, create gift transfer
          if (giftRecipient) {
            // Get recipient user ID from profiles
            const { data: recipientProfile } = await supabaseClient
              .from("profiles")
              .select("id")
              .eq("id", giftRecipient)
              .single();

            const { error: giftError } = await supabaseClient
              .from("gift_transfers")
              .insert({
                from_user_id: userId,
                purchase_id: purchase.id,
                to_email: giftRecipient,
                message: `Gift of ${item.name}`,
                status: "pending",
              });

            if (giftError) {
              console.error("Gift transfer error:", giftError);
              throw giftError;
            }

            console.log("Gift transfer created for:", giftRecipient);
          }

          // Create coupon record
          const couponCode = `${item.id.substring(0, 4).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
          
          const { error: couponError } = await supabaseClient
            .from("coupons")
            .insert({
              user_id: userId,
              code: couponCode,
              title: item.name,
              description: `Investment in ${item.name}`,
              value: item.amount,
              status: "active",
            });

          if (couponError) {
            console.error("Coupon error:", couponError);
            throw couponError;
          }

          console.log("Coupon created:", couponCode);
        }

        console.log("All records created successfully");
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
});
