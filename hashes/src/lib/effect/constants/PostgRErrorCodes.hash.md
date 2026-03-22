---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Lib.Effect.Constants.PostgRErrorCodes

### [Signatures]
```ts
export const PostgRErrorCodes: {
  readonly SINGLETON_NOT_FOUND: "PGRST116"
  readonly PARSING_ERROR: "PGRST100"
  // ... all PostgREST error codes
}

export type PostgRErrorCode = (typeof PostgRErrorCodes)[keyof typeof PostgRErrorCodes]
```

### [Governance]
- **Constant_Law:** All PostgREST error codes defined as constants.
- **TypeSafe_Law:** Provides type for error code matching.

### [Implementation Notes]
- **Source:** Derived from [PostgREST Error Codes](https://postgrest.org/en/stable/api.html#error-codes).
- **Usage:** Use instead of magic strings for error handling (e.g., `error?.code === PostgRErrorCodes.SINGLETON_NOT_FOUND`).

### [Semantic Hash]
Centralized PostgREST API error code constants for type-safe error handling.

### [Linkage]
- **Used by:** `@root/src/contexts/AuthContext.tsx`
