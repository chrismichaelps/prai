---
State_ID: BigInt(0x1)
Git_SHA: INIT
Grammar_Lock: "@root/hashes/grammar/next.hash.md"
---

## @Logic.Middleware.I18n

### [Signatures]
```ts
export function middleware(request: NextRequest): NextResponse
export const config: { matcher: string[] }
```

### [Governance]
- **Edge_Runtime_Law:** Next.js middleware runs on Edge runtime — no Node.js APIs allowed.
- **Cookie_Law:** Sets NEXT_LOCALE cookie across all routes (except api, _next/static, _next/image, favicon).
- **Perf_Law:** No heavy computation — pure cookie check → NextResponse.next().

### [Semantic Hash]
Ensures NEXT_LOCALE cookie is set (defaults to "es") on all first-time page visits. Enables server-side locale awareness in middleware edge.

### [Linkage]
- **Upstream:** None
- **Downstream:** `@root/src/lib/effect/I18nProvider.tsx` (reads NEXT_LOCALE cookie), `@root/src/lib/effect/i18n/index.ts`
