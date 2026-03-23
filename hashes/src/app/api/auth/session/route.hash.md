---
State_ID: BigInt(0x0fc98cc)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Route.Auth.Session

### [Signatures]
```ts
export async function GET(request: NextRequest): Promise<NextResponse>
```

### [Governance]
- **State_Hydration_Law:** Provides a secure read-only endpoint for the Client `AuthContext` to interrogate the current HTTP-only cookie session state without exposing the Supabase Anon Key unnecessarily on the client for initial loads.
- **Silent_Failure_Law:** Returns `{ session: null, user: null }` with a `200 OK` status when no valid session exists, avoiding console error spam during anonymous browsing.

### [Semantic Hash]
Secure HTTP-only session verification endpoint. Allows the frontend to accurately detect authenticated states via SSR cookies.

### [Linkage]
- **Dependencies:** `next/server`, `@supabase/ssr`
