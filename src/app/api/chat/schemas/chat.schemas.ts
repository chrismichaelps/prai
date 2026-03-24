/** @Type.Api.Chat.Schema */
import { S } from "../../_lib/validation"

export const UserIdSchema = S.String.pipe(
  S.filter((s: string) => s.trim().length > 0, { message: () => "userId is required" })
)

export const ChatIdSchema = S.String.pipe(
  S.filter((s: string) => s.trim().length > 0, { message: () => "chatId is required" })
)

export const ChatTitleSchema = S.optional(S.String)

export const IsArchivedSchema = S.Boolean

export const CreateChatSchema = S.Struct({
  userId: UserIdSchema,
  title: ChatTitleSchema
})

export const UpdateChatSchema = S.Struct({
  chatId: ChatIdSchema,
  title: ChatTitleSchema,
  is_archived: S.optional(IsArchivedSchema)
})

export const ArchiveAllChatsSchema = S.Struct({
  userId: UserIdSchema
})

export type CreateChat = S.Schema.Type<typeof CreateChatSchema>
export type UpdateChat = S.Schema.Type<typeof UpdateChatSchema>
export type ArchiveAllChats = S.Schema.Type<typeof ArchiveAllChatsSchema>
