/** @Type.Chat */

export type {
  SearchResult,
  ChatMessageMetadata,
  ChatMessage,
  MessageStep,
  ToolCallRecord,
} from '@/lib/effect/schemas/ChatSchema'

import type { CardType } from '@/lib/effect/schemas/AdaptiveCardsSchema'

/** @Type.Chat.CardType */
export type { CardType }

/** @Constant.Chat.Role */
export const ChatRole = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
} as const

/** @Type.Chat.RoleType */
export type ChatRoleType = (typeof ChatRole)[keyof typeof ChatRole]

/** @Type.Chat.Suggestion */
export type { Suggestion } from '@/lib/effect/schemas/SuggestionSchema'

/** @Type.Chat.AdaptiveData */
export type { AdaptiveData } from '@/lib/effect/schemas/AdaptiveCardsSchema'
