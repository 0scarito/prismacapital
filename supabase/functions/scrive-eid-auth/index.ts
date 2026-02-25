import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SCRIVE_BASE_URL = "https://testbed-eid.scrive.com/api/v1";

// Safe JSON parse helper
async function safeJsonParse(response: Response): Promise<{ ok: boolean; status: number; data: any; rawText?: string }> {
  const text = await response.text();
  try {
    const data = JSON.parse(text);
    return { ok: response.ok, status: response.status, data };
  } catch {
    return { ok: response.ok, status: response.status, data: null, rawText: text };
  }
}

// Authenticate user from JWT
async function authenticateUser(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } }
  );

  const token = authHeader.replace("Bearer ", "");
  const { data, error } = await supabase.auth.getClaims(token);
  if (error || !data?.claims) return null;

  return { userId: data.claims.sub as string, supabase };
}

// Extract identity from Scrive Onfido completion data
function extractIdentity(providerInfo: any): { name: string | null; documentNumber: string | null } {
  const onfido = providerInfo?.onfidoAuth;
  const completion = onfido?.completionData;

  if (!completion) return { name: null, documentNumber: null };

  // Onfido completionData may have various structures — extract what's available
  const firstName = completion.first_name || completion.firstName || "";
  const lastName = completion.last_name || completion.lastName || "";
  const fullName = (firstName + " " + lastName).trim() || completion.full_name || completion.fullName || null;
  const documentNumber = completion.document_number || completion.documentNumber || 
                         completion.id_number || completion.idNumber || null;

  return { name: fullName, documentNumber };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const SCRIVE_EID_TOKEN = Deno.env.get("SCRIVE_EID_TOKEN");
    if (!SCRIVE_EID_TOKEN) {
      return new Response(
        JSON.stringify({ error: "SCRIVE_EID_TOKEN not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const body = await req.json();
    const { action } = body;
    console.log("Scrive eID request:", { action });

    // --- CREATE TRANSACTION ---
    if (action === "create") {
      // Authenticate user
      const auth = await authenticateUser(req);
      if (!auth) {
        return new Response(
          JSON.stringify({ error: "Authentication required" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const { userId, supabase } = auth;
      const redirectUrl = body.redirectUrl || "https://example.com";
      console.log("Creating Onfido transaction for user:", userId, "redirect:", redirectUrl);

      // Set profile to pending immediately
      const serviceClient = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      );

      await serviceClient
        .from("profiles")
        .update({
          kyc_status: "pending",
          kyc_provider: "onfido",
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      const createPayload = {
        provider: "onfido",
        redirectUrl,
        method: "auth",
        providerParameters: {
          auth: {
            onfido: {
              report: "documentFacialSimilarityMotion",
              allowedDocumentTypes: ["Passport", "NationalIdentityCard", "DrivingLicence"],
              uiLocale: "en-US",
            },
          },
        },
      };

      const response = await fetch(`${SCRIVE_BASE_URL}/transaction/new`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SCRIVE_EID_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createPayload),
      });

      const result = await safeJsonParse(response);
      console.log("Scrive create response:", result.status, result.data || result.rawText);

      if (!result.ok) {
        return new Response(
          JSON.stringify({ error: "Scrive create failed", upstream_status: result.status, upstream_error: result.data || result.rawText }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      // Start transaction
      console.log(`Starting transaction: ${result.data.id}`);
      const startResponse = await fetch(`${SCRIVE_BASE_URL}/transaction/${result.data.id}/start`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SCRIVE_EID_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      const startResult = await safeJsonParse(startResponse);
      console.log("Scrive start response:", startResult.status);

      return new Response(
        JSON.stringify({
          success: true,
          transactionId: result.data.id,
          accessUrl: result.data.accessUrl,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // --- VERIFY TRANSACTION ---
    if (action === "verify") {
      // Authenticate user
      const auth = await authenticateUser(req);
      if (!auth) {
        return new Response(
          JSON.stringify({ error: "Authentication required" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const { userId } = auth;
      const { transactionId } = body;
      console.log("Verifying transaction:", transactionId, "for user:", userId);

      const response = await fetch(`${SCRIVE_BASE_URL}/transaction/${transactionId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${SCRIVE_EID_TOKEN}` },
      });

      const result = await safeJsonParse(response);
      console.log("Scrive verify response:", result.status, "status:", result.data?.status);

      if (!result.ok || !result.data) {
        return new Response(
          JSON.stringify({ success: false, status: "error", error: result.rawText || "Failed to fetch transaction" }),
          { status: result.ok ? 200 : result.status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const txData = result.data;
      const scriveStatus = txData.status; // "started" | "completed" | "failed"
      const checksClear = txData.providerInfo?.onfidoAuth?.checksClear;

      const serviceClient = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      );

      // Map Scrive status to our KYC status
      if (scriveStatus === "completed" && checksClear === true) {
        // SUCCESS: Extract identity and update profile
        const identity = extractIdentity(txData.providerInfo);
        console.log("Onfido verification successful, identity:", identity);

        // Check for duplicate document number
        if (identity.documentNumber) {
          const { data: existingProfiles } = await serviceClient
            .from("profiles")
            .select("id")
            .eq("eid_personal_number", identity.documentNumber)
            .neq("id", userId);

          if (existingProfiles && existingProfiles.length > 0) {
            console.error("Duplicate document number detected:", identity.documentNumber);
            await serviceClient
              .from("profiles")
              .update({
                kyc_status: "failed",
                updated_at: new Date().toISOString(),
              })
              .eq("id", userId);

            return new Response(
              JSON.stringify({
                success: false,
                status: "failed",
                error: "This identity document is already linked to another account",
              }),
              { headers: { ...corsHeaders, "Content-Type": "application/json" } },
            );
          }
        }

        // Update profile with verified identity
        await serviceClient
          .from("profiles")
          .update({
            kyc_status: "verified",
            kyc_provider: "onfido",
            kyc_verified_at: new Date().toISOString(),
            verified_name: identity.name,
            eid_personal_number: identity.documentNumber,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);

        return new Response(
          JSON.stringify({
            success: true,
            status: "verified",
            verificationOnly: true,
            identity: { name: identity.name, documentNumber: identity.documentNumber },
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      if (scriveStatus === "completed" && checksClear === false) {
        // FAILED checks
        console.log("Onfido checks failed for user:", userId);
        await serviceClient
          .from("profiles")
          .update({
            kyc_status: "failed",
            kyc_provider: "onfido",
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);

        return new Response(
          JSON.stringify({ success: false, status: "failed", error: "Identity verification checks did not pass" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      if (scriveStatus === "started") {
        // PENDING - user hasn't completed Onfido yet
        return new Response(
          JSON.stringify({ success: true, status: "pending" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      // FAILED or unknown status
      console.log("Scrive transaction in unexpected state:", scriveStatus);
      await serviceClient
        .from("profiles")
        .update({
          kyc_status: "failed",
          kyc_provider: "onfido",
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      return new Response(
        JSON.stringify({ success: false, status: "failed", error: `Verification failed (status: ${scriveStatus})` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
