---
State_ID: BigInt(0x2)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/effect.hash.md"
---

## @UI.Chat.Container

### [Signatures]
```tsx
export function ChatContainer(): JSX.Element

// Sub-components
export const Chat: {
  Root: ({ children, className }) => JSX.Element
  Messages: ({ children, scrollAreaRef, innerRef, onScroll, className }) => JSX.Element
  Input: ({ value, onChange, onSend, isLoading, showScrollButton, onScrollToBottom, suggestions, textareaRef, isRecording, onMicClick, stopResponse, t, isAtLimit, isAuthenticated, usage, isUsageVisible, onToggleUsage }) => JSX.Element
}
```

### [Governance]
- **Performance_Law:** `MemoizedMessageBubble` used for the message list to prevent heavy stream re-renders.
- **Scroll_Law:** `ScrollArea` ref auto-scroll triggers on every stream chunk — must throttle.
- **Auto_Chat_Law:** Creates new chat automatically when visiting `/chat` with no `currentChatId`.
- **URL_Sync_Law:** Updates URL to `/chat/:id` when returning with existing chat via `usePathname`.
- **Usage_Law:** Displays inline usage bar with progress, remaining messages count, and limit warnings. Usage pill can be toggled visible/hidden.

### [Implementation Notes]
- **Component Code Splitting:** Heavy components like `AdaptiveCard` are lazily loaded via Next.js `dynamic()`.
- **List Rendering Efficiency:** `MemoizedMessageBubble` relies on `React.memo`.
- **Auto_Create:** `ensureChatExists` called on mount if no `currentChatId`.
- **URL_Update:** Uses `usePathname` + `router.replace()` for URL sync.
- **Resize_Observer:** Monitors textarea for auto-resize behavior.

### [State]
| State | Type | Description |
|-------|------|-------------|
| `userInput` | `string` | Current input text |
| `isRecording` | `boolean` | Voice recording state |
| `isLockedToBottom` | `boolean` | Auto-scroll lock |
| `showScrollButton` | `boolean` | Show scroll to bottom button |

### [Callbacks]
| Callback | Description |
|----------|-------------|
| `createNewChat` | Creates new chat via API, dispatches to Redux, navigates to `/chat/:id` |
| `ensureChatExists` | Returns existing chat or creates new one |
| `handleSend` | Main message sending handler |
| `handleMicClick` | Voice recording toggle |
| `scrollToBottom` | Smooth/auto scroll to bottom |

### [Semantic Hash]
Root chat UI container. Manages message list rendering, auto-scroll, input handling, voice recording, adaptive card display, and automatic chat creation/navigation.

### [Linkage]
- **Upstream:** `@/lib/effect/ChatProvider`, `@/store/slices/chatSlice`, `useAuth`, `usePathname`, `@/hooks/useUsage`
- **Downstream:** `AdaptiveCard`, `MessageBubble`, `Suggestions`, `DiscoveryLoader`, `UsageDisplay`
