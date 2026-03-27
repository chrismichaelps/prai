import { Effect, Stream, Option } from "effect"
import { HttpClient, HttpClientRequest, HttpClientResponse } from "@effect/platform"
import { ConfigService } from "./Config"
import { PromptBuilderService } from "./PromptBuilder"
import { OpenRouterError } from "../errors"
import { OpenRouterErrorCodes } from "../schemas/OpenRouterSchema"
import type { ChatMessage } from "@/types/chat"
import type { PuertoRicoSearchOptions, DiscoveryCategory } from "../types/search"
import { Timeframes } from "../types/search"
import { createSearchContext, createSearchMessage, getDiscoveryQuery } from "./search"

export interface ChatResponse {
  readonly content: string
  readonly annotations: readonly {
    readonly type: string
    readonly url_citation?: {
      readonly url: string
      readonly title: string
      readonly content?: string
      readonly start_index: number
      readonly end_index: number
    }
  }[]
}

export class OpenRouter extends Effect.Service<OpenRouter>()("OpenRouter", {
  effect: Effect.gen(function* () {
    const baseClient = yield* HttpClient.HttpClient
    const config = yield* ConfigService
    const promptBuilder = yield* PromptBuilderService

    const buildSystemPrompt = (searchOptions?: PuertoRicoSearchOptions): string => {
      const basePrompt = promptBuilder.compose()
      return searchOptions
        ? basePrompt + createSearchContext(searchOptions)
        : basePrompt
    }

    const chat = (
      messages: readonly ChatMessage[],
      searchOptions?: PuertoRicoSearchOptions
    ): Stream.Stream<ChatResponse, OpenRouterError> => {
      const systemPrompt = buildSystemPrompt(searchOptions)
      const enhancedMessages: ChatMessage[] = [
        { role: "system", content: systemPrompt },
        ...messages
      ]

      const requestBody = {
        model: config.models.default,
        messages: enhancedMessages,
        stream: config.chatRequestConfig.stream,
        temperature: config.chatRequestConfig.temperature,
        max_tokens: config.chatRequestConfig.maxTokens,
        plugins: [{
          id: "web",
          enabled: true,
          max_results: 3,
          include_domains: [
            "discoverpuertorico.com",
            "seepuertorico.com",
            "elnuevodia.com",
            "primerahora.com",
            "lonelyplanet.com/puerto-rico",
            "booking.com/puerto-rico",
            "youtube.com",
            "instagram.com",
            "facebook.com"
          ]
        }],
        provider: {
          allow_fallbacks: true,
          data_collection: "deny"
        }
      }

      const responseEffect = HttpClientRequest.post(`${config.openRouterBaseUrl}/chat/completions`).pipe(
        HttpClientRequest.setHeader("Authorization", `Bearer ${config.apiKey}`),
        HttpClientRequest.setHeader("HTTP-Referer", config.siteUrl),
        HttpClientRequest.setHeader("X-Title", "PR AI Tourism Assistant"),
        HttpClientRequest.setHeader("Content-Type", "application/json"),
        HttpClientRequest.bodyJson(requestBody),
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
        Stream.splitLines,
        Stream.filter((line) => line.startsWith("data: ") && line !== "data: [DONE]"),
        Stream.map((line) => line.slice(6)),
        /** @Logic.Chat.ProcessStreamChunk.Simple */
        Stream.filterMap((jsonStr): Option.Option<ChatResponse> => {
          try {
            const parsed = JSON.parse(jsonStr)
            const content = parsed.choices?.[0]?.delta?.content || ""
            // OpenRouter may return annotations on either delta or message depending on the chunk type
            const annotations =
              parsed.choices?.[0]?.delta?.annotations ||
              parsed.choices?.[0]?.message?.annotations ||
              []

            if (content || annotations.length > 0) {
              return Option.some({ content, annotations } as ChatResponse)
            }
            return Option.none()
          } catch {
            return Option.none()
          }
        }),
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
      )
    }

    const searchPuertoRico = (
      query: string,
      options?: Partial<PuertoRicoSearchOptions>
    ): Stream.Stream<ChatResponse, OpenRouterError> => {
      const searchOptions: PuertoRicoSearchOptions = {
        query,
        ...options
      }
      const searchMessage = createSearchMessage(query)
      return chat([searchMessage], searchOptions)
    }

    const discoverLive = (
      category: DiscoveryCategory,
      location?: string
    ): Stream.Stream<ChatResponse, OpenRouterError> => {
      const categoryQuery = getDiscoveryQuery(category)
      return searchPuertoRico(categoryQuery, {
        location,
        timeframe: Timeframes.Live
      })
    }

    return { chat, searchPuertoRico, discoverLive } as const
  }),
  accessors: true
}) { }