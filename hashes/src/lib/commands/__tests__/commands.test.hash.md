---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Test.Command

### [Signatures]
```ts
// Layer factories
const makeReduxLayer = (dispatched: UnknownAction[]) => Layer.succeed(Redux, {...})
const ChatApiNoopLayer: Layer.Layer<ChatApi>
const makeMemoryApiLayer = (saved?, forgotten?) => Layer.succeed(MemoryApi, {...})

// Test runner
const runExecutor = <A>(
  effect: Effect.Effect<A, CommandError, Redux | ChatApi | MemoryApi>,
  dispatched?: UnknownAction[]
) => Effect.runPromiseExit(effect.pipe(Effect.provide(Layer.mergeAll(...))))
```

### [Governance]
- **Layer_Law:** All three service dependencies (`Redux`, `ChatApi`, `MemoryApi`) provided as noop layers — no real DB or HTTP calls in tests.
- **MemoryApi_Tag_Law:** `MemoryApi` is `Context.GenericTag` — test layer uses `Layer.succeed(MemoryApi, { save, forget })` without `.of()`.
- **Coverage_Law:** Tests cover all 6 `CommandResult` variants: `setting`, `system_inject`, `navigate`, `dispatch`, `memory`, `memory_delete`.

### [Semantic Hash]
Unit tests for the command executor (`applyResult`). Validates Redux dispatching, DB persistence calls, memory writes, and navigation for all `CommandResult` types.

### [Linkage]
- **Tests:** `@/lib/commands/executor`, `@/lib/effect/services/MemoryApi`, `@/lib/effect/services/Redux`, `@/lib/effect/services/ChatApi`
