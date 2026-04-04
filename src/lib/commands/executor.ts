/** @Command.Executor */

import { Effect } from "effect"
import type { UnknownAction } from "@reduxjs/toolkit"
import type { CommandResult } from "../effect/schemas/CommandSchema"
import { Redux } from "../effect/services/Redux"
import { ChatApi } from "../effect/services/ChatApi"
import { MemoryApi } from "../effect/services/MemoryApi"
import { CommandError } from "../effect/errors"

/** @Const.Command.Executor.SettingMemoryMap */
const SETTING_MEMORY_MAP: Record<string, { keyPrefix: string; category: "preference" | "fact" | "itinerary" | "contact" }> = {
  tripDate: { keyPrefix: "trip_date",         category: "itinerary"  },
  budget:   { keyPrefix: "budget_preference",  category: "preference" },
  region:   { keyPrefix: "region_preference",  category: "preference" },
}

/** @Logic.Command.Execute.Apply */
export const applyResult = (
  result: CommandResult,
  chatId: string | null
): Effect.Effect<void, CommandError, Redux | ChatApi | MemoryApi> =>
  Effect.gen(function* () {
    switch (result.type) {
      case "setting": {
        yield* Redux.dispatch({
          type: "chat/updateChatSettings",
          payload: { key: result.key, value: result.value },
        })
        if (chatId) {
          const state = yield* Redux.getState()
          const chatApi = yield* ChatApi
          yield* Effect.catchAll(
            chatApi.updateSettings({
              chatId,
              settings: state.chat.chatSettings as Record<string, unknown>,
            }),
            () => Effect.void
          )
        }
        if (result.key === "language" && (result.value === "es" || result.value === "en")) {
          const chatApi = yield* ChatApi
          yield* Effect.catchAll(
            chatApi.updateUserLanguage({ language: result.value as "es" | "en" }),
            () => Effect.void
          )
        }
        const memoryTarget = SETTING_MEMORY_MAP[result.key]
        if (memoryTarget && typeof result.value === "string" && result.value) {
          const memApi = yield* MemoryApi
          yield* Effect.catchAll(
            memApi.save({ key: memoryTarget.keyPrefix, value: result.value, category: memoryTarget.category }),
            () => Effect.void
          )
        }
        break
      }
      case "system_inject": {
        yield* Redux.dispatch({
          type: "chat/addMessage",
          payload: { role: "system", content: result.content },
        })
        break
      }
      case "navigate": {
        if (typeof window !== "undefined") {
          window.location.href = result.path
        }
        break
      }
      case "dispatch": {
        yield* Redux.dispatch(result.action as UnknownAction)
        break
      }
      case "memory": {
        const memApi = yield* MemoryApi
        yield* Effect.catchAll(
          memApi.save({ key: result.key, value: result.value, category: result.category }),
          () => Effect.void
        )
        break
      }
      case "memory_delete": {
        const memApi = yield* MemoryApi
        yield* Effect.catchAll(
          memApi.forget(result.key),
          () => Effect.void
        )
        break
      }
    }
  })
