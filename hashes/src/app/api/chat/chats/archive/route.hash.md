---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Lib.Api.Chat.ChatsArchive

### [Routes]
| Method | Handler | Description |
|--------|---------|-------------|
| POST | `POST` | Archive all chats for user |

### [Signatures]
```ts
export async function POST(request: NextRequest): Promise<NextResponse>
```

### [Governance]
- **Body_Validation:** Validates `userId` via request body schema.
- **Response_Law:** Returns 204 (NO_CONTENT) on success.

### [Semantic Hash]
API route to archive all chats for a user at `/api/chat/chats/archive`.

### [Linkage]
- **Upstream:** `chatService.archiveAllChats`
- **Downstream:** Profile page
