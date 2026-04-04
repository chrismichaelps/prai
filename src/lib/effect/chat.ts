import { Effect } from "effect"
import { ConfigService } from "./services/Config"
import { Redux } from "./services/Redux"
import { ChatApi } from "./services/ChatApi"
import { ChatRole } from "@/types/chat"
import {
  addMessage,
  updateLastMessage,
  setLoading,
  setError,
  setSuggestions,
  clearHistory as clearChatHistory,
  updateChat
} from "@/store/slices/chatSlice"
import { setApiError, clearApiError } from "@/store/slices/uiSlice"
import type { Personalization } from "./schemas/PersonalizationSchema"
import { I18n } from "./services/I18n"
import { LimitConstants } from "@/lib/constants/app-constants"
import { toSource, deduplicateSources } from "@/lib/url"
import type { SearchResult } from "@/types/chat"
import { HttpStatus } from "@/app/api/_lib/constants/status-codes"
import { buildSettingsPrompt } from "@/lib/commands/settingsPrompt"
import { shouldShowSuggestion, shouldFilterSuggestion } from "./services/Suggestion"

/** @Logic.Chat.GenerateTitle */
const generateChatTitle = (
  currentMessage: string,
  _conversationHistory: string[]
): Effect.Effect<string, never, ConfigService> =>
  Effect.gen(function* () {
    const firstWords = currentMessage.split(/\s+/).slice(0, 4).join(' ')
    const title = firstWords.replace(/[^\w\sáéíóúñüÁÉÍÓÚÑÜ]/g, '').trim()
    return title.slice(0, LimitConstants.CHAT_TITLE_MAX_LENGTH) || "New Chat"
  }).pipe(
    Effect.catchAll(() => Effect.succeed("New Chat"))
  )

/** @Logic.Effect.Chat.Init */
export const initChat = Effect.gen(function* () {
  const config = yield* ConfigService
  yield* Redux.dispatch(clearChatHistory())
  yield* Redux.dispatch(addMessage({ role: ChatRole.SYSTEM, content: config.systemPrompt }))
})

/** @Logic.Chat.GenerateResponse */
const generateResponse = (
  _sessionId?: string,
  _personalization?: Personalization
): Effect.Effect<void, never, Redux | I18n | ConfigService> => Effect.gen(function* () {
  const state = yield* Redux.getState()
  const messages = state.chat.messages

  const chatMessages: Array<{ role: string; content: string }> = messages.map(m => ({
    role: m.role,
    content: m.content
  }))

  const settingsBlock = buildSettingsPrompt(state.chat.chatSettings)
  if (settingsBlock) {
    chatMessages.splice(1, 0, { role: "system", content: settingsBlock })
  }

  const apiUrl = `${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/chat`

  yield* Redux.dispatch(addMessage({ role: ChatRole.ASSISTANT, content: "" }))

  try {
    const response = yield* Effect.promise(() =>
      fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: chatMessages,
          stream: true
        })
      })
    )

    if (!response.ok) {
      let errorMsg = "Failed to get response"
      try {
        const errorText = yield* Effect.promise(() => response.text())
        try {
          const errorJson = JSON.parse(errorText)
          errorMsg = errorJson.error || `Error ${response.status}`
        } catch {
          errorMsg = errorText.slice(0, 100) || `Error ${response.status}`
        }
      } catch {
        errorMsg = `Error ${response.status}`
      }
      yield* Redux.dispatch(setApiError({ code: response.status || HttpStatus.INTERNAL_SERVER_ERROR, message: errorMsg }))
      return
    }

    if (!response.body) {
      yield* Redux.dispatch(setApiError({ code: HttpStatus.INTERNAL_SERVER_ERROR, message: "No response stream" }))
      return
    }

    const decoder = new TextDecoder()
    const reader = response.body.getReader()
    let buffer = ""
    let tagBuffer = ""
    let inNextActions = false

    /** @Logic.Chat.FlushTagBuffer */
    const flushTagBuffer = (buf: string): string[] => {
      if (!buf.trim()) return []
      try {
        const actions = JSON.parse(buf)
        if (Array.isArray(actions)) return actions as string[]
      } catch { /* */ }
      return []
    }

    try {
      while (true) {
        const { done, value } = yield* Effect.promise(() => reader.read())

        if (done) {
          if (inNextActions && tagBuffer) {
            const actions = flushTagBuffer(tagBuffer)
            if (actions && actions.length > 0) {
              const snapState = yield* Redux.getState()
              if (shouldShowSuggestion(snapState.chat.messages)) {
                const filtered = (actions as string[])
                  .map((s: string) => shouldFilterSuggestion(s))
                  .filter(r => r.suggestion !== null)
                  .map(r => ({ label: r.suggestion!, action: r.suggestion! }))
                if (filtered.length > 0) {
                  yield* Redux.dispatch(setSuggestions(filtered))
                }
              }
            }
          }
          break
        }

        buffer += decoder.decode(value, { stream: true })

        const lines = buffer.split("\n")
        buffer = lines.pop() || ""

        for (const line of lines) {
          if (!line.startsWith("data:")) continue

          const data = line.slice(5).trim()
          if (data === "[DONE]" || data === "") continue

          try {
            const parsed = JSON.parse(data)
            const content = parsed.choices?.[0]?.delta?.content || ""
            const reasoning = parsed.choices?.[0]?.delta?.reasoning || ""
            const error = parsed.choices?.[0]?.error

            if (error) {
              yield* Redux.dispatch(setApiError({ code: HttpStatus.INTERNAL_SERVER_ERROR, message: error }))
              continue
            }

            if (content && content.startsWith("[Error:")) {
              const errorMatch = content.match(/\[Error:\s*(.+?)\]/)
              if (errorMatch) {
                yield* Redux.dispatch(setApiError({ code: HttpStatus.INTERNAL_SERVER_ERROR, message: errorMatch[1] }))
                continue
              }
            }

            if (reasoning) {
              yield* Redux.dispatch(updateLastMessage({ metadata: { thought: reasoning, isThinking: true } }))
            }

            /** @Logic.Chat.Annotations.Sources */
            const annotations = parsed.choices?.[0]?.delta?.annotations as Array<{
              type: string
              url?: string
              title?: string
            }> | undefined
            if (annotations?.length) {
              const incoming: SearchResult[] = annotations
                .filter(a => a.type === "url_citation" && a.url)
                .map(a => toSource(a.url!, true, a.title ?? undefined))
              if (incoming.length > 0) {
                const currentState = yield* Redux.getState()
                const msgs = currentState.chat.messages
                const lastMsg = msgs[msgs.length - 1]
                const existing: SearchResult[] = (lastMsg?.metadata?.sources as SearchResult[]) ?? []
                const merged = deduplicateSources([...existing, ...incoming])
                yield* Redux.dispatch(updateLastMessage({ metadata: { sources: merged } }))
              }
            }

            if (content) {
              /** @Logic.Chat.NextActions.TagBuffer */
              let displayContent = ""
              let remaining = content

              while (remaining.length > 0) {
                if (inNextActions) {
                  const closeIdx = remaining.indexOf("</next_actions>")
                  if (closeIdx !== -1) {
                    tagBuffer += remaining.slice(0, closeIdx)
                    remaining = remaining.slice(closeIdx + "</next_actions>".length)
                    inNextActions = false
                    try {
                      const actions = JSON.parse(tagBuffer)
                      if (Array.isArray(actions)) {
                        const snapState = yield* Redux.getState()
                        if (shouldShowSuggestion(snapState.chat.messages)) {
                          const filtered = actions
                            .map((s: string) => shouldFilterSuggestion(s))
                            .filter(r => r.suggestion !== null)
                            .map(r => ({ label: r.suggestion!, action: r.suggestion! }))
                          if (filtered.length > 0) {
                            yield* Redux.dispatch(setSuggestions(filtered))
                          }
                        }
                      }
                    } catch { /*  */ }
                    tagBuffer = ""
                  } else {
                    tagBuffer += remaining
                    remaining = ""
                  }
                } else {
                  const openIdx = remaining.indexOf("<next_actions>")
                  if (openIdx !== -1) {
                    displayContent += remaining.slice(0, openIdx)
                    remaining = remaining.slice(openIdx + "<next_actions>".length)
                    inNextActions = true
                  } else {
                    displayContent += remaining
                    remaining = ""
                  }
                }
              }

              if (displayContent) {
                const currentState = yield* Redux.getState()
                const msgs = currentState.chat.messages
                const lastMsg = msgs[msgs.length - 1]
                if (lastMsg) {
                  yield* Redux.dispatch(updateLastMessage({ content: lastMsg.content + displayContent }))
                }
              }
            }
          } catch { /*  */ }
        }
      }
    } finally {
      reader.releaseLock()
    }

  } catch {
    yield* Redux.dispatch(setApiError({ code: HttpStatus.INTERNAL_SERVER_ERROR, message: "Connection error" }))
  }
})

/** @Logic.Chat.Send */
export const sendChatMessage = (
  content: string,
  _personalization?: Personalization
): Effect.Effect<void, never, Redux | ConfigService | ChatApi | I18n> =>
  Effect.gen(function* () {
    if (!content.trim()) return

    yield* Redux.dispatch(addMessage({ role: ChatRole.USER, content }))
    yield* Redux.dispatch(setLoading(true))
    yield* Redux.dispatch(setError(null))
    yield* Redux.dispatch(clearApiError())
    yield* Redux.dispatch(setSuggestions([]))

    const state = yield* Redux.getState()
    const currentChatId = state.chat.currentChatId

    if (currentChatId) {
      const chatApi = yield* ChatApi
      yield* Effect.asVoid(
        Effect.catchAll(
          chatApi.addMessage({
            chatId: currentChatId,
            role: ChatRole.USER,
            content,
            metadata: null
          }),
          () => Effect.sync(() => { })
        )
      )

      const chatState = yield* Redux.getState()
      const chat = chatState.chat.chats.find(c => c.id === currentChatId)
      const defaultTitles = ['New Chat', 'Nueva Conversación', 'Nuevo Chat', 'New Conversation']
      const needsTitle = !chat?.title || defaultTitles.includes(chat.title)

      if (needsTitle) {
        const userMessages = state.chat.messages
          .filter(m => m.role === ChatRole.USER)
          .map(m => m.content)
        const title = yield* generateChatTitle(content, userMessages.slice(0, -1))
        yield* Redux.dispatch(updateChat({ id: currentChatId, updates: { title } }))
        yield* Effect.asVoid(
          Effect.catchAll(
            chatApi.updateChat({ chatId: currentChatId, title }),
            () => Effect.sync(() => { })
          )
        )
      }
    }

    yield* generateResponse(currentChatId ?? undefined, _personalization)

    if (currentChatId) {
      const state = yield* Redux.getState()
      const lastMessage = state.chat.messages[state.chat.messages.length - 1]
      if (lastMessage && lastMessage.role === ChatRole.ASSISTANT) {
        const chatApi = yield* ChatApi
        const filteredMetadata = lastMessage.metadata
          ? Object.fromEntries(
            Object.entries(lastMessage.metadata).filter(([, v]) => v !== undefined)
          )
          : null
        yield* Effect.asVoid(
          Effect.catchAll(
            chatApi.addMessage({
              chatId: currentChatId,
              role: ChatRole.ASSISTANT,
              content: lastMessage.content,
              metadata: filteredMetadata
            }),
            () => Effect.sync(() => { })
          )
        )

        const userMessages = state.chat.messages
          .filter(m => m.role === ChatRole.USER)
          .map(m => m.content)
        const title = yield* generateChatTitle(lastMessage.content, userMessages)
        yield* Redux.dispatch(updateChat({ id: currentChatId, updates: { title } }))
        yield* Effect.asVoid(
          Effect.catchAll(
            chatApi.updateChat({ chatId: currentChatId, title }),
            () => Effect.sync(() => { })
          )
        )
      }
    }
  }).pipe(
    Effect.ensuring(Redux.dispatch(setLoading(false))),
    Effect.catchAll(() =>
      Effect.gen(function* () {
        yield* Redux.dispatch(setApiError({ code: HttpStatus.INTERNAL_SERVER_ERROR, message: "Connection error" }))
      })
    )
  )

/** @Logic.Chat.Regenerate */
export const regenerateResponse = (
  _personalization?: Personalization
): Effect.Effect<void, never, Redux | ConfigService | I18n> =>
  Effect.gen(function* () {
    yield* Redux.dispatch(setLoading(true))
    yield* Redux.dispatch(setError(null))
    yield* Redux.dispatch(clearApiError())
    yield* Redux.dispatch(setSuggestions([]))

    const state = yield* Redux.getState()
    const currentChatId = state.chat.currentChatId
    yield* generateResponse(currentChatId ?? undefined, _personalization)
  }).pipe(
    Effect.ensuring(Redux.dispatch(setLoading(false))),
    Effect.catchAll(() =>
      Effect.gen(function* () {
        yield* Redux.dispatch(setApiError({ code: HttpStatus.INTERNAL_SERVER_ERROR, message: "Connection error" }))
      })
    )
  )
