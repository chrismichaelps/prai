import type { ChatMessage, ChatRoleType } from "@/types/chat"
import { ChatRole } from "@/types/chat"
import { suggestionPrompt, suggestionSystemPrompt } from "./prompts/suggestion"
import { SUGGESTION_FILTER_RULES, SUGGESTION_CONFIG } from "./prompts/suggestion-filters"

/** @Config.Export */
export { SUGGESTION_CONFIG }

/** @Type.Result */
export interface SuggestionResult {
  readonly suggestion: string
  readonly confidence: number
}

/** @Type.Filter */
export interface SuggestionFilter {
  readonly reason: string
  readonly suggestion: string | null
}

/** @Constant.RoleLabels */
export const ROLE_LABELS: Record<ChatRoleType, string> = {
  [ChatRole.USER]: "Usuario",
  [ChatRole.ASSISTANT]: "Asistente",
  [ChatRole.SYSTEM]: "Sistema",
} as const

/** @Constant.ApiIndicator */
export const CHAT_ROLE_API_INDICATOR = "API" as const

/** @Helper.GetRoleLabel */
function getRoleLabel(role: ChatRoleType): string {
  return ROLE_LABELS[role] ?? role
}

/** @Logic.ShouldShow */
export function shouldShowSuggestion(messages: readonly ChatMessage[]): boolean {
  /** @Logic.CountAssistants */
  const assistantCount = messages.filter((m) => m.role === ChatRole.ASSISTANT).length
  if (assistantCount < SUGGESTION_CONFIG.MIN_ASSISTANT_MESSAGES) return false

  /** @Logic.FindLastAssistant */
  const lastAssistant = messages.findLast((m) => m.role === ChatRole.ASSISTANT)
  if (lastAssistant?.content?.toLowerCase().includes(CHAT_ROLE_API_INDICATOR.toLowerCase())) return false

  return true
}

/** @Logic.ShouldFilter */
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

/** @Logic.Filter */
export function filterSuggestion(suggestion: string | null): SuggestionFilter {
  return shouldFilterSuggestion(suggestion)
}

/** @Logic.BuildPrompt */
export function buildSuggestionPrompt(messages: readonly ChatMessage[]): string {
  /** @Logic.SliceHistory */
  const conversationContext = messages
    .slice(-SUGGESTION_CONFIG.CONVERSATION_HISTORY_SIZE)
    .map((m) => {
      /** @Logic.GetLabel */
      const role = getRoleLabel(m.role)
      /** @Logic.TruncateContent */
      const content = m.content?.slice(0, SUGGESTION_CONFIG.MAX_CONTEXT_LENGTH) || ""
      return `${role}: ${content}`
    })
    .join("\n\n")

  return `${suggestionPrompt}\n\n--- CONVERSACIÓN ---\n${conversationContext}\n\n---`
}

/** @Logic.GetSystemPrompt */
export function getSuggestionSystemPrompt(): string {
  return suggestionSystemPrompt
}

/** @Logic.ProcessResponse */
export function processSuggestionResponse(content: string): SuggestionResult {
  /** @Logic.TrimContent */
  const trimmed = content.trim()
  /** @Logic.FilterContent */
  const filtered = shouldFilterSuggestion(trimmed)

  if (!filtered.suggestion) {
    return { suggestion: "", confidence: 0 }
  }

  return {
    suggestion: filtered.suggestion,
    confidence: SUGGESTION_CONFIG.CONFIDENCE_THRESHOLD,
  }
}
