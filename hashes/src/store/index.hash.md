---
State_ID: BigInt(0x1)
Git_SHA: INIT
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Store.Redux.Root

### [Signatures]
```ts
export const store: ConfiguredStore<RootState, UnknownAction>
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

**Reducers:**
- `chat` → chatSlice
- `passport` → passportSlice
- `ui` → uiSlice

### [Governance]
- **Singleton_Law:** Redux store is a module-level singleton — safe for browser, NOT safe for SSR (no request isolation).
- **SSR_Warning:** If Next.js SSR is ever enabled for pages consuming Redux, store must be per-request.

### [Semantic Hash]
Root Redux store combining chat, passport, and UI slice reducers. Exported singleton and types consumed by Redux Effect service.

### [Linkage]
- **Upstream:** `chatSlice`, `passportSlice`, `uiSlice`
- **Downstream:** `@root/src/lib/effect/services/Redux.ts`, `@root/src/store/hooks.ts`
