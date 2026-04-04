---
State_ID: BigInt(0x2)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Context.Effect.Chat

### [Signatures]
```ts
export function ChatProvider({ children }: { children: React.ReactNode }): JSX.Element
export const useChatActions: () => ChatContextType
export const useChatStore: () => ChatContextType  // Deprecated alias

interface ChatContextType {
  sendMessage: (content: string, personalization?: Personalization) => Promise<void>
  regenerateMessage: (personalization?: Personalization) => Promise<void>
  editMessage: (index: number, content: string, personalization?: Personalization) => Promise<void>
  clearHistory: () => void
  startVoice: (onResult: (text: string, isFinal: boolean) => void) => void
  stopVoice: () => void
}
```

### [Governance]
- **Bridge_Law:** Correct pattern — React bridge calls `runtime.runPromise(effect)` wrapped in `.catch()` boundary.
- **Render_Law:** Callbacks (`sendMessage`, etc.) memoized with `useCallback` to prevent re-renders.
- **Personalization_Law:** sendMessage, regenerateMessage, and editMessage accept optional personalization parameter.
- **Fiber_Type_Law:** `activeFiber` typed as `Fiber.RuntimeFiber<void, unknown>` to accommodate Effect's unknown error channel from chat operations.

### [Implementation Notes]
- **Error Boundaries:** The React bridge ensures `runtime.runPromise` is wrapped in `.catch()` to handle Promise rejections safely.
- **Memoization:** Callbacks like `sendMessage` are wrapped in `useCallback` to prevent unnecessary re-renders in standard consumers.

### [Semantic Hash]
React Context bridge that exposes Effect-native chat, voice, and history operations as Promise-based API for React components. Fiber tracking uses `unknown` error channel for compatibility with chat Effect operations.

### [Linkage]
- **Upstream:** `@root/src/lib/effect/runtime.ts`, `@root/src/lib/effect/chat.ts`, `@root/src/lib/effect/services/Voice.ts`
- **Downstream:** `@root/src/components/chat/ChatContainer.tsx`
