---
State_ID: BigInt(0x0fc98cc)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Route.Chat.Main

### [Signatures]
```ts
export default function ChatPage(): JSX.Element
```

### [Governance]
- **ClientOnly_Law:** Bounded by React `'use client'` interactive context.
- **Authentication_Gate:** Tightly wrapped within `<ProtectedRoute redirectTo="/">`. It is physically impossible to mount the Chat UI without a verified Supabase session context.
- **Visual_Aesthetic_Lock:** Mandates the exact mathematical rendering of the "Ambient Glow" (`radial-gradient`), ensuring the UI matches the premium UI specifications at the highest level node.
- **Height_Constraint:** Enforces `100vh` boundaries (`h-screen overflow-hidden`) to guarantee the chat scrolling relies on internal layout components (`ChatContainer`) rather than window scrolling.

### [Semantic Hash]
The core authenticated gateway into the AI interface. It provides universal structure (Header), strict Route protection, and the foundational aesthetic ambient lighting.

### [Linkage]
- **Dependencies:** `react`, `@/components/layout/Header`, `@/components/chat/ChatContainer`, `@/components/auth/ProtectedRoute`
