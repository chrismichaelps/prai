---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @UI.Provider.BuildInfo

### [Signatures]
```ts
export function BuildInfoProvider({ children }): JSX.Element
export function useBuildInfo(): string | null
```

### [Governance]
- **Singleton_Law:** Initializes `BuildInfoService` once via `useEffect` on mount. Provides `{ buildHash }` via React context to all descendants.
- **EffectBridge_Law:** `BuildInfoProvider` lives inside `I18nProvider` in `layout.tsx`. The Effect runtime is available because `Providers` (which includes `ChatProvider`) has already initialized it.
- **NullDefault_Law:** Context default is `{ buildHash: null }`. Header renders nothing until the service resolves.

### [Semantic Hash]
React context provider that bridges the `BuildInfoService` Effect Layer to the component tree. Initializes the service via `runtime.runPromise` and exposes `buildHash` to consumers.

### [Linkage]
- **Upstream:** `@root/src/lib/effect/services/BuildInfo.ts`, `@root/src/lib/effect/runtime.ts`
- **Downstream:** `@root/src/components/layout/Header.tsx`
- **Sibling:** `@root/src/app/layout.tsx` (provides `BuildInfoProvider`)
