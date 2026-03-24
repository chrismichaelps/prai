---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Lib.Api.Validation.Common

### [Signatures]
```ts
export const MessageRoleSchema: Schema<"system" | "user" | "assistant">
export const MessageSchema: Schema<{ role: MessageRole; content: string; name?: string }>
export const UuidSchema: Schema<string>  // RFC 4122 UUID validation
export const NonEmptyStringSchema: Schema<string>
export const PositiveIntSchema: Schema<number>
export const PaginationSchema: Schema<{ page?: PositiveInt; limit?: number }>
```

### [Governance]
- **Schema_Law:** Reusable schemas for common API validation patterns.
- **Uuid_Law:** UUIDs validated via RFC 4122 regex pattern.
- **NonEmpty_Law:** Strings must have non-whitespace characters.

### [Semantic Hash]
Common Effect-TS schemas for API validation: message roles, UUIDs, non-empty strings, positive integers, and pagination parameters.

### [Linkage]
- **Upstream:** `effect/Schema`
- **Downstream:** `src/app/api/_lib/validation/index.ts`
