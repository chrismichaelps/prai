---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Route.User.Personalization

### [Signatures]
```ts
export async function GET(request: NextRequest): NextResponse
export async function POST(request: NextRequest): NextResponse
```

### [Governance]
- **Auth_Law:** Requires authentication via Supabase session.
- **Validation_Law:** POST validates body against PersonalizationBodySchema with Effect Schema.

### [Semantic Hash]
API endpoints for user personalization. GET fetches preferences, POST saves them.

### [Linkage]
- **Upstream:** `@root/src/app/api/user/personalization/services/personalization.ts`
- **Downstream:** `@root/src/hooks/usePersonalization.ts`