import { Effect, Stream } from "effect"
import { HttpClient, HttpClientRequest, HttpClientResponse } from "@effect/platform"
import { ConfigService } from "./Config"
import { OpenRouterError } from "../errors"
import { OpenRouterErrorBodySchema, type OpenRouterErrorBody } from "../schemas/OpenRouterSchema"
import { Schema } from "effect"
import type { ChatMessage } from "@/types/chat"

/** @Service.Effect.OpenRouter */
export class OpenRouter extends Effect.Service<OpenRouter>()("OpenRouter", {
  effect: Effect.gen(function* () {
    const baseClient = yield* HttpClient.HttpClient
    const config = yield* ConfigService

    const chat = (messages: readonly ChatMessage[]): Stream.Stream<string, OpenRouterError, never> => {
      const responseEffect = HttpClientRequest.post(`${config.openRouterBaseUrl}/chat/completions`).pipe(
        HttpClientRequest.setHeader("Authorization", `Bearer ${config.apiKey}`),
        /** @Service.OpenRouter.Metadata */
        HttpClientRequest.setHeader("HTTP-Referer", config.siteUrl),

        HttpClientRequest.setHeader("X-Title", "PR AI Assistant"),
        HttpClientRequest.bodyJson({ 
          model: config.modelName,
          messages,
          stream: true
        }),
        Effect.andThen((request: HttpClientRequest.HttpClientRequest) => baseClient.execute(request)),
        Effect.flatMap((res) => {
          if (res.status === 429) {
            return res.json.pipe(
              Effect.flatMap(json => Schema.decodeUnknown(OpenRouterErrorBodySchema)(json)),
              Effect.flatMap((errorBody: OpenRouterErrorBody) => Effect.fail(new OpenRouterError({
                message: errorBody.error.message,
                code: errorBody.error.code,
                rateLimit: errorBody.error.metadata ? {
                  limit: errorBody.error.metadata.headers["X-RateLimit-Limit"],
                  remaining: errorBody.error.metadata.headers["X-RateLimit-Remaining"],
                  reset: errorBody.error.metadata.headers["X-RateLimit-Reset"]
                } : undefined
              })))
            )
          }
          return HttpClientResponse.filterStatusOk(res)
        }),
        Effect.map((res: HttpClientResponse.HttpClientResponse) => res.stream)
      )

      return Stream.unwrapScoped(responseEffect).pipe(
        Stream.decodeText(),
        Stream.catchAll((error: unknown) =>
          Stream.fail(
            new OpenRouterError({
              message: "Falló la conexión con el servicio de chat.",
              cause: error
            })
          )
        )
      ) as Stream.Stream<string, OpenRouterError, never>
    }

    return { chat } as const
  }),
  accessors: true
}) {}
