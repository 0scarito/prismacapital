
# Scrive eID Hub API Integration Plan

## Overview

This plan integrates Scrive eID Hub for secure user authentication using Nordic eID methods (Swedish BankID, Norwegian BankID, Danish MitID). The implementation follows the 3-step flow you specified.

---

## Architecture

```text
+----------------+     +------------------+     +-------------+
|   Auth Page    | --> | Edge Function    | --> | Scrive API  |
| (Select eID)   |     | (Create Tx)      |     |             |
+----------------+     +------------------+     +-------------+
        |                      |                      |
        |                      v                      |
        |              accessUrl returned             |
        v                                             |
+----------------+                                    |
| User Browser   | -------- Redirect to Scrive ------+
| (BankID App)   |                                    
+----------------+                                    
        |                                             
        v                                             
+----------------+     +------------------+     +-------------+
| Callback Page  | --> | Edge Function    | --> | Scrive API  |
| (/auth/eid-    |     | (Verify Tx)      |     | (GET tx)    |
|  callback)     |     +------------------+     +-------------+
+----------------+             |
        |                      v
        |              Identity extracted
        v              from providerInfo
+----------------+     
| Supabase Auth  | <-- Sign in with custom token
| (Session)      |     or link to existing user
+----------------+     
```

---

## Implementation Details

### 1. Secret Configuration

**Secret Name:** `SCRIVE_EID_TOKEN`

You will be prompted to add this Bearer token when implementation begins.

### 2. Edge Function: `scrive-eid-auth`

Creates a single edge function handling both endpoints:

| Action | Endpoint | Purpose |
|--------|----------|---------|
| `create` | POST /transaction/new | Initiates eID authentication |
| `verify` | GET /transaction/{id} | Retrieves completed transaction |

**Request Flow:**
- `POST /scrive-eid-auth` with `{ action: "create", provider: "seBankID" }`
- Returns `{ accessUrl, transactionId }`
- Frontend redirects user to `accessUrl`
- On return, `POST /scrive-eid-auth` with `{ action: "verify", transactionId }`
- Returns user identity from `providerInfo`

**Supported Providers:**
- `seBankID` - Swedish BankID
- `noBankID` - Norwegian BankID  
- `dkMitID` - Danish MitID

### 3. Callback Page: `/auth/eid-callback`

New page to handle Scrive redirects:

1. Extract `transaction_id` from URL query params
2. Call edge function to verify transaction
3. If status is "complete":
   - Extract identity (name, personal number, etc.)
   - Create or sign in user via Supabase
4. Redirect to dashboard on success

### 4. Auth Page Updates

Add eID login section below existing email/password form:

- "Login with eID" section header
- Provider selection buttons:
  - Swedish BankID (flag icon)
  - Norwegian BankID (flag icon)
  - Danish MitID (flag icon)
- Loading state during redirect

### 5. useAuth Hook Extension

Add new method for eID authentication:

```typescript
signInWithEid: (provider: 'seBankID' | 'noBankID' | 'dkMitID') => Promise<void>
```

This method:
1. Calls edge function to create transaction
2. Stores `transactionId` in sessionStorage
3. Redirects browser to `accessUrl`

### 6. User Linking Strategy

When eID verification completes, the system will:

1. Check if a user exists with the same personal number (stored in profiles)
2. If exists: Sign them in
3. If new: Create account with eID identity data

This requires a new `eid_identity` column in the `profiles` table to store the unique identifier.

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `supabase/functions/scrive-eid-auth/index.ts` | Create | Edge function for Scrive API |
| `supabase/config.toml` | Modify | Add function config |
| `src/pages/EidCallback.tsx` | Create | Callback handler page |
| `src/pages/Auth.tsx` | Modify | Add eID login buttons |
| `src/hooks/useAuth.tsx` | Modify | Add `signInWithEid` method |
| `src/App.tsx` | Modify | Add callback route |
| `src/i18n/en.json` | Modify | Add translations |
| `src/i18n/fr.json` | Modify | Add translations |

---

## Database Migration

Add column to store eID identity for user linking:

```sql
ALTER TABLE profiles 
ADD COLUMN eid_personal_number TEXT UNIQUE;

CREATE INDEX idx_profiles_eid_personal_number 
ON profiles(eid_personal_number);
```

---

## Security Considerations

1. **No iframes** - Full redirect as specified by Scrive
2. **Token validation** - Edge function validates JWT for verify action
3. **CORS headers** - Properly configured for browser requests
4. **Error sanitization** - No Scrive errors exposed to frontend
5. **Transaction ID validation** - Verify transaction belongs to the flow

---

## Translation Keys

```json
{
  "auth.eidLogin": "Login with eID",
  "auth.eidSelect": "Select your eID provider",
  "auth.swedishBankId": "Swedish BankID",
  "auth.norwegianBankId": "Norwegian BankID", 
  "auth.danishMitId": "Danish MitID",
  "auth.eidVerifying": "Verifying your identity...",
  "auth.eidSuccess": "Identity verified successfully",
  "auth.eidError": "eID verification failed"
}
```

---

## Implementation Sequence

1. Request `SCRIVE_EID_TOKEN` secret from you
2. Create `scrive-eid-auth` edge function
3. Create `EidCallback.tsx` page
4. Add database migration for `eid_personal_number`
5. Update `Auth.tsx` with eID buttons
6. Update `useAuth.tsx` with `signInWithEid`
7. Add routes to `App.tsx`
8. Add translations
9. Deploy and test

---

## Testing Checklist

After implementation:
- [ ] Test Swedish BankID flow end-to-end
- [ ] Test Norwegian BankID flow
- [ ] Test Danish MitID flow
- [ ] Verify error handling for cancelled auth
- [ ] Verify existing user linking
- [ ] Verify new user creation
- [ ] Test timeout scenarios
