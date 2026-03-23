---
State_ID: BigInt(0x0fc98cc)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Constants.PostgRErrorCodes

### [Signatures]
```ts
export const PostgRErrorCodes = {
  UNIQUE_VIOLATION: '23505',
  FOREIGN_KEY_VIOLATION: '23503',
  CHECK_VIOLATION: '23514',
  NOT_NULL_VIOLATION: '23502',
} as const;

export type PostgRErrorCode = typeof PostgRErrorCodes[keyof typeof PostgRErrorCodes];
```

### [Governance]
- **Immutability_Law:** Exported strictly `as const` to provide absolute compile-time safety when mapping raw Postgres error strings to Effect `TaggedError` variants.
- **Agnostic_Isolation:** This file exists independently of the Supabase client to ensure database error definitions can be used purely within Effect layers without importing third-party SDKs.

### [Semantic Hash]
A pure, static dictionary mapping standard PostgreSQL integrity constraint violation codes. Crucial for the `DatabaseError` parsing boundary.

### [Linkage]
- **Dependencies:** N/A (Pure Constants)
