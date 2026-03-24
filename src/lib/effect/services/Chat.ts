import { Effect, Context, Layer, Data } from "effect"
import { SupabaseAdminService } from "./Supabase"

/** @Type.Effect.ChatError */
export class ChatError extends Data.TaggedError("ChatError")<{ message: string }> {}

/** @Type.Effect.ChatNotFoundError */
export class ChatNotFoundError extends Data.TaggedError("ChatNotFoundError")<{ chatId: string }> {}

/** @Type.Effect.Chat */
export interface Chat {
  readonly id: string
  readonly user_id: string
  readonly title: string | null
  readonly is_archived: boolean | null
  readonly created_at: string | null
  readonly updated_at: string | null
}

/** @Type.Effect.Message */
export interface Message {
  readonly id: string
  readonly chat_id: string
  readonly role: "user" | "assistant"
  readonly content: string
  readonly metadata: Record<string, unknown> | null
  readonly created_at: string | null
}

/** @Service.Effect.Chat */
export const ChatService = Context.GenericTag<ChatService>("Chat")

/** @Interface.Effect.ChatService */
export interface ChatService {
  readonly createChat: (userId: string, title?: string) => Effect.Effect<Chat, ChatError>
  readonly getChats: (userId: string) => Effect.Effect<Chat[], ChatError>
  readonly getChat: (chatId: string) => Effect.Effect<Chat, ChatNotFoundError | ChatError>
  readonly updateChat: (chatId: string, updates: Partial<Pick<Chat, "title" | "is_archived">>) => Effect.Effect<Chat, ChatNotFoundError | ChatError>
  readonly archiveChat: (chatId: string) => Effect.Effect<void, ChatNotFoundError | ChatError>
  readonly deleteChat: (chatId: string) => Effect.Effect<void, ChatNotFoundError | ChatError>
  readonly addMessage: (chatId: string, message: Omit<Message, "id" | "chat_id" | "created_at">) => Effect.Effect<Message, ChatError>
  readonly getMessages: (chatId: string) => Effect.Effect<Message[], ChatError>
  readonly deleteMessage: (messageId: string) => Effect.Effect<void, ChatError>
}

/** @Layer.Effect.Chat */
export const ChatLayer = Layer.effect(
  ChatService,
  Effect.gen(function* () {
    const supabase = yield* SupabaseAdminService

    return {
      /** @Logic.Effect.Chat.CreateChat */
      createChat: (userId: string, title?: string) =>
        Effect.gen(function* () {
          const { data, error } = yield* Effect.promise(() =>
            supabase
              .from("chats")
              .insert({ user_id: userId, title: title || "New Chat" })
              .select()
              .single()
          )

          if (error) {
            return yield* Effect.fail(new ChatError({ message: error.message }))
          }

          return data as Chat
        }),

      /** @Logic.Effect.Chat.GetChats */
      getChats: (userId: string) =>
        Effect.gen(function* () {
          const { data, error } = yield* Effect.promise(() =>
            supabase
              .from("chats")
              .select("*")
              .eq("user_id", userId)
              .eq("is_archived", false)
              .order("updated_at", { ascending: false })
          )

          if (error) {
            return yield* Effect.fail(new ChatError({ message: error.message }))
          }

          return (data || []) as Chat[]
        }),

      getChat: (chatId: string) =>
        Effect.gen(function* () {
          const { data, error } = yield* Effect.promise(() =>
            supabase
              .from("chats")
              .select("*")
              .eq("id", chatId)
              .single()
          )

          if (error) {
            if (error.code === "PGRST116") {
              return yield* Effect.fail(new ChatNotFoundError({ chatId }))
            }
            return yield* Effect.fail(new ChatError({ message: error.message }))
          }

          return data as Chat
        }),

      updateChat: (chatId: string, updates: Partial<Pick<Chat, "title" | "is_archived">>) =>
        Effect.gen(function* () {
          const { data, error } = yield* Effect.promise(() =>
            supabase
              .from("chats")
              .update(updates)
              .eq("id", chatId)
              .select()
              .single()
          )

          if (error) {
            if (error.code === "PGRST116") {
              return yield* Effect.fail(new ChatNotFoundError({ chatId }))
            }
            return yield* Effect.fail(new ChatError({ message: error.message }))
          }

          return data as Chat
        }),

      /** @Logic.Effect.Chat.ArchiveChat */
      archiveChat: (chatId: string) =>
        Effect.gen(function* () {
          const { error } = yield* Effect.promise(() =>
            supabase
              .from("chats")
              .update({ is_archived: true })
              .eq("id", chatId)
          )

          if (error) {
            if (error.code === "PGRST116") {
              return yield* Effect.fail(new ChatNotFoundError({ chatId }))
            }
            return yield* Effect.fail(new ChatError({ message: error.message }))
          }
        }),

      deleteChat: (chatId: string) =>
        Effect.gen(function* () {
          const { error } = yield* Effect.promise(() =>
            supabase
              .from("chats")
              .delete()
              .eq("id", chatId)
          )

          if (error) {
            if (error.code === "PGRST116") {
              return yield* Effect.fail(new ChatNotFoundError({ chatId }))
            }
            return yield* Effect.fail(new ChatError({ message: error.message }))
          }
        }),

      /** @Logic.Effect.Chat.AddMessage */
      addMessage: (chatId: string, message: Omit<Message, "id" | "chat_id" | "created_at">) =>
        Effect.gen(function* () {
          const { data, error } = yield* Effect.promise(() =>
            supabase
              .from("messages")
              .insert({
                chat_id: chatId,
                role: message.role,
                content: message.content,
                metadata: message.metadata || {}
              })
              .select()
              .single()
          )

          if (error) {
            return yield* Effect.fail(new ChatError({ message: error.message }))
          }

          return data as Message
        }),

      getMessages: (chatId: string) =>
        Effect.gen(function* () {
          const { data, error } = yield* Effect.promise(() =>
            supabase
              .from("messages")
              .select("*")
              .eq("chat_id", chatId)
              .order("created_at", { ascending: true })
          )

          if (error) {
            return yield* Effect.fail(new ChatError({ message: error.message }))
          }

          return (data || []) as Message[]
        }),

      deleteMessage: (messageId: string) =>
        Effect.gen(function* () {
          const { error } = yield* Effect.promise(() =>
            supabase
              .from("messages")
              .delete()
              .eq("id", messageId)
          )

          if (error) {
            return yield* Effect.fail(new ChatError({ message: error.message }))
          }
        })
    } as ChatService
  })
)
