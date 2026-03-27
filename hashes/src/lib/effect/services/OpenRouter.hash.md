---
State_ID: BigInt(0x1)
Git_SHA: INIT
Grammar_Lock: "@root/hashes/grammar/effect.hash.md"
---

## @Service.OpenRouter

### [Signatures]
```ts
export class OpenRouter extends Effect.Service<OpenRouter>()("OpenRouter", {
  effect: Effect.gen(function* () {
    return { chat } as const
  }),
  accessors: true
}) {}
```

**Interface:**
```ts
interface OpenRouterShape {
  readonly chat: (messages: readonly ChatMessage[], searchOptions?: PuertoRicoSearchOptions, sessionId?: string) => Stream.Stream<ChatResponse, OpenRouterError, never>
}
```

### [Governance]
- **Layer_Law:** Depends on `ConfigService` (via yield*) and `HttpClient.HttpClient` (via @effect/platform-browser).
- **Export_Law:** Single Effect.Service class with `accessors: true`. Exposes `OpenRouter.chat(...)` directly.
- **Propagation_Law:** HTTP errors (429, network) are mapped to `OpenRouterError` — typed E channel.
- **Stream_Law:** Uses `Stream.unwrapScoped` for proper SSE lifecycle management.

### [Implementation Notes]
- **HTTP Referer:** The HTTP-Referer header is dynamically sourced from `ConfigService.siteUrl` rather than hardcoded to ensure full portability across environments.
- **Session_ID:** Optional `session_id` parameter passed to OpenRouter for grouping generations into sessions (debug chains, full conversation tracking).
- **Response:** Returns `ChatResponse` containing `content`, `reasoning`, and `annotations` (not raw string).

### [Semantic Hash]
OpenAI-compatible streaming chat completion via OpenRouter.ai HTTP API. Returns `Stream<ChatResponse, OpenRouterError>` with content, reasoning, and annotations. Supports optional session_id for conversation grouping.

### [Linkage]
- **Upstream:** `@root/src/lib/effect/services/Config.ts`, `@root/src/lib/effect/errors.ts`
- **Downstream:** `@root/src/lib/effect/chat.ts`, `@root/src/lib/effect/runtime.ts`
