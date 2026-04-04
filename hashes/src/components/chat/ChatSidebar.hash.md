---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @UI.Component.ChatSidebar

### [Signatures]
```tsx
interface ChatSidebarProps {
  isOpen: boolean
  onClose: () => void
}
export function ChatSidebar({ isOpen, onClose }: ChatSidebarProps): JSX.Element
```

### [Governance]
- **Store_Integration:** Reads/writes to Redux `chatSlice` via `useAppSelector`/`useAppDispatch`.
- **Route_Protection:** Requires authenticated user via `useAuth`.

### [Implementation Notes]
- **Props:** `isOpen` controls visibility, `onClose` callback for parent state.
- **State:** `chats`, `currentChatId`, `isLoading`, `archivedChats`, `showArchived`, `activeMenu`.
- **Auto_Load:** Loads chats when sidebar opens and user is authenticated.
- **Actions:** Create, select, archive, restore, delete chat operations.
- **Redux_Actions:** Uses `setChats`, `addChat`, `removeChat`, `setMessages`, `clearHistory`, `setChatSettings`.
- **AbortController_Law:** In-flight `/api/chat/chats/:id` fetches cancelled on unmount or re-trigger via `AbortController`.
- **Settings_Law:** Dispatches `setChatSettings` after loading a chat's messages to restore per-chat command settings.

### [State Management]
| State | Type | Description |
|-------|------|-------------|
| `chats` | `Chat[]` | Active (non-archived) chats from Redux |
| `archivedChats` | `Chat[]` | Archived chats (local state) |
| `currentChatId` | `string \| undefined` | Currently selected chat |
| `showArchived` | `boolean` | Toggle between active/archived view |
| `activeMenu` | `string \| null` | Which chat menu is open |
| `isLoading` | `boolean` | Loading state for main chats |
| `isLoadingArchived` | `boolean` | Loading state for archived |

### [API Calls]
| Operation | Endpoint | Method |
|----------|----------|--------|
| Load chats | `/api/chat/chats?userId=` | GET |
| Load archived | `/api/chat/chats/archived?userId=` | GET |
| Create chat | `/api/chat/chats` | POST |
| Archive chat | `/api/chat/chats/:id` | PATCH |
| Restore chat | `/api/chat/chats/:id` | PATCH |
| Delete chat | `/api/chat/chats/:id` | DELETE |

### [Semantic Hash]
Sidebar component for chat management: displays list of chats, allows creating new chats, archiving, restoring, and deleting chats. Integrates with Redux for state management and navigates to chat pages.

### [Linkage]
- **Upstream:** Redux `chatSlice`, `useAuth`, `useI18n`
- **Downstream:** `/chat`, `/chat/:id` pages
