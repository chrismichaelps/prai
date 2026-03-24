---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Lib.Api.Chat.ChatsCount

### [Routes]
| Method | Handler | Description |
|--------|---------|-------------|
| GET | `GET` | Get total count of non-archived chats for user |

### [Signatures]
```ts
export async function GET(request: NextRequest): Promise<NextResponse>
```

### [Governance]
- **SearchParams_Validation:** Validates `userId` via searchParams schema.
- **Response_Law:** Returns JSON object `{ count: number }`.

### [Semantic Hash]
API route to count non-archived chats for a user at `/api/chat/chats/count`.

### [Linkage]
- **Upstream:** `chatService.getChatsCount`
- **Downstream:** ChatSidebar component
