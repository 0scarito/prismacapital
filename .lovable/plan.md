

# VoveID Identity Verification Integration Plan

## Overview

This plan integrates VoveID as an alternative identity verification provider alongside the existing Scrive/Onfido integration. VoveID offers 3D liveness checks, document OCR, and KYC compliance through a Web SDK.

---

## Architecture

```text
+-------------------+     +----------------------+     +---------------+
|   Dashboard       | --> | Edge Function        | --> | VoveID API    |
| (Verify Button)   |     | (Create Session)     |     | /v2/...       |
+-------------------+     +----------------------+     +---------------+
        |                         |                          |
        |                 sessionToken returned              |
        v                                                    |
+-------------------+                                        |
| VoveID Web SDK    | -------- Opens Verification UI -------+
| (Frontend Modal)  |                                        
+-------------------+                                        
        |                                                    
        | onVerificationComplete callback                    
        v                                                    
+-------------------+     +----------------------+     +---------------+
| Callback Handler  | --> | Edge Function        | --> | VoveID API    |
| (In-page)         |     | (Get User Status)    |     | GET /users/:id|
+-------------------+     +----------------------+     +---------------+
        |                         |
        |                 Identity data returned
        v                         |
+-------------------+             |
| Supabase Profile  | <-----------+
| (eid_personal_no) |
+-------------------+

Webhook (Optional):
+-------------------+     +----------------------+
| VoveID Servers    | --> | Webhook Edge Fn      |
| (Async Updates)   |     | /voveid-webhook      |
+-------------------+     +----------------------+
```

---

## What I Need From You

Before implementation, please provide these credentials from your VoveID Dashboard:

| Item | Description | Where to Find |
|------|-------------|---------------|
| **API Secret Key** | Backend authentication | Dashboard > API Keys |
| **Public Key** | Frontend SDK initialization | Dashboard > API Keys |
| **Flow ID** | Specific KYC process to use | Dashboard > Flows |
| **Environment** | `Sandbox` or `Production` | Your choice for testing |

**Note**: I will store the API Secret Key as a backend secret. The Public Key will be stored as `VITE_VOVEID_PUBLIC_KEY` environment variable.

---

## Implementation Details

### 1. Secret Configuration

| Secret Name | Type | Purpose |
|-------------|------|---------|
| `VOVEID_API_KEY` | Backend Secret | Server-to-server API calls |
| `VITE_VOVEID_PUBLIC_KEY` | Environment Variable | Frontend SDK (safe to expose) |

### 2. Edge Function: `voveid-auth`

Single edge function handling session creation and status verification:

| Action | API Endpoint | Purpose |
|--------|--------------|---------|
| `create-session` | POST `/v2/verification-session` | Create verification session |
| `get-status` | GET `/v2/users/:refId` | Check verification status |

**Request Flow:**
1. Authenticated user clicks "Verify with VoveID"
2. Frontend calls edge function with `action: "create-session"`
3. Edge function creates session with user's ID as `refId`
4. Returns `sessionToken` to frontend
5. Frontend initializes VoveID SDK with token
6. On completion, frontend calls edge function with `action: "get-status"`
7. Edge function retrieves full identity data and updates profile

### 3. Frontend Integration

Install the VoveID Web SDK and create a verification component:

```typescript
import { Vove, VoveEnvironment } from '@vove-id/web-sdk';

// Initialize and start verification
const vove = new Vove();
vove.start({
  environment: VoveEnvironment.Sandbox, // or Production
  publicKey: import.meta.env.VITE_VOVEID_PUBLIC_KEY,
  sessionToken: tokenFromBackend,
  onVerificationComplete: (status) => {
    // Handle: success, pending, failed, canceled
  }
});
```

### 4. Webhook Handler (Optional but Recommended)

A separate edge function to receive async verification updates:

| Endpoint | Purpose |
|----------|---------|
| `/voveid-webhook` | Receive POST notifications when verification completes |

This ensures verification status is updated even if the user closes the browser.

### 5. Provider Selection UI

Update the `EidVerificationCard` component to allow users to choose between:
- Onfido (via Scrive) - existing
- VoveID - new

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `supabase/functions/voveid-auth/index.ts` | Create | Edge function for VoveID API |
| `supabase/functions/voveid-webhook/index.ts` | Create | Webhook listener (optional) |
| `supabase/config.toml` | Modify | Register new functions |
| `src/components/VoveidVerification.tsx` | Create | VoveID SDK integration component |
| `src/components/EidVerificationCard.tsx` | Modify | Add provider selection |
| `src/hooks/useAuth.tsx` | Modify | Add `verifyWithVoveid` method |
| `package.json` | Modify | Add `@vove-id/web-sdk` dependency |
| `src/i18n/en.json` | Modify | Add translations |
| `src/i18n/fr.json` | Modify | Add translations |

---

## Database Considerations

The existing `eid_personal_number` column in `profiles` will store the VoveID unique identifier. No schema changes needed - we'll use the same field regardless of provider.

Optionally, we could add a `kyc_provider` column to track which service verified the user:

```sql
ALTER TABLE profiles 
ADD COLUMN kyc_provider TEXT DEFAULT NULL;
-- Values: 'onfido', 'voveid', etc.
```

---

## Security Considerations

1. **API Key Protection** - Secret key stored as backend secret, never exposed to frontend
2. **User Association** - Use authenticated user's ID as `refId` to prevent session hijacking
3. **Webhook Validation** - Verify webhook signatures (if VoveID provides them)
4. **Status Verification** - Always verify status server-side, don't trust frontend callbacks alone

---

## Translation Keys

```json
{
  "auth.voveidTitle": "Verify with VoveID",
  "auth.voveidDescription": "Complete identity verification using your ID document",
  "auth.selectProvider": "Select verification method",
  "auth.providerOnfido": "Onfido (via Scrive)",
  "auth.providerVoveid": "VoveID",
  "auth.voveidVerifying": "Verifying your identity...",
  "auth.voveidSuccess": "Identity verified successfully",
  "auth.voveidError": "VoveID verification failed"
}
```

---

## Implementation Sequence

1. Request credentials from you (API Key, Public Key, Flow ID)
2. Add `VOVEID_API_KEY` secret
3. Create `voveid-auth` edge function
4. Install `@vove-id/web-sdk` package
5. Create `VoveidVerification.tsx` component
6. Update `EidVerificationCard.tsx` with provider selection
7. Update `useAuth.tsx` with new verification method
8. (Optional) Create `voveid-webhook` edge function
9. Add translations
10. Test in sandbox environment

---

## Questions Before Proceeding

1. **Do you want provider selection?** Should users choose between Onfido and VoveID, or should VoveID replace Scrive/Onfido entirely?

2. **Webhook setup?** Do you want the webhook handler for async updates? (Recommended for reliability)

3. **KYC provider tracking?** Should we add a column to track which provider verified each user?

---

## Next Steps

Once you provide the credentials, I'll implement the full integration. Please share:
- ✅ API Secret Key
- ✅ Public Key  
- ✅ Flow ID
- ✅ Environment preference (Sandbox/Production)

