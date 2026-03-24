---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Type.Api.Chat.MessageSchema

### [Signatures]
```ts
export const ChatMessageRoleSchema: Schema<"user" | "assistant">
export const CreateMessageSchema: Schema<{ chatId: string; role: ChatMessageRole; content: string; metadata?: unknown }>
```

### [Governance]
- **Role_Law:** Only user and assistant roles (no system for user messages).
- **Content_Law:** Content must be non-empty string.
- **Metadata_Law:** metadata accepts null, undefined, or any value.

### [Semantic Hash]
Effect-TS schemas for creating chat messages.

### [Linkage]
- **Upstream:** `@/app/api/_lib/validation`
- **Downstream:** `src/app/api/chat/messages/route.ts`
