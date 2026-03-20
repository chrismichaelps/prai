---
State_ID: BigInt(0x1)
Git_SHA: INIT
Grammar_Lock: "@root/hashes/grammar/effect.hash.md"
---

## @Context.Effect.I18n

### [Signatures]
```ts
export function I18nProvider({ children }: { children: React.ReactNode }): JSX.Element
export const useI18n: () => { t: (key: string) => string; locale: string; setLocale: (l: Locale) => void }
```

### [Governance]
- **Bridge_Law:** Uses ManagedRuntime to bridge Effect locale Ref into React context.
- **State_Law:** Locale state held in Effect Ref — mutations propagate via React state sync.

### [Semantic Hash]
React Context wrapper for Effect-based I18n service. Provides `t()` translate function and locale switcher to all component children.

### [Linkage]
- **Upstream:** `@root/src/lib/effect/services/I18n.ts`, `@root/src/lib/effect/runtime.ts`, `@root/src/lib/effect/i18n/index.ts`
- **Downstream:** All UI components using `useI18n()`
