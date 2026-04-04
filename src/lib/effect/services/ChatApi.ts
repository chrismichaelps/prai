import { Effect, Context, Layer, Data } from "effect"
import type { Chat, Message } from "./Chat"
import { AppConstants } from "@/lib/constants/app-constants"

/** @Type.Effect.ApiError */
export class ApiError extends Data.TaggedError("ApiError")<{ message: string; status?: number }> { }

export interface AddMessagePayload {
  chatId: string
  role: "user" | "assistant"
  content: string
  metadata: Record<string, unknown> | null
}

export interface UpdateChatPayload {
  chatId: string
  title?: string
  is_archived?: boolean
}

export interface UpdateSettingsPayload {
  chatId: string
  settings: Record<string, unknown>
}

export interface UpdateUserLanguagePayload {
  language: "es" | "en"
}

/** @Service.Effect.ChatApi */
export const ChatApi = Context.GenericTag<ChatApi>("ChatApi")

/** @Interface.Effect.ChatApi */
export interface ChatApi {
  readonly addMessage: (payload: AddMessagePayload) => Effect.Effect<Message, ApiError>
  readonly getMessages: (chatId: string) => Effect.Effect<Message[], ApiError>
  readonly updateChat: (payload: UpdateChatPayload) => Effect.Effect<Chat, ApiError>
  readonly getChat: (chatId: string) => Effect.Effect<Chat, ApiError>
  readonly updateSettings: (payload: UpdateSettingsPayload) => Effect.Effect<void, ApiError>
  readonly updateUserLanguage: (payload: UpdateUserLanguagePayload) => Effect.Effect<void, ApiError>
}

/** @Layer.Effect.ChatApi */
export const ChatApiLayer = Layer.effect(
  ChatApi,
  Effect.gen(function* () {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || AppConstants.DEV_URL

    return {
      /** @Logic.Effect.ChatApi.AddMessage */
      addMessage: (payload: AddMessagePayload) =>
        Effect.gen(function* () {
          const response = yield* Effect.promise(() =>
            fetch(`${baseUrl}/api/chat/messages`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            })
          )

          if (!response.ok) {
            const error = yield* Effect.promise(() => response.json() as Promise<{ error: string }>)
            return yield* Effect.fail(new ApiError({
              message: error.error || 'Failed to add message',
              status: response.status
            }))
          }

          return yield* Effect.promise(() => response.json() as Promise<Message>)
        }),

      /** @Logic.Effect.ChatApi.GetMessages */
      getMessages: (chatId: string) =>
        Effect.gen(function* () {
          const response = yield* Effect.promise(() =>
            fetch(`${baseUrl}/api/chat/messages?chatId=${encodeURIComponent(chatId)}`, {
              method: 'GET'
            })
          )

          if (!response.ok) {
            const error = yield* Effect.promise(() => response.json() as Promise<{ error: string }>)
            return yield* Effect.fail(new ApiError({
              message: error.error || 'Failed to get messages',
              status: response.status
            }))
          }

          return yield* Effect.promise(() => response.json() as Promise<Message[]>)
        }),

      updateChat: (payload: UpdateChatPayload) =>
        Effect.gen(function* () {
          const response = yield* Effect.promise(() =>
            fetch(`${baseUrl}/api/chat/chats`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            })
          )

          if (!response.ok) {
            const error = yield* Effect.promise(() => response.json() as Promise<{ error: string }>)
            return yield* Effect.fail(new ApiError({
              message: error.error || 'Failed to update chat',
              status: response.status
            }))
          }

          return yield* Effect.promise(() => response.json() as Promise<Chat>)
        }),

      getChat: (chatId: string) =>
        Effect.gen(function* () {
          const response = yield* Effect.promise(() =>
            fetch(`${baseUrl}/api/chat/chats?id=${encodeURIComponent(chatId)}`, {
              method: 'GET'
            })
          )

          if (!response.ok) {
            const error = yield* Effect.promise(() => response.json() as Promise<{ error: string }>)
            return yield* Effect.fail(new ApiError({
              message: error.error || 'Failed to get chat',
              status: response.status
            }))
          }

          return yield* Effect.promise(() => response.json() as Promise<Chat>)
        }),

      /** @Logic.Effect.ChatApi.UpdateSettings */
      updateSettings: (payload: UpdateSettingsPayload) =>
        Effect.gen(function* () {
          const response = yield* Effect.promise(() =>
            fetch(`${baseUrl}/api/chat/chats/${encodeURIComponent(payload.chatId)}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ settings: payload.settings })
            })
          )

          if (!response.ok) {
            const error = yield* Effect.promise(() => response.json() as Promise<{ error: string }>)
            return yield* Effect.fail(new ApiError({
              message: error.error || 'Failed to update settings',
              status: response.status
            }))
          }
        }),

      /** @Logic.Effect.ChatApi.UpdateUserLanguage */
      updateUserLanguage: (payload: UpdateUserLanguagePayload) =>
        Effect.gen(function* () {
          const response = yield* Effect.promise(() =>
            fetch(`${baseUrl}/api/user/language`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ language: payload.language })
            })
          )

          if (!response.ok) {
            const error = yield* Effect.promise(() => response.json() as Promise<{ error: string }>)
            return yield* Effect.fail(new ApiError({
              message: error.error || 'Failed to update user language',
              status: response.status
            }))
          }
        }),
    }
  })
)
