import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, svix-id, svix-timestamp, svix-signature",
};

/**
 * Verify Svix webhook signature (used by VoveID)
 * Secret format: "whsec_<base64key>"
 */
async function verifySvixSignature(
  rawBody: string,
  svixId: string,
  svixTimestamp: string,
  svixSignature: string,
  secret: string
): Promise<boolean> {
  // Strip "whsec_" prefix and base64-decode the key
  const keyBase64 = secret.startsWith("whsec_") ? secret.slice(6) : secret;
  const keyBytes = Uint8Array.from(atob(keyBase64), (c) => c.charCodeAt(0));

  // Build the signed content: "${svix_id}.${svix_timestamp}.${body}"
  const signedContent = `${svixId}.${svixTimestamp}.${rawBody}`;
  const encoder = new TextEncoder();

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureBytes = await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(signedContent));
  const computedSig = btoa(String.fromCharCode(...new Uint8Array(signatureBytes)));

  // Svix-Signature can contain multiple signatures separated by spaces, each prefixed with "v1,"
  const expectedSigs = svixSignature.split(" ").map((s) => s.replace("v1,", ""));
  return expectedSigs.some((sig) => sig === computedSig);
}

// VoveID API URLs
const VOVEID_SANDBOX_URL = "https://api.voveid.net/v2";
const VOVEID_PRODUCTION_URL = "https://api.voveid.com/v2";

/**
 * Fetch full user data from VoveID API to extract identity documents
 */
async function fetchVoveidUserData(refId: string, apiKey: string, baseUrl: string) {
  const response = await fetch(`${baseUrl}/users/${refId}`, {
    method: "GET",
    headers: { "x-api-key": apiKey },
  });
  if (!response.ok) {
    console.error("Failed to fetch VoveID user data:", response.status);
    return null;
  }
  return await response.json();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const VOVEID_WEBHOOK_SECRET = Deno.env.get("VOVEID_WEBHOOK_SECRET");
    const VOVEID_API_KEY = Deno.env.get("VOVEID_API_KEY");
    const VOVEID_ENVIRONMENT = Deno.env.get("VOVEID_ENVIRONMENT") || "sandbox";
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const VOVEID_BASE_URL = VOVEID_ENVIRONMENT.toLowerCase() === "production"
      ? VOVEID_PRODUCTION_URL
      : VOVEID_SANDBOX_URL;

    const rawBody = await req.text();

    // ── Svix Signature Verification ──
    if (VOVEID_WEBHOOK_SECRET) {
      const svixId = req.headers.get("svix-id");
      const svixTimestamp = req.headers.get("svix-timestamp");
      const svixSignature = req.headers.get("svix-signature");

      if (!svixId || !svixTimestamp || !svixSignature) {
        console.error("Missing Svix headers");
        return new Response(JSON.stringify({ error: "Missing signature headers" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Reject if timestamp is too old (5 min tolerance)
      const nowSeconds = Math.floor(Date.now() / 1000);
      const webhookTimestamp = parseInt(svixTimestamp, 10);
      if (Math.abs(nowSeconds - webhookTimestamp) > 300) {
        console.error("Webhook timestamp too old");
        return new Response(JSON.stringify({ error: "Timestamp too old" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const isValid = await verifySvixSignature(rawBody, svixId, svixTimestamp, svixSignature, VOVEID_WEBHOOK_SECRET);
      if (!isValid) {
        console.error("Invalid Svix webhook signature");
        return new Response(JSON.stringify({ error: "Invalid signature" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      console.log("Svix signature verified");
    } else {
      console.warn("No VOVEID_WEBHOOK_SECRET configured – skipping signature verification");
    }

    const body = JSON.parse(rawBody);
    const refId = body.refId || body.data?.refId;
    const status = body.status || body.data?.status;
    console.log("VoveID webhook:", { refId, status, type: body.type });

    if (!refId) {
      console.error("No refId in webhook payload");
      return new Response(JSON.stringify({ error: "Missing refId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Check user exists
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id, eid_personal_number, kyc_status")
      .eq("id", refId)
      .maybeSingle();

    if (profileError || !profile) {
      console.error("Profile not found:", refId);
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Skip if already verified
    if (profile.kyc_status === "verified" && profile.eid_personal_number) {
      console.log("Already verified, skipping:", refId);
      return new Response(JSON.stringify({ received: true, alreadyVerified: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── SUCCESSFUL ──
    if (status === "successful") {
      if (!VOVEID_API_KEY) {
        console.error("VOVEID_API_KEY not set, cannot fetch user data");
        return new Response(JSON.stringify({ error: "Server configuration error" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Fetch full user data to extract identity documents
      const userData = await fetchVoveidUserData(refId, VOVEID_API_KEY, VOVEID_BASE_URL);
      if (!userData) {
        console.error("Could not fetch user data after successful webhook");
        // Still mark as verified with minimal data
      }

      const idDoc = userData?.documents?.find((d: any) => d.stepId === "ID_DOCUMENT") || userData?.documents?.[0];
      const firstName = idDoc?.firstName || "";
      const lastName = idDoc?.lastName || "";
      const fullName = `${firstName} ${lastName}`.trim();
      const personalNumber = idDoc?.idNumber || idDoc?.documentNumber || refId;

      // Deduplication check
      const { data: existing } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("eid_personal_number", personalNumber)
        .neq("id", refId)
        .maybeSingle();

      if (existing) {
        console.error("Identity already linked to another account:", personalNumber);
        await supabaseAdmin.from("profiles").update({ kyc_status: "failed" }).eq("id", refId);
        return new Response(JSON.stringify({ error: "Identity already used" }), {
          status: 409,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      await supabaseAdmin
        .from("profiles")
        .update({
          eid_personal_number: personalNumber,
          kyc_provider: "voveid",
          verified_name: fullName || null,
          kyc_status: "verified",
          kyc_verified_at: new Date().toISOString(),
        })
        .eq("id", refId);

      console.log("Profile verified via webhook:", { refId, name: fullName });
      return new Response(JSON.stringify({ received: true, processed: true, action: "verified" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── SUSPECTED → failed ──
    if (status === "suspected") {
      await supabaseAdmin.from("profiles").update({ kyc_status: "failed" }).eq("id", refId);
      console.log("Profile marked failed (suspected):", refId);
      return new Response(JSON.stringify({ received: true, processed: true, action: "marked_failed" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── IN_PROGRESS / PENDING → keep pending ──
    if (status === "in_progress" || status === "pending") {
      // Ensure pending status is set
      if (profile.kyc_status !== "pending") {
        await supabaseAdmin.from("profiles").update({ kyc_status: "pending" }).eq("id", refId);
      }
      console.log("Verification still processing:", { refId, status });
      return new Response(JSON.stringify({ received: true, processed: true, action: "still_pending" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Unknown status ──
    console.log("Unknown webhook status, ignoring:", { refId, status });
    return new Response(JSON.stringify({ received: true, processed: false }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("VoveID webhook error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
