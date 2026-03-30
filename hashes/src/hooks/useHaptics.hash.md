---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Hook.Haptics

### [Signatures]
```ts
export type HapticType = "success" | "warning" | "error" | "light" | "medium" | "heavy" | "selection"

interface HapticsReturn {
  trigger: (type: HapticType) => void
  success: () => void
  warning: () => void
  error: () => void
  light: () => void
  medium: () => void
  heavy: () => void
  selection: () => void
}

export function useHaptics(): HapticsReturn
```

### [Governance]
- **Haptics_Law:** Wraps web-haptics library for mobile tactile feedback.

### [Semantic Hash]
Custom hook providing haptic feedback triggers for mobile interactions using web-haptics library.

### [Linkage]
- **Dependencies:** `web-haptics`
- **Downstream:** `@root/src/components/chat/ChatContainer.tsx`, `@root/src/components/chat/ChatSidebar.tsx`
