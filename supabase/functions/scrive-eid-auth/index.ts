import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// --- CONFIGURATION ---
const SCRIVE_BASE_URL = "https://testbed-eid.scrive.com/api/v1";
const SCRIVE_EID_TOKEN = "2e222dce-78a8-41a4-a742-043ec2523dbd.80801023-1c06-4f9c-bc87-a47911e27ba0";

// Safe JSON parse helper - handles non-JSON responses from Scrive
async function safeJsonParse(response: Response): Promise<{ ok: boolean; status: number; data: any; rawText?: string }> {
  const text = await response.text();
  try {
    const data = JSON.parse(text);
    return { ok: response.ok, status: response.status, data };
  } catch {
    return { ok: response.ok, status: response.status, data: null, rawText: text };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json();
    const { action } = body;

    console.log("Scrive eID request:", { action });

    // 1. CREATE TRANSACTION
    if (action === "create") {
      const redirectUrl = body.redirectUrl || "https://example.com";
      console.log("Creating Onfido transaction, redirect:", redirectUrl);

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

      console.log("Create payload:", JSON.stringify(createPayload));

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
          JSON.stringify({
            error: "Scrive create failed",
            upstream_status: result.status,
            upstream_error: result.data || result.rawText,
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      // 2. START TRANSACTION
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
      console.log("Scrive start response:", startResult.status, startResult.data || startResult.rawText);

      if (!startResult.ok) {
        console.error("Start failed but transaction was created, returning accessUrl anyway");
      }

      return new Response(
        JSON.stringify({
          transactionId: result.data.id,
          accessUrl: result.data.accessUrl,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // 3. VERIFY TRANSACTION
    if (action === "verify") {
      const { transactionId } = body;
      console.log("Verifying transaction:", transactionId);

      const response = await fetch(`${SCRIVE_BASE_URL}/transaction/${transactionId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${SCRIVE_EID_TOKEN}` },
      });

      const result = await safeJsonParse(response);
      console.log("Scrive verify response:", result.status);

      return new Response(JSON.stringify(result.data || { error: result.rawText }), {
        status: result.ok ? 200 : result.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
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
