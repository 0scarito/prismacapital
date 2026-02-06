import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Use sandbox URL for testing - switch to "https://eid.scrive.com/api/v1" for production
const SCRIVE_BASE_URL = Deno.env.get("SCRIVE_EID_SANDBOX") === "false" 
  ? "https://eid.scrive.com/api/v1" 
  : "https://eid-sandbox.scrive.com/api/v1";

interface CreateTransactionRequest {
  action: "create";
  provider: "onfido";
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
    
    // Debug: Log environment variable availability (not values)
    console.log("Environment check:", {
      hasToken: !!SCRIVE_EID_TOKEN,
      tokenLength: SCRIVE_EID_TOKEN?.length || 0,
      tokenPrefix: SCRIVE_EID_TOKEN?.substring(0, 4) || "none",
      apiBaseUrl: SCRIVE_BASE_URL,
    });
    
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

    // Check if user is already authenticated
    const authHeader = req.headers.get("authorization");
    let authenticatedUserId: string | null = null;
    
    if (authHeader) {
      const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: authHeader } }
      });
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (user) {
        authenticatedUserId = user.id;
        console.log("User already authenticated:", { userId: authenticatedUserId });
      }
    }

    const body: RequestBody = await req.json();
    console.log("Scrive eID auth request:", { action: body.action, hasAuthUser: !!authenticatedUserId });

    if (body.action === "create") {
      // Create transaction - can be called by authenticated or unauthenticated users
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

      // Extract identity from providerInfo (Onfido KYC)
      const providerInfo = scriveData.providerInfo || {};
      console.log("Onfido providerInfo keys:", Object.keys(providerInfo));
      
      // Onfido may return document_number, applicant_id, or other identifiers
      const personalNumber = providerInfo.document_number || 
                            providerInfo.applicant_id || 
                            providerInfo.personalNumber || 
                            providerInfo.pid || 
                            providerInfo.ssn ||
                            scriveData.id; // fallback to transaction ID
      
      const fullName = providerInfo.name || 
                      providerInfo.fullName || 
                      `${providerInfo.first_name || providerInfo.givenName || ""} ${providerInfo.last_name || providerInfo.surname || ""}`.trim();
      
      console.log("Identity extracted:", { hasPersonalNumber: !!personalNumber, hasName: !!fullName, provider: scriveData.provider });

      if (!personalNumber) {
        console.error("No identifier found in providerInfo:", JSON.stringify(providerInfo));
        return new Response(
          JSON.stringify({ error: "Could not extract identity from verification" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Use service role for database operations
      const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

      // CASE 1: User is already authenticated - this is identity verification only
      if (authenticatedUserId) {
        console.log("Verifying identity for existing authenticated user:", { userId: authenticatedUserId });
        
        // Check if this personal number is already used by another account
        const { data: existingProfile } = await supabaseAdmin
          .from("profiles")
          .select("id")
          .eq("eid_personal_number", personalNumber)
          .neq("id", authenticatedUserId)
          .maybeSingle();

        if (existingProfile) {
          console.error("Personal number already linked to another account");
          return new Response(
            JSON.stringify({ error: "This eID is already linked to another account" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Update the authenticated user's profile with eID verification
        const { error: updateError } = await supabaseAdmin
          .from("profiles")
          .update({ 
            eid_personal_number: personalNumber,
          })
          .eq("id", authenticatedUserId);

        if (updateError) {
          console.error("Error updating profile with eID:", updateError);
          return new Response(
            JSON.stringify({ error: "Failed to update profile with eID" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        console.log("Successfully verified identity for user:", { userId: authenticatedUserId });

        return new Response(
          JSON.stringify({
            success: true,
            isNewUser: false,
            verificationOnly: true,
            identity: {
              personalNumber,
              name: fullName,
              provider: scriveData.provider,
            },
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // CASE 2: User is NOT authenticated - check if user exists with this personal number
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
