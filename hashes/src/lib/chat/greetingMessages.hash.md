---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Constant.Chat.Greetings

### [Signatures]
```ts
export const GREETING_MESSAGES: readonly string[]  // 6 Spanish greeting strings
export function getRandomGreeting(): string
```

### [Governance]
- **Const_Law:** `GREETING_MESSAGES` is `as const` — typed as readonly tuple.
- **Random_Law:** `getRandomGreeting()` returns a uniformly random element from the array.

### [Implementation Notes]
- Messages: `"¿Qué quieres descubrir hoy?"`, `"¿En qué te puedo ayudar?"`, `"¿A dónde quieres ir?"`, `"Estoy aquí para guiarte."`, `"¿Listo para explorar la isla?"`, `"Cuéntame, ¿qué buscas?"`

### [Semantic Hash]
Six rotating Spanish greeting prompts for the chat welcome screen. Used by `ChatContainer` to display a random greeting on initial load.

### [Linkage]
- **Downstream:** `@/components/chat/ChatContainer`
