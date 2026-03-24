---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/next.hash.md"
---

## @Route.Chat.ById

### [Routes]
| Handler | Description |
|---------|-------------|
| `page.tsx` | Individual chat view with messages |

### [Signatures]
```tsx
export default function ChatByIdPage(): JSX.Element
```

### [Governance]
- **Auth_Law:** Protected route - redirects unauthenticated users to home.
- **Data_Law:** Fetches chat messages on mount via `/api/chat/chats/[id]`.
- **Error_Law:** Redirects to `/chat` on error loading chat.

### [Semantic Hash]
Individual chat page at `/chat/[id]` that loads and displays messages for a specific chat.

### [Linkage]
- **Upstream:** `useAuth` context, Redux store
- **Downstream:** `ChatContainer`, `ChatSidebar` components
