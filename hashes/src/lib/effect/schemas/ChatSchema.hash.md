---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Schema.Effect.Chat

### [Signatures]
```ts
export const SearchResultSchema: Schema.Struct<{ title, url, snippet?, source?, icon?, verified? }>
export type SearchResult = Schema.Schema.Type<typeof SearchResultSchema>

export const MessageStepSchema: Schema.Struct<{ type: "analyzed"|"plan"|"search", label }>
export type MessageStep = Schema.Schema.Type<typeof MessageStepSchema>

export const ToolCallRecordSchema: Schema.Struct<{ id, name, arguments, result? }>
export type ToolCallRecord = Schema.Schema.Type<typeof ToolCallRecordSchema>

export const ChatMessageMetadataSchema: Schema.Struct<{
  thought?, thoughtTime?, isThinking?, thoughtDuration?,
  steps?, sources?, searchQuery?, edited?, tool_calls?, isTruncated?
}>
export type ChatMessageMetadata = Schema.Schema.Type<typeof ChatMessageMetadataSchema>

export const ChatMessageSchema: Schema.Struct<{ role: "user"|"assistant"|"system", content, metadata? }>
export type ChatMessage = Schema.Schema.Type<typeof ChatMessageSchema>
```

### [Governance]
- **Schema_Law:** All schemas use Effect `Schema` for runtime validation.
- **Metadata_Law:** `ChatMessageMetadata` is optional per-message — enables per-message thought process, sources, and tool call tracking.
- **Step_Law:** `MessageStep.type` restricted to `"analyzed" | "plan" | "search"` — matches preflight pipeline stages.

### [Semantic Hash]
Core schemas for chat message types: search results, message steps (thought process), tool call records, message metadata, and the chat message itself.

### [Change Notes — isTruncated added]
- Added `isTruncated` optional boolean to `ChatMessageMetadataSchema`

### [Linkage]
- **Dependencies:** `effect` (Schema)
- **Downstream:** Chat components, Redux chat slice
