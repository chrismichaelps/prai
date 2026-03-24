---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Lib.Api.Validation

### [Signatures]
```ts
export const decodeBody: <A>(schema: Schema<A>) => (request: Request) => Effect<A, ValidationError>
export const decodeParams: <A>(schema: Schema<A>) => (params: Record<string, string>) => Effect<A, ValidationError>
export const decodeSearchParams: <A>(schema: Schema<A>) => (searchParams: URLSearchParams) => Effect<A, ValidationError>
export const formatSchemaErrors: (error: unknown) => string
```

### [Governance]
- **Schema_Law:** All API inputs MUST be validated via Effect-TS Schema before processing.
- **Error_Channel:** Validation failures return `ValidationError` with `message` and optional `details`.
- **Decode_Law:** Uses `S.decodeUnknown` (not `decode`) to accept untyped input from request.
- **Curried_Design:** Functions are curried: `decodeBody(schema)(request)` for composability.

### [Implementation Notes]
- **decodeBody:** Parses `request.json()`, then validates against schema. Wraps JSON parse errors as `ValidationError`.
- **decodeParams:** Validates path parameters directly against schema without parsing.
- **decodeSearchParams:** Converts `URLSearchParams` to plain object before schema validation.
- **formatSchemaErrors:** Extracts human-readable error message from Schema errors.

### [Semantic Hash]
Provides schema-based validation for all API route inputs (body, path params, query params) using Effect-TS. Ensures type-safe, validated inputs before business logic execution.

### [Linkage]
- **Upstream:** Effect-TS Schema, `@/app/api/_lib/errors`
- **Downstream:** All API route handlers (`src/app/api/**/route.ts`)
