---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @UI.Component.ToastProvider

### [Signatures]
```ts
export function ToastProvider({ children }: React.PropsWithChildren<object>): React.ReactElement
export function useToast(): { showToast: (message: string, type?: 'success' | 'error') => void }
```

### [Governance]
- **Context_Law:** Uses React Context for toast state management.
- **Animation_Law:** Uses Framer Motion for smooth enter/exit animations.
- **AutoDismiss_Law:** Toasts auto-dismiss after 4 seconds.

### [Implementation Notes]
- **Styling:** Uses same glass-morphism style as CookieBanner (dark bg, blur, rounded).
- **Position:** Fixed bottom-right on desktop, bottom-center on mobile.
- **Types:** Supports `success` and `error` toast types with appropriate icons/colors.

### [Semantic Hash]
Provides toast notifications with cookie banner styling and Framer Motion animations.

### [Linkage]
- **Used by:** `@root/src/app/layout.tsx`
- **Children:** All app components
