---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Type.Api.Chat.Schema

### [Signatures]
```ts
export const CreateChatSchema: Schema<{ userId: string; title?: string }>
export const UpdateChatSchema: Schema<{ chatId: string; title?: string; is_archived?: boolean }>
export const ArchiveAllChatsSchema: Schema<{ userId: string }>
```

### [Governance]
- **Id_Law:** userId and chatId must be non-empty strings.
- **Optional_Law:** title and is_archived are optional for flexibility.
- **Filter_Law:** IDs validated with trim().length > 0.

### [Semantic Hash]
Effect-TS schemas for chat CRUD operations (create, update, archive).

### [Linkage]
- **Upstream:** `@/app/api/_lib/validation`
- **Downstream:** `src/app/api/chat/chats/route.ts`
