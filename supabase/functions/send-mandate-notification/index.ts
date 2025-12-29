import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MandateNotificationRequest {
  type: 'activated' | 'cancelled' | 'created';
  mandateId: string;
  mandateName: string;
  contractReference: string;
  organizationName: string;
  recipientEmail: string;
  totalValue: number;
  couponCount: number;
  cancellationReason?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("send-mandate-notification function called");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify JWT authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("No authorization header");
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      console.error("Auth error:", authError);
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    const {
      type,
      mandateId,
      mandateName,
      contractReference,
      organizationName,
      recipientEmail,
      totalValue,
      couponCount,
      cancellationReason,
    }: MandateNotificationRequest = await req.json();

    console.log(`Sending ${type} notification for mandate ${mandateId} to ${recipientEmail}`);

    let subject: string;
    let htmlContent: string;

    const formattedValue = new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: 'EUR',
    }).format(totalValue);

    switch (type) {
      case 'activated':
        subject = `Mandate Activated: ${mandateName}`;
        htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
              .highlight { background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #10b981; }
              .stats { display: flex; justify-content: space-around; text-align: center; margin: 20px 0; }
              .stat { padding: 15px; }
              .stat-value { font-size: 24px; font-weight: bold; color: #10b981; }
              .stat-label { font-size: 12px; color: #6b7280; }
              .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">✓ Mandate Activated</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Your mandate is now active and ready for distribution</p>
              </div>
              <div class="content">
                <div class="highlight">
                  <h2 style="margin-top: 0;">${mandateName}</h2>
                  <p><strong>Contract Reference:</strong> ${contractReference}</p>
                  <p><strong>Organization:</strong> ${organizationName}</p>
                </div>
                
                <table width="100%" style="margin: 20px 0;">
                  <tr>
                    <td style="text-align: center; padding: 15px; background: white; border-radius: 8px; margin: 5px;">
                      <div style="font-size: 24px; font-weight: bold; color: #10b981;">${formattedValue}</div>
                      <div style="font-size: 12px; color: #6b7280;">Total Value</div>
                    </td>
                    <td style="width: 20px;"></td>
                    <td style="text-align: center; padding: 15px; background: white; border-radius: 8px; margin: 5px;">
                      <div style="font-size: 24px; font-weight: bold; color: #3b82f6;">${couponCount}</div>
                      <div style="font-size: 12px; color: #6b7280;">Coupons</div>
                    </td>
                  </tr>
                </table>

                <p>You can now begin distributing coupons to your clients through the Partner Dashboard.</p>
                
                <p style="margin-top: 30px;">Best regards,<br><strong>Prisma Capital Team</strong></p>
              </div>
              <div class="footer">
                <p>This is an automated notification from Prisma Capital.</p>
              </div>
            </div>
          </body>
          </html>
        `;
        break;

      case 'cancelled':
        subject = `Mandate Cancelled: ${mandateName}`;
        htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
              .highlight { background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #ef4444; }
              .reason-box { background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 15px; margin: 20px 0; }
              .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">✗ Mandate Cancelled</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">This mandate has been cancelled</p>
              </div>
              <div class="content">
                <div class="highlight">
                  <h2 style="margin-top: 0;">${mandateName}</h2>
                  <p><strong>Contract Reference:</strong> ${contractReference}</p>
                  <p><strong>Organization:</strong> ${organizationName}</p>
                </div>
                
                ${cancellationReason ? `
                <div class="reason-box">
                  <strong>Cancellation Reason:</strong>
                  <p style="margin-bottom: 0;">${cancellationReason}</p>
                </div>
                ` : ''}

                <p>Any undistributed coupons associated with this mandate have been voided. If you have any questions, please contact our support team.</p>
                
                <p style="margin-top: 30px;">Best regards,<br><strong>Prisma Capital Team</strong></p>
              </div>
              <div class="footer">
                <p>This is an automated notification from Prisma Capital.</p>
              </div>
            </div>
          </body>
          </html>
        `;
        break;

      case 'created':
        subject = `New Mandate Created: ${mandateName}`;
        htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
              .highlight { background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #3b82f6; }
              .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">📋 New Mandate Created</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Your mandate has been created and is pending activation</p>
              </div>
              <div class="content">
                <div class="highlight">
                  <h2 style="margin-top: 0;">${mandateName}</h2>
                  <p><strong>Contract Reference:</strong> ${contractReference}</p>
                  <p><strong>Organization:</strong> ${organizationName}</p>
                  <p><strong>Total Value:</strong> ${formattedValue}</p>
                  <p><strong>Coupon Count:</strong> ${couponCount}</p>
                </div>

                <p>Your mandate is currently in <strong>draft</strong> status. To begin distributing coupons, please activate the mandate from your Partner Dashboard.</p>
                
                <p style="margin-top: 30px;">Best regards,<br><strong>Prisma Capital Team</strong></p>
              </div>
              <div class="footer">
                <p>This is an automated notification from Prisma Capital.</p>
              </div>
            </div>
          </body>
          </html>
        `;
        break;

      default:
        throw new Error(`Unknown notification type: ${type}`);
    }

    const emailResponse = await resend.emails.send({
      from: "Prisma Capital <onboarding@resend.dev>",
      to: [recipientEmail],
      subject,
      html: htmlContent,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-mandate-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);