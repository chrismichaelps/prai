---
State_ID: BigInt(0x0fc98cd)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Route.Auth.Callback

### [Signatures]
```ts
export async function GET(request: NextRequest): Promise<NextResponse>

// Admin detection — runs on every sign-in
const adminEmails = (process.env.ADMIN_EMAILS ?? '')
  .split(',').map(e => e.trim().toLowerCase()).filter(Boolean)
const isAdmin = adminEmails.includes((user.email ?? '').toLowerCase())
```

### [Governance]
- **OAuth_Exchange_Law:** Exclusively responsible for exchanging the Supabase OAuth `code` grant for a secure user session.
- **Server_Cookie_Mutation:** Instantiates `@supabase/ssr` `createServerClient` to manually intercept and apply secure HTTP-only session cookies directly to the `NextResponse`.
- **Redirect_Constraint:** Enforces redirect to `/?auth=success` upon successful exchange, or `/?error=[desc]` upon failure, closing the OAuth popup/redirect loop.
- **Usage_Init_Law:** On new user signup, initializes profile with default usage values: subscription_tier='free', messages_limit=100, reset_interval='daily', last_reset_date=now.
- **Admin_Bootstrap_Law:** On every sign-in, reads `ADMIN_EMAILS` env var (comma-separated). If the signing-in email matches, spreads `{ is_admin: true }` into the profile upsert. Self-healing — admin status is re-asserted on every login, surviving account deletion/recreation. Unmatched emails are not touched, preserving manually granted DB admin flags.

### [Semantic Hash]
The critical Server-Side OAuth callback receiver. It bridges the OpenID Connect flow from Google/Supabase back into the Next.js secure cookie store. Also bootstraps admin status from the `ADMIN_EMAILS` env var on every sign-in, keeping the DB `is_admin` flag in sync without requiring redeploys.

### [Linkage]
- **Dependencies:** `next/server`, `@supabase/ssr`
- **Downstream:** `public.profiles.is_admin` — set at login time for matching emails
- **Env:** `ADMIN_EMAILS` — comma-separated list of admin email addresses
