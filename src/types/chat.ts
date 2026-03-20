export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: {
    thought?: string;
    thoughtDuration?: string;
    steps?: { type: 'analyzed' | 'plan' | 'search'; label: string }[];
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
