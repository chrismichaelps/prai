---
State_ID: BigInt(0x1)
Git_SHA: INIT
Grammar_Lock: "@root/hashes/grammar/effect.hash.md"
---

## @Effect.Errors

### [Signatures]
```ts
export class ConfigError extends Data.TaggedError("ConfigError")<{
  readonly message: string
  readonly cause?: unknown
}> {}

export class OpenRouterError extends Data.TaggedError("OpenRouterError")<{
  readonly message: string
  readonly code?: number
  readonly rateLimit?: { readonly limit: string; readonly remaining: string; readonly reset: string }
  readonly cause?: unknown
}> {}
```

### [Governance]
- **Error_Law:** Both errors use `Data.TaggedError` — typed in E channel, yieldable in Effect.gen.
- **Export_Law:** Flat exports, no barrel. Imported directly per consumer.
- **Propagation_Law:** Errors propagate up to `chat.ts` which handles via `Effect.catchAll`.

### [Semantic Hash]
Domain-level typed error definitions for Config and OpenRouter failure channels.

### [Linkage]
- **Upstream:** None
- **Downstream:** `@root/src/lib/effect/services/OpenRouter.ts`, `@root/src/lib/effect/chat.ts`

### [Quality Notes]
- `cause?: unknown` is acceptable for defect wrapping but could be replaced with `Cause<never>` for Effect-native tracing.
