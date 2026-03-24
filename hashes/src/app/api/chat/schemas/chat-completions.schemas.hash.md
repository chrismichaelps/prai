---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Type.Api.Chat.CompletionsSchema

### [Signatures]
```ts
export const MessageSchema: Schema<{ role: "system" | "user" | "assistant"; content: string; name?: string }>
export const ChatCompletionsSchema: Schema<{ messages: Message[]; model?: string; stream?: boolean }>
```

### [Governance]
- **Schema_Law:** Message roles limited to system/user/assistant.
- **Array_Law:** Messages must be a non-empty array.

### [Semantic Hash]
Effect-TS schemas for chat completions API request body validation.

### [Linkage]
- **Upstream:** `@/app/api/_lib/validation`
- **Downstream:** `src/app/api/chat/route.ts`
