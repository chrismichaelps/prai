---
State_ID: BigInt(0x2)
Git_SHA: LATEST
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
  readonly code: number
  readonly rateLimit?: { readonly limit: string; readonly remaining: string; readonly reset: string }
  readonly cause?: unknown
}> {}

export class AuthError extends Data.TaggedError("AuthError")<{
  readonly message: string
  readonly cause?: unknown
}> {}

export class BuildInfoError extends Data.TaggedError("BuildInfoError")<{
  readonly message: string
  readonly cause?: unknown
}> {}

export class ParseError extends Data.TaggedError("ParseError")<{
  readonly message: string
  readonly cause?: unknown
}> {}

export class RuntimeError extends Data.TaggedError("RuntimeError")<{
  readonly message: string
  readonly cause?: unknown
}> {}

export class AccessibilityError extends Data.TaggedError("AccessibilityError")<{
  readonly message: string
  readonly cause?: unknown
}> {}

export class SeoError extends Data.TaggedError("SeoError")<{
  readonly message: string
  readonly cause?: unknown
}> {}
```

### [Governance]
- **Error_Law:** All errors use `Data.TaggedError` — typed in E channel, yieldable in Effect.gen.
- **Export_Law:** Flat exports from `@/lib/effect/errors`.
- **Propagation_Law:** Errors propagate up to handlers via `Effect.catchAll` or `Effect.gen`.

### [Semantic Hash]
Domain-level typed error definitions for all Effect services.

### [Linkage]
- **Used by:** All Effect services (`AuthError`, `ConfigError`, `OpenRouterError`, etc.)
