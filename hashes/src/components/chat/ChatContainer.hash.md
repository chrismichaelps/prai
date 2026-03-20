---
State_ID: BigInt(0x1)
Git_SHA: INIT
Grammar_Lock: "@root/hashes/grammar/effect.hash.md"
---

## @UI.Chat.Container

### [Signatures]
```ts
export function ChatContainer(): JSX.Element
```

### [Governance]
- **Performance_Law:** `MemoizedMessageBubble` used for the message list to prevent heavy stream re-renders.
- **Scroll_Law:** `ScrollArea` ref auto-scroll triggers on every stream chunk — must throttle.

### [Implementation Notes]
- **Component Code Splitting:** Heavy components like `AdaptiveCard` are lazily loaded via Next.js `dynamic()` to reduce the initial JS payload bundle size.
- **List Rendering Efficiency:** `MemoizedMessageBubble` relies on `React.memo` to prevent entire-list re-renders when streaming message chunks arrive.

### [Semantic Hash]
Root chat UI container. Manages message list rendering, auto-scroll, input handling, voice recording, and adaptive card display.

### [Linkage]
- **Upstream:** `@root/src/lib/effect/ChatProvider.tsx`, `@root/src/store/slices/chatSlice.ts`
- **Downstream:** `AdaptiveCard.tsx`, `MessageBubble.tsx`, `Suggestions.tsx`, `DiscoveryLoader.tsx`
