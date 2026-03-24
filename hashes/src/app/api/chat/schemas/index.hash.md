---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Lib.Api.Chat.Schemas

### [Signatures]
```ts
export const ChatMessageRoleSchema: Schema<"user" | "assistant">
export const MessageContentSchema: Schema<string>
export const MessageMetadataSchema: Schema<unknown>  // nullable
export const CreateMessageSchema: Schema<{ chatId: string; role: "user" | "assistant"; content: string; metadata?: unknown }>

export const UserIdSchema: Schema<string>
export const ChatIdSchema: Schema<string>
export const ChatTitleSchema: Schema<string>
export const CreateChatSchema: Schema<{ userId: string; title?: string }>
export const UpdateChatSchema: Schema<{ chatId: string; title?: string; is_archived?: boolean }>

export const ChatCompletionsSchema: Schema<{ messages: Array<{ role: string; content: string }>; model?: string; stream?: boolean }>
```

### [Governance]
- **Schema_Law:** All API inputs MUST be validated against these schemas before processing.
- **Validation_Law:** Uses Effect-TS `S.filter` for string validation (non-empty).
- **Optional_Law:** Optional fields use `S.optional()` or explicit union with `undefined`.

### [Implementation Notes]
- **ChatMessageRoleSchema:** Restricts roles to `"user"` | `"assistant"`.
- **MessageMetadataSchema:** Accepts `null | undefined | unknown` via `S.Union`.
- **Filter:** String schemas use `S.filter` with custom error messages for non-empty validation.

### [Semantic Hash]
Defines Effect-TS schemas for all chat-related API validation: messages, chats, and completions.

### [Linkage]
- **Upstream:** `@/app/api/_lib/validation`
- **Downstream:** Chat API routes (`src/app/api/chat/**/route.ts`)
