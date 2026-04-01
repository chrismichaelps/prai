import { Schema } from "effect"

/** @Schema.Effect.OpenRouter.ChatMessage */
export const ChatMessageSchema = Schema.Struct({
  role: Schema.Literal("user", "assistant", "system"),
  content: Schema.String
})

export type ChatMessage = Schema.Schema.Type<typeof ChatMessageSchema>

/** @Schema.Effect.OpenRouter.RateLimit */
export const OpenRouterRateLimitSchema = Schema.Struct({
  headers: Schema.Struct({
    "X-RateLimit-Limit": Schema.String,
    "X-RateLimit-Remaining": Schema.String,
    "X-RateLimit-Reset": Schema.String
  }),
  provider_name: Schema.NullOr(Schema.String)
})

/** @Schema.Effect.OpenRouter.ErrorBody */
export const OpenRouterErrorBodySchema = Schema.Struct({
  error: Schema.Struct({
    message: Schema.String,
    code: Schema.Number,
    metadata: Schema.optional(OpenRouterRateLimitSchema)
  }),
  user_id: Schema.optional(Schema.String)
})

export interface OpenRouterErrorBody extends Schema.Schema.Type<typeof OpenRouterErrorBodySchema> {}

/** @Schema.Effect.OpenRouter.Choice */
export const ChoiceSchema = Schema.Struct({
  message: Schema.Struct({
    content: Schema.String
  })
})

/** @Schema.Effect.OpenRouter.Response */
export const OpenRouterResponseSchema = Schema.Struct({
  choices: Schema.NonEmptyArray(ChoiceSchema)
})

/** @Schema.Effect.OpenRouter.ErrorCodes */
export const OpenRouterErrorCodes = {
  400: "Bad Request",
  401: "Unauthorized",
  402: "Insufficient Credits",
  403: "Content Flagged",
  408: "Request Timeout",
  429: "Rate Limited",
  500: "Internal Error",
  502: "Bad Gateway",
  503: "Service Unavailable"
} as const

export type OpenRouterErrorCode = keyof typeof OpenRouterErrorCodes

/** @Schema.Effect.OpenRouter.UrlCitation */
export const UrlCitationSchema = Schema.Struct({
  url: Schema.String,
  title: Schema.String,
  content: Schema.optional(Schema.String),
  start_index: Schema.Number,
  end_index: Schema.Number
})

export type UrlCitation = Schema.Schema.Type<typeof UrlCitationSchema>

/** @Schema.Effect.OpenRouter.Annotation */
export const AnnotationSchema = Schema.Struct({
  type: Schema.String,
  url_citation: Schema.optional(UrlCitationSchema)
})

export type Annotation = Schema.Schema.Type<typeof AnnotationSchema>

/** @Schema.Effect.OpenRouter.ToolCall */
export const ToolCallSchema = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
  arguments: Schema.String
})

export type ToolCall = Schema.Schema.Type<typeof ToolCallSchema>

/** @Schema.Effect.OpenRouter.ChatResponse */
export const ChatResponseSchema = Schema.Struct({
  content: Schema.String,
  reasoning: Schema.optional(Schema.String),
  annotations: Schema.optional(Schema.Array(AnnotationSchema)),
  toolCalls: Schema.optional(Schema.Array(ToolCallSchema))
})

export type ChatResponse = Schema.Schema.Type<typeof ChatResponseSchema>
