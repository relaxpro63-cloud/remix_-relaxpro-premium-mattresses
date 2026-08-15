# RelaxPro AI — Voice Sales Assistant

**Date:** 2026-08-14
**Status:** Design approved, pending spec review
**Repo:** `remix_-relaxpro-premium-mattresses-main/relaxpro`

---

## 1. Goal

A voice-and-text sales assistant ("RelaxPro AI") embedded in the RelaxPro
marketing site. Visitors speak or type in Telugu, Tenglish, English, or Hindi
and get help choosing a mattress, grounded strictly in real Sanity CMS product
data. When buying intent appears, the assistant captures a lead into the
existing Google Sheet and can hand off to a human on WhatsApp.

### Success criteria

- A visitor can complete "find me a queen mattress under ₹20,000" by voice on
  Android Chrome and land on the correct product page.
- Every price, size, thickness, and warranty figure shown originates from the
  Sanity catalog, never from model output.
- A captured lead reaches the existing Google Sheet with a usable context
  summary attached.
- The widget adds no measurable cost to initial page load.
- The site continues to work normally when the AI backend is unavailable.

### Non-goals

- Payment or checkout inside the assistant. RelaxPro has no payment gateway;
  the assistant hands off to WhatsApp or the existing cart.
- Replacing Tawk.to human chat.
- Authenticated or cross-device conversation history.
- Medical advice of any kind.

---

## 2. Context: the existing codebase

Facts that shaped this design.

| Fact | Consequence |
|---|---|
| Static Vite + React 19 SPA on Vercel. No `api/` directory, no server. | Serverless functions must be introduced, and `vercel.json`'s SPA catch-all rewrite must be amended to stop swallowing `/api/*`. |
| Catalog is **13 products** plus a handful of accessories. | No vector DB, no embeddings, no RAG. Deterministic filtering over an in-memory array is sufficient and exact. |
| Products carry two mutually exclusive `pricingModel` shapes — `with_without_accessories` and `fabric_options` — each a size-keyed price map. | Price resolution is genuinely error-prone and must live in one tested function, never in a prompt. |
| `MattressSize` in `src/types.ts` includes 18 dimension sizes (`72x36`…`78x72`) that the Sanity `product.pricing` schema does not define. They silently resolve to `0`. | The assistant must never quote these sizes. Catalog normalization treats a `0` price as *absent*, not as free. |
| `src/services/leadService.ts` posts to Google Apps Script with `mode: 'no-cors'`, so the response is unreadable and the function **always returns `{success: true}`**, even on failure. | Routing leads through a serverless function fixes a pre-existing silent data-loss bug. |
| WhatsApp number is already centralised in `src/lib/site.ts` (`WHATSAPP_NUMBER`, `buildWhatsAppUrl`). | The "don't hardcode the number in many places" requirement is already satisfied — reuse, don't re-add. |
| Bottom-right holds the WhatsApp FAB; bottom-left holds Tawk.to (moved there deliberately in commit `89d3d22`). | A third floating button is not viable. See §7. |
| Repo has **no test setup at all**. | Vitest is introduced as part of this work, scoped to the pure logic where bugs are silent and expensive. |

---

## 3. Approved decisions

| # | Decision | Rationale |
|---|---|---|
| 1 | **Vercel serverless functions in this repo** | Same repo, same deploy, same origin — no CORS, no second host, no extra bill. |
| 2 | **Browser-native Web Speech API, typed fallback** | Zero cost and zero added latency. Works well on Android Chrome, which dominates Indian traffic. Degrades to a text chat on iOS Safari and Firefox with an explicit message. |
| 3 | **Tool calls into a deterministic search + scoring layer** | Prices and specs are produced by code, not by the model. This is what makes "never invent prices" enforceable rather than an aspiration. |
| 4 | **Stateless conversations; transcript summary attached to the lead** | No database, no new infra. Sales gets context on real leads without storing every anonymous visitor's chat. |
| 5 | **Groq + `llama-3.3-70b-versatile`** | ~10–20× cheaper and substantially faster than a frontier model. Removes cost as the binding constraint. |
| 6 | **Tenglish is the default language; Telugu button retained with degraded quality** | Llama 3.3 70B officially supports 8 languages (English, German, French, Italian, Portuguese, Hindi, Spanish, Thai). Telugu is not among them. See §4. |

---

## 4. Known limitation: Telugu script

This is a capability gap in the chosen model, recorded here so it is not
rediscovered as a bug.

`llama-3.3-70b-versatile` is not trained for Telugu. Telugu-script output will
show malformed words, incorrect grammar, and occasional script drift. This is
not tunable through prompting.

**Mitigations built into the design:**

- Tenglish is the default and visually primary language option. It is
  Latin-script code-mixed text, which the model handles acceptably, and it is
  what the product's own example conversations use.
- Telugu (`తెలుగు`) remains selectable. Telugu **voice input** works well
  regardless — that path depends on Chrome's `te-IN` speech recognition, not on
  the model — so a Telugu speaker can speak naturally and receive a Tenglish
  reply.
- Hindi, though scoped as "future-ready", is in fact the best-supported Indian
  language in this model. The language layer is built so enabling it is a
  one-line config change.

**Escalation path if Telugu quality proves unacceptable:** add a routing layer
in `_lib/llm.ts` that sends `language === 'telugu'` turns to a model with real
Telugu support (Claude, or Sarvam AI — an Indian-language specialist) and keeps
everything else on Groq. The LLM client is deliberately behind an interface to
make this a contained change.

---

## 5. Architecture

```
Browser widget ──POST /api/chat──▶ Vercel fn ──▶ Groq (llama-3.3-70b-versatile)
   │  Web Speech API                    │              │
   │  (mic + TTS)                       │              └─tools─▶ search_products
   │                                    │                        get_product
   │                                    │                        compare_products
   │                                    ▼                        capture_lead
   │                              Sanity CDN                     escalate_to_human
   │                            (catalog cache, 5 min TTL)
   │
   └──POST /api/lead────────────▶ Vercel fn ──▶ Apps Script ──▶ Google Sheet
```

### Request lifecycle — a product query

1. Widget POSTs `{ sessionId, messages[], language }` to `/api/chat`.
2. Handler runs rate-limit and payload-size checks.
3. Handler builds the system prompt and the OpenAI-format tool schemas, then
   calls Groq chat completions.
4. Model returns `finish_reason: "tool_calls"` with
   `search_products({ maxPrice: 20000, size: "queen", firmness: "medium" })`.
5. Handler validates the arguments with Zod. On failure it returns a structured
   error to the model and allows exactly one repair attempt.
6. Handler filters the normalized catalog and runs `scoreProducts()`, returning
   the top 3 as JSON with `score` and `reasons[]`.
7. Handler calls Groq a second time with the tool result appended.
8. Model writes the reply in the user's language.
9. Handler responds with `{ message, products, intent, language }`.
10. Widget renders the text, renders product cards **from `products`**, and
    speaks the text if voice output is enabled.

**Non-streaming is deliberate.** Groq serves Llama 3.3 70B at several hundred
tokens per second; a complete turn including the tool hop lands in roughly one
to two seconds. Streaming would add tool-call delta accumulation for no
perceptible gain. The response shape is a plain JSON object. Streaming remains
a contained later upgrade if turn latency grows.

### Model configuration

```ts
{
  model: 'llama-3.3-70b-versatile',
  temperature: 0.5,          // lower improves tool-calling reliability
  max_completion_tokens: 1024,
  tools,
  tool_choice: 'auto',
}
```

Anthropic-specific parameters (`thinking`, `output_config.effort`,
`cache_control`) do not exist on this API and are absent.

**No prompt caching.** Groq bills the full system prompt every turn. At this
model's rates the cost is negligible, but the prompt is kept tight regardless.

---

## 6. Components

### 6.1 Backend — `api/`

New directory. Vercel Node functions, TypeScript.

| File | Responsibility |
|---|---|
| `api/chat.ts` | `POST /api/chat`. Rate-limit, build prompt, run the tool loop, return the turn. |
| `api/products.ts` | `GET /api/products` with `minPrice`, `maxPrice`, `size`, `material`, `firmness`, `tier`, `inStock`. Also usable by the widget directly. |
| `api/lead.ts` | `POST /api/lead` → Apps Script, with real error handling. |
| `api/_lib/llm.ts` | Groq client behind a narrow interface. The only file that knows the vendor. |
| `api/_lib/sanity.ts` | Server-side Sanity client (`useCdn: true`). |
| `api/_lib/catalog.ts` | Fetch + normalize products and accessories. **Owns `priceFor()`** — collapses both `pricingModel` shapes into one lookup. In-memory cache, 5-minute TTL. |
| `api/_lib/recommend.ts` | Pure scoring function. No I/O. |
| `api/_lib/tools.ts` | Tool schemas (OpenAI function-calling format), Zod arg validators, handlers. |
| `api/_lib/prompt.ts` | System prompt assembly and per-language instruction blocks. |
| `api/_lib/ratelimit.ts` | Best-effort per-IP limiter and quota guard. |

`vercel.json` gains an exclusion so `/api/*` is not rewritten to `/index.html`:

```json
{ "source": "/((?!api/).*)", "destination": "/index.html" }
```

New runtime dependencies: `groq-sdk`, `zod` (Zod runs in the request path
validating tool arguments, so it is a dependency, not a dev dependency). New
dev dependency: `vitest`.

### 6.2 Frontend — `src/features/voice-ai/`

New directory, lazy-loaded via `React.lazy` so it contributes nothing to
initial page load.

```
VoiceAssistant.tsx            shell: desktop panel / mobile bottom sheet
components/MicButton.tsx      idle | listening | processing states
components/LanguagePicker.tsx Tenglish (default) | English | Telugu | [Hindi]
components/QuickActions.tsx   six preset prompts
components/MessageList.tsx    scroll container, autoscroll, aria-live
components/MessageBubble.tsx  user / assistant, replay button
components/ProductRecommendationCard.tsx
components/LeadCaptureForm.tsx
hooks/useVoiceRecognition.ts
hooks/useSpeechSynthesis.ts
hooks/useChat.ts              session id, history, request, error states
lib/languages.ts              single source of language truth
types.ts
```

**Reused, not rebuilt:** `ui/Button`, `ui/SafeImage`, `ui/PriceText`,
`ui/Toast`, `motion/motionPrimitives`, and `WHATSAPP_NUMBER` /
`buildWhatsAppUrl` from `lib/site.ts`. Styling uses the existing Tailwind v4
tokens (`brand-*`, `accent`, `graphite-*`) so the widget reads as part of the
site rather than a bolted-on chatbot.

### 6.3 Language configuration

`src/features/voice-ai/lib/languages.ts` is the only place language behaviour
is defined.

```ts
export const LANGUAGES = {
  tenglish: { label: 'Tenglish', asr: 'en-IN', tts: 'en-IN', enabled: true,  default: true },
  english:  { label: 'English',  asr: 'en-IN', tts: 'en-IN', enabled: true },
  telugu:   { label: 'తెలుగు',   asr: 'te-IN', tts: 'te-IN', ttsFallback: 'en-IN', enabled: true },
  hindi:    { label: 'हिन्दी',    asr: 'hi-IN', tts: 'hi-IN', enabled: false },
} as const
```

Two decisions encoded here:

- **Tenglish uses `en-IN` for recognition.** No speech recogniser anywhere
  emits romanized Telugu. `te-IN` returns Telugu script; `en-IN` returns
  approximate English words. The model decodes the latter reliably
  ("naaku queen mattress kavali under 20k" parses fine).
- **Tenglish uses an `en-IN` voice for speech.** Latin-script Tenglish read by
  a Telugu voice mispronounces badly; read by an Indian-English voice it sounds
  approximately correct.

---

## 7. Floating button consolidation

Bottom-right currently holds `WhatsAppFAB`; bottom-left holds the Tawk.to
launcher. A third floating control would make the corner unusable on mobile.

**Resolution:** RelaxPro AI takes bottom-right. `WhatsAppFAB` is removed from
`App.tsx` and its function moves inside the assistant as the "Talk to Expert on
WhatsApp" action — which the requirements call for regardless. Tawk.to stays
bottom-left, untouched.

Net effect: one fewer floating element than today, and the WhatsApp handoff
gains conversation context it did not previously have.

---

## 8. Tools

All tools use the OpenAI function-calling schema. Every handler validates its
arguments with Zod before touching catalog or pricing code. On validation
failure the handler returns a structured error message as the tool result and
the loop permits exactly one repair attempt before falling back to the generic
error response.

### `search_products`

```
{ maxPrice?, minPrice?, size?, firmness?, material?, tier?, sleepingPosition? }
```

Filters the normalized catalog, runs `scoreProducts()`, returns the top 3 with
`score` and `reasons[]`. Returns an empty array rather than a near-miss when
nothing qualifies.

### `get_product`

```
{ slug, size?, includeAccessories?, fabricOption? }
```

Full detail for one product, including the exact resolved price for the
requested configuration. Fields absent from the CMS are returned as explicit
`null` — never omitted, never guessed.

### `compare_products`

```
{ slugs: string[] }   // 2–3
```

Side-by-side comparable fields for the comparison view.

### `capture_lead`

```
{ name, phone, preferredContact, city?, notes? }
```

Called **only** after buying intent. Posts to `/api/lead`. Returns success or a
real failure — no optimistic success.

### `escalate_to_human`

```
{ context? }
```

Returns a `wa.me` URL built by `buildWhatsAppUrl` from `lib/site.ts`, with a
prefilled message carrying the conversation context.

---

## 9. Recommendation scoring

`api/_lib/recommend.ts`. Pure, synchronous, no I/O — the most heavily tested
file in the feature.

| Signal | Weight |
|---|---|
| Budget match | 30 |
| Sleeping position | 20 |
| Firmness match | 20 |
| Material match | 15 |
| Size availability | 10 |
| Features | 5 |

Returns:

```ts
{ slug: string, score: number, reasons: string[] }
```

`reasons` are generated from the matched signals ("Within your budget",
"Available in Queen size", "Matches your preferred firmness") and are what the
product card renders. The percentage on the card is this `score` — a computed
number, not a model-authored one.

Products whose price resolves to `0` or `undefined` for the requested size are
excluded entirely rather than scored, because `0` means "not defined in the
CMS", not "free".

---

## 10. Lead capture

No phone number is requested until buying intent appears — "I want to buy",
"can someone call me", "WhatsApp me", or an equivalent. The system prompt
states this and the `capture_lead` tool description repeats it.

Flow: `capture_lead` → `POST /api/lead` → existing Apps Script → Google Sheet.

The lead payload reuses the existing column contract and adds one field:

- **`aiSummary`** — a one-line recap the model produces (budget, size, firmness
  preference, products discussed). Sales receives context rather than a bare
  phone number.

Adding a column requires a matching update to `COLUMN_HEADERS` in
`google-apps-script.gs` and a redeploy of the Web App.

`/api/lead` reads the real Apps Script response. This is the fix to the
existing `mode: 'no-cors'` blindness described in §2. Existing site forms can
be migrated to this endpoint later; that migration is out of scope here.

---

## 11. Error handling

Exact user-facing strings, each wired to a real detectable condition. Nothing is
invented to paper over a failure.

| Condition | Message |
|---|---|
| Groq unreachable, 5xx, quota exhausted, or rate-limit trip | "Sorry, I'm having trouble connecting right now. Please try again or contact our RelaxPro expert on WhatsApp." |
| `getUserMedia` returns `NotAllowedError` | "I couldn't access your microphone. Please check your browser microphone permission." |
| `search_products` returns empty | "I don't have enough information to recommend a product right now. Please contact our RelaxPro team." |
| `SpeechRecognition` absent from `window` | "Voice input is not supported on this browser. Please type your question." Mic control is hidden; text input remains. |
| Requested field is `null` in the CMS | Model states it does not have that information and recommends contacting the RelaxPro team. |

The WhatsApp escalation link is present in every error state, so a failure
always leaves the visitor a path forward.

---

## 12. Abuse and quota control

`/api/chat` is public and unauthenticated. Guards:

- Per-IP request limiter (in-memory, per serverless instance — best-effort, but
  effective against naive loops since Vercel reuses instances).
- Hard caps on message length, history length, and turns per session.
- `AI_DAILY_REQUEST_CAP` env var; when exceeded the endpoint returns the
  standard connection-failure message rather than calling Groq.

Groq's own request quota is the binding constraint, not spend. **Each product
turn costs two Groq requests** because of the tool round trip. Verify the
account tier's daily allowance against expected traffic before launch.

If real abuse appears, the upgrade is a shared store (Upstash Redis) for
cross-instance limiting.

---

## 13. Secrets

| Name | Where |
|---|---|
| `GROQ_API_KEY` | Vercel project environment variables. Never in the repo. |
| `VITE_PUBLIC_GOOGLE_SCRIPT_URL` | Already present. |
| `AI_DAILY_REQUEST_CAP` | Vercel env, optional, defaults to a conservative value. |

`.env.example` lists names only, never values. Note that `.env.example` is
**not** gitignored in this repo while `.env.local` is.

**The Groq key shared during design must be rotated before launch** — it was
transmitted in plaintext and must be treated as compromised.

---

## 14. System prompt

Used verbatim, with a per-language instruction block appended.

> You are RelaxPro AI, the official virtual mattress shopping assistant for RelaxPro.
>
> Your job is to help customers understand RelaxPro mattresses and choose products based only on verified RelaxPro product information supplied to you.
>
> Customers may speak English, Telugu, Tenglish, Hindi, or mixed language. If the customer uses Tenglish, respond naturally in conversational Tenglish. Do not use overly formal Telugu unless the customer requests it.
>
> You are a sales assistant, not a doctor. Never make medical diagnoses or medical guarantees. Never say that a mattress will cure back pain, neck pain, arthritis, or any disease.
>
> Never invent product specifications, prices, sizes, stock, warranty, delivery times, discounts, or offers. Only use the product information provided by the application. If information is missing, say that you do not have the information and recommend contacting a RelaxPro expert.
>
> Ask short clarification questions when necessary. When recommending a mattress, explain briefly why it matches the customer's stated preferences.
>
> Prioritize: customer requirements, budget, mattress size, sleeping position, firmness preference, material preference, verified product data.
>
> Always remain friendly, concise, and helpful. If the customer wants to buy or speak with a human, offer WhatsApp or lead capture. Do not pressure the customer to purchase.

Appended operational rules: never state a price not returned by a tool; call
`search_products` before recommending anything; do not ask for a phone number
before buying intent; keep replies under roughly three sentences unless the
customer asks for detail.

---

## 15. Testing

Vitest is introduced by this work. Coverage is scoped to logic where a bug is
silent and expensive rather than to the whole widget.

**Unit tested:**

- `recommend.ts` — weights, tie-breaks, reason generation, exclusion of
  unpriced products.
- `catalog.ts` — `priceFor()` across both `pricingModel` shapes for every size,
  explicitly including the 18 dimension sizes that must resolve to "no price"
  rather than `0`.
- `languages.ts` — voice selection and fallback when no Telugu voice is
  installed.
- Tool handlers — Zod validation, malformed-argument repair, empty results.

**Manually verified:** Android Chrome (primary target — full voice), iOS Safari
(text fallback path), desktop Firefox (no `SpeechRecognition` — fallback
message).

**Playwright smoke test:** open widget → click a quick action → assert a
product card renders → assert the WhatsApp link resolves to the configured
number.

---

## 16. Build order

Each phase is independently useful and independently verifiable.

1. **Backend foundation** — `api/` scaffolding, `vercel.json` fix,
   `sanity.ts`, `catalog.ts` with `priceFor()`, `recommend.ts`, plus Vitest and
   the unit tests for those two. Verifiable with no UI.
2. **Chat endpoint** — `llm.ts`, `tools.ts`, `prompt.ts`, `ratelimit.ts`,
   `api/chat.ts`. Verifiable with `curl`.
3. **Widget shell, text-only** — `VoiceAssistant`, `useChat`, message list,
   quick actions, product cards. Full feature working without any microphone.
4. **Voice layer** — `useVoiceRecognition`, `useSpeechSynthesis`,
   `LanguagePicker`, `MicButton`, unsupported-browser fallbacks.
5. **Lead capture** — `api/lead.ts`, `capture_lead`, `LeadCaptureForm`,
   `aiSummary` column, Apps Script update, WhatsApp escalation.
6. **Integration and polish** — mount in `App.tsx`, remove `WhatsAppFAB`,
   mobile bottom sheet, accessibility pass, Playwright smoke test.

---

## 17. Open items

- Confirm the Groq account tier's daily request allowance against expected
  traffic (§12).
- Rotate the Groq API key before launch (§13).
- `google-apps-script.gs` needs the `aiSummary` column added and the Web App
  redeployed (§10).
