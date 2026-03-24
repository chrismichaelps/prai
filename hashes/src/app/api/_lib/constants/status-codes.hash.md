---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Lib.Api.Constants.HttpStatus

### [Signatures]
```ts
export const HttpStatus: {
  readonly CONTINUE: 100
  readonly OK: 200
  readonly CREATED: 201
  readonly NO_CONTENT: 204
  readonly BAD_REQUEST: 400
  readonly UNAUTHORIZED: 401
  readonly FORBIDDEN: 403
  readonly NOT_FOUND: 404
  readonly CONFLICT: 409
  readonly UNPROCESSABLE_ENTITY: 422
  readonly TOO_MANY_REQUESTS: 429
  readonly INTERNAL_SERVER_ERROR:  500
  readonly SERVICE_UNAVAILABLE: 503
}
```

### [Governance]
- **No_Magic_Numbers:** All HTTP status codes MUST use these constants, never raw numbers.
- **Naming:** Constants match standard HTTP status name patterns (e.g., `OK`, `CREATED`, `NOT_FOUND`).

### [Semantic Hash]
Centralized HTTP status code constants to prevent magic numbers in API routes and response helpers.

### [Linkage]
- **Upstream:** None
- **Downstream:** All API routes, `@/app/api/_lib/response`
