---
State_ID: BigInt(0x1)
Git_SHA: INIT
Grammar_Lock: "@root/hashes/grammar/effect.hash.md"
---

## @Logic.Effect.Chat

### [Signatures]
```ts
export const initChat: Effect<void, never, ConfigService | Redux>
export const sendChatMessage: (content: string) => Effect<void, never, OpenRouter | ConfigService | Redux>
```

### [Governance]
- **Generator_Law:** Uses `Effect.gen` + `yield*` for linear flow — COMPLIANT.
- **Stream_Law:** `Stream.runForEach` for SSE chunk consumption — COMPLIANT.
- **Error_Law:** `Effect.catchAll` at pipeline end — partially compliant. Internal `try/catch` blocks are VIOLATIONS.

### [Implementation Notes]
- **State Isolation:** All conversational state inside streams relies exclusively on Effect `Ref` instances rather than local mutable variables to ensure atomicity.
- **Exception Safety:** Native `try/catch` blocks are prohibited in favor of `Effect.try` struct configurations for parsed errors.
- **Instrumentation:** Native `console.warn` calls are replaced with `Effect.logWarning` to funnel into standard tracing telemetry.
- **Action Validity:** Redux dispatches strictly match schema types (e.g., explicit mapping to `updateLastMessage` payloads).

### [Semantic Hash]
Manages the full chat lifecycle: initialize system prompt, stream SSE from OpenRouter, parse reasoning/content deltas, extract AdaptiveCard JSON blocks, and dispatch all state mutations via Redux.

### [Linkage]
- **Upstream:** `OpenRouter`, `ConfigService`, `Redux`, `chatSlice`, `AdaptiveCardsSchema`, `ChatConstants`
- **Downstream:** `@root/src/lib/effect/ChatProvider.tsx`
