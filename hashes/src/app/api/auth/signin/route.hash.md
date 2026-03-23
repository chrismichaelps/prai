---
State_ID: BigInt(0x0fc98cc)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Route.Auth.Signin

### [Signatures]
```ts
export async function POST(request: NextRequest): Promise<NextResponse>
```

### [Governance]
- **Google_SSO_Law:** Instantiates `signInWithOAuth({ provider: 'google' })` through the Supabase server client.
- **CSRF_Redirect_Anchor:** Explicitly hardcodes the `redirectTo` options parameter to `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback` to guarantee security against open redirect attacks.
- **Secure_Cookie_Tunnel:** Pre-warms the HTTP-only cookie store during the initial SSO jump to prevent session tearing.

### [Semantic Hash]
The OAuth initiation boundary. Responds with the Google Authentication URL for the client to redirect the browser.

### [Linkage]
- **Dependencies:** `next/server`, `@supabase/ssr`
