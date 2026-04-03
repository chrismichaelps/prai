---
State_ID: BigInt(0x2)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Service.Effect.ToolExecutor

### [Signatures]
```ts
export const executeTool: (toolName: string, args: Record<string, unknown>) => Effect.Effect<string, ToolError>
```

### [Governance]
- **Effect_Law:** All tool execution uses Effect framework with `ToolError` in the error channel.
- **Read_Write_Separation_Law:** `executeReadTool` and `executeWriteTool` are separate execution paths.
- **Memory_Integration_Law:** `remember_user_fact` tool writes directly to SessionMemoryService via runtime import (avoids circular dependency).
- **Retry_Law:** Tools support retry with exponential backoff via `executeWithRetry`.

### [Semantic Hash]
Core tool execution engine. Routes tool calls to read or write handlers. Supports search tools (beaches, restaurants, events, places, hotels, weather, transport) and write tools (save_favorite, save_itinerary, remember_user_fact). The `remember_user_fact` tool stores user facts directly into SessionMemory for cross-session persistence.

### [Linkage]
- **Upstream:** Tool types/schemas, SessionMemoryService (for remember_user_fact)
- **Downstream:** `@root/src/app/api/chat/route.ts` (tool execution in agentic loops)
