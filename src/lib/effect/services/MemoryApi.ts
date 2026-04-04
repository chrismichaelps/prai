/** @Service.Effect.MemoryApi */

import { Effect, Context, Layer } from "effect"
import { AppConstants } from "@/lib/constants/app-constants"
import type { MemoryCategory } from "@/lib/effect/schemas/memory/SessionMemorySchema"

/** @Type.Effect.MemoryApi.Error */
export class MemoryApiError extends Error {
  readonly _tag = "MemoryApiError"
  readonly status: number | undefined
  constructor(message: string, status?: number) {
    super(message)
    this.status = status
  }
}

/** @Type.Effect.MemoryApi.SavePayload */
export interface SaveMemoryPayload {
  key: string
  value: string
  category: MemoryCategory
}

/** @Interface.Effect.MemoryApi */
export interface MemoryApi {
  readonly save: (payload: SaveMemoryPayload) => Effect.Effect<void, MemoryApiError>
  readonly forget: (key: string) => Effect.Effect<void, MemoryApiError>
}

/** @Tag.Effect.MemoryApi */
export const MemoryApi = Context.GenericTag<MemoryApi>("MemoryApi")

/** @Layer.Effect.MemoryApi */
export const MemoryApiLayer = Layer.effect(
  MemoryApi,
  Effect.gen(function* () {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || AppConstants.DEV_URL

    return {
      /** @Logic.Effect.MemoryApi.Save */
      save: (payload: SaveMemoryPayload) =>
        Effect.gen(function* () {
          const response = yield* Effect.promise(() =>
            fetch(`${baseUrl}/api/memory`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            })
          )

          if (!response.ok) {
            const err = yield* Effect.promise(() =>
              response.json().catch(() => ({ error: "Error al guardar memoria" })) as Promise<{ error: string }>
            )
            return yield* Effect.fail(
              new MemoryApiError(err.error || "Error al guardar memoria", response.status)
            )
          }
        }),

      /** @Logic.Effect.MemoryApi.Forget */
      forget: (key: string) =>
        Effect.gen(function* () {
          const response = yield* Effect.promise(() =>
            fetch(`${baseUrl}/api/memory`, {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ key }),
            })
          )

          if (!response.ok) {
            const err = yield* Effect.promise(() =>
              response.json().catch(() => ({ error: "Error al eliminar memoria" })) as Promise<{ error: string }>
            )
            return yield* Effect.fail(
              new MemoryApiError(err.error || "Error al eliminar memoria", response.status)
            )
          }
        }),
    }
  })
)
