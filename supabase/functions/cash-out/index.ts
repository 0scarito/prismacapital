import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: userData } = await supabaseClient.auth.getUser(token);
    const user = userData.user;

    if (!user) {
      throw new Error("User not authenticated");
    }

    const { holdingId } = await req.json();

    // Get the holding
    const { data: holding, error: holdingError } = await supabaseClient
      .from("portfolio_holdings")
      .select("*")
      .eq("id", holdingId)
      .eq("user_id", user.id)
      .single();

    if (holdingError || !holding) {
      throw new Error("Holding not found");
    }

    if (holding.status !== "active") {
      throw new Error("This investment has already been cashed out");
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

    // Start a transaction
    // Update holding status
    const { error: updateError } = await supabaseClient
      .from("portfolio_holdings")
      .update({ status: "cashed_out" })
      .eq("id", holdingId);

    if (updateError) throw updateError;

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

      if (walletError) throw walletError;
      wallet = newWallet;
    }

    // Update wallet balance
    const { error: balanceError } = await supabaseClient
      .from("wallets")
      .update({ balance: Number(wallet.balance) + cashOutAmount })
      .eq("id", wallet.id);

    if (balanceError) throw balanceError;

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

    if (txError) throw txError;

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

      if (penaltyError) throw penaltyError;
    }

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
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
