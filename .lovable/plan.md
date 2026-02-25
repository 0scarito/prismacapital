
## Scrive Integration Assessment (What I did now, what is wrong, and what to send Scrive)

### 1) What I inspected right now
I investigated the live integration using your current backend function and the uploaded Postman collection:

1. Read current function code: `supabase/functions/scrive-eid-auth/index.ts`
2. Read your uploaded Postman collection: `user-uploads://eID_Hub.postman_collection.json`
3. Triggered the function directly with a test create call (`action: "create", provider: "onfido"`)
4. Pulled fresh backend function logs for `scrive-eid-auth`

### 2) Confirmed root cause (from live logs)
The 500 error in your app is a wrapped upstream 400 from Scrive.  
Exact backend log error:

```text
Scrive create error: 400
Error in $.providerParameters.onfido.allowedDocumentTypes[0]:
parsing ... OnfidoDocumentType failed, expected one of:
["NationalIdentityCard","DrivingLicence","Passport","ResidencePermit"],
but found tag "passport"
```

So the request currently fails because `allowedDocumentTypes` uses lowercase/underscore enum values:
- `passport`
- `national_identity_card`
- `driving_licence`

Scrive expects exact enum tags:
- `Passport`
- `NationalIdentityCard`
- `DrivingLicence`
- `ResidencePermit`

### 3) Why this happens (technical mismatch)
Your current request body sends:

```json
"allowedDocumentTypes": ["passport", "national_identity_card", "driving_licence"]
```

But Scrive’s parser is strict enum-based (case-sensitive + exact spelling).  
So the create transaction never succeeds, and your app surfaces generic `Failed to create eID transaction`.

### 4) Additional compatibility note I found
Your Postman sample shape uses `providerParameters.auth.onfido`.  
The Scrive error path reports `providerParameters.onfido...`, which suggests their internal validation path may flatten/alias that object. Since their parser reached `allowedDocumentTypes`, the object path is at least being interpreted enough to validate this field.  
Primary blocker is definitely enum mismatch.

### 5) Exact fix plan (implementation)
When implementing, I would make these changes in `supabase/functions/scrive-eid-auth/index.ts`:

1. **Fix enum values**
   - Replace:
     - `"passport"` → `"Passport"`
     - `"national_identity_card"` → `"NationalIdentityCard"`
     - `"driving_licence"` → `"DrivingLicence"`

2. **Keep working fields that are already valid**
   - Keep `uiLocale: "en-US"` (already corrected)
   - Keep `report: "documentFacialSimilarityMotion"` (already corrected earlier)

3. **Improve error transparency to debug with Scrive**
   - Return Scrive upstream status/body in function response (sanitized), instead of only generic:
     - `"Failed to create eID transaction"`
   - This helps support immediately see exact parser complaints.

4. **Maintain the 3-step flow already in place**
   - `POST /transaction/new`
   - `POST /transaction/{tId}/start`
   - return `accessUrl` for redirect

### 6) JSON payload to send Scrive team (current vs corrected)

#### A) What your backend is effectively sending now (failing)
```json
{
  "method": "auth",
  "provider": "onfido",
  "redirectUrl": "https://<your-domain>/auth/eid-callback",
  "providerParameters": {
    "auth": {
      "onfido": {
        "uiLocale": "en-US",
        "allowedDocumentTypes": [
          "passport",
          "national_identity_card",
          "driving_licence"
        ],
        "report": "documentFacialSimilarityMotion"
      }
    }
  }
}
```

#### B) Corrected payload proposal (should pass enum validation)
```json
{
  "method": "auth",
  "provider": "onfido",
  "redirectUrl": "https://<your-domain>/auth/eid-callback",
  "providerParameters": {
    "auth": {
      "onfido": {
        "uiLocale": "en-US",
        "allowedDocumentTypes": [
          "Passport",
          "NationalIdentityCard",
          "DrivingLicence"
        ],
        "report": "documentFacialSimilarityMotion"
      }
    }
  }
}
```

### 7) What to ask Scrive support explicitly
Send them this checklist:

1. Confirm exact accepted enum values for `providerParameters.auth.onfido.allowedDocumentTypes` in **testbed**.
2. Confirm whether payload should be:
   - `providerParameters.auth.onfido` **or**
   - `providerParameters.onfido`
3. Confirm accepted `report` values for your token configuration (Onfido-only token).
4. Confirm whether `start` endpoint for Onfido requires an empty JSON body or no body.
5. Confirm redirect whitelist requirements for:
   - preview domain(s)
   - production domain

### 8) Ready-to-send “support summary” (you can paste this)
```text
We are integrating Scrive eID Hub (Onfido only) against testbed host: https://testbed-eid.scrive.com.

Our create transaction call returns HTTP 400 with:
Error in $.providerParameters.onfido.allowedDocumentTypes[0]:
expected one of ["NationalIdentityCard","DrivingLicence","Passport","ResidencePermit"],
found "passport".

Current payload includes:
allowedDocumentTypes: ["passport","national_identity_card","driving_licence"]
report: "documentFacialSimilarityMotion"
uiLocale: "en-US"

Can you confirm:
1) Exact payload path expected for Onfido fields (providerParameters.auth.onfido vs providerParameters.onfido),
2) Exact enum values for allowedDocumentTypes,
3) Valid report enum values for our token,
4) Whether /transaction/{tId}/start requires a request body for Onfido?
```

### 9) Implementation status right now
- I have completed diagnosis and reproduced the failure path from live logs.
- Root cause is identified with precise field-level validation mismatch.
- Fix is straightforward and low-risk (enum correction + better error passthrough).
- No database schema change is required.
