---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Components.Chat

### [Components]
| Component | Description |
|-----------|-------------|
| `ChatContainer.tsx` | Main chat UI with message input |
| `ChatSidebar.tsx` | Chat list with archive/delete/restore |
| `MessageBubble.tsx` | Individual message display |
| `AdaptiveCard.tsx` | Rich card UI for structured content |
| `DiscoveryLoader.tsx` | Loading animation |
| `SourcesSidebar.tsx` | Source references sidebar |
| `Suggestions.tsx` | Quick suggestion buttons |

### [Governance]
- **Auth_Law:** Protected components require authentication.
- **I18n_Law:** All text via `useI18n()`.
- **State_Law:** Uses Redux for message/chat state.

### [Semantic Hash]
Chat-related UI components for the PR/AI tourism assistant interface.

### [Linkage]
- **Upstream:** Redux store, AuthContext, `useI18n`
- **Downstream:** Chat pages, API routes
