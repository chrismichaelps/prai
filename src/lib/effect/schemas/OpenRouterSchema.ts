import { Schema } from "effect"

/** @Schema.Effect.OpenRouter */
export const ChatMessageSchema = Schema.Struct({
  role: Schema.Literal("user", "assistant", "system"),
  content: Schema.String
})

export type ChatMessage = Schema.Schema.Type<typeof ChatMessageSchema>


export const OpenRouterRateLimitSchema = Schema.Struct({
  headers: Schema.Struct({
    "X-RateLimit-Limit": Schema.String,
    "X-RateLimit-Remaining": Schema.String,
    "X-RateLimit-Reset": Schema.String
  }),
  provider_name: Schema.NullOr(Schema.String)
})

export const OpenRouterErrorBodySchema = Schema.Struct({
  error: Schema.Struct({
    message: Schema.String,
    code: Schema.Number,
    metadata: Schema.optional(OpenRouterRateLimitSchema)
  }),
  user_id: Schema.optional(Schema.String)
})

export interface OpenRouterErrorBody extends Schema.Schema.Type<typeof OpenRouterErrorBodySchema> {}

/** @Schema.Effect.OpenRouter.Response */
export const ChoiceSchema = Schema.Struct({
  message: Schema.Struct({
    content: Schema.String
  })
})

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
