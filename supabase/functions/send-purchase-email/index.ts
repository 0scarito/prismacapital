import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation schema
const emailRequestSchema = z.object({
  type: z.enum(["purchase", "gift_sent", "gift_received"]),
  recipientEmail: z.string().email(),
  recipientName: z.string().optional(),
  items: z.array(z.object({
    name: z.string(),
    amount: z.number(),
    couponCode: z.string().optional(),
  })),
  giftSenderName: z.string().optional(),
  giftMessage: z.string().optional(),
  totalAmount: z.number(),
});

type EmailRequest = z.infer<typeof emailRequestSchema>;

function generatePurchaseEmail(data: EmailRequest): string {
  const itemsList = data.items
    .map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">€${item.amount.toFixed(2)}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
          <code style="background: #f5f5f5; padding: 4px 8px; border-radius: 4px;">${item.couponCode || 'N/A'}</code>
        </td>
      </tr>
    `)
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #1a365d; margin: 0;">Prisma Capital Cards</h1>
        <p style="color: #666; margin-top: 5px;">Confirmation d'achat</p>
      </div>
      
      <div style="background: linear-gradient(135deg, #1a365d 0%, #2d4a7c 100%); color: white; padding: 30px; border-radius: 12px; margin-bottom: 20px;">
        <h2 style="margin: 0 0 10px 0;">Merci pour votre achat !</h2>
        <p style="margin: 0; opacity: 0.9;">Votre investissement a été confirmé avec succès.</p>
      </div>

      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="margin-top: 0; color: #1a365d;">Récapitulatif de votre commande</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #e5e7eb;">
              <th style="padding: 12px; text-align: left;">Investissement</th>
              <th style="padding: 12px; text-align: right;">Montant</th>
              <th style="padding: 12px; text-align: center;">Code Coupon</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
          </tbody>
          <tfoot>
            <tr style="font-weight: bold; background: #1a365d; color: white;">
              <td style="padding: 12px;">Total</td>
              <td style="padding: 12px; text-align: right;" colspan="2">€${data.totalAmount.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; margin-bottom: 20px;">
        <strong style="color: #065f46;">Vos coupons sont maintenant disponibles !</strong>
        <p style="margin: 5px 0 0 0; color: #047857;">Retrouvez-les dans votre espace personnel sur notre plateforme.</p>
      </div>

      <p style="color: #666; font-size: 14px;">
        Vous pouvez suivre l'évolution de vos investissements à tout moment depuis votre tableau de bord.
      </p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      
      <p style="color: #999; font-size: 12px; text-align: center;">
        Prisma Capital Cards SAS - 25 Avenue des Champs-Élysées, 75008 Paris<br>
        <a href="mailto:support@prismacapital.fr" style="color: #1a365d;">support@prismacapital.fr</a>
      </p>
    </body>
    </html>
  `;
}

function generateGiftSentEmail(data: EmailRequest): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #1a365d; margin: 0;">Prisma Capital Cards</h1>
        <p style="color: #666; margin-top: 5px;">Cadeau envoyé</p>
      </div>
      
      <div style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: white; padding: 30px; border-radius: 12px; margin-bottom: 20px;">
        <h2 style="margin: 0 0 10px 0;">🎁 Votre cadeau a été envoyé !</h2>
        <p style="margin: 0; opacity: 0.9;">Le destinataire recevra un email pour récupérer son investissement.</p>
      </div>

      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="margin-top: 0; color: #1a365d;">Détails du cadeau</h3>
        ${data.items.map(item => `
          <p><strong>${item.name}</strong> - €${item.amount.toFixed(2)}</p>
        `).join('')}
        <p style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd;">
          <strong>Total offert :</strong> €${data.totalAmount.toFixed(2)}
        </p>
      </div>

      <p style="color: #666; font-size: 14px;">
        Nous vous informerons dès que le destinataire aura accepté votre cadeau.
      </p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      
      <p style="color: #999; font-size: 12px; text-align: center;">
        Prisma Capital Cards SAS - 25 Avenue des Champs-Élysées, 75008 Paris
      </p>
    </body>
    </html>
  `;
}

function generateGiftReceivedEmail(data: EmailRequest): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #1a365d; margin: 0;">Prisma Capital Cards</h1>
        <p style="color: #666; margin-top: 5px;">Vous avez reçu un cadeau !</p>
      </div>
      
      <div style="background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%); color: #1a365d; padding: 30px; border-radius: 12px; margin-bottom: 20px; text-align: center;">
        <div style="font-size: 48px; margin-bottom: 10px;">🎁</div>
        <h2 style="margin: 0 0 10px 0;">Félicitations !</h2>
        <p style="margin: 0; font-size: 18px;">
          ${data.giftSenderName || 'Quelqu\'un'} vous a offert un investissement !
        </p>
      </div>

      ${data.giftMessage ? `
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-bottom: 20px; font-style: italic;">
          "${data.giftMessage}"
        </div>
      ` : ''}

      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="margin-top: 0; color: #1a365d;">Votre cadeau</h3>
        ${data.items.map(item => `
          <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 10px; border: 1px solid #e5e7eb;">
            <strong style="font-size: 16px;">${item.name}</strong>
            <p style="margin: 5px 0 0 0; color: #059669; font-size: 20px; font-weight: bold;">€${item.amount.toFixed(2)}</p>
          </div>
        `).join('')}
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://prismacapital.fr/auth" style="display: inline-block; background: #1a365d; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
          Accepter mon cadeau
        </a>
      </div>

      <p style="color: #666; font-size: 14px; text-align: center;">
        Créez un compte ou connectez-vous pour ajouter cet investissement à votre portefeuille.
      </p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      
      <p style="color: #999; font-size: 12px; text-align: center;">
        Prisma Capital Cards SAS - 25 Avenue des Champs-Élysées, 75008 Paris
      </p>
    </body>
    </html>
  `;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    // Validate input
    const validation = emailRequestSchema.safeParse(body);
    if (!validation.success) {
      console.error("Validation error:", validation.error);
      return new Response(
        JSON.stringify({ error: "Invalid request data" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = validation.data;
    console.log(`Sending ${data.type} email to ${data.recipientEmail}`);

    let subject: string;
    let html: string;

    switch (data.type) {
      case "purchase":
        subject = "✅ Confirmation de votre achat - Prisma Capital Cards";
        html = generatePurchaseEmail(data);
        break;
      case "gift_sent":
        subject = "🎁 Votre cadeau a été envoyé - Prisma Capital Cards";
        html = generateGiftSentEmail(data);
        break;
      case "gift_received":
        subject = `🎁 ${data.giftSenderName || 'Quelqu\'un'} vous a offert un investissement !`;
        html = generateGiftReceivedEmail(data);
        break;
      default:
        throw new Error("Unknown email type");
    }

    // Send email using Resend API directly
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Prisma Capital <onboarding@resend.dev>",
        to: [data.recipientEmail],
        subject,
        html,
      }),
    });

    const emailResult = await emailResponse.json();
    
    if (!emailResponse.ok) {
      console.error("Resend API error:", emailResult);
      throw new Error(emailResult.message || "Failed to send email");
    }

    console.log("Email sent successfully:", emailResult);

    return new Response(
      JSON.stringify({ success: true, messageId: emailResult.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
