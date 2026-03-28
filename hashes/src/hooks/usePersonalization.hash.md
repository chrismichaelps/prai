---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Hook.UsePersonalization

### [Signatures]
```ts
export function usePersonalization(): {
  readonly personalization: Personalization
  readonly loading: boolean
  readonly error: string | null
  readonly fetchPersonalization: () => Promise<void>
  readonly savePersonalization: (newPrefs: Personalization) => Promise<Personalization | null>
  readonly setPersonalization: (prefs: Personalization) => void
}
```

### [Governance]
- **Fetch_Law:** Fetches personalization on mount if authenticated.
- **Save_Law:** Posts to `/api/user/personalization` with `{ preferences: newPrefs }`.

### [Semantic Hash]
React hook for managing user personalization state with API integration.

### [Linkage]
- **Upstream:** `@root/src/app/api/user/personalization/route.ts`
- **Downstream:** `@root/src/components/chat/ChatContainer.tsx`, `@root/src/components/ui/PersonalizationModal.tsx`