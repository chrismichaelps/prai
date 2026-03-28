---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/next.hash.md"
---

## @UI.Chat.PersonalizationNestedView

### [Signatures]
```tsx
interface PersonalizationNestedViewProps {
  isOpen: boolean
  onClose: () => void
}

export function PersonalizationNestedView(props: PersonalizationNestedViewProps): JSX.Element | null
```

### [Implementation Notes]
- Nested view within chat for quick personalization access
- Displays current personalization settings
- Allows editing base style and characteristics

### [Semantic Hash]
Nested view component for personalization within chat interface.

### [Linkage]
- **Upstream:** `@root/src/hooks/usePersonalization.ts`
- **Downstream:** `@root/src/components/chat/ChatContainer.tsx`