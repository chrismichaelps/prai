---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Lib.Api.Chat.ArchivedChats

### [Routes]
| Method | Handler | Description |
|--------|---------|-------------|
| GET | `GET` | Get archived chats for user |

### [Signatures]
```ts
export async function GET(request: NextRequest): Promise<NextResponse>
```

### [Governance]
- **SearchParams_Validation:** Validates `userId` via searchParams schema.
- **Response_Law:** Returns JSON array of archived chats.

### [Semantic Hash]
API route to retrieve archived chats for a user at `/api/chat/chats/archived`.

### [Linkage]
- **Upstream:** `chatService.getArchivedChats`
- **Downstream:** ChatSidebar component
