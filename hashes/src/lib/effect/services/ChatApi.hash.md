---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/effect.hash.md"
---

## @Lib.Effect.Services.ChatApi

### [Signatures]
```ts
export class ApiError extends Data.TaggedError<{ message: string; status?: number }>
export interface AddMessagePayload { chatId: string; role: "user" | "assistant"; content: string; metadata: Record<string, unknown> | null }
export interface UpdateChatPayload { chatId: string; title?: string; is_archived?: boolean }

export const ChatApi: Context.GenericTag<ChatApi>
export interface UpdateSettingsPayload { chatId: string; settings: Record<string, unknown> }
export interface UpdateUserLanguagePayload { language: "es" | "en" }

export interface ChatApi {
  addMessage: (payload: AddMessagePayload) => Effect<Message, ApiError>
  getMessages: (chatId: string) => Effect<Message[], ApiError>
  updateChat: (payload: UpdateChatPayload) => Effect<Chat, ApiError>
  getChat: (chatId: string) => Effect<Chat, ApiError>
  updateSettings: (payload: UpdateSettingsPayload) => Effect<void, ApiError>
  updateUserLanguage: (payload: UpdateUserLanguagePayload) => Effect<void, ApiError>
}

export const ChatApiLayer: Layer<ChatApi>
```

### [Governance]
- **Effect_Tag:** Uses `Context.GenericTag` for dependency injection.
- **Layer_Pattern:** Layer implementation fetches from Next.js API routes.

### [Implementation Notes]
- **Base_URL:** Uses `NEXT_PUBLIC_SITE_URL` or fallback to `localhost:3000`.
- **Error_Handling:** Maps HTTP errors to `ApiError` with status code.
- **Type_Safety:** Response JSON is cast to typed responses.

### [Semantic Hash]
Client-side Effect-TS service that calls Next.js API routes for chat operations. Acts as bridge between Effect services and REST API.

### [Linkage]
- **Upstream:** Types from `./Chat`
- **Downstream:** Components that need chat data via Effect, `@/lib/commands/executor` (updateSettings, updateUserLanguage)

### [Change Notes — command integration]
- `updateSettings(payload)` → PATCH `/api/chat/chats/:id` with `settings` field
- `updateUserLanguage(payload)` → PATCH `/api/user/language` — persists language preference to `profiles` table
