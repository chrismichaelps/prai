import { Schema } from "effect"
import { ChatRole } from "@/types/chat"

/** @Schema.Effect.Suggestion.FilterRule */
export const FilterRuleSchema = Schema.Struct({
  id: Schema.String,
  check: Schema.declare(
    (u): u is (s: string) => boolean => typeof u === "function",
  ),
})

/** @Type.Effect.Suggestion.FilterRule */
export type FilterRule = Schema.Schema.Type<typeof FilterRuleSchema>

/** @Schema.Effect.Suggestion.Result */
export const SuggestionResultSchema = Schema.Struct({
  suggestion: Schema.String,
  confidence: Schema.Number,
})

/** @Type.Effect.Suggestion.Result */
export type SuggestionResult = Schema.Schema.Type<typeof SuggestionResultSchema>

/** @Schema.Effect.Suggestion.Filter */
export const SuggestionFilterSchema = Schema.Struct({
  reason: Schema.String,
  suggestion: Schema.NullOr(Schema.String),
})

/** @Type.Effect.Suggestion.Filter */
export type SuggestionFilter = Schema.Schema.Type<typeof SuggestionFilterSchema>

const ChatRoleSchema = Schema.Literal(
  ChatRole.USER,
  ChatRole.ASSISTANT,
  ChatRole.SYSTEM,
)

/** @Schema.Effect.Suggestion.Message */
export const SuggestionMessageSchema = Schema.Struct({
  role: ChatRoleSchema,
  content: Schema.String,
})

/** @Type.Effect.Suggestion.Message */
export type SuggestionMessage = Schema.Schema.Type<typeof SuggestionMessageSchema>
/** @Schema.Effect.Suggestion */
export const SuggestionSchema = Schema.Struct({
  label: Schema.String,
  action: Schema.String,
  icon: Schema.optional(Schema.String),
})

/** @Type.Effect.Suggestion */
export type Suggestion = Schema.Schema.Type<typeof SuggestionSchema>
