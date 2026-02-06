import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// VoveID API URLs - Sandbox uses .net, Production uses .com
const VOVEID_SANDBOX_URL = "https://api.voveid.net/v2";
const VOVEID_PRODUCTION_URL = "https://api.voveid.com/v2";

interface CreateSessionRequest {
  action: "create-session";
}

interface GetStatusRequest {
  action: "get-status";
}

interface GetConfigRequest {
  action: "get-config";
}

type RequestBody = CreateSessionRequest | GetStatusRequest | GetConfigRequest;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const VOVEID_API_KEY = Deno.env.get("VOVEID_API_KEY");
    const VOVEID_ENVIRONMENT = Deno.env.get("VOVEID_ENVIRONMENT") || "sandbox";
    
    // Select API URL based on environment
    const VOVEID_BASE_URL = VOVEID_ENVIRONMENT.toLowerCase() === "production" 
      ? VOVEID_PRODUCTION_URL 
      : VOVEID_SANDBOX_URL;

    console.log("VoveID environment check:", {
      hasApiKey: !!VOVEID_API_KEY,
      environment: VOVEID_ENVIRONMENT,
      baseUrl: VOVEID_BASE_URL,
    });

    if (!VOVEID_API_KEY) {
      console.error("VOVEID_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "VoveID service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Verify user is authenticated
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authorization required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      console.error("Auth error:", authError);
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Authenticated user:", { userId: user.id });

    const body: RequestBody = await req.json();
    console.log("VoveID auth request:", { action: body.action, userId: user.id });

    // Get config from environment
    const VOVEID_PUBLIC_KEY = Deno.env.get("VITE_VOVEID_PUBLIC_KEY");
    const VOVEID_FLOW_ID = Deno.env.get("VITE_VOVEID_FLOW_ID");

    if (body.action === "get-config") {
      // Return public configuration for the frontend
      if (!VOVEID_PUBLIC_KEY || !VOVEID_FLOW_ID) {
        console.error("VoveID public key or flow ID not configured");
        return new Response(
          JSON.stringify({ error: "VoveID configuration incomplete" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({
          publicKey: VOVEID_PUBLIC_KEY,
          flowId: VOVEID_FLOW_ID,
          environment: VOVEID_ENVIRONMENT,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );

    } else if (body.action === "create-session") {
      if (!VOVEID_FLOW_ID) {
        return new Response(
          JSON.stringify({ error: "VoveID flow ID not configured" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log("Creating VoveID verification session:", { flowId: VOVEID_FLOW_ID, refId: user.id });

      // Create verification session with VoveID
      const voveResponse = await fetch(`${VOVEID_BASE_URL}/sessions`, {
        method: "POST",
        headers: {
          "x-api-key": VOVEID_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refId: user.id, // Use user ID as reference
          flowId: VOVEID_FLOW_ID,
        }),
      });


      if (!voveResponse.ok) {
        const errorText = await voveResponse.text();
        console.error("VoveID API error:", voveResponse.status, errorText);
        return new Response(
          JSON.stringify({ error: "Failed to create verification session", details: errorText }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const voveData = await voveResponse.json();
      console.log("VoveID API response:", JSON.stringify(voveData));
      
      // VoveID may return the token as 'sessionToken' or 'token'
      const sessionToken = voveData.sessionToken || voveData.token;
      console.log("VoveID session created:", { 
        sessionToken: sessionToken ? "present" : "missing",
        sessionId: voveData.sessionId || voveData.id,
        responseKeys: Object.keys(voveData)
      });

      if (!sessionToken) {
        console.error("No session token in VoveID response:", voveData);
        return new Response(
          JSON.stringify({ error: "No session token received from VoveID", response: voveData }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({
          sessionToken: sessionToken,
          sessionId: voveData.sessionId || voveData.id,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );

    } else if (body.action === "get-status") {
      // Get verification status for the authenticated user
      console.log("Getting VoveID status for user:", { refId: user.id });

      const voveResponse = await fetch(`${VOVEID_BASE_URL}/users/${user.id}`, {
        method: "GET",
        headers: {
          "x-api-key": VOVEID_API_KEY,
        },
      });

      if (!voveResponse.ok) {
        const errorText = await voveResponse.text();
        console.error("VoveID status API error:", voveResponse.status, errorText);
        
        // If 404, user hasn't completed verification
        if (voveResponse.status === 404) {
          return new Response(
            JSON.stringify({ error: "Verification not found", status: "pending" }),
            { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        return new Response(
          JSON.stringify({ error: "Failed to get verification status" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const voveData = await voveResponse.json();
      console.log("VoveID user data:", { 
        status: voveData.status,
        hasDocumentData: !!voveData.documentData,
      });

      // Check if verification is complete and successful
      if (voveData.status === "success" || voveData.status === "approved") {
        // Extract identity data
        const documentData = voveData.documentData || {};
        const personalNumber = documentData.documentNumber || 
                              documentData.idNumber || 
                              voveData.refId ||
                              user.id;
        
        const fullName = documentData.fullName || 
                        `${documentData.firstName || ""} ${documentData.lastName || ""}`.trim() ||
                        voveData.name;

        console.log("VoveID verification successful:", { 
          hasPersonalNumber: !!personalNumber, 
          hasName: !!fullName 
        });

        // Update user profile with verification data
        const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        // Check if this personal number is already used by another account
        const { data: existingProfile } = await supabaseAdmin
          .from("profiles")
          .select("id")
          .eq("eid_personal_number", personalNumber)
          .neq("id", user.id)
          .maybeSingle();

        if (existingProfile) {
          console.error("Personal number already linked to another account");
          return new Response(
            JSON.stringify({ error: "This identity is already linked to another account" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Update profile with verification
        const { error: updateError } = await supabaseAdmin
          .from("profiles")
          .update({ 
            eid_personal_number: personalNumber,
            kyc_provider: "voveid",
          })
          .eq("id", user.id);

        if (updateError) {
          console.error("Error updating profile:", updateError);
          return new Response(
            JSON.stringify({ error: "Failed to update profile" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({
            success: true,
            status: "verified",
            identity: {
              personalNumber,
              name: fullName,
              provider: "voveid",
            },
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Verification not complete
      return new Response(
        JSON.stringify({
          success: false,
          status: voveData.status || "pending",
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("VoveID auth error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
