---
State_ID: BigInt(0x1)
Git_SHA: INIT
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Store.Redux.ChatSlice

### [Signatures]
```ts
export const chatSlice: Slice<ChatState>
export const {
  addMessage, updateLastMessage, setLoading, setError,
  setSuggestions, setActiveAdaptiveData, clearHistory
} = chatSlice.actions

interface ChatState {
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null
  suggestions: string[]
  activeAdaptiveData: AdaptiveBlock[]
}
```

### [Governance]
- **Reducer_Law:** All mutation via Redux Toolkit Immer — safe for state mutation patterns.
- **Export_Law:** Named action creators + slice exported. Consumed in chat.ts and ChatProvider.tsx.

### [Semantic Hash]
All chat-related Redux state: message history, loading indicator, error state, AI suggestions, and active adaptive card data.

### [Linkage]
- **Upstream:** None (leaf slice)
- **Downstream:** `@root/src/lib/effect/chat.ts`, `@root/src/lib/effect/ChatProvider.tsx`, `@root/src/components/chat/ChatContainer.tsx`
