'use client';

import { Provider } from "react-redux";
import { store } from "@/store";
import { ChatProvider } from "@/lib/effect/ChatProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ChatProvider>
        {children}
      </ChatProvider>
    </Provider>
  );
}
