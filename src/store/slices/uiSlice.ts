import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { UIActiveTab } from '@/types/ui';

export interface UIState {
  isSidebarOpen: boolean;
  activeTab: UIActiveTab;
  isModelInfoVisible: boolean;
  apiError: {
    code: number;
    message: string;
  } | null;
}

const initialState: UIState = {
  isSidebarOpen: true,
  activeTab: 'chat',
  isModelInfoVisible: false,
  apiError: null,
};

/** @Store.Slice.UI */
export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isSidebarOpen = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<UIActiveTab>) => {
      state.activeTab = action.payload;
    },
    setModelInfoVisible: (state, action: PayloadAction<boolean>) => {
      state.isModelInfoVisible = action.payload;
    },
    toggleModelInfo: (state) => {
      state.isModelInfoVisible = !state.isModelInfoVisible;
    },
    setApiError: (state, action: PayloadAction<{ code: number; message: string } | null>) => {
      state.apiError = action.payload;
    },
    clearApiError: (state) => {
      state.apiError = null;
    },
  },
});

export const { toggleSidebar, setSidebarOpen, setActiveTab, setModelInfoVisible, toggleModelInfo, setApiError, clearApiError } = uiSlice.actions;

export default uiSlice.reducer;
