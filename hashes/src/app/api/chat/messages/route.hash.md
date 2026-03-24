---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Lib.Api.Chat.Messages

### [Routes]
| Method | Handler | Description |
|--------|---------|-------------|
| POST | `POST` | Create a new message in a chat |
| GET | `GET` | Retrieve all messages for a chat |

### [Signatures]
```ts
export async function POST(request: NextRequest): Promise<NextResponse>
export async function GET(request: NextRequest): Promise<NextResponse>
```

### [Governance]
- **Body_Validation (POST):** Validates message via `CreateMessageSchema`.
- **SearchParams_Validation (GET):** Validates `chatId` via searchParams schema.
- **Response_Law:** POST returns 201 (CREATED). GET returns JSON array of messages.

### [Semantic Hash]
API route for message CRUD operations at `/api/chat/messages`.

### [Linkage]
- **Upstream:** `chatService.addMessage`, `chatService.getMessages`
- **Downstream:** ChatContainer, chatService
