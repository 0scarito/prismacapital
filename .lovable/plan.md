

## Plan: VoveID-Only KYC Integration Overhaul

### Current State Assessment

After reading the VoveID official documentation and the current codebase, here is what needs fixing:

**What works:**
- Session creation calls `POST /v2/sessions` with `refId` and `flowId` -- correct
- Webhook endpoint exists at `voveid-webhook` -- but uses wrong signature verification (HMAC-SHA256 on raw body vs Svix standard)
- `get-status` action calls `GET /v2/users/:refId` -- correct endpoint

**What is broken or missing:**

1. **Session creation does not send user info.** VoveID accepts an optional `user` object (`firstName`, `lastName`, `gender`, `dateOfBirth`) which enables data matching. Your current code only sends `refId` + `flowId`. We should pull the user's `display_name` and pass it as `firstName`/`lastName`.

2. **Webhook signature verification is wrong.** VoveID uses **Svix** webhooks. The current `voveid-webhook` computes a plain HMAC-SHA256 on the raw body with `x-voveid-signature` header. VoveID actually sends `Svix-Id`, `Svix-Timestamp`, `Svix-Signature` headers. The signature is computed as `HMAC-SHA256(base64decode(secret_after_whsec_), "${svix_id}.${svix_timestamp}.${body}")` and compared as base64.

3. **Webhook status mapping is wrong.** The current webhook checks for `verification.completed`, `user.approved`, `success` etc. VoveID's actual webhook statuses are: `successful`, `suspected`, `in_progress`, `pending`. There is no `verification.completed` or `user.approved`.

4. **Webhook does not fetch user documents.** After receiving a webhook with `status: "successful"`, you should call `GET /v2/users/:refId` to get the full identity data (name, DOB, document number from `documents[]`).

5. **get-status action maps wrong statuses.** It checks for `"success"` and `"approved"` but VoveID returns `"successful"`. It also checks `documentData` which doesn't exist -- VoveID returns `documents[]` array.

6. **Frontend `VoveidVerification` component** calls `checkVerificationStatus` right after the SDK's `onVerificationComplete` fires with `"success"`. But VoveID may not have finished processing yet (webhook may come later with `in_progress` or `pending`). We need to handle the pending state properly.

### Implementation Plan

#### 1. Fix `voveid-auth` edge function

- **Session creation**: Pass `user` object with `firstName`/`lastName` parsed from profile `display_name`, and `forceCreation: true` for retries
- **get-status**: Fix status mapping (`"successful"` not `"success"`), extract identity from `documents[]` array (use `firstName`, `lastName`, `idNumber` from the ID_DOCUMENT step), handle `"suspected"` as failed
- **get-config**: No changes needed

#### 2. Rewrite `voveid-webhook` edge function

- **Svix signature verification**: Parse `Svix-Id`, `Svix-Timestamp`, `Svix-Signature` headers. Compute `HMAC-SHA256(base64decode(secret_key), "${svixId}.${timestamp}.${body}")` and compare as base64 against the signature
- **Status handling**: Map `successful` → fetch `GET /v2/users/:refId` for full data → update profile to `verified`. Map `suspected` → `failed`. Map `in_progress`/`pending` → keep `pending`
- **Identity extraction**: From `GET /v2/users/:refId` response, extract `documents[0].firstName`, `documents[0].lastName`, `documents[0].idNumber` for `verified_name` and `eid_personal_number`
- **Deduplication**: Check `eid_personal_number` uniqueness before setting verified

#### 3. Update `VoveidVerification` component

- If `checkVerificationStatus` returns `pending` or `in_progress`, keep the dialog open showing "processing" state instead of showing failure
- Add a polling loop (every 5s, up to 2 min) for pending status
- Only close/succeed when status is `verified`, or fail on `suspected`/`failed`

#### 4. Update `useAuth` hook

- No structural changes needed -- it already handles `pending`/`verified`/`failed` states correctly

#### 5. Remove Onfido/Scrive as default

- Update `verifyIdentity()` in `useAuth` to use VoveID instead of Scrive Onfido
- Keep Scrive code in place but make VoveID the primary flow

### Files to Modify

| File | Changes |
|---|---|
| `supabase/functions/voveid-auth/index.ts` | Add user info to session creation, fix status mapping to use VoveID's actual response shape |
| `supabase/functions/voveid-webhook/index.ts` | Rewrite signature verification to Svix standard, fix status enum mapping, add `GET /v2/users/:refId` call on success |
| `src/components/VoveidVerification.tsx` | Handle `pending`/`in_progress` states with polling instead of immediate failure |
| `src/hooks/useAuth.tsx` | Make VoveID the primary `verifyIdentity()` flow |

### Questions for VoveID (if any issues arise)

1. Confirm your webhook secret format starts with `whsec_` and the signing key is the base64-decoded part after the prefix
2. Confirm `forceCreation: true` is safe to use on retry flows
3. Confirm the `documents[]` array always contains at least one entry with `stepId: "ID_DOCUMENT"` for IDV flows

### Extra Features You Mentioned (Phase 2)

These are noted for future implementation after the core flow works:

- **AML/Sanctions screening**: Can be triggered via VoveID MCP or API after verification succeeds
- **Accredited investor verification**: Address proof module via `ADDRESS_PROOF` step in VoveID flows
- **Automated investor agreements**: Trigger document signing on `successful` webhook
- **Tiered access control**: Already partially implemented (Invest Now blocked without KYC)
- **Periodic re-KYC**: Cron job checking `kyc_verified_at > 12 months` to force re-verification

