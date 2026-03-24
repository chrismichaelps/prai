---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Lib.Api.Response

### [Signatures]
```ts
export const toNextResponse: <A>(effect: Effect<A, ApiError>, successStatus?: number) => Promise<NextResponse>
export const exitResponse: <A, E, R>(onSuccess: (value: A) => R) => (effect: Effect<A, E>) => Promise<R>
```

### [Governance]
- **Exit_Law:** Uses `Effect.runPromiseExit` to handle both success and failure cases.
- **Discriminated_Union:** Uses `_tag === "Success"` / `_tag === "Failure"` for Exit type narrowing.
- **Cause_Handling:** Processes Cause types: `Fail` (expected errors), `Die` (runtime panics), `Interrupt` (cancellations).
- **Error_Map:** Maps error constructor names to HTTP status codes and human-readable messages.

### [Implementation Notes]
- **exitResponse:** Curried helper for API routes: `exitResponse(NextResponse.json)(program)`.
- **No_Content:** Returns `NextResponse.json(null, { status: 204 })` for 204 responses.
- **Error_Details:** Includes `details` field in response when error has additional context.
- **Type_Escape:** Uses `as unknown as` for generic error handling across different error types.

### [Error Status Mapping]
| Error Type | HTTP Status |
|------------|-------------|
| ValidationError | 400 |
| NotFoundError | 404 |
| UnauthorizedError | 401 |
| UniqueConstraintError | 409 |
| ForeignKeyError | 400 |
| SupabaseError | 500 |
| InternalError | 500 |

### [Semantic Hash]
Centralized response helper for all API routes. Converts Effect programs to NextResponse with proper HTTP status codes, error messages, and JSON serialization.

### [Linkage]
- **Upstream:** `@/app/api/_lib/errors`, `@/app/api/_lib/constants/status-codes`
- **Downstream:** All API route handlers
