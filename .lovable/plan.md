

# VoveID Webhook Secret Configuration

## Summary

The webhook infrastructure is fully implemented and ready. The only remaining step is to add your signing secret so the backend can cryptographically verify that incoming webhooks are genuinely from VoveID.

---

## Current Status

| Component | Status |
|-----------|--------|
| Webhook endpoint code | Complete with HMAC-SHA256 verification |
| Webhook URL | `https://pxvfvwnblvljwxymnvpr.supabase.co/functions/v1/voveid-webhook` |
| VoveID endpoint ID | `ep_39INDm67hdncFqX0BuW354BaRPC` (configured in your dashboard) |
| Signing secret | **Needs to be added** |

---

## What Happens When Webhook Fires

When a user completes verification, VoveID sends a POST request to your webhook with:

```text
1. User completes liveness check + document scan in VoveID SDK
2. VoveID processes the verification
3. VoveID sends webhook to your endpoint with:
   - event: "verification.completed" or "user.approved"
   - refId: User's Supabase ID
   - documentData: { fullName, documentNumber, etc. }
   - x-voveid-signature header (HMAC signature)
4. Your webhook:
   - Verifies the signature matches
   - Updates the user's profile with:
     - kyc_status: "verified"
     - verified_name: Legal name from ID
     - eid_personal_number: Document number
     - kyc_verified_at: Timestamp
5. User can now make purchases
```

---

## Implementation Step

### Add Webhook Signing Secret

Store the secret so the webhook can verify incoming requests:

- **Secret Name**: `VOVEID_WEBHOOK_SECRET`
- **Secret Value**: `whsec_FET4JAbFCp6ElnS92FHrqmB6M0HHXNTc`

---

## Technical Details

### Signature Verification Flow

The webhook already implements this logic (lines 64-81 in `voveid-webhook/index.ts`):

```text
1. Read raw request body
2. Get x-voveid-signature header
3. Compute HMAC-SHA256(body, VOVEID_WEBHOOK_SECRET)
4. Compare computed signature with header
5. Reject with 401 if mismatch
```

### Webhook Response Messages

| Scenario | Response |
|----------|----------|
| Signature invalid | `401: Invalid signature` |
| Verification successful | `200: { received: true, processed: true, userId: "..." }` |
| Verification failed | `200: { received: true, action: "marked_failed" }` |
| Already verified | `200: { received: true, alreadyVerified: true }` |
| User not found | `404: User not found` |

---

## Files Changed

| File | Change |
|------|--------|
| Supabase Secrets | Add `VOVEID_WEBHOOK_SECRET` |

No code changes required - the implementation is complete.

