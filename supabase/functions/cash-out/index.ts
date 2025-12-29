import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation schema
const cashOutSchema = z.object({
  holdingId: z.string().uuid("Invalid holding ID format"),
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: authError } = await supabaseClient.auth.getUser(token);
    const user = userData.user;

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate input
    const body = await req.json();
    const validation = cashOutSchema.safeParse(body);
    
    if (!validation.success) {
      console.error("Validation error:", validation.error.errors);
      return new Response(
        JSON.stringify({ error: "Invalid request data. Please provide a valid holding ID." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { holdingId } = validation.data;

    console.log(`Cash-out request from user ${user.id} for holding ${holdingId}`);

    // Get the holding with optimistic locking check
    const { data: holding, error: holdingError } = await supabaseClient
      .from("portfolio_holdings")
      .select("*")
      .eq("id", holdingId)
      .eq("user_id", user.id)
      .single();

    if (holdingError || !holding) {
      console.error("Holding not found:", holdingError);
      return new Response(
        JSON.stringify({ error: "Investment not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (holding.status !== "active") {
      return new Response(
        JSON.stringify({ error: "This investment has already been cashed out" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Calculate days since purchase
    const purchaseDate = new Date(holding.purchase_date);
    const now = new Date();
    const daysSincePurchase = Math.floor((now.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24));

    // Apply 10% penalty if less than 90 days
    let cashOutAmount = holding.current_value;
    let penalty = 0;

    if (daysSincePurchase < 90) {
      penalty = holding.current_value * 0.10;
      cashOutAmount = holding.current_value * 0.90;
    }

    // Update holding status with optimistic locking using updated_at
    const { data: updatedHolding, error: updateError } = await supabaseClient
      .from("portfolio_holdings")
      .update({ status: "cashed_out" })
      .eq("id", holdingId)
      .eq("user_id", user.id)
      .eq("status", "active") // Only update if still active (prevent double cash-out)
      .select()
      .single();

    if (updateError || !updatedHolding) {
      console.error("Failed to update holding - possible race condition:", updateError);
      return new Response(
        JSON.stringify({ error: "Cash out failed. The investment may have already been processed." }),
        {
          status: 409,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get or create wallet
    let { data: wallet } = await supabaseClient
      .from("wallets")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!wallet) {
      const { data: newWallet, error: walletError } = await supabaseClient
        .from("wallets")
        .insert({ user_id: user.id, balance: 0 })
        .select()
        .single();

      if (walletError) {
        console.error("Failed to create wallet:", walletError);
        // Rollback holding status
        await supabaseClient
          .from("portfolio_holdings")
          .update({ status: "active" })
          .eq("id", holdingId);
        
        return new Response(
          JSON.stringify({ error: "Cash out failed. Please try again." }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      wallet = newWallet;
    }

    // Update wallet balance
    const { error: balanceError } = await supabaseClient
      .from("wallets")
      .update({ balance: Number(wallet.balance) + cashOutAmount })
      .eq("id", wallet.id)
      .eq("user_id", user.id);

    if (balanceError) {
      console.error("Failed to update wallet balance:", balanceError);
      // Rollback holding status
      await supabaseClient
        .from("portfolio_holdings")
        .update({ status: "active" })
        .eq("id", holdingId);
      
      return new Response(
        JSON.stringify({ error: "Cash out failed. Please try again." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create cash out transaction
    const { error: txError } = await supabaseClient
      .from("transactions")
      .insert({
        user_id: user.id,
        type: "cash_out",
        amount: cashOutAmount,
        description: `Cashed out ${holding.investment_name}`,
        related_holding_id: holdingId,
      });

    if (txError) {
      console.error("Failed to create transaction record:", txError);
      // Continue - transaction record is for audit, cash out succeeded
    }

    // If there was a penalty, create penalty transaction
    if (penalty > 0) {
      const { error: penaltyError } = await supabaseClient
        .from("transactions")
        .insert({
          user_id: user.id,
          type: "penalty",
          amount: -penalty,
          description: `Early withdrawal penalty (${daysSincePurchase} days, 10% fee)`,
          related_holding_id: holdingId,
        });

      if (penaltyError) {
        console.error("Failed to create penalty transaction record:", penaltyError);
        // Continue - penalty record is for audit
      }
    }

    console.log(`Cash-out successful for user ${user.id}: €${cashOutAmount}`);

    return new Response(
      JSON.stringify({
        success: true,
        cashOutAmount,
        penalty,
        daysSincePurchase,
        penaltyApplied: daysSincePurchase < 90,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error processing cash out:", error);
    return new Response(JSON.stringify({ error: "Cash out failed. Please try again." }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
