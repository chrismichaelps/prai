---
State_ID: BigInt(0x1)
Git_SHA: INIT
Grammar_Lock: "@root/hashes/grammar/effect.hash.md"
---

## @Service.Redux

### [Signatures]
```ts
export class Redux extends Effect.Service<Redux>()("Redux", {
  sync: () => ({
    dispatch: <T>(action: T) => Effect.sync(() => store.dispatch(action as any)),
    getState: () => Effect.sync(() => store.getState() as RootState),
  }),
  accessors: true
}) {}
```

**Interface:**
```ts
interface ReduxShape {
  readonly dispatch: <T>(action: T) => Effect<void, never, never>
  readonly getState: () => Effect<RootState, never, never>
}
```

### [Governance]
- **Layer_Law:** `Redux.Default` uses `sync:` — synchronously wraps the singleton Redux store.
- **Export_Law:** Single class with `accessors: true`. Exposes `Redux.dispatch(...)` and `Redux.getState()` directly.
- **Type_Law:** `dispatch<T>(action: T)` — use `as any` is justified here due to Redux action type variability, but could be improved with `AnyAction` or `UnknownAction` from Redux Toolkit.

### [Implementation Notes]
- **Action Type Safety:** Redux dispatches utilize `@reduxjs/toolkit` `UnknownAction` to maintain strict compiler safety instead of raw `any` casting.

### [Semantic Hash]
Bridges the Redux singleton store into the Effect dependency graph. Enables Effect-native state reads and dispatches.

### [Linkage]
- **Upstream:** `@root/src/store/index.ts`
- **Downstream:** `@root/src/lib/effect/chat.ts`, `@root/src/lib/effect/runtime.ts`
