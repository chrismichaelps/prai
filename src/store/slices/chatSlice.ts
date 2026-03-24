import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ChatMessage, AdaptiveData, Suggestion, SearchResult } from '@/types/chat';

/** @Type.Chat */
export interface Chat {
  id: string;
  user_id: string;
  title: string | null;
  is_archived: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

/** @Store.Redux.ChatSlice */
export interface ChatState {
  currentChatId: string | null;
  chats: Chat[];
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
  currentChatId: null,
  chats: [],
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
      state.messages = action.payload;
    },
    /** @Store.Action.Chat.AddMessage */
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
    /** @Store.Action.Chat.UpdateLastMessage */
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
      if (state.messages[lastIndex]?.role === 'assistant') {
        state.messages.pop();
      }
      state.activeAdaptiveData = [];
      state.suggestions = [];
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
