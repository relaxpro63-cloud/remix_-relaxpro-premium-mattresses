# Lead-Pipeline Security Fix — Design Spec

**Date:** 2026-07-05  
**Route:** client-only (no backend changes)  
**Goal:** Remove hardcoded Apps Script URL from the shipped bundle, enforce env-only redirect, stop leaking customer PII into WhatsApp pre-filled links, and surface transport-level failures honestly.

---

## 1. Problem statement

Three live issues in the lead-capture / order-success flow:

| # | File | Issue |
|---|------|-------|
| A | `src/utils/googleSheets.ts:7` | Production Apps Script Web App URL is hardcoded as a JS literal fallback. Any user who opens DevTools can find it and spam the Leads sheet. |
| B | `src/utils/googleSheets.ts:46-56` | `fetch` runs under `no-cors` and always returns `true`. The caller (`submitLead`) cannot know whether the request dispatched or threw; transport-level errors are silently swallowed. |
| C | `src/features/cart/success-page.tsx:31-32` | Customer name, mobile, full address (with pincode), and order total are pre-filled into a `wa.me` URL. These values appear in the browser URL bar, referrer headers, analytics scripts, and any extension with tab access. |

---

## 2. Constraints

- **No server-side changes.** The design introduced a Vercel Serverless Function was evaluated and rejected by the user. We stay client-only.
- **Apps Script URL must not be discoverable from the client bundle.** The only way to satisfy this without a proxy is to make it fully environment-driven and throw on missing env. A URL in source is a URL anyone can read.
- **WhatsApp remains the human-confirmation primitive.** We do not cancel the WhatsApp redirect; we only remove PII from it.

---

## 3. Approach: defensive client-only

### 3.1 `src/utils/googleSheets.ts`

**Current signature:**
```ts
export async function submitLead(data: LeadFormData): Promise<boolean>
```

**New contract:**
```ts
export async function submitLead(data: LeadFormData): Promise<void>
```

- Returns `void`. Callers must not branch on success/failure.
- **No fallback URL whatsoever.** If `import.meta.env.VITE_PUBLIC_GOOGLE_SCRIPT_URL` is unset, throw synchronously:
  ```ts
  const SCRIPT_URL = import.meta.env.VITE_PUBLIC_GOOGLE_SCRIPT_URL;
  if (!SCRIPT_URL) throw new Error('VITE_PUBLIC_GOOGLE_SCRIPT_URL is not configured');
  ```
- Remove the previous fallback chain (the `|| meta.env?.VITE_GOOGLE_SCRIPT_URL || ...` and the hardcoded literal string) entirely.
- Keep `no-cors` POST; under the new honest semantics it is a best-effort fire-and-forget dispatch.
- Propagate transport-level errors: if `fetch` throws (network down, CSP block), reject with the error so callers can show a visible recovery CTA.
- Add a short comment above the function explaining that **under `no-cors` the response is opaque**: success here means "dispatch made it to the browser's network stack", not "Apps Script wrote a row".

**`URLSearchParams` payload:** Keep name and phone in the form body (Apps Script `doPost(e)` reads `e.parameter.*`). Also keep the `payload` and `json` fields. Strip name/phone off the query URL; only `orderId`, `product`, and source should live in the query string for debugging Apps Script stack traces.

### 3.2 `src/features/cart/success-page.tsx`

**Current WhatsApp message** (line 31-32):
```
Hello Suresh! I have completed order booking ORDER_ID ... items: ... Consignee Details: Name: ..., phone: ..., address: .... Please verify and dispatch!
```

**New WhatsApp message:** Only the order summary — no PII:
```
Hello! I placed order ORDER_ID. Total: ₹AMOUNT. Please verify on your end.
%0A%0AItems:%0A- Product [Size x Qty]%0A...
```

- Remove: customer name, phone, address, city, zip from message body.
- Build the string with real newlines (`\n`) and let `buildWhatsAppUrl`'s `encodeURIComponent` handle encoding (current code uses `%0A` literal which is NOT re-encoded — the literal characters `% 0 A` reach WhatsApp).
- The success-page order-receipt card already shows all PII on screen; the WhatsApp link only needs to nudge the manufacturer to look up the order by ID.

### 3.3 `src/lib/site.ts` `buildWhatsAppUrl`

No change needed. It already calls `encodeURIComponent(message)`. The bug is that callers pass an already-encoded string; callers will now pass raw `\n`.

### 3.4 Caller: forms that call `submitLead`

`submitLead` is called from checkout / consultation / showroom-booking form handlers. Most of those handlers do not branch on the return value today (it's `await submitLead(...)` unused). After the signature change, they should either:

- Await and ignore (fire-and-forget), **or**
- Wrap in try/catch and set a local `submitError` state so the inline form can render a "couldn't send — call us" notice.

Recommended: adopt the try/catch pattern in the places that already have form-level error state (`ConsultationForm`, `ShowroomBookingForm`). Other callers can keep `await submitLead(...)` and let the error bubble to the nearest boundary.

---

## 4. Behavioral contract after fix

```
Form submit (COD / consultation / showroom)
  ├─ submitLead(payload)
  │    ├─ SCRIPT_URL missing?  → throw synchronously → caller catches → "WhatsApp this order instead"
  │    ├─ fetch throws (offline / CSP) → reject → caller catches → same recovery path
  │    └─ fetch dispatches (no-cors) → resolve (void) → caller advances to success page
  └─ Success page:
       ├─ WhatsApp link contains: orderId, total, items, NO name/phone/address
       └─ Screen card contains full PII (unchanged, expected)
```

---

## 5. Files touched

| File | Change type |
|------|-------------|
| `src/utils/googleSheets.ts` | Replace body, remove fallback URL, new return type |
| `src/features/cart/success-page.tsx` | Rewrite `message` template, drop PII fields, use `\n` not `%0A` |
| `src/components/home/ConsultationForm.tsx` | Add try/catch around `submitLead` (if not already present) |
| `src/components/home/ShowroomBookingForm.tsx` | Same as above |

---

## 6. What stays unchanged

- Apps Script Web App itself (`google-apps-script.gs`) — already reads `e.parameter.*`.
- `vercel.json` rewrites, routing, cart logic, all other pages.
- `import.meta.env.VITE_PUBLIC_GOOGLE_SCRIPT_URL` remains the env-key contract; `.env.example` already documents it.

---

## 7. Verification

1. `VITE_PUBLIC_GOOGLE_SCRIPT_URL=""` in shell → dev server prints nothing to Sheets; form advances (env-unset is now a hard error, so verify behavior is appropriate). **After implementing:** with env unset, `submitLead` should throw; callers with try/catch show "call us" UI; callers without should surface the error up to ErrorBoundary.
2. DevTools → Network: response is `opaque`; form's behavior does NOT change based on response type.
3. Success page → copy WhatsApp link body → verify: no name, no 10-digit phone, no street address, no pincode; confirm `\n` appears as line breaks in the WA composer.
4. Google Sheets → Leads tab receives new rows with correct fields end-to-end when env is set and network is up.
