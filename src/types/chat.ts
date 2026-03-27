import type { CardType } from '@/lib/effect/schemas/AdaptiveCardsSchema';

export type { CardType };

export interface SearchResult {
  title: string;
  url: string;
  snippet?: string;
  source?: string;
  icon?: string;
  verified?: boolean;
}

export const ChatRole = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system'
} as const;

export type ChatRoleType = typeof ChatRole[keyof typeof ChatRole];

export interface ChatMessage {
  role: ChatRoleType;
  content: string;
  metadata?: {
    thought?: string;
    thoughtTime?: string;
    isThinking?: boolean;
    thoughtDuration?: string;
    steps?: { type: 'analyzed' | 'plan' | 'search'; label: string }[];
    sources?: SearchResult[];
    searchQuery?: string;
    edited?: boolean;
  };
}

export interface Suggestion {
  label: string;
  action: string;
  icon?: string;
}

export interface AdaptiveData {
  type: CardType;
  data: unknown;
}
