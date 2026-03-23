import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './slices/chatSlice';
import passportReducer from './slices/passportSlice';
import uiReducer from './slices/uiSlice';
import authReducer from './slices/authSlice';

/** @Store.Redux.Root */
export const store = configureStore({
  reducer: {
    chat: chatReducer,
    passport: passportReducer,
    ui: uiReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
