---
State_ID: BigInt(0x0fc98cc)
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
- **Event_Stream_Law:** Enforces streaming capabilities (`stream: true`) by returning a raw `Response` object with `Content-Type: text/event-stream` and `Cache-Control: no-cache` headers, ensuring the UI receives token-by-token generation.
- **Header_Identity:** Injects `HTTP-Referer` and `X-Title` to comply with OpenRouter API ranking and identification metrics.

### [Semantic Hash]
The core Artificial Intelligence conduit. Proxies UI-generated message histories securely to OpenRouter (Gemini 2.0 Flash) and streams the response text back to the client interface.

### [Linkage]
- **Dependencies:** `next/server`
