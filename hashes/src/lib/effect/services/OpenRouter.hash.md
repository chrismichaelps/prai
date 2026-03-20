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
  readonly chat: (messages: readonly ChatMessage[]) => Stream.Stream<string, OpenRouterError, never>
}
```

### [Governance]
- **Layer_Law:** Depends on `ConfigService` (via yield*) and `HttpClient.HttpClient` (via @effect/platform-browser).
- **Export_Law:** Single Effect.Service class with `accessors: true`. Exposes `OpenRouter.chat(...)` directly.
- **Propagation_Law:** HTTP errors (429, network) are mapped to `OpenRouterError` — typed E channel.
- **Stream_Law:** Uses `Stream.unwrapScoped` for proper SSE lifecycle management.

### [Implementation Notes]
- **HTTP Referer:** The HTTP-Referer header is dynamically sourced from `ConfigService.siteUrl` rather than hardcoded to ensure full portability across environments.

### [Semantic Hash]
OpenAI-compatible streaming chat completion via OpenRouter.ai HTTP API. Returns `Stream<string, OpenRouterError>` of raw SSE chunks.

### [Linkage]
- **Upstream:** `@root/src/lib/effect/services/Config.ts`, `@root/src/lib/effect/errors.ts`
- **Downstream:** `@root/src/lib/effect/chat.ts`, `@root/src/lib/effect/runtime.ts`
