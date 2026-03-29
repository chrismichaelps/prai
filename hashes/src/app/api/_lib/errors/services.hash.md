---
State_ID: BigInt(0x0fc98ec)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Api.ServiceErrors

### [Signatures]
```ts
export class IssueDbError extends Data.TaggedError("IssueDbError")
export class NotificationDbError extends Data.TaggedError("NotificationDbError")
export class UsersDbError extends Data.TaggedError("UsersDbError")
export class ChatDbError extends Data.TaggedError("ChatDbError")
export class AccountDbError extends Data.TaggedError("AccountDbError")
```

### [Governance]
- **Tagged_Error_Schema:** Mandates the use of `Effect.Data.TaggedError` for all backend service failures to enable exhaustive pattern matching and type-safe error propagation.

### [Semantic Hash]
The definition layer for service-level failure modes. It provides a unified set of tagged objects used as the error channel for all database-driven effect programs across the API.

### [Linkage]
- **Dependencies:** `effect`
