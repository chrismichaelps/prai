---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Lib.Api.Errors

### [Signatures]
```ts
export class ValidationError extends Data.TaggedError<{ message: string; details?: unknown }>
export class NotFoundError extends Data.TaggedError<{ resource: string; id: string }>
export class UnauthorizedError extends Data.TaggedError<{ message: string }>
export class SupabaseError extends Data.TaggedError<{ original: unknown; status: number }>
export class UniqueConstraintError extends Data.TaggedError<{ field: string }>
export class ForeignKeyError extends Data.TaggedError<{ field: string }>
export class InternalError extends Data.TaggedError<{ message: string }>
export const mapSupabaseError: (error: unknown) => SupabaseError | UniqueConstraintError | ForeignKeyError | InternalError
```

### [Governance]
- **Tagged_Error:** All errors use `Data.TaggedError` from Effect for exhaustive error handling.
- **Tagged_Tag:** Error tag matches class name for discriminator-based mapping.
- **Supabase_Codes:** Maps PostgreSQL error codes (23505, 23503) to domain-specific errors.

### [Implementation Notes]
- **ValidationError:** Used for invalid request body/params/query. Includes optional `details` field for schema errors.
- **NotFoundError:** Resource + ID pattern for 404 responses.
- **SupabaseError:** Wraps raw Supabase errors with optional status code.
- **mapSupabaseError:** Converts Supabase PostgrestError codes to typed errors.

### [Semantic Hash]
Defines all API error types using Effect's `Data.TaggedError` pattern. Provides a discriminated union of errors that map to appropriate HTTP responses.

### [Linkage]
- **Upstream:** `@supabase/supabase-js`, `@/app/api/_lib/constants/status-codes`
- **Downstream:** `@/app/api/_lib/response`
