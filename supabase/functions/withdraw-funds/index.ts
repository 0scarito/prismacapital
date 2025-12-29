import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation schema with maximum withdrawal limit
const withdrawSchema = z.object({
  amount: z.number()
    .min(1, "Minimum withdrawal is €1")
    .max(100000, "Maximum withdrawal is €100,000 per transaction")
    .optional(),
});

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

    // Parse and validate request body
    const body = await req.json().catch(() => ({}));
    const validation = withdrawSchema.safeParse(body);
    
    if (!validation.success) {
      console.error("Validation error:", validation.error.errors);
      return new Response(
        JSON.stringify({ error: validation.error.errors[0]?.message || "Invalid withdrawal amount" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const requestedAmount = validation.data?.amount;

    // Fetch user's wallet
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

    // Determine withdrawal amount with validation
    let withdrawalAmount: number;
    if (requestedAmount) {
      if (requestedAmount > wallet.balance) {
        return new Response(
          JSON.stringify({ error: "Withdrawal amount exceeds available balance" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      withdrawalAmount = requestedAmount;
    } else {
      withdrawalAmount = wallet.balance;
    }

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

    // Update wallet balance with optimistic locking using updated_at
    const { data: updatedWallet, error: updateError } = await supabaseClient
      .from("wallets")
      .update({ 
        balance: newBalance,
        updated_at: new Date().toISOString()
      })
      .eq("id", wallet.id)
      .eq("user_id", user.id)
      .eq("updated_at", wallet.updated_at) // Optimistic locking
      .select()
      .single();

    if (updateError || !updatedWallet) {
      console.error("Error updating wallet - possible race condition:", updateError);
      return new Response(
        JSON.stringify({ error: "Withdrawal failed. Please try again." }),
        {
          status: 409,
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
