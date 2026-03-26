import { Effect, pipe } from "effect"
import { createClient } from "@/lib/supabase/server"
import type { Database } from "@/types/database.types"
import { ChatDbError } from "@/app/api/_lib/errors/services"

type Chat = Database["public"]["Tables"]["chats"]["Row"]
type Message = Database["public"]["Tables"]["messages"]["Row"]
type MessageInsert = Database["public"]["Tables"]["messages"]["Insert"]

export { ChatDbError }
export type ChatServiceError = ChatDbError

/** @Service.Api.Chat */
export const chatService = {
  /** @Logic.Api.Chat.GetChats */
  getChats: (userId: string): Effect.Effect<Chat[], ChatDbError> => {
    return pipe(
      Effect.tryPromise({
        try: async () => {
          const supabase = await createClient()
          const { data, error } = await supabase
            .from("chats")
            .select("*")
            .eq("user_id", userId)
            .eq("is_archived", false)
            .order("updated_at", { ascending: false })
          
          if (error) throw new ChatDbError({ error })
          return data
        },
        catch: (error) => new ChatDbError({ error })
      })
    )
  },

  /** @Logic.Api.Chat.GetArchivedChats */
  getArchivedChats: (userId: string): Effect.Effect<Chat[], ChatDbError> => {
    return pipe(
      Effect.tryPromise({
        try: async () => {
          const supabase = await createClient()
          const { data, error } = await supabase
            .from("chats")
            .select("*")
            .eq("user_id", userId)
            .eq("is_archived", true)
            .order("updated_at", { ascending: false })
          
          if (error) throw new ChatDbError({ error })
          return data
        },
        catch: (error) => new ChatDbError({ error })
      })
    )
  },

  /** @Logic.Api.Chat.CreateChat */
  createChat: (userId: string, title?: string): Effect.Effect<Chat, ChatDbError> => {
    return pipe(
      Effect.tryPromise({
        try: async () => {
          const supabase = await createClient()
          const { data, error } = await supabase
            .from("chats")
            .insert({ user_id: userId, title: title || "Nueva Conversación" })
            .select()
            .single()
          
          if (error) throw new ChatDbError({ error })
          return data
        },
        catch: (error) => new ChatDbError({ error })
      })
    )
  },

  /** @Logic.Api.Chat.UpdateChat */
  updateChat: (
    chatId: string, 
    updates: { title?: string; is_archived?: boolean }
  ): Effect.Effect<Chat, ChatDbError> => {
    return pipe(
      Effect.tryPromise({
        try: async () => {
          const supabase = await createClient()
          const { data, error } = await supabase
            .from("chats")
            .update(updates)
            .eq("id", chatId)
            .select()
            .single()
          
          if (error) throw new ChatDbError({ error })
          return data
        },
        catch: (error) => new ChatDbError({ error })
      })
    )
  },
  
  /** @Logic.Api.Chat.DeleteChat */
  deleteChat: (chatId: string): Effect.Effect<void, ChatDbError> => {
    return pipe(
      Effect.tryPromise({
        try: async () => {
          const supabase = await createClient()
          const { error } = await supabase
            .from("chats")
            .delete()
            .eq("id", chatId)
          
          if (error) throw new ChatDbError({ error })
        },
        catch: (error) => new ChatDbError({ error })
      })
    )
  },

  deleteAllChats: (userId: string): Effect.Effect<void, ChatDbError> => {
    return pipe(
      Effect.tryPromise({
        try: async () => {
          const supabase = await createClient()
          console.log('[ChatService] Deleting all chats for userId:', userId)
          const { error } = await supabase
            .from("chats")
            .delete()
            .eq("user_id", userId)
          
          if (error) {
            console.error('[ChatService] Delete error:', error)
            throw new ChatDbError({ error })
          }
          console.log('[ChatService] All chats deleted successfully')
        },
        catch: (error) => new ChatDbError({ error })
      })
    )
  },

  /** @Logic.Api.Chat.ArchiveAllChats */
  archiveAllChats: (userId: string): Effect.Effect<void, ChatDbError> => {
    return pipe(
      Effect.tryPromise({
        try: async () => {
          const supabase = await createClient()
          const { error } = await supabase
            .from("chats")
            .update({ is_archived: true })
            .eq("user_id", userId)
            .eq("is_archived", false)
          
          if (error) throw new ChatDbError({ error })
        },
        catch: (error) => new ChatDbError({ error })
      })
    )
  },

  getMessages: (chatId: string): Effect.Effect<Message[], ChatDbError> => {
    return pipe(
      Effect.tryPromise({
        try: async () => {
          const supabase = await createClient()
          const { data, error } = await supabase
            .from("messages")
            .select("*")
            .eq("chat_id", chatId)
            .order("created_at", { ascending: true })
          
          if (error) throw new ChatDbError({ error })
          return data
        },
        catch: (error) => new ChatDbError({ error })
      })
    )
  },

  /** @Logic.Api.Chat.AddMessage */
  addMessage: (
    chatId: string,
    message: { role: "user" | "assistant"; content: string; metadata?: unknown }
  ): Effect.Effect<Message, ChatDbError> => {
    return pipe(
      Effect.tryPromise({
        try: async () => {
          const supabase = await createClient()
          const insertData: MessageInsert = {
            chat_id: chatId,
            role: message.role,
            content: message.content,
            metadata: message.metadata as MessageInsert["metadata"]
          }
          
          const { data, error } = await supabase
            .from("messages")
            .insert(insertData)
            .select()
            .single()
          
          if (error) throw new ChatDbError({ error })
          return data
        },
        catch: (error) => new ChatDbError({ error })
      })
    )
  },

  getChatsCount: (userId: string): Effect.Effect<number, ChatDbError> => {
    return pipe(
      Effect.tryPromise({
        try: async () => {
          const supabase = await createClient()
          const { count, error } = await supabase
            .from("chats")
            .select("*", { count: "exact", head: true })
            .eq("user_id", userId)
            .eq("is_archived", false)
          
          if (error) throw new ChatDbError({ error })
          return count || 0
        },
        catch: (error) => new ChatDbError({ error })
      })
    )
  }
}
