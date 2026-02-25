

## Plan: End-to-End KYC Status Tracking for Scrive/Onfido

### The Problem

Right now, after a user completes the Onfido ID check and gets redirected back to your app, **nothing actually updates their profile**. Here is why:

1. The `scrive-eid-auth` `verify` action fetches raw Scrive transaction data and returns it as-is
2. The `EidCallback` page checks for `data.success` -- but the Scrive response has no `success` field, it has `status`, `providerInfo.onfidoAuth.completionData`, etc.
3. No code extracts identity data (name, document number) from the Scrive response
4. No code writes `kyc_status`, `verified_name`, or `eid_personal_number` to the profiles table for the Onfido provider
5. The VoveID flow handles all of this correctly (via `voveid-auth` get-status + webhook) -- Onfido/Scrive has none of it

### What Scrive Returns After Onfido Completion

From your logs, a completed Scrive transaction includes:

```text
status: "completed" | "started" | "failed"
providerInfo.onfidoAuth.completionData   → identity results (name, DOB, document)
providerInfo.onfidoAuth.checksClear      → boolean (did checks pass)
providerInfo.onfidoAuth.applicantId      → Onfido applicant ID
```

When `status` is still `"started"`, the user has not finished yet. When `"completed"` and `checksClear === true`, identity data is available in `completionData`.

### What We Need From Scrive (Questions for Their Team)

Before implementing, you should confirm these with Scrive:

1. **Webhook support**: Does Scrive eID Hub support webhooks/callbacks when a transaction completes? If so, what is the payload format and how do we register a webhook URL? (This is critical for async status updates when the user takes time on Onfido.)

2. **completionData structure**: What are the exact fields inside `providerInfo.onfidoAuth.completionData` after a successful verification? We need: full name, date of birth, document number, document type, nationality.

3. **checksClear semantics**: When `checksClear` is `true`, does that mean all Onfido reports passed? Are there partial-pass states?

4. **Transaction status lifecycle**: What are all possible `status` values? We see `"started"` and expect `"completed"` and `"failed"` -- are there others like `"expired"` or `"error"`?

5. **Transaction polling**: Is it safe to poll `GET /transaction/{id}` multiple times? Any rate limits?

### Implementation Plan

#### Step 1: Upgrade `scrive-eid-auth` verify action

Update the edge function's `verify` action to:
- Accept the authenticated user's JWT (currently it does not authenticate the caller)
- Fetch the Scrive transaction status
- Map the Scrive status to our KYC states:
  - `status === "completed"` + `checksClear === true` → extract identity, write `kyc_status: "verified"`, `verified_name`, `eid_personal_number`, `kyc_provider: "onfido"`, `kyc_verified_at` to profiles
  - `status === "completed"` + `checksClear === false` → write `kyc_status: "failed"`
  - `status === "started"` → write `kyc_status: "pending"` (user still in Onfido flow)
  - `status === "failed"` or `"error"` → write `kyc_status: "failed"`
- Check for duplicate `eid_personal_number` (same logic as VoveID flow)
- Return a normalized response: `{ success, status, identity: { name, documentNumber } }`

#### Step 2: Upgrade `scrive-eid-auth` create action

- Authenticate the caller via JWT
- Set `kyc_status: "pending"` on the profile immediately when creating the transaction (matching VoveID behavior)
- Store the `transactionId` in the profile or a new column so we can poll later

#### Step 3: Fix EidCallback page

- The callback currently checks `data.success` which does not exist in Scrive responses
- Update to use the normalized response from Step 1
- Handle all states: verified → redirect to dashboard, pending → show "processing" message, failed → show retry
- If pending, implement a short polling loop (check every 5 seconds, up to 2 minutes) before giving up and telling the user to check back

#### Step 4: Add `useAuth` Onfido flow parity

- In `verifyIdentity()`, set local `kycStatus` to `"pending"` immediately
- After redirect back and successful verify, `refreshEidStatus()` picks up the new profile data automatically (this already works)

#### Step 5: (Optional but recommended) Add Scrive webhook endpoint

Create a new edge function `scrive-webhook` that:
- Receives Scrive transaction completion notifications
- Extracts identity data and updates profiles
- This eliminates the need for polling and handles cases where the user closes the browser before the callback fires

This depends on whether Scrive supports webhooks -- question 1 above.

### Security Considerations

- The `scrive-eid-auth` function currently has no JWT validation -- anyone can call it. We will add authentication so only logged-in users can create/verify transactions, and the user ID comes from the JWT, not the request body.
- Move the hardcoded `SCRIVE_EID_TOKEN` to use the `SCRIVE_EID_TOKEN` secret (already configured) via `Deno.env.get()` instead of the constant in the code.
- Identity deduplication: same document number cannot be used by two accounts (already implemented for VoveID, will replicate for Onfido).

### Files to Modify

| File | Change |
|---|---|
| `supabase/functions/scrive-eid-auth/index.ts` | Add JWT auth, upgrade verify action with profile updates, use secret for token |
| `src/pages/EidCallback.tsx` | Fix response parsing, add polling for pending state |
| `src/hooks/useAuth.tsx` | Set pending status on create, minor cleanup |

### What You Should Send Scrive

```text
We have the Scrive eID Hub Onfido integration working (create + start + redirect).
Users complete Onfido and get redirected back to our app with the transaction ID.

We now need to extract identity data from completed transactions.

Questions:
1) Does eID Hub support webhooks for transaction completion? 
   If yes, what is the payload format and where do we register the URL?

2) After a successful Onfido verification, what fields are inside 
   providerInfo.onfidoAuth.completionData? 
   We need: full legal name, date of birth, document number, document type.

3) What are all possible transaction status values? 
   (started, completed, failed, expired, ...?)

4) When checksClear is true, does that guarantee all reports passed?

5) Any rate limits on polling GET /transaction/{id}?

Our token: 2e222dce-... (testbed)
Our redirect URL: https://prismacapital.lovable.app/auth/eid-callback
```

