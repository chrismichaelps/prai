---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/next.hash.md"
---

## @Lib.Api.Chat

### [Routes]
| Route | Description |
|-------|-------------|
| `route.ts` | Chat completions (POST) |
| `schemas/` | Chat, Message, ChatCompletions schemas |
| `services/` | Chat service with CRUD operations |
| `chats/` | Chat CRUD routes |
| `messages/` | Message routes |

### [Governance]
- **Validation_Law:** All inputs validated via Effect-TS schemas.
- **Effect_Law:** All DB operations return `Effect` for composable error handling.
- **Response_Law:** Use `exitResponse` helper for consistent API responses.

### [Semantic Hash]
Chat API module handling chat completions, message storage, and chat CRUD operations.

### [Linkage]
- **Upstream:** OpenRouter API, Supabase
- **Downstream:** ChatContainer, ChatSidebar components
