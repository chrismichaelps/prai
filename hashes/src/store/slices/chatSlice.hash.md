---
State_ID: BigInt(0x2)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Store.Redux.ChatSlice

### [Signatures]
```ts
export type RichChatMessage = ChatMessage & { _key: string }

export const chatSlice: Slice<ChatState>
export const {
  addMessage, updateLastMessage, setLoading, setError,
  setSuggestions, setActiveAdaptiveData, clearHistory,
  updateChatSettings, clearChatSettings, setChatSettings,
  setMessages, updateChat, setCurrentChatId, setChats, addChat
} = chatSlice.actions

interface ChatState {
  messages: RichChatMessage[]
  isLoading: boolean
  error: string | null
  suggestions: Suggestion[]
  activeAdaptiveData: AdaptiveBlock[]
  chatSettings: ChatSettings
  currentChatId: string | null
  chats: Chat[]
}
```

### [Governance]
- **Reducer_Law:** All mutation via Redux Toolkit Immer — safe for state mutation patterns.
- **Settings_Law:** `chatSettings` is part of chat state — persisted per-chat, reset to `DEFAULT_CHAT_SETTINGS` on `clearHistory`.
- **Clear_Law:** `clearHistory` resets `messages`, `activeAdaptiveData`, `suggestions`, `isSourcesOpen`, `selectedSources`, `isLoading`, `error`, AND `chatSettings` to `DEFAULT_CHAT_SETTINGS`.
- **Key_Law:** `addMessage` and `setMessages` assign a `_key` (UUID) to each message for stable React reconciliation during streaming.
- **Export_Law:** Named action creators + slice exported. Consumed in `chat.ts`, `ChatProvider.tsx`, command executor.

### [Implementation Notes]
- `RichChatMessage = ChatMessage & { _key: string }` — stable key prevents React re-renders during stream updates
- `chatSettings` bug fix: `clearHistory` previously left stale settings when navigating between chats

### [Semantic Hash]
All chat-related Redux state: message history (with stable `_key`), loading, error, suggestions, adaptive cards, per-chat settings (`ChatSettings`), and multi-chat management.

### [Linkage]
- **Upstream:** None (leaf slice)
- **Downstream:** `@root/src/lib/effect/chat.ts`, `@root/src/lib/effect/ChatProvider.tsx`, `@root/src/components/chat/ChatContainer.tsx`, `@root/src/lib/commands/clear.ts`, `@root/src/app/chat/[id]/page.tsx`
