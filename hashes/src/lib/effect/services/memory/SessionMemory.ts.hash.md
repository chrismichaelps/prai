---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Service.State.Memory

### [Signatures]
```ts
export class SessionMemoryService extends Effect.Service<SessionMemoryService>()("app/SessionMemory", {
  effect: Effect.gen(function* () { ... })
})

export const extractPreferences: (messages: any[]) => Effect.Effect<Record<string, any>>
export const injectMemoryContext: (prompt: string, memory: any) => Effect.Effect<string>
```

跨### [Governance]
- **Extraction_Law:** Scans the session history to identify persistent user preferences (e.g., allergies, locations).
- **Injection_Law:** Dynamically curates the `system` prompt dynamically by injecting memory facts right before the OpenRouter dispatch.
- **Boundary_Law:** Memory extraction is strictly read-only within the chat loop. Supabase persistence occurs out-of-band.

### [Semantic Hash]
The session continuity layer. Analyzes past messages to extract implicit constraints, preferences, and facts, automatically prepending them to the AI's system prompt to create a highly personalized conversational memory.

### [Linkage]
- **Upstream:** \`@root/src/lib/effect/schemas/memory/SessionMemorySchema.ts\`
- **Downstream:** \`@root/src/app/api/chat/route.ts\`
