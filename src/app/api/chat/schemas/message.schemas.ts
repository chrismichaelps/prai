/** @Type.Api.Chat.MessageSchema */
import { S } from "../../_lib/validation"

export const ChatMessageRoleSchema = S.Literal("user", "assistant")
export type ChatMessageRole = S.Schema.Type<typeof ChatMessageRoleSchema>

export const MessageContentSchema = S.String.pipe(
  S.filter((s: string) => s.trim().length > 0, { message: () => "content is required" })
)

export const CreateMessageSchema = S.Struct({
  chatId: S.String.pipe(
    S.filter((s: string) => s.trim().length > 0, { message: () => "chatId is required" })
  ),
  role: ChatMessageRoleSchema,
  content: MessageContentSchema,
  metadata: S.Union(S.Null, S.Undefined, S.Unknown)
})

export type CreateMessage = S.Schema.Type<typeof CreateMessageSchema>
