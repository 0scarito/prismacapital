
# Full Security & Logic Review: VoveID Integration + Purchase Flow

## Executive Summary

After a thorough code review, I've identified **3 critical security vulnerabilities**, **2 data integrity issues**, and **4 UX improvements** needed to make the verification and purchase flow bulletproof.

---

## Critical Security Issues Found

### Issue 1: Server-Side Verification Check Missing (CRITICAL)

The `create-payment` edge function does NOT verify that a user has completed identity verification. The frontend check (`isEidVerified`) can be easily bypassed by calling the API directly.

**Current code in `create-payment/index.ts`:**
```javascript
// Only checks if user is authenticated - NOT if they're KYC verified!
const { data } = await supabaseClient.auth.getUser(token);
const user = data.user;
if (!user?.email) {
  throw new Error("User not authenticated");
}
// PROCEEDS TO CREATE PAYMENT - NO KYC CHECK!
```

**Fix:** Add server-side KYC verification check before processing any payment.

### Issue 2: VoveID Webhook Lacks Signature Verification

The webhook handler accepts any POST request without verifying it actually came from VoveID.

**Current code:**
```javascript
const signature = req.headers.get("x-voveid-signature");
if (signature) {
  console.log("Webhook signature present:", signature.substring(0, 10) + "...");
  // TODO: Implement signature verification if VoveID provides documentation
}
```

**Fix:** Implement proper HMAC signature verification using a shared secret.

### Issue 3: Frontend Shows Success Even When Status Check Fails

In `VoveidVerification.tsx`, if the `get-status` call fails, it still shows success and calls `onVerificationComplete()`:

```javascript
} catch (err) {
  console.error('Status check error:', err);
  // Even if status check fails, the webhook might still update
  setStatus('success');  // WRONG - should not show success
  onVerificationComplete();  // WRONG - user might not be verified
}
```

**Fix:** Only show success when verification is confirmed server-side.

---

## Data Integrity Issues

### Issue 4: Profile Name Not Synced with Verified Identity

VoveID returns the user's legal name from their ID document, but it's never stored or compared with the profile's `display_name`. The Scrive/Onfido integration updates `display_name` for new users, but VoveID doesn't.

**Fix:** Store verified name in a new `verified_name` column and optionally update `display_name`.

### Issue 5: No Verification Status Tracking

There's no way to track:
- Pending verifications (started but not completed)
- Failed verifications (for retry logic)
- Verification timestamps (for compliance/audit)

**Fix:** Add `kyc_status` and `kyc_verified_at` columns to profiles.

---

## UX Improvements Needed

### Issue 6: No Clear Indication When Verification is Incomplete

If a user starts verification but doesn't complete it (closes the modal), there's no way to know they have a pending session. They have to start fresh.

### Issue 7: Cart Doesn't Warn About Verification Requirement

Users can add items to cart and proceed to checkout only to find they're blocked. Better UX would be to show a warning earlier.

### Issue 8: Verification Card Should Allow Re-verification After Failure

If verification fails, the user should be able to retry from the same card without confusion.

---

## Implementation Plan

### Step 1: Database Schema Updates

Add new columns to track verification state properly:

```sql
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS verified_name TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS kyc_status TEXT DEFAULT 'none',
ADD COLUMN IF NOT EXISTS kyc_verified_at TIMESTAMPTZ DEFAULT NULL;

COMMENT ON COLUMN public.profiles.verified_name IS 'Legal name from KYC document';
COMMENT ON COLUMN public.profiles.kyc_status IS 'none, pending, verified, failed';
COMMENT ON COLUMN public.profiles.kyc_verified_at IS 'Timestamp when KYC was completed';
```

### Step 2: Secure the Payment Flow (Critical)

Update `create-payment/index.ts` to verify KYC status server-side:

```javascript
// After user authentication, check KYC status
const { data: profile, error: profileError } = await supabaseClient
  .from("profiles")
  .select("eid_personal_number, kyc_status")
  .eq("id", user.id)
  .single();

if (profileError || !profile?.eid_personal_number) {
  return new Response(
    JSON.stringify({ 
      error: "Identity verification required",
      code: "KYC_REQUIRED"
    }),
    { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}
```

### Step 3: Fix VoveID Verification Status Handling

Update `VoveidVerification.tsx` to handle failures properly:

- Don't show success unless server confirms verification
- Clear error states and allow retry
- Update profile's `kyc_status` to track state

### Step 4: Update Edge Functions to Store Verified Name

Update both `voveid-auth/index.ts` and `voveid-webhook/index.ts`:

```javascript
// When verification succeeds, store the verified name
const { error: updateError } = await supabaseAdmin
  .from("profiles")
  .update({ 
    eid_personal_number: personalNumber,
    kyc_provider: "voveid",
    verified_name: fullName,  // NEW
    kyc_status: "verified",   // NEW
    kyc_verified_at: new Date().toISOString(),  // NEW
  })
  .eq("id", user.id);
```

### Step 5: Implement Webhook Signature Verification

Add HMAC-SHA256 signature verification to `voveid-webhook/index.ts`:

```javascript
const computedSignature = await computeHmacSha256(
  requestBody,
  Deno.env.get("VOVEID_WEBHOOK_SECRET")
);

if (signature !== computedSignature) {
  console.error("Invalid webhook signature");
  return new Response(
    JSON.stringify({ error: "Invalid signature" }),
    { status: 401, headers: corsHeaders }
  );
}
```

Note: This requires adding a `VOVEID_WEBHOOK_SECRET` from your VoveID dashboard.

### Step 6: Update useAuth Hook

Add `kycStatus` to the auth context for more granular state:

```typescript
interface AuthContextType {
  // ... existing fields
  kycStatus: 'none' | 'pending' | 'verified' | 'failed';
  verifiedName: string | null;
}
```

### Step 7: Improve Verification UI

Update `EidVerificationCard.tsx` to show:
- Clear status when verification is pending
- Retry option when verification failed
- Verified name after successful verification

### Step 8: Add Cart Warning

Update cart/checkout flow to show early warning about verification requirement.

---

## Files to Modify

| File | Changes |
|------|---------|
| `supabase/functions/create-payment/index.ts` | Add server-side KYC verification check |
| `supabase/functions/voveid-auth/index.ts` | Store verified_name, kyc_status, kyc_verified_at |
| `supabase/functions/voveid-webhook/index.ts` | Add signature verification, store full data |
| `supabase/functions/scrive-eid-auth/index.ts` | Add kyc_status tracking for consistency |
| `src/components/VoveidVerification.tsx` | Fix status handling, don't show false success |
| `src/components/EidVerificationCard.tsx` | Show pending/failed states, display verified name |
| `src/hooks/useAuth.tsx` | Add kycStatus and verifiedName to context |
| `src/pages/Checkout.tsx` | Improve error messaging for KYC requirement |
| `src/pages/Cart.tsx` | Add warning about verification requirement |
| Database migration | Add verified_name, kyc_status, kyc_verified_at columns |

---

## Security Checklist After Implementation

- [ ] Server-side KYC check before any payment processing
- [ ] Webhook signature verification implemented
- [ ] No false success states in frontend
- [ ] Verified identity data stored and auditable
- [ ] Rate limiting on verification attempts (future enhancement)
- [ ] Verified name displayed to user for confirmation

---

## Technical Details

### Database Migration SQL

```sql
-- Add verification tracking columns
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS verified_name TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS kyc_status TEXT DEFAULT 'none' 
  CHECK (kyc_status IN ('none', 'pending', 'verified', 'failed')),
ADD COLUMN IF NOT EXISTS kyc_verified_at TIMESTAMPTZ DEFAULT NULL;

-- Update existing verified users
UPDATE public.profiles 
SET kyc_status = 'verified', kyc_verified_at = updated_at
WHERE eid_personal_number IS NOT NULL AND kyc_status = 'none';
```

### New Secret Required

A `VOVEID_WEBHOOK_SECRET` will be needed for webhook signature verification. This should be obtained from the VoveID dashboard when configuring the webhook URL.

---

## Expected Outcome

After implementation:

1. Users cannot bypass identity verification to make purchases
2. Verification state is properly tracked (pending, verified, failed)
3. Users see their verified legal name after successful KYC
4. Webhook updates are cryptographically verified
5. Clear UI feedback at every step of the verification process
6. Audit trail of when KYC was completed for each user
