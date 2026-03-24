---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/effect.hash.md"
---

## @Lib.Effect.Services.Chat

### [Signatures]
```ts
export class ChatError extends Data.TaggedError<{ message: string }>
export class ChatNotFoundError extends Data.TaggedError<{ chatId: string }>
export interface Chat { id: string; user_id: string; title: string | null; is_archived: boolean | null; created_at: string | null; updated_at: string | null }
export interface Message { id: string; chat_id: string; role: "user" | "assistant"; content: string; metadata: Record<string, unknown> | null; created_at: string | null }

export const ChatService: Context.GenericTag<ChatService>
export interface ChatService {
  createChat: (userId: string, title?: string) => Effect<Chat, ChatError>
  getChats: (userId: string) => Effect<Chat[], ChatError>
  getChat: (chatId: string) => Effect<Chat, ChatNotFoundError | ChatError>
  updateChat: (chatId: string, updates: Partial<Pick<Chat, "title" | "is_archived">>) => Effect<Chat, ChatNotFoundError | ChatError>
  archiveChat: (chatId: string) => Effect<void, ChatNotFoundError | ChatError>
  deleteChat: (chatId: string) => Effect<void, ChatNotFoundError | ChatError>
  addMessage: (chatId: string, message: Omit<Message, "id" | "chat_id" | "created_at">) => Effect<Message, ChatError>
  getMessages: (chatId: string) => Effect<Message[], ChatError>
  deleteMessage: (messageId: string) => Effect<void, ChatError>
}

export const ChatLayer: Layer<ChatService>
```

### [Governance]
- **Tagged_Error:** Uses `ChatError` and `ChatNotFoundError` for typed error handling.
- **Effect_Tag:** Service registered via `Context.GenericTag` for dependency injection.
- **Layer_Pattern:** Layer provides implementation using `SupabaseAdminService`.

### [Implementation Notes]
- **Types:** Mirror database schema types from `@/types/database.types`.
- **Context_Injection:** Uses `yield* SupabaseAdminService` for database access.
- **NotFound_Semantic:** Separate error type for "not found" vs "database error".

### [Semantic Hash]
Client-side Effect-TS service for chat CRUD operations. Provides typed interface for chat and message management integrated with the Effect dependency system.

### [Linkage]
- **Upstream:** `SupabaseAdminService`
- **Downstream:** `ChatProvider`, `@/lib/effect/chat`
