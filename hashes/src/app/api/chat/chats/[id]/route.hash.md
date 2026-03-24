---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Route.Chat.ChatById

### [Routes]
| Method | Handler | Description |
|--------|---------|-------------|
| GET | `GET` | Get messages for a chat |
| PATCH | `PATCH` | Update chat (e.g., archive/unarchive) |
| DELETE | `DELETE` | Delete a chat |

### [Signatures]
```ts
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse>
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse>
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse>
```

### [Governance]
- **Params_Law:** Path params validated via `decodeParams` with non-empty string filter.
- **Response_Law:** DELETE returns 204 (NO_CONTENT) using `new NextResponse(null, ...)`.
- **Error_Map:** `ChatDbError` wrapped in API error type.

### [Implementation Notes]
- **GET:** Retrieves all messages for chat, ordered by `created_at` ASC.
- **PATCH:** Updates `is_archived` boolean for archive/unarchive functionality.
- **DELETE:** Permanently deletes chat and cascades to messages via FK constraint.

### [Semantic Hash]
API routes for individual chat operations: retrieve messages, update chat properties, delete chat.

### [Linkage]
- **Upstream:** `@/app/api/_lib/validation`, `@/app/api/_lib/response`, `chatService`
- **Downstream:** Chat components (`ChatSidebar`, `ChatContainer`)
