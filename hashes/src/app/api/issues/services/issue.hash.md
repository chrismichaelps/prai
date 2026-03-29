---
State_ID: BigInt(0x0fc98d2)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Issues.Service

### [Signatures]
```ts
export const issueService = {
  listIssues, createIssue, getIssueById, updateIssue, deleteIssue,
  addComment, updateComment, deleteComment, dispatchMentionNotifications,
  searchProfiles, toggleUpvote, getProfile
}
```

### [Governance]
- **Atomic_Database_Gate:** Mandates standardizing all Supabase CRUD operations within `Effect.tryPromise` to ensure consistent error mapping to `IssueDbError`.
- **Soft_Delete_Law:** Enforces a "Deleted At" timestamp pattern for comments, preserving mention metadata and system integrity while removing content from active visibility.
- **Mention_Reflex_Rule:** Orchestrates non-blocking asynchronous mention detection and notification dispatch using `Effect.runFork` during insertion events.

### [Semantic Hash]
The architectural core for Issue Tracker persistence and logic. It centralizes all domain-specific Postgres interactions, permission validations, and cross-module notification triggers, ensuring a unified and predictable state across the API layer.

### [Linkage]
- **Dependencies:** `effect`, `@/lib/supabase/server`, `@/app/api/_lib/validation/common`, `@/app/api/_lib/errors/services`
