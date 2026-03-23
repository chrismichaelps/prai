---
State_ID: BigInt(0x0fc98cc)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Component.Header

### [Signatures]
```ts
export function Header(props: { className?: string, transparent?: boolean, variant?: 'default' | 'chat' }): JSX.Element
```

### [Governance]
- **Client_Law:** Pure `'use client'` component managing layout interactions.
- **Auth_Hook_Integration:** Utilizes `useAuth()` to dynamically render SignIn, Profile Dropdown, or LogOut options based on Supabase session state.
- **Z_Index_Stacking:** Mandates `z-[100]` to explicitly resolve overlap with Chat Sidebar and Map components.

### [Semantic Hash]
Global application header handling brand navigation, responsive hamburger menu, and authentication gateways. Dynamic dropdowns scale based on user roles and locale strings.

### [Linkage]
- **Dependencies:** `@root/contexts/AuthContext.tsx`, `framer-motion`, `@root/store/slices/uiSlice.ts`
