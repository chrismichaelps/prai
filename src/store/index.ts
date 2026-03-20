import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './slices/chatSlice';
import passportReducer from './slices/passportSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    passport: passportReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
