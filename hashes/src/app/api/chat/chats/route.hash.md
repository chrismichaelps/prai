---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Lib.Api.Chat.Chats

### [Routes]
| Method | Handler | Description |
|--------|---------|-------------|
| GET | `GET` | Get all chats for user |
| POST | `POST` | Create new chat |
| PATCH | `PATCH` | Update chat (title, archived status) |
| DELETE | `DELETE` | Delete all chats for user |

### [Signatures]
```ts
export async function GET(request: NextRequest): Promise<NextResponse>
export async function POST(request: NextRequest): Promise<NextResponse>
export async function PATCH(request: NextRequest): Promise<NextResponse>
export async function DELETE(request: NextRequest): Promise<NextResponse>
```

### [Governance]
- **Schema_Law:** All inputs validated via `chat.schemas`.
- **Response_Law:** Uses `exitResponse` helper for Effect → NextResponse conversion.
- **Query_Params:** Uses `decodeSearchParams` for GET/DELETE.

### [Semantic Hash]
API routes for chat CRUD operations at `/api/chat/chats`.

### [Linkage]
- **Upstream:** `@/app/api/_lib/validation`, `chatService`
- **Downstream:** ChatSidebar, ChatContainer
