import { Effect, Stream } from "effect"
import { HttpClient, HttpClientRequest, HttpClientResponse } from "@effect/platform"
import { ConfigService } from "./Config"
import { OpenRouterError } from "../errors"
import { OpenRouterErrorCodes } from "../schemas/OpenRouterSchema"
import type { ChatMessage } from "@/types/chat"

/** @Service.Effect.OpenRouter */
export class OpenRouter extends Effect.Service<OpenRouter>()("OpenRouter", {
  effect: Effect.gen(function* () {
    const baseClient = yield* HttpClient.HttpClient
    const config = yield* ConfigService

    const chat = (messages: readonly ChatMessage[]): Stream.Stream<string, OpenRouterError, never> => {
      const responseEffect = HttpClientRequest.post(`${config.openRouterBaseUrl}/chat/completions`).pipe(
        HttpClientRequest.setHeader("Authorization", `Bearer ${config.apiKey}`),
        HttpClientRequest.setHeader("HTTP-Referer", config.siteUrl),
        HttpClientRequest.setHeader("X-Title", "PR AI Assistant"),
        HttpClientRequest.bodyJson({ 
          model: config.modelName,
          messages,
          stream: true
        }),
        Effect.andThen((request: HttpClientRequest.HttpClientRequest) => baseClient.execute(request)),
        Effect.flatMap((res) => {
          if (!res.status || res.status >= 400) {
            const statusCode = res.status || 500
            return Effect.fail(new OpenRouterError({
              message: OpenRouterErrorCodes[statusCode as keyof typeof OpenRouterErrorCodes] || `Error ${statusCode}`,
              code: statusCode
            }))
          }
          return Effect.succeed(res)
        }),
        Effect.flatMap((res) => HttpClientResponse.filterStatusOk(res)),
        Effect.map((res: HttpClientResponse.HttpClientResponse) => res.stream)
      )

      return Stream.unwrapScoped(responseEffect).pipe(
        Stream.decodeText(),
        Stream.catchAll((error: unknown) => {
          if (error instanceof OpenRouterError) {
            return Stream.fail(error)
          }
          return Stream.fail(
            new OpenRouterError({
              message: error instanceof Error ? error.message : "Connection failed",
              code: 0
            })
          )
        })
      ) as Stream.Stream<string, OpenRouterError, never>
    }

    return { chat } as const
  }),
  accessors: true
}) {}
