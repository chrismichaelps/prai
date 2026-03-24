---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Lib.Api.Chat.Service

### [Signatures]
```ts
export class ChatDbError extends Data.TaggedError<{ error: unknown }>
export type ChatServiceError = ChatDbError

export const chatService: {
  getChats: (userId: string) => Effect<Chat[], ChatDbError>
  getArchivedChats: (userId: string) => Effect<Chat[], ChatDbError>
  createChat: (userId: string, title?: string) => Effect<Chat, ChatDbError>
  updateChat: (chatId: string, updates: { title?: string; is_archived?: boolean }) => Effect<Chat, ChatDbError>
  deleteChat: (chatId: string) => Effect<void, ChatDbError>
  deleteAllChats: (userId: string) => Effect<void, ChatDbError>
  archiveAllChats: (userId: string) => Effect<void, ChatDbError>
  getMessages: (chatId: string) => Effect<Message[], ChatDbError>
  addMessage: (chatId: string, message: { role: "user" | "assistant"; content: string; metadata?: unknown }) => Effect<Message, ChatDbError>
  getChatsCount: (userId: string) => Effect<number, ChatDbError>
}
```

### [Governance]
- **Effect_Law:** All database operations return Effect with typed error channel.
- **Error_Tagged:** Uses `ChatDbError` for all database failures.
- **RLS_Compliance:** All queries respect Row Level Security via `user_id` matching.

### [Implementation Notes]
- **getChats:** Returns only non-archived chats, ordered by `updated_at` DESC.
- **getArchivedChats:** Returns only archived chats for archive management UI.
- **createChat:** Sets default title to "Nueva Conversación" if not provided.
- **deleteAllChats:** Cascades to messages via FK constraint (`ON DELETE CASCADE`).
- **addMessage:** Type-safe message insertion with metadata support.
- **getChatsCount:** Uses `select("*", { count: "exact", head: true })` for efficient count.

### [Semantic Hash]
Server-side database service for chat and message CRUD operations using Supabase. Provides typed Effect operations for all chat-related data access.

### [Linkage]
- **Upstream:** `@/lib/supabase/server`
- **Downstream:** Chat API routes
