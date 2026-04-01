import { Effect } from "effect"
import type { ChatMessage, ChatRoleType } from "@/types/chat"
import { ChatRole } from "@/types/chat"
import { SuggestionError } from "@/lib/effect/errors"
import type {
  SuggestionResult,
  SuggestionFilter,
} from "@/lib/effect/schemas/SuggestionSchema"
import { suggestionPrompt, suggestionSystemPrompt } from "./prompts/suggestion"
import { SUGGESTION_FILTER_RULES, SUGGESTION_CONFIG } from "./prompts/suggestion-filters"

/** @Config.Export */
export { SUGGESTION_CONFIG }

/** @Type.Export */
export type { SuggestionResult, SuggestionFilter }

/** @Constant.Suggestion.RoleLabels */
export const ROLE_LABELS: Record<ChatRoleType, string> = {
  [ChatRole.USER]: "Usuario",
  [ChatRole.ASSISTANT]: "Asistente",
  [ChatRole.SYSTEM]: "Sistema",
} as const

/** @Constant.Suggestion.ApiIndicator */
export const CHAT_ROLE_API_INDICATOR = "API" as const

/** @Constant.Suggestion.GenerateTrigger */
export const SUGGESTION_GENERATE_TOKEN = "[Generar sugerencia]" as const

/** @Constant.Suggestion.ConversationSeparator */
export const CONVERSATION_SEPARATOR = "--- CONVERSACIÓN ---" as const

/** @Constant.Suggestion.ConversationEnd */
export const CONVERSATION_END_MARKER = "---" as const

/** @Helper.Suggestion.GetRoleLabel */
function getRoleLabel(role: ChatRoleType): string {
  return ROLE_LABELS[role] ?? role
}

/** @Logic.Suggestion.ShouldShow */
export function shouldShowSuggestion(messages: readonly ChatMessage[]): boolean {
  /** @Check.MinAssistantCount */
  const assistantCount = messages.filter((m) => m.role === ChatRole.ASSISTANT).length
  if (assistantCount < SUGGESTION_CONFIG.MIN_ASSISTANT_MESSAGES) return false

  /** @Check.ApiIndicator */
  const lastAssistant = messages.findLast((m) => m.role === ChatRole.ASSISTANT)
  if (
    lastAssistant?.content
      ?.toLowerCase()
      .includes(CHAT_ROLE_API_INDICATOR.toLowerCase())
  )
    return false

  return true
}

/** @Logic.Suggestion.ShouldFilter */
export function shouldFilterSuggestion(suggestion: string | null): SuggestionFilter {
  /** @Check.Empty */
  if (!suggestion) return { reason: "empty", suggestion: null }

  /** @Check.Trim */
  const trimmed = suggestion.trim()
  if (!trimmed) return { reason: "empty", suggestion: null }

  /** @Check.Rules */
  for (const rule of SUGGESTION_FILTER_RULES) {
    if (rule.check(trimmed)) {
      return { reason: rule.id, suggestion: null }
    }
  }

  return { reason: "passed", suggestion: trimmed }
}

/** @Logic.Suggestion.BuildPrompt */
export function buildSuggestionPrompt(messages: readonly ChatMessage[]): string {
  /** @Logic.Suggestion.SliceHistory */
  const conversationContext = messages
    .slice(-SUGGESTION_CONFIG.CONVERSATION_HISTORY_SIZE)
    .map((m) => {
      /** @Logic.Suggestion.GetLabel */
      const role = getRoleLabel(m.role)
      /** @Logic.Suggestion.TruncateContent */
      const content = m.content?.slice(0, SUGGESTION_CONFIG.MAX_CONTEXT_LENGTH) || ""
      return `${role}: ${content}`
    })
    .join("\n\n")

  return `${suggestionPrompt}\n\n${CONVERSATION_SEPARATOR}\n${conversationContext}\n\n${CONVERSATION_END_MARKER}`
}

/** @Logic.Suggestion.GetSystemPrompt */
export function getSuggestionSystemPrompt(): string {
  return suggestionSystemPrompt
}

/** @Logic.Suggestion.ProcessResponse */
export function processSuggestionResponse(
  content: string,
): Effect.Effect<SuggestionResult, SuggestionError> {
  /** @Logic.Suggestion.TrimContent */
  const trimmed = content.trim()
  /** @Logic.Suggestion.FilterContent */
  const filtered = shouldFilterSuggestion(trimmed)

  if (!filtered.suggestion) {
    return Effect.fail(
      new SuggestionError({
        message: `Suggestion rejected by filter rule: ${filtered.reason}`,
        reason: "filter",
        filterReason: filtered.reason,
      }),
    )
  }

  return Effect.succeed({
    suggestion: filtered.suggestion,
    confidence: SUGGESTION_CONFIG.CONFIDENCE_THRESHOLD,
  })
}

/** @Logic.Suggestion.FilterSuggestion */
export const filterSuggestion = shouldFilterSuggestion
