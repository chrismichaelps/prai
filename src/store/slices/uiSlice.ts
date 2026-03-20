import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface UIState {
  isSidebarOpen: boolean;
  activeTab: string;
  isModelInfoVisible: boolean;
}

const initialState: UIState = {
  isSidebarOpen: true,
  activeTab: 'chat',
  isModelInfoVisible: false,
};

/** @Namespace.UI.Slice */
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
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    setModelInfoVisible: (state, action: PayloadAction<boolean>) => {
      state.isModelInfoVisible = action.payload;
    },
    toggleModelInfo: (state) => {
      state.isModelInfoVisible = !state.isModelInfoVisible;
    },
  },
});

export const { toggleSidebar, setSidebarOpen, setActiveTab, setModelInfoVisible, toggleModelInfo } = uiSlice.actions;

export default uiSlice.reducer;
