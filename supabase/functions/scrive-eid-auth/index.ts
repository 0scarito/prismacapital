import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// --- CONFIGURATION ---
const SCRIVE_BASE_URL = "https://testbed-eid.scrive.com/api/v1";
// Using the token you provided directly for testing
const SCRIVE_EID_TOKEN = "2e222dce-78a8-41a4-a742-043ec2523dbd.80801023-1c06-4f9c-bc87-a47911e27ba0";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json();
    const { action } = body;

    // 1. CREATE TRANSACTION
    if (action === "create") {
      console.log("Creating Onfido transaction on Testbed...");

      const response = await fetch(`${SCRIVE_BASE_URL}/transaction/new`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SCRIVE_EID_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider: "onfido",
          redirectUrl: body.redirectUrl || "https://example.com",
          method: "auth",
          providerParameters: {
            auth: {
              onfido: {
                // Adjust these based on your specific requirements
                report: "documentFacialSimilarityMotion",
                allowedDocumentTypes: ["Passport", "DrivingLicence"],
                uiLocale: "en",
              },
            },
          },
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(`Scrive Create Error: ${JSON.stringify(data)}`);

      // 2. START TRANSACTION (Required for the handshake)
      console.log(`Starting transaction: ${data.id}`);
      const startResponse = await fetch(`${SCRIVE_BASE_URL}/transaction/${data.id}/start`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SCRIVE_EID_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      const startData = await startResponse.json();

      return new Response(
        JSON.stringify({
          transactionId: data.id,
          redirectUrl: data.accessUrl, // This is the URL your frontend should open
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // 3. VERIFY TRANSACTION
    if (action === "verify") {
      const { transactionId } = body;
      const response = await fetch(`${SCRIVE_BASE_URL}/transaction/${transactionId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${SCRIVE_EID_TOKEN}` },
      });

      const data = await response.json();
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
