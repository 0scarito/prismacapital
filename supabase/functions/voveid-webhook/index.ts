import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-voveid-signature",
};

/**
 * Compute HMAC-SHA256 signature for webhook verification
 */
async function computeHmacSha256(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(payload);
  
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, messageData);
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * VoveID Webhook Handler
 * 
 * This endpoint receives async verification updates from VoveID.
 * When a user completes verification, VoveID sends a POST request
 * with the verification result.
 * 
 * Register this webhook URL in VoveID Dashboard:
 * https://<project-ref>.supabase.co/functions/v1/voveid-webhook
 */
serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Only accept POST requests
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const VOVEID_WEBHOOK_SECRET = Deno.env.get("VOVEID_WEBHOOK_SECRET");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Get raw body for signature verification
    const rawBody = await req.text();
    
    // Verify webhook signature if secret is configured
    const signature = req.headers.get("x-voveid-signature");
    if (VOVEID_WEBHOOK_SECRET && signature) {
      const computedSignature = await computeHmacSha256(rawBody, VOVEID_WEBHOOK_SECRET);
      
      if (signature !== computedSignature) {
        console.error("Invalid webhook signature");
        return new Response(
          JSON.stringify({ error: "Invalid signature" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      console.log("Webhook signature verified successfully");
    } else if (VOVEID_WEBHOOK_SECRET && !signature) {
      console.warn("Webhook secret configured but no signature in request");
    } else {
      console.log("No webhook secret configured - skipping signature verification");
    }

    const body = JSON.parse(rawBody);
    console.log("VoveID webhook received:", {
      event: body.event || body.type,
      refId: body.refId || body.userId,
      status: body.status,
    });

    // Extract data from webhook payload
    const event = body.event || body.type;
    const refId = body.refId || body.userId || body.data?.refId;
    const status = body.status || body.data?.status;
    const documentData = body.documentData || body.data?.documentData || {};

    // Process verification failures
    if (["verification.failed", "user.rejected", "failed"].includes(event) || 
        status === "failed" || status === "rejected") {
      console.log("Processing failed verification:", { event, status, refId });
      
      if (refId) {
        const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        
        await supabaseAdmin
          .from("profiles")
          .update({ kyc_status: "failed" })
          .eq("id", refId);
        
        console.log("Updated profile to failed status:", { refId });
      }
      
      return new Response(
        JSON.stringify({ received: true, processed: true, action: "marked_failed" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Only process successful verifications
    if (!["verification.completed", "user.approved", "success"].includes(event) && 
        status !== "success" && status !== "approved") {
      console.log("Ignoring non-success event:", { event, status });
      return new Response(
        JSON.stringify({ received: true, processed: false }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!refId) {
      console.error("No refId in webhook payload");
      return new Response(
        JSON.stringify({ error: "Missing refId" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Extract identity information
    const personalNumber = documentData.documentNumber || 
                          documentData.idNumber || 
                          body.documentNumber ||
                          refId;
    
    const fullName = documentData.fullName || 
                    `${documentData.firstName || ""} ${documentData.lastName || ""}`.trim() ||
                    body.name;

    console.log("Processing verification:", { refId, hasPersonalNumber: !!personalNumber, hasName: !!fullName });

    // Update user profile
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Check if user exists
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id, eid_personal_number, kyc_status")
      .eq("id", refId)
      .maybeSingle();

    if (profileError || !profile) {
      console.error("Profile not found for refId:", refId, profileError);
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Skip if already verified
    if (profile.eid_personal_number && profile.kyc_status === "verified") {
      console.log("User already verified, skipping:", refId);
      return new Response(
        JSON.stringify({ received: true, alreadyVerified: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if personal number is used by another account
    const { data: existingProfile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("eid_personal_number", personalNumber)
      .neq("id", refId)
      .maybeSingle();

    if (existingProfile) {
      console.error("Personal number already linked to another account");
      
      // Mark as failed since identity is already used
      await supabaseAdmin
        .from("profiles")
        .update({ kyc_status: "failed" })
        .eq("id", refId);
      
      return new Response(
        JSON.stringify({ error: "Identity already linked to another account" }),
        { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update profile with full verification data
    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({ 
        eid_personal_number: personalNumber,
        kyc_provider: "voveid",
        verified_name: fullName || null,
        kyc_status: "verified",
        kyc_verified_at: new Date().toISOString(),
      })
      .eq("id", refId);

    if (updateError) {
      console.error("Error updating profile:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update profile" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Successfully updated profile via webhook:", { refId, personalNumber, verifiedName: fullName });

    return new Response(
      JSON.stringify({ 
        received: true, 
        processed: true,
        userId: refId,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("VoveID webhook error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
