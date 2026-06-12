# Prisma Capital

A gifting platform for investments: buy an "investment coupon" for someone — private equity, venture capital, real estate, commodities, ETFs, or crypto — and they redeem it into a real position after identity-verified onboarding.

The premise is that access to private markets makes a better gift than another object. Prisma Capital wraps regulated investment products into transferable coupons, with the KYC, risk-disclosure, and payment plumbing that redeeming into an actual financial product requires.

## Features

- **Investment catalogue** across six asset classes (private equity, venture capital, real estate, commodities, ETFs, crypto), each product carrying fund-grade metadata: ISIN, legal structure, domicile, AUM, fee schedule, liquidity terms, risk rating, and historical performance.
- **Cart and checkout** flow with Stripe payments, optional physical gift cards, and post-purchase email confirmation.
- **Gift transfers**: send a purchased coupon to any email address with a personal message; recipients accept it from their own account, with server-side validation of the recipient.
- **eID-based KYC** for onboarding, integrated with Scrive eID and VoveID — identity verification gates redemption, not browsing.
- **User dashboard and portfolio** showing owned positions, received gifts, and cash-out / withdrawal requests.
- **B2B partner side**: organizations request distribution mandates (bulk coupon allotments with pricing tiers, product mix, and compliance acknowledgements) and manage them from a dedicated partner dashboard, including bulk coupon distribution.
- **Bilingual UI** (English / French) with language-prefixed routes (`/en/...`, `/fr/...`) and JSON-based translations.
- **Compliance surface**: risk disclosure, DICI/KID documentation, ESG reports, legal notices, and cookie settings as first-class pages.

## Stack

- **Frontend**: React 18 + TypeScript, Vite, React Router v6
- **UI**: shadcn/ui (Radix primitives), Tailwind CSS, Lucide icons, Recharts
- **State / data**: TanStack Query, React context (auth, cart, language), react-hook-form + Zod
- **Backend**: Supabase — Postgres with row-level security, Auth, and 11 Deno edge functions (payments, webhooks, gift validation, KYC callbacks, transactional email, cash-out)
- **Third-party services**: Stripe (payments + webhooks), Resend (transactional email), Scrive eID and VoveID (identity verification)

## Getting Started

```sh
git clone https://github.com/0scarito/prismacapital.git
cd prismacapital
npm i
npm run dev
```

The frontend expects a Supabase project, configured via environment variables in a local `.env`:

```
VITE_SUPABASE_URL=<your Supabase project URL>
VITE_SUPABASE_PROJECT_ID=<your Supabase project id>
VITE_SUPABASE_PUBLISHABLE_KEY=<your Supabase anon/publishable key>
```

Database schema lives in `supabase/migrations/` (plus `DATABASE_SETUP.sql` for the cart/gift tables and their RLS policies). Edge functions read their secrets (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `SCRIVE_EID_TOKEN`, `VOVEID_API_KEY`, ...) from Supabase function secrets — none are needed to run the frontend locally.

## How it works

- `src/App.tsx` declares the full route table three times — default, `/en`-prefixed, and `/fr`-prefixed — with `LanguageContext` resolving translations from `src/i18n/{en,fr}.json`.
- Product data is typed in `src/data/investments.ts` (`Investment` interface with the extended fund-documentation fields) and rendered through category pages (`Etfs`, `Crypto`, `PrivateEquity`, ...) and `InvestmentDetailDialog`.
- `CartContext` holds the in-session basket; `Checkout` → `create-payment` edge function → Stripe → `stripe-webhook` / `verify-payment` functions record the purchase and trigger `send-purchase-email`.
- Gifting writes a `gift_transfers` row linked to the purchase; the `validate-gift-recipient` function checks the recipient server-side with the service role, and RLS policies let recipients see and accept gifts addressed to their email.
- KYC runs through the `scrive-eid-auth` / `voveid-auth` edge functions with a browser callback at `/auth/eid-callback`; `ProtectedRoute` gates the dashboards on Supabase Auth sessions.
- The partner flow (`RequestMandate` → `send-mandate-notification`, then `PartnerDashboard` with `CreateMandateDialog` / `DistributeCouponsDialog`) handles B2B mandates: coupon counts, total value, pricing tier, product mix, and compliance confirmations per mandate.

## Status

Prototype, currently on hold. The product surface (catalogue, checkout, gifting, KYC scaffold, partner mandates) is built end-to-end; payments and identity verification run against sandbox environments.
