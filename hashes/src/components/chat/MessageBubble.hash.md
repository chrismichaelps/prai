---
State_ID: BigInt(0x2)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @UI.Component.Chat.MessageBubble

### [Signatures]
```ts
export const MessageBubble(props: MessageBubbleProps): JSX.Element
const SingleSource({ source }): JSX.Element
const SourcesPill({ sources, message, dispatch, t }): JSX.Element
```

### [Semantic Hash]
Renders individual chat message bubbles with support for thought process, tool calls, sources, and follow-up suggestions.

### [Change Notes — sources pill redesign]
- SingleSource: Direct link when only 1 source
- SourcesPill: Button with stacked favicons + count when 2+ sources
- Opens SourcesSidebar on click (dispatch openSources action)
- Shows +N badge when sources > 3

### [Linkage]
- **Dependencies:** `ChatMessage`, `SearchResult`, `ToolCallRecord` from `@root/src/lib/effect/schemas/ChatSchema.ts`
- **Upstream:** `@root/src/store/slices/chatSlice.ts` (openSources)