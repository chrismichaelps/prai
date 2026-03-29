---
State_ID: BigInt(0x0fc98e6)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Profile.Client

### [Signatures]
```ts
export default function ProfileClient({ profile, email, chatsCount }): JSX.Element
```

### [Governance]
- **Auth_Gate_Protected:** Mandates wrapping the entire profile view in a `ProtectedRoute` to prevent unauthorized metadata leakage.
- **Data_Sovereignty_Modal:** Enforces a multi-step confirmation flow for account deletion, including a handle-match verification and a high-fidelity warning modal.
- **I18n_Boundary:** Strictly resolves all profile labels (bio, data controls, danger zone) through the `useI18n` hook.
- **Usage_Law:** Fetches usage on mount, displays TierBadge next to display name.
- **StrictMode_Law:** Uses `chatsCountFetched` ref to prevent duplicate API calls in development (React Strict Mode).

### [Semantic Hash]
The private UI boundary for user account management. It facilitates profile metadata viewing, data archival/deletion, and the final account closure process, ensuring a secure and user-centric data control interface.

### [Linkage]
- **Dependencies:** `@/components/auth/ProtectedRoute`, `@/lib/effect/I18nProvider`, `hooks/useUsage`, `components/usage/TierBadge`, `framer-motion`, `lucide-react`
