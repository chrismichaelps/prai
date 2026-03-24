---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Lib.Api.Auth.Schemas

### [Signatures]
```ts
export const AuthCallbackSchema: Schema<{
  code?: string
  error?: string
  error_description?: string
  error_code?: string
  state?: string
}>
export type AuthCallback = Schema.Type<typeof AuthCallbackSchema>
```

### [Governance]
- **Optional_Fields:** All fields are optional as OAuth callbacks may return partial data.
- **Validation_Law:** Schema validation happens in auth callback route.

### [Semantic Hash]
Defines schema for OAuth callback parameters from Supabase auth flow.

### [Linkage]
- **Upstream:** `@/app/api/_lib/validation`
- **Downstream:** Auth callback route
