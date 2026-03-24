---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/next.hash.md"
---

## @Route.Auth.Signin

### [Routes]
| Handler | Description |
|---------|-------------|
| `page.tsx` | Sign-in page with Google OAuth |

### [Signatures]
```tsx
export default function SignInPage(): JSX.Element
```

### [Governance]
- **Auth_Law:** Redirects authenticated users to home page.
- **Loading_Law:** Shows loading state while auth is initializing.
- **Action_Law:** Google OAuth sign-in via `useAuth().signIn()`.

### [Semantic Hash]
Client-side sign-in page at `/auth/signin` that provides Google OAuth authentication flow.

### [Linkage]
- **Upstream:** `useAuth` context, `useI18n` provider
- **Downstream:** Home page redirect after successful auth
