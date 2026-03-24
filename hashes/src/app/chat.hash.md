---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/next.hash.md"
---

## @Route.Chat

### [Routes]
| Handler | Description |
|---------|-------------|
| `layout.tsx` | Chat section layout |
| `page.tsx` | Main chat page with auto-create |
| `[id]/page.tsx` | Individual chat view |

### [Governance]
- **Auth_Law:** Protected section - requires authentication.
- **AutoCreate_Law:** Auto-creates chat on first visit.
- **URLSync_Law:** URL synced with current chat via `usePathname`.

### [Semantic Hash]
Chat section containing main chat interface, individual chat pages, and shared chat layout.

### [Linkage]
- **Upstream:** ProtectedRoute, AuthContext
- **Downstream:** ChatContainer, ChatSidebar, MessageBubble
