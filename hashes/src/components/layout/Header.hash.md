---
State_ID: BigInt(0x3)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/next.hash.md"
---

## @UI.Layout.Header

### [Signatures]
```ts
export function Header({ className, transparent, variant }: HeaderProps): JSX.Element

interface HeaderProps {
  className?: string
  transparent?: boolean
  variant?: 'default' | 'chat'
}
```

**Variants:**
- `default` — home/about pages. Shows nav links, auth-aware actions.
- `chat` — chat page. Shows model info button only.

### [Governance]
- **AuthAware_Law:** Renders different UI based on `isAuthenticated` state from `useAuth()`.
- **AnimatePresence_Law:** Uses framer-motion `AnimatePresence` for smooth auth state transitions.
- **Dropdown_Law:** Avatar dropdown with user menu (open chat, sign out).
- **CallbackUrl_Law:** Passes `callbackUrl` to `signIn()` for post-login redirect.
- **Mobile_Law:** Full-screen mobile menu with auth-aware actions.

### [Implementation Notes]
- **Desktop Actions:** Animated crossfade between login button and authenticated state (avatar + "Abrir Chat").
- **Avatar Dropdown:** Shows user avatar/initials, name, email. Menu with "Mi Chat" and "Cerrar sesión".
- **Mobile Menu:** Slide-in overlay with large typography actions, auth-aware.
- **useAuth:** Consumes `@Context.Auth` for auth state and actions.
- **getCallbackUrl:** Reads `callbackUrl` from query params for protected route redirects.

### [Semantic Hash]
Top navigation header with auth-aware rendering. Uses `useAuth()` hook to conditionally show login or user avatar/dropdown. Includes mobile menu with smooth animations.

### [Linkage]
- **Upstream:** `@root/src/contexts/AuthContext.tsx`, `@root/src/lib/effect/I18nProvider.tsx`, `@root/src/store/slices/uiSlice.ts`
- **Downstream:** All page layouts
