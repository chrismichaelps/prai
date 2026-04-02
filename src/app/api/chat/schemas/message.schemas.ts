/** @Type.Api.Chat.MessageSchema */
import { S } from "../../_lib/validation"

export const ChatMessageRoleSchema = S.Literal("user", "assistant")
export type ChatMessageRole = S.Schema.Type<typeof ChatMessageRoleSchema>

/** @Schema.Api.Chat.CreateMessage */
export const CreateMessageSchema = S.Struct({
  chatId: S.String.pipe(
    S.filter((s: string) => s.trim().length > 0, { message: () => "chatId is required" })
  ),
  role: ChatMessageRoleSchema,
  /** @Schema.Api.Chat.Content */
  content: S.String,
  metadata: S.Union(S.Null, S.Undefined, S.Unknown),
}).pipe(
  S.filter(
    (msg) => msg.role === "assistant" || msg.content.trim().length > 0,
    { message: () => "content is required for user messages" }
  )
)

export type CreateMessage = S.Schema.Type<typeof CreateMessageSchema>

