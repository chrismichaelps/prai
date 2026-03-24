---
State_ID: BigInt(0x2)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/next.hash.md"
---

## @Middleware.Main

### [Signatures]
```ts
export async function middleware(request: NextRequest): Promise<NextResponse>
```

### [Governance]
- **Cookie_Law:** Sets `NEXT_LOCALE` cookie to `es` if missing.
- **Session_Law:** Updates Supabase session via `updateSession()`.
- **Matcher_Law:** Excludes static assets (`_next/static`, images, favicon).

### [Semantic Hash]
Main Next.js middleware that initializes locale cookie and refreshes Supabase auth session on each request.

### [Linkage]
- **Upstream:** `NextRequest`
- **Downstream:** `src/lib/supabase/proxy`
