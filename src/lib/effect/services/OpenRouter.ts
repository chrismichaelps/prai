/** @Service.OpenRouter */

import { Effect, Stream, Option, Context, Layer } from "effect"
import { HttpClient, HttpClientRequest, HttpClientResponse } from "@effect/platform"
import { ConfigService } from "./Config"
import { PromptBuilderService } from "./PromptBuilder"
import { I18n } from "./I18n"
import { OpenRouterError } from "../errors"
import { OpenRouterErrorCodes } from "../schemas/OpenRouterSchema"
import type { ChatMessage } from "@/types/chat"
import type { PuertoRicoSearchOptions, DiscoveryCategory } from "../types/search"
import { Timeframes } from "../types/search"
import { createSearchContext, createSearchMessage, getDiscoveryQuery } from "./search"
import type { Personalization } from "../schemas/PersonalizationSchema"
import { SSEConstants } from "@/lib/constants/app-constants"
import { HttpStatus } from "@/app/api/_lib/constants/status-codes"
import { type ChatResponse } from "../schemas/OpenRouterSchema"

export const OpenRouter = Context.GenericTag<OpenRouter>("OpenRouter")

export interface OpenRouter {
  readonly chat: (
    messages: ChatMessage[],
    searchOptions?: PuertoRicoSearchOptions,
    sessionId?: string,
    personalization?: Personalization
  ) => Stream.Stream<ChatResponse, OpenRouterError, I18n>
  readonly searchPuertoRico: (
    query: string,
    options?: Partial<PuertoRicoSearchOptions>
  ) => Stream.Stream<ChatResponse, OpenRouterError, I18n>
  readonly discoverLive: (
    category: DiscoveryCategory,
    location?: string
  ) => Stream.Stream<ChatResponse, OpenRouterError, I18n>
}

/** @Layer.Effect.OpenRouter */
export const OpenRouterLayer = Layer.effect(
  OpenRouter,
  Effect.gen(function* () {
    const baseClient = yield* HttpClient.HttpClient
    const config = yield* ConfigService
    const promptBuilder = yield* PromptBuilderService

    /** @Logic.OpenRouter.BuildSystemPrompt */
    const buildSystemPrompt = (t: (key: string, params?: Record<string, string>) => string, searchOptions?: PuertoRicoSearchOptions, personalization?: Personalization): string => {
      const basePrompt = promptBuilder.compose(t, undefined, personalization)
      return searchOptions
        ? basePrompt + createSearchContext(searchOptions)
        : basePrompt
    }

    /** @Logic.OpenRouter.Chat */
    const chat = (
      messages: ChatMessage[],
      searchOptions?: PuertoRicoSearchOptions,
      sessionId?: string,
      personalization?: Personalization
    ): Stream.Stream<ChatResponse, OpenRouterError, I18n> => {
      const responseEffect = Effect.gen(function* () {
        const t = (key: string, _params?: Record<string, string>) => key
        const systemPrompt = buildSystemPrompt(t, searchOptions, personalization)

        const chatMessages = messages.filter(m => m.role !== "system")
        const enhancedMessages: ChatMessage[] = [
          { role: "system", content: systemPrompt },
          ...chatMessages
        ]

        const requestBody = {
          messages: enhancedMessages,
          stream: config.chatRequestConfig.stream,
          model: config.models.default
        }

        const request = yield* HttpClientRequest.post(`${config.siteUrl || ''}/api/chat`).pipe(
          HttpClientRequest.setHeader("Content-Type", "application/json"),
          HttpClientRequest.bodyJson(requestBody)
        )

        const res = yield* baseClient.execute(request)

        if (!res.status || res.status >= HttpStatus.BAD_REQUEST) {
          const statusCode = res.status || HttpStatus.INTERNAL_SERVER_ERROR
          return yield* Effect.fail(new OpenRouterError({
            message: OpenRouterErrorCodes[statusCode as keyof typeof OpenRouterErrorCodes] || `Error ${statusCode}`,
            code: statusCode
          }))
        }

        return yield* HttpClientResponse.filterStatusOk(res)
      })

      return Stream.unwrapScoped(responseEffect.pipe(Effect.map(res => res.stream))).pipe(
        Stream.decodeText(),
        Stream.splitLines,
        Stream.filter((line) => line.startsWith(SSEConstants.DATA_PREFIX) && line !== SSEConstants.DATA_DONE),
        Stream.map((line) => line.slice(6)),
        Stream.filterMap((jsonStr): Option.Option<ChatResponse> => {
          try {
            const parsed = JSON.parse(jsonStr as string)
            const content = parsed.choices?.[0]?.delta?.content || ""
            const reasoning = parsed.choices?.[0]?.delta?.reasoning || ""
            const annotations =
              parsed.choices?.[0]?.delta?.annotations ||
              parsed.choices?.[0]?.message?.annotations ||
              []
            const toolCalls = parsed.choices?.[0]?.delta?.tool_calls || parsed.choices?.[0]?.message?.tool_calls || []

            if (content || reasoning || annotations.length > 0 || toolCalls.length > 0) {
              return Option.some({
                content,
                reasoning: reasoning || undefined,
                annotations,
                toolCalls: toolCalls.length > 0 ? toolCalls.map((tc: { id: string; function: { name: string; arguments: string } }) => ({
                  id: tc.id,
                  name: tc.function.name,
                  arguments: tc.function.arguments
                })) : undefined
              } as ChatResponse)
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
    ): Stream.Stream<ChatResponse, OpenRouterError, I18n> => {
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
    ): Stream.Stream<ChatResponse, OpenRouterError, I18n> => {
      const categoryQuery = getDiscoveryQuery(category)
      return searchPuertoRico(categoryQuery, {
        location,
        timeframe: Timeframes.Live
      })
    }

    return { chat, searchPuertoRico, discoverLive }
  })
)