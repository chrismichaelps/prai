---
State_ID: BigInt(0x0fc98cc)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Route.Auth.Callback

### [Signatures]
```ts
export async function GET(request: NextRequest): Promise<NextResponse>
```

### [Governance]
- **OAuth_Exchange_Law:** Exclusively responsible for exchanging the Supabase OAuth `code` grant for a secure user session.
- **Server_Cookie_Mutation:** Instantiates `@supabase/ssr` `createServerClient` to manually intercept and apply secure HTTP-only session cookies directly to the `NextResponse`.
- **Redirect_Constraint:** Enforces redirect to `/?auth=success` upon successful exchange, or `/?error=[desc]` upon failure, closing the OAuth popup/redirect loop.
- **Usage_Init_Law:** On new user signup, initializes profile with default usage values: subscription_tier='free', messages_limit=100, reset_interval='daily', last_reset_date=now.

### [Semantic Hash]
The critical Server-Side OAuth callback receiver. It bridges the OpenID Connect flow from Google/Supabase back into the Next.js secure cookie store.

### [Linkage]
- **Dependencies:** `next/server`, `@supabase/ssr`
