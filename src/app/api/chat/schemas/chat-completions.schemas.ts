/** @Type.Api.Chat.CompletionsSchema */
import { S } from "../../_lib/validation"

export const MessageSchema = S.Struct({
  role: S.Union(S.Literal("system"), S.Literal("user"), S.Literal("assistant")),
  content: S.String,
  name: S.optional(S.String)
})

export const ChatCompletionsSchema = S.Struct({
  messages: S.Array(MessageSchema),
  model: S.optional(S.String),
  stream: S.optional(S.Boolean)
})

export type ChatCompletions = S.Schema.Type<typeof ChatCompletionsSchema>
