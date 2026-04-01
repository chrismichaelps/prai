import { Schema } from "effect"

/** @Schema.Effect.Chat.SearchResult */
export const SearchResultSchema = Schema.Struct({
  title: Schema.String,
  url: Schema.String,
  snippet: Schema.optional(Schema.String),
  source: Schema.optional(Schema.String),
  icon: Schema.optional(Schema.String),
  verified: Schema.optional(Schema.Boolean),
})

/** @Type.Effect.Chat.SearchResult */
export type SearchResult = Schema.Schema.Type<typeof SearchResultSchema>

/** @Schema.Effect.Chat.MessageStep */
export const MessageStepSchema = Schema.Struct({
  type: Schema.Literal("analyzed", "plan", "search"),
  label: Schema.String,
})

/** @Type.Effect.Chat.MessageStep */
export type MessageStep = Schema.Schema.Type<typeof MessageStepSchema>

/** @Schema.Effect.Chat.ToolCallRecord */
export const ToolCallRecordSchema = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
  arguments: Schema.String,
  result: Schema.optional(Schema.String),
})

/** @Type.Effect.Chat.ToolCallRecord */
export type ToolCallRecord = Schema.Schema.Type<typeof ToolCallRecordSchema>

/** @Schema.Effect.Chat.MessageMetadata */
export const ChatMessageMetadataSchema = Schema.Struct({
  thought: Schema.optional(Schema.String),
  thoughtTime: Schema.optional(Schema.String),
  isThinking: Schema.optional(Schema.Boolean),
  thoughtDuration: Schema.optional(Schema.String),
  steps: Schema.optional(Schema.Array(MessageStepSchema)),
  sources: Schema.optional(Schema.Array(SearchResultSchema)),
  searchQuery: Schema.optional(Schema.String),
  edited: Schema.optional(Schema.Boolean),
  tool_calls: Schema.optional(Schema.Array(ToolCallRecordSchema)),
})

/** @Type.Effect.Chat.MessageMetadata */
export type ChatMessageMetadata = Schema.Schema.Type<typeof ChatMessageMetadataSchema>

const ChatRoleSchema = Schema.Literal("user", "assistant", "system")

/** @Schema.Effect.Chat.Message */
export const ChatMessageSchema = Schema.Struct({
  role: ChatRoleSchema,
  content: Schema.String,
  metadata: Schema.optional(ChatMessageMetadataSchema),
})

/** @Type.Effect.Chat.Message */
export type ChatMessage = Schema.Schema.Type<typeof ChatMessageSchema>
