export interface SearchResult {
  title: string;
  url: string;
  snippet?: string;
  source?: string;
  icon?: string;
  verified?: boolean;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
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

export type CardType = 'radio' | 'tourism' | 'news' | 'photos' | 'video' | 'suggestions' | 'personality' | 'welcome';

export interface AdaptiveData {
  type: CardType;
  data: unknown;
}

export interface Suggestion {
  label: string;
  action: string;
  icon?: string;
}
