import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ChatMessage, AdaptiveData, Suggestion, SearchResult } from '@/types/chat';

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  suggestions: Suggestion[];
  activeAdaptiveData: AdaptiveData[];
  isSourcesOpen: boolean;
  selectedSources: {
    query: string;
    sources: SearchResult[];
  } | null;
}

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null,
  suggestions: [],
  activeAdaptiveData: [],
  isSourcesOpen: false,
  selectedSources: null,
};

/** @Store.Slice.Chat */
export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<ChatMessage[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
    updateLastMessage: (state, action: PayloadAction<string | { content?: string; metadata?: ChatMessage['metadata'] }>) => {
      const last = state.messages[state.messages.length - 1];
      if (last && last.role === 'assistant') {
        if (typeof action.payload === 'string') {
          last.content = action.payload;
        } else {
          if (action.payload.content !== undefined) last.content = action.payload.content;
          if (action.payload.metadata !== undefined) {
            last.metadata = { 
              ...last.metadata, 
              ...action.payload.metadata 
            };
          }
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSuggestions: (state, action: PayloadAction<Suggestion[]>) => {
      state.suggestions = action.payload;
    },
    setActiveAdaptiveData: (state, action: PayloadAction<AdaptiveData[]>) => {
      state.activeAdaptiveData = action.payload;
    },
    addActiveAdaptiveData: (state, action: PayloadAction<AdaptiveData>) => {
      state.activeAdaptiveData.push(action.payload);
    },
    openSources: (state, action: PayloadAction<{ query: string; sources: SearchResult[] }>) => {
      state.selectedSources = action.payload;
      state.isSourcesOpen = true;
    },
    closeSources: (state) => {
      state.isSourcesOpen = false;
    },
    clearHistory: (state) => {
      state.messages = [];
      state.activeAdaptiveData = [];
      state.suggestions = [];
      state.isSourcesOpen = false;
      state.selectedSources = null;
    },
    editMessage: (state, action: PayloadAction<{ index: number; content: string }>) => {
      const { index, content } = action.payload;
      if (!state.messages[index]) return;

      state.messages[index].content = content;
      state.messages[index].metadata = {
        ...state.messages[index].metadata,
        edited: true,
      };
      const lastIndex = state.messages.length - 1;
      if (state.messages[lastIndex]?.role === 'assistant') {
        state.messages.pop();
      }
      state.activeAdaptiveData = [];
      state.suggestions = [];
    },
  },
});

export const {
  setMessages,
  addMessage,
  updateLastMessage,
  setLoading,
  setError,
  setSuggestions,
  setActiveAdaptiveData,
  addActiveAdaptiveData,
  openSources,
  closeSources,
  clearHistory,
  editMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
