---
State_ID: BigInt(0x0fc98de)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Users.Service

### [Signatures]
```ts
export const userService = { deleteAccount }
const deleteUserData = async (userId: string): Promise<void>
```

### [Governance]
- **Cascade_Delete_Law:** Orchestrates the surgical removal of all user-associated data (chats, issues, upvotes, notifications) using the Service Role key to override RLS for complete cleanup.
- **Auth_Admin_Bridge:** Directly communicates with `supabase.auth.admin` to purge the identity record after all application-level data has been erased.

### [Semantic Hash]
The administrative engine for user data management. It handles complex, multi-table deletions with elevated privileges to ensure full data erasure upon account closure.

### [Linkage]
- **Dependencies:** `effect`, `@supabase/supabase-js`, `@/app/api/_lib/validation/common`, `@/app/api/_lib/errors/services`
