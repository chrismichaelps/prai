---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/next.hash.md"
---

## @Component.Auth.ProtectedRoute

### [Signatures]
```ts
export function ProtectedRoute({ children, redirectTo }: ProtectedRouteProps): JSX.Element

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
}
```

### [Governance]
- **ClientOnly_Law:** Uses `'use client'` directive.
- **useEffect_Law:** Uses `useEffect` for navigation (required for side effects).
- **useMemo_Law:** Computes redirect URL and content with `useMemo` for purity.

### [Implementation Notes]
- **Loading State:** Shows spinner while `!initialized || isLoading`.
- **Redirect Logic:** When unauthenticated, redirects to `redirectTo/?callbackUrl=currentPath`.
- **useMemo:** Computes `redirectUrl` and `content` purely, then `useEffect` handles navigation.
- **Graceful:** Returns `null` during redirect, content only renders when authenticated.

### [Semantic Hash]
Wrapper component that protects routes requiring authentication. Shows loading state, then redirects unauthenticated users to login page with callback URL.

### [Linkage]
- **Upstream:** `@root/src/contexts/AuthContext.tsx`
- **Used by:** `@root/src/app/chat/page.tsx`, `@root/src/app/profile/page.tsx`
