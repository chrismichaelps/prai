---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Route.Chat.Completions

### [Signatures]
```ts
export async function POST(req: Request): Promise<Response | NextResponse>
```

### [Governance]
- **Secure_Proxy_Law:** Acts as a Next.js Server-Side proxy to explicitly shield `process.env.OPENROUTER_API_KEY` from the browser bundle.
- **Event_Stream_Law:** Enforces streaming capabilities (`stream: true`) by returning a raw `Response` object with `Content-Type: text/event-stream` and `Cache-Control: no-cache` headers.
- **Header_Identity:** Injects `HTTP-Referer` and `X-Title` to comply with OpenRouter API ranking and identification metrics.
- **Tier_Model_Law:** Selects model based on user's subscription tier. Free tier uses default model, Pro tier uses premium model.
- **Reasoning_Law:** Injects `reasoning: { effort: "low"|"medium" }` based on tier.
- **Plugin_Law:** Only injects web search plugins for Pro tier users.
- **Usage_Law:** Checks user usage before processing; returns 403 if limit reached.

### [Implementation Notes]
- **Model Selection:** Reads from `NEXT_PUBLIC_MODEL_NAME` (free) and `NEXT_PUBLIC_MODEL_NAME_PREMIUM` (pro) env vars.
- **Reasoning Effort:** Free = "low", Pro = "medium".
- **Plugins:** Google Search and Wikipedia only for Pro tier.
- **Auth Flow:** Checks auth, fetches usage, determines tier, then proceeds with chat.

### [Semantic Hash]
The core AI conduit with tier-based model selection, reasoning effort injection, and web search plugin support for Pro users. Acts as secure proxy to OpenRouter.

### [Linkage]
- **Upstream:** `@root/src/lib/effect/constants/SubscriptionConstants.ts`, `@root/src/lib/effect/constants/UsageConstants.ts`, `@root/src/app/api/user/usage/services/usage.ts`
- **Downstream:** UI Chat components
