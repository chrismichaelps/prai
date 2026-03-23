---
State_ID: BigInt(0x0fc98cc)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Component.ProfileClient

### [Signatures]
```ts
export function ProfileClient(): JSX.Element
function getSupabaseClient(): SupabaseClient<Database>
```

### [Governance]
- **Client_Law:** Pure `'use client'` interactive component.
- **State_Silo:** Manages local form state (`isEditing`, `isSaving`, `displayName`, `bio`, `language`).
- **Mutation_Law:** Utilizes `getSupabaseClient()` to directly mutate `profiles` table in Supabase. Bypasses Redux in favor of React Context (`useAuth`).
- **I18n_Law:** Directly mutates global locale via `setLocale` and persists language choice to database.

### [Semantic Hash]
Interactive dashboard wrapper for user identity management. Handles the edit/save flow, optimistic UI updates, and Supabase integration.

### [Linkage]
- **Dependencies:** `@root/src/components/layout/Header.tsx`, `@root/contexts/AuthContext.tsx`, `@root/components/ui/ToastProvider.tsx`, `@supabase/ssr`
