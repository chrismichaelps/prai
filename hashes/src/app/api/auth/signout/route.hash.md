---
State_ID: BigInt(0x0fc98cc)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Route.Auth.Signout

### [Signatures]
```ts
export async function POST(request: NextRequest): Promise<NextResponse>
```

### [Governance]
- **Session_Termination_Law:** Calls `supabase.auth.signOut()` on the server client to actively revoke the token from the backend database.
- **Cookie_Purge_Law:** Mutates the `NextResponse` cookie proxy to aggressively delete the local HTTP-only session identifiers, enforcing zero-trust state on the client after execution.

### [Semantic Hash]
The authoritative Session Destruction boundary. Ensures cryptographic termination of the session on both the client (cookies) and server (Supabase token blacklist).

### [Linkage]
- **Dependencies:** `next/server`, `@supabase/ssr`
