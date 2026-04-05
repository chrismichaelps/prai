import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { castDraft } from 'immer';
import type { ChatMessage, AdaptiveData, Suggestion, SearchResult } from '@/types/chat';
import { ChatRole } from '@/types/chat';
import type { ChatSettings } from '@/lib/effect/schemas/CommandSchema';
import { DEFAULT_CHAT_SETTINGS } from '@/lib/effect/schemas/CommandSchema';
import type { ProcessingStateValue } from '@/lib/constants/app-constants';

/** @Type.Chat.RichMessage */
export type RichChatMessage = ChatMessage & { _key: string }

/** @Type.Chat.ProcessingStage */
export interface ProcessingStage {
  state: ProcessingStateValue
  message: string
}

/** @Type.Chat */
export interface Chat {
  id: string;
  user_id: string;
  title: string | null;
  is_archived: boolean | null;
  settings: Record<string, unknown> | null;
  created_at: string | null;
  updated_at: string | null;
}

/** @Store.Redux.ChatSlice */
export interface ChatState {
  currentChatId: string | null;
  chats: Chat[];
  messages: RichChatMessage[];
  isLoading: boolean;
  error: string | null;
  suggestions: Suggestion[];
  activeAdaptiveData: AdaptiveData[];
  isSourcesOpen: boolean;
  selectedSources: {
    query: string;
    sources: SearchResult[];
  } | null;
  chatSettings: ChatSettings;
  processingStage: ProcessingStage | null;
}

const initialState: ChatState = {
  currentChatId: null,
  chats: [],
  messages: [],
  isLoading: false,
  error: null,
  suggestions: [],
  activeAdaptiveData: [],
  isSourcesOpen: false,
  selectedSources: null,
  chatSettings: DEFAULT_CHAT_SETTINGS,
  processingStage: null,
};

/** @Store.Slice.Chat */
export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    /** @Store.Action.Chat.SetCurrentChat */
    setCurrentChat: (state, action: PayloadAction<string | null>) => {
      state.currentChatId = action.payload;
    },
    /** @Store.Action.Chat.SetChats */
    setChats: (state, action: PayloadAction<Chat[]>) => {
      state.chats = action.payload;
    },
    /** @Store.Action.Chat.AddChat */
    addChat: (state, action: PayloadAction<Chat>) => {
      state.chats.unshift(action.payload);
      state.currentChatId = action.payload.id;
    },
    /** @Store.Action.Chat.UpdateChat */
    updateChat: (state, action: PayloadAction<{ id: string; updates: Partial<Chat> }>) => {
      const index = state.chats.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        const existingChat = state.chats[index]!;
        state.chats[index] = {
          ...existingChat,
          ...action.payload.updates,
          id: action.payload.updates.id ?? existingChat.id,
          user_id: action.payload.updates.user_id ?? existingChat.user_id,
        };
      }
    },
    /** @Store.Action.Chat.RemoveChat */
    removeChat: (state, action: PayloadAction<string>) => {
      state.chats = state.chats.filter(c => c.id !== action.payload);
      if (state.currentChatId === action.payload) {
        state.currentChatId = state.chats[0]?.id || null;
      }
    },
    /** @Store.Action.Chat.SetMessages */
    setMessages: (state, action: PayloadAction<ChatMessage[]>) => {
      state.messages = castDraft(action.payload.map(m => ({ ...m, _key: Math.random().toString(36).slice(2) })));
    },
    /** @Store.Action.Chat.AddMessage */
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(castDraft({ ...action.payload, _key: Math.random().toString(36).slice(2) }));
    },
    /** @Store.Action.Chat.UpdateLastMessage */
    updateLastMessage: (state, action: PayloadAction<string | { content?: string; metadata?: ChatMessage['metadata'] }>) => {
      const last = state.messages[state.messages.length - 1];
      if (last && last.role === ChatRole.ASSISTANT) {
        if (typeof action.payload === 'string') {
          last.content = action.payload;
        } else {
          if (action.payload.content !== undefined) last.content = action.payload.content;
          if (action.payload.metadata !== undefined) {
            last.metadata = castDraft({
              ...last.metadata,
              ...action.payload.metadata,
            });
          }
        }
      }
    },
    /** @Store.Action.Chat.SetLoading */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    /** @Store.Action.Chat.SetError */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    /** @Store.Action.Chat.SetSuggestions */
    setSuggestions: (state, action: PayloadAction<Suggestion[]>) => {
      state.suggestions = action.payload;
    },
    /** @Store.Action.Chat.SetActiveAdaptiveData */
    setActiveAdaptiveData: (state, action: PayloadAction<AdaptiveData[]>) => {
      state.activeAdaptiveData = action.payload;
    },
    /** @Store.Action.Chat.AddActiveAdaptiveData */
    addActiveAdaptiveData: (state, action: PayloadAction<AdaptiveData>) => {
      state.activeAdaptiveData.push(action.payload);
    },
    /** @Store.Action.Chat.OpenSources */
    openSources: (state, action: PayloadAction<{ query: string; sources: SearchResult[] }>) => {
      state.selectedSources = action.payload;
      state.isSourcesOpen = true;
    },
    /** @Store.Action.Chat.CloseSources */
    closeSources: (state) => {
      state.isSourcesOpen = false;
    },
    /** @Store.Action.Chat.ClearHistory */
    clearHistory: (state) => {
      state.messages = [];
      state.activeAdaptiveData = [];
      state.suggestions = [];
      state.isSourcesOpen = false;
      state.selectedSources = null;
      state.isLoading = false;
      state.error = null;
      state.chatSettings = DEFAULT_CHAT_SETTINGS;
      state.processingStage = null;
    },
    /** @Store.Action.Chat.PopLastAssistantMessage */
    popLastAssistantMessage: (state) => {
      const last = state.messages[state.messages.length - 1]
      if (last?.role === ChatRole.ASSISTANT) {
        state.messages.pop()
      }
    },
    /** @Store.Action.Chat.EditMessage */
    editMessage: (state, action: PayloadAction<{ index: number; content: string }>) => {
      const { index, content } = action.payload;
      if (!state.messages[index]) return;

      state.messages[index].content = content;
      state.messages[index].metadata = {
        ...state.messages[index].metadata,
        edited: true,
      };
      const lastIndex = state.messages.length - 1;
      if (state.messages[lastIndex]?.role === ChatRole.ASSISTANT) {
        state.messages.pop();
      }
      state.activeAdaptiveData = [];
      state.suggestions = [];
    },
    /** @Store.Action.Chat.UpdateChatSettings */
    updateChatSettings: (state, action: PayloadAction<{ key: string; value: unknown }>) => {
      (state.chatSettings as Record<string, unknown>)[action.payload.key] = action.payload.value;
    },
    /** @Store.Action.Chat.ClearChatSettings */
    clearChatSettings: (state) => {
      state.chatSettings = DEFAULT_CHAT_SETTINGS;
    },
    /** @Store.Action.Chat.SetChatSettings */
    setChatSettings: (state, action: PayloadAction<ChatSettings>) => {
      state.chatSettings = action.payload;
    },
    /** @Store.Action.Chat.SetProcessingStage */
    setProcessingStage: (state, action: PayloadAction<ProcessingStage | null>) => {
      state.processingStage = action.payload;
    },
  },
});

export const {
  setCurrentChat,
  setChats,
  addChat,
  updateChat,
  removeChat,
  setMessages,
  addMessage,
  updateLastMessage,
  popLastAssistantMessage,
  setLoading,
  setError,
  setSuggestions,
  setActiveAdaptiveData,
  addActiveAdaptiveData,
  openSources,
  closeSources,
  clearHistory,
  editMessage,
  updateChatSettings,
  clearChatSettings,
  setChatSettings,
  setProcessingStage,
} = chatSlice.actions;

export default chatSlice.reducer;
