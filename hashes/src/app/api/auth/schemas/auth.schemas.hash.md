---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Type.Api.Auth.Schema

### [Signatures]
```ts
export const AuthCallbackSchema: Schema<{ code?: string; error?: string; error_description?: string; error_code?: string; state?: string }>
```

### [Governance]
- **Optional_Law:** All fields are optional for OAuth callback flexibility.
- **Validation_Law:** Validates OAuth callback parameters from Supabase.

### [Semantic Hash]
Effect-TS schema for OAuth authentication callback query parameters.

### [Linkage]
- **Upstream:** `@/app/api/_lib/validation`
- **Downstream:** `src/app/api/auth/callback/route.ts`
