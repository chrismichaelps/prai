---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Logic.Effect.ChatPrompts

### [Signatures]
```ts
export const titleSystemPrompt: string
```

### [Governance]
- **Language_Law:** Prompts user to use same language as user.
- **Format_Law:** Title must be 2-4 words, max 30 chars, no emojis.

### [Semantic Hash]
System prompt for AI-powered chat title generation.

### [Linkage]
- **Upstream:** N/A (static constants)
- **Downstream:** `src/app/api/chat/route.ts`
