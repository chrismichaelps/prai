import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './slices/chatSlice';
import uiReducer from './slices/uiSlice';
import authReducer from './slices/authSlice';
import issuesReducer from './slices/issuesSlice';
import healthReducer from './slices/healthSlice';

/** @Store.Redux.Root */
export const store = configureStore({
  reducer: {
    chat: chatReducer,
    ui: uiReducer,
    auth: authReducer,
    issues: issuesReducer,
    health: healthReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
