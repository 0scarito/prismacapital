import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SCRIVE_BASE_URL = "https://api.scrive.com/eid/v1";

interface CreateTransactionRequest {
  action: "create";
  provider: "seBankID" | "noBankID" | "dkMitID";
  redirectUrl: string;
}

interface VerifyTransactionRequest {
  action: "verify";
  transactionId: string;
}

type RequestBody = CreateTransactionRequest | VerifyTransactionRequest;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const SCRIVE_EID_TOKEN = Deno.env.get("SCRIVE_EID_TOKEN");
    if (!SCRIVE_EID_TOKEN) {
      console.error("SCRIVE_EID_TOKEN is not configured");
      return new Response(
        JSON.stringify({ error: "eID service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const body: RequestBody = await req.json();
    console.log("Scrive eID auth request:", { action: body.action });

    if (body.action === "create") {
      // Create transaction - public endpoint (no auth required)
      const { provider, redirectUrl } = body as CreateTransactionRequest;

      if (!provider || !redirectUrl) {
        return new Response(
          JSON.stringify({ error: "Missing provider or redirectUrl" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log("Creating Scrive transaction:", { provider, redirectUrl });

      const scriveResponse = await fetch(`${SCRIVE_BASE_URL}/transaction/new`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${SCRIVE_EID_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          method: "auth",
          provider,
          redirectUrl,
          providerParameters: { auth: {} },
        }),
      });

      if (!scriveResponse.ok) {
        const errorText = await scriveResponse.text();
        console.error("Scrive API error:", scriveResponse.status, errorText);
        return new Response(
          JSON.stringify({ error: "Failed to initiate eID authentication" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const scriveData = await scriveResponse.json();
      console.log("Scrive transaction created:", { id: scriveData.id });

      return new Response(
        JSON.stringify({
          accessUrl: scriveData.accessUrl,
          transactionId: scriveData.id,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else if (body.action === "verify") {
      // Verify transaction - returns user identity
      const { transactionId } = body as VerifyTransactionRequest;

      if (!transactionId) {
        return new Response(
          JSON.stringify({ error: "Missing transactionId" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log("Verifying Scrive transaction:", { transactionId });

      const scriveResponse = await fetch(`${SCRIVE_BASE_URL}/transaction/${transactionId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${SCRIVE_EID_TOKEN}`,
        },
      });

      if (!scriveResponse.ok) {
        const errorText = await scriveResponse.text();
        console.error("Scrive API error:", scriveResponse.status, errorText);
        return new Response(
          JSON.stringify({ error: "Failed to verify eID transaction" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const scriveData = await scriveResponse.json();
      console.log("Scrive transaction status:", { status: scriveData.status });

      if (scriveData.status !== "complete") {
        return new Response(
          JSON.stringify({ 
            error: "eID verification not complete",
            status: scriveData.status 
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Extract identity from providerInfo
      const providerInfo = scriveData.providerInfo || {};
      const personalNumber = providerInfo.personalNumber || providerInfo.pid || providerInfo.ssn;
      const fullName = providerInfo.name || providerInfo.fullName || 
        `${providerInfo.givenName || ""} ${providerInfo.surname || ""}`.trim();
      
      console.log("eID identity extracted:", { hasPersonalNumber: !!personalNumber, hasName: !!fullName });

      if (!personalNumber) {
        console.error("No personal number in providerInfo:", Object.keys(providerInfo));
        return new Response(
          JSON.stringify({ error: "Could not extract identity from eID" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Use service role to check/create user
      const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

      // Check if user exists with this personal number
      const { data: existingProfile, error: profileError } = await supabaseAdmin
        .from("profiles")
        .select("id, display_name")
        .eq("eid_personal_number", personalNumber)
        .maybeSingle();

      if (profileError) {
        console.error("Error checking existing profile:", profileError);
        return new Response(
          JSON.stringify({ error: "Database error" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      let userId: string;
      let isNewUser = false;

      if (existingProfile) {
        // Existing user - sign them in
        userId = existingProfile.id;
        console.log("Found existing user:", { userId });
      } else {
        // New user - create account
        const email = `eid_${personalNumber.replace(/[^a-zA-Z0-9]/g, "")}@eid.prisma.local`;
        
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email,
          email_confirm: true,
          user_metadata: {
            display_name: fullName,
            eid_provider: scriveData.provider,
          },
        });

        if (createError) {
          console.error("Error creating user:", createError);
          return new Response(
            JSON.stringify({ error: "Failed to create user account" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        userId = newUser.user.id;
        isNewUser = true;

        // Update profile with eID personal number and name
        const { error: updateError } = await supabaseAdmin
          .from("profiles")
          .update({ 
            eid_personal_number: personalNumber,
            display_name: fullName,
          })
          .eq("id", userId);

        if (updateError) {
          console.error("Error updating profile:", updateError);
        }

        console.log("Created new user:", { userId });
      }

      // Generate a magic link / session for the user
      const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
        type: "magiclink",
        email: (await supabaseAdmin.auth.admin.getUserById(userId)).data.user?.email!,
      });

      if (linkError || !linkData) {
        console.error("Error generating session:", linkError);
        return new Response(
          JSON.stringify({ error: "Failed to create session" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Extract the token from the magic link
      const magicLinkUrl = new URL(linkData.properties.action_link);
      const token = magicLinkUrl.searchParams.get("token");
      const tokenType = magicLinkUrl.searchParams.get("type");

      return new Response(
        JSON.stringify({
          success: true,
          isNewUser,
          identity: {
            personalNumber,
            name: fullName,
            provider: scriveData.provider,
          },
          auth: {
            token,
            type: tokenType,
          },
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Scrive eID auth error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
