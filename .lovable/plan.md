

## Plan: Rework Scrive eID Auth Using Postman Collection

### Analysis

After reviewing the Postman collection and the current `scrive-eid-auth` edge function, there are two issues to fix:

1. **Missing "Start transaction" step**: The Postman collection shows a 3-step flow: Create → Start → Redirect. The current code skips the Start step entirely, going directly from Create to Redirect. This may be why the flow fails at Scrive's frontend.

2. **Empty Onfido provider parameters**: The current code sends `providerParameters: { auth: {} }` instead of properly specifying the Onfido-specific fields (like `uiLocale`, `allowedDocumentTypes`, etc.) that the Postman collection documents.

### What Changes

**Edge function `supabase/functions/scrive-eid-auth/index.ts`:**

- **Create action**: Send proper Onfido-specific `providerParameters` in the create request body, including sensible defaults for `uiLocale`, `allowedDocumentTypes`, and the `report` type
- **Add Start step**: After creating the transaction, call `POST /api/v1/transaction/{tId}/start` before returning the `accessUrl` to the frontend. This is the step the current code is missing.
- **Verify action**: No structural changes needed; the GET transaction endpoint is already correct. Add logging of the full response for better debugging.

**No frontend changes needed** -- the `useAuth.tsx` hook and `EidCallback.tsx` already handle the redirect and callback correctly. The fix is purely server-side.

### Technical Details

```text
Current flow (broken):
  Frontend → Edge Fn: create → Scrive: POST /transaction/new → return accessUrl → redirect

Fixed flow (per Postman collection):
  Frontend → Edge Fn: create → Scrive: POST /transaction/new
                                      → Scrive: POST /transaction/{tId}/start
                                      → return accessUrl → redirect
```

The edge function's `create` action will:
1. POST to `/api/v1/transaction/new` with `provider: "onfido"`, `method: "auth"`, `redirectUrl`, and populated `providerParameters.auth.onfido` fields
2. POST to `/api/v1/transaction/{tId}/start` to activate the transaction
3. Return `accessUrl` and `transactionId` to the frontend

