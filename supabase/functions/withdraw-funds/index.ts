import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

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

    console.log(`Withdrawal request from user: ${user.id}`);

    // Parse request body (could include amount in future)
    const body = await req.json().catch(() => ({}));
    const requestedAmount = body.amount; // Optional: allow partial withdrawals

    // Fetch user's wallet with row-level security
    const { data: wallet, error: walletError } = await supabaseClient
      .from("wallets")
      .select("id, balance, updated_at")
      .eq("user_id", user.id)
      .maybeSingle();

    if (walletError) {
      console.error("Error fetching wallet:", walletError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch wallet" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!wallet) {
      console.error("Wallet not found for user:", user.id);
      return new Response(
        JSON.stringify({ error: "Wallet not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate sufficient balance
    if (wallet.balance <= 0) {
      console.log(`Insufficient balance for user ${user.id}: ${wallet.balance}`);
      return new Response(
        JSON.stringify({ error: "Insufficient balance" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Determine withdrawal amount
    const withdrawalAmount = requestedAmount && requestedAmount <= wallet.balance 
      ? requestedAmount 
      : wallet.balance;

    if (withdrawalAmount <= 0) {
      return new Response(
        JSON.stringify({ error: "Invalid withdrawal amount" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Calculate new balance
    const newBalance = wallet.balance - withdrawalAmount;

    console.log(`Processing withdrawal: €${withdrawalAmount} for user ${user.id}`);

    // Update wallet balance atomically
    const { error: updateError } = await supabaseClient
      .from("wallets")
      .update({ 
        balance: newBalance,
        updated_at: new Date().toISOString()
      })
      .eq("id", wallet.id)
      .eq("user_id", user.id); // Double-check ownership

    if (updateError) {
      console.error("Error updating wallet:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to process withdrawal" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create transaction record for audit trail
    const { error: transactionError } = await supabaseClient
      .from("transactions")
      .insert({
        user_id: user.id,
        type: "withdrawal",
        amount: -withdrawalAmount, // Negative for withdrawal
        description: `Withdrawal to bank account: €${withdrawalAmount.toFixed(2)}`,
      });

    if (transactionError) {
      console.error("Error creating transaction record:", transactionError);
      // Don't fail the withdrawal, but log the issue
      console.error("WARNING: Withdrawal succeeded but transaction record failed");
    }

    console.log(`Withdrawal successful for user ${user.id}: €${withdrawalAmount}`);

    return new Response(
      JSON.stringify({
        success: true,
        withdrawalAmount: withdrawalAmount,
        newBalance: newBalance,
        message: `Successfully withdrawn €${withdrawalAmount.toFixed(2)} to your bank account`,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Unexpected error in withdraw-funds:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});