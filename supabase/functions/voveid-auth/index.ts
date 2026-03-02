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

type RequestBody = { action: "create-session" } | { action: "get-status" } | { action: "get-config" };

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const VOVEID_API_KEY = Deno.env.get("VOVEID_API_KEY");
    const VOVEID_ENVIRONMENT = Deno.env.get("VOVEID_ENVIRONMENT") || "sandbox";
    const VOVEID_BASE_URL = VOVEID_ENVIRONMENT.toLowerCase() === "production" 
      ? VOVEID_PRODUCTION_URL 
      : VOVEID_SANDBOX_URL;

    if (!VOVEID_API_KEY) {
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
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body: RequestBody = await req.json();
    console.log("VoveID request:", { action: body.action, userId: user.id });

    const VOVEID_PUBLIC_KEY = Deno.env.get("VITE_VOVEID_PUBLIC_KEY");
    const VOVEID_FLOW_ID = Deno.env.get("VITE_VOVEID_FLOW_ID");
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // ── GET CONFIG ──
    if (body.action === "get-config") {
      if (!VOVEID_PUBLIC_KEY || !VOVEID_FLOW_ID) {
        return new Response(
          JSON.stringify({ error: "VoveID configuration incomplete" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      return new Response(
        JSON.stringify({ publicKey: VOVEID_PUBLIC_KEY, flowId: VOVEID_FLOW_ID, environment: VOVEID_ENVIRONMENT }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── CREATE SESSION ──
    if (body.action === "create-session") {
      if (!VOVEID_FLOW_ID) {
        return new Response(
          JSON.stringify({ error: "VoveID flow ID not configured" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Fetch user profile to send user info for data matching
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .single();

      // Parse display_name into firstName / lastName
      let firstName = "";
      let lastName = "";
      if (profile?.display_name) {
        const parts = profile.display_name.trim().split(/\s+/);
        firstName = parts[0] || "";
        lastName = parts.slice(1).join(" ") || "";
      }

      // Set pending immediately
      await supabaseAdmin
        .from("profiles")
        .update({ kyc_status: "pending", kyc_provider: "voveid" })
        .eq("id", user.id);

      // Build session payload with optional user info
      const sessionPayload: Record<string, unknown> = {
        refId: user.id,
        flowId: VOVEID_FLOW_ID,
        forceCreation: true,
      };
      if (firstName) {
        sessionPayload.user = { firstName, lastName: lastName || undefined };
      }

      console.log("Creating VoveID session:", { flowId: VOVEID_FLOW_ID, refId: user.id, hasUserInfo: !!firstName });

      const voveResponse = await fetch(`${VOVEID_BASE_URL}/sessions`, {
        method: "POST",
        headers: { "x-api-key": VOVEID_API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify(sessionPayload),
      });

      if (!voveResponse.ok) {
        const errorText = await voveResponse.text();
        console.error("VoveID API error:", voveResponse.status, errorText);
        await supabaseAdmin.from("profiles").update({ kyc_status: "none" }).eq("id", user.id);
        return new Response(
          JSON.stringify({ error: "Failed to create verification session", details: errorText }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const voveData = await voveResponse.json();
      const sessionToken = voveData.sessionToken || voveData.token;
      console.log("VoveID session created:", { hasToken: !!sessionToken, keys: Object.keys(voveData) });

      if (!sessionToken) {
        await supabaseAdmin.from("profiles").update({ kyc_status: "none" }).eq("id", user.id);
        return new Response(
          JSON.stringify({ error: "No session token received from VoveID" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ sessionToken, sessionId: voveData.sessionId || voveData.id }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── GET STATUS ──
    if (body.action === "get-status") {
      console.log("Getting VoveID status for user:", user.id);

      const voveResponse = await fetch(`${VOVEID_BASE_URL}/users/${user.id}`, {
        method: "GET",
        headers: { "x-api-key": VOVEID_API_KEY },
      });

      if (!voveResponse.ok) {
        if (voveResponse.status === 404) {
          return new Response(
            JSON.stringify({ status: "pending" }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        return new Response(
          JSON.stringify({ error: "Failed to get verification status" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const voveData = await voveResponse.json();
      console.log("VoveID user data:", { status: voveData.status, documentsCount: voveData.documents?.length });

      // ── successful ──
      if (voveData.status === "successful") {
        // Extract identity from documents[] array
        const idDoc = voveData.documents?.find((d: any) => d.stepId === "ID_DOCUMENT") || voveData.documents?.[0];
        const firstName = idDoc?.firstName || "";
        const lastName = idDoc?.lastName || "";
        const fullName = `${firstName} ${lastName}`.trim();
        const personalNumber = idDoc?.idNumber || idDoc?.documentNumber || user.id;

        // Deduplication check
        const { data: existingProfile } = await supabaseAdmin
          .from("profiles")
          .select("id")
          .eq("eid_personal_number", personalNumber)
          .neq("id", user.id)
          .maybeSingle();

        if (existingProfile) {
          await supabaseAdmin.from("profiles").update({ kyc_status: "failed" }).eq("id", user.id);
          return new Response(
            JSON.stringify({ error: "This identity is already linked to another account", status: "failed" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Update profile as verified
        await supabaseAdmin
          .from("profiles")
          .update({
            eid_personal_number: personalNumber,
            kyc_provider: "voveid",
            verified_name: fullName || null,
            kyc_status: "verified",
            kyc_verified_at: new Date().toISOString(),
          })
          .eq("id", user.id);

        return new Response(
          JSON.stringify({
            success: true,
            status: "verified",
            identity: { personalNumber, name: fullName, provider: "voveid" },
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // ── suspected → failed ──
      if (voveData.status === "suspected") {
        await supabaseAdmin.from("profiles").update({ kyc_status: "failed" }).eq("id", user.id);
        return new Response(
          JSON.stringify({ success: false, status: "failed" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // ── in_progress / pending → still pending ──
      return new Response(
        JSON.stringify({ success: false, status: voveData.status || "pending" }),
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
