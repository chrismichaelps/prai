---
State_ID: BigInt(0x0fc98cc)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Component.ToastProvider

### [Signatures]
```ts
export type ToastType = 'success' | 'error' | 'info'
export interface Toast { id: string; message: string; type: ToastType }
export const ToastContext: React.Context<ToastContextType | undefined>

export function ToastProvider(props: { children: React.ReactNode }): JSX.Element
export function useToast(): ToastContextType
```

### [Governance]
- **UI_Consistency_Law:** Success and info state indicators MUST align with the global brand variable `--primary` defined in `globals.css` rather than explicit Tailwind greens.
- **Singleton_Provider:** Must tightly wrap the root `<Providers>` layout slice.
- **Animation_Lifecycle:** `framer-motion` `AnimatePresence` exclusively handles toast mount/unmount behaviors to prevent race conditions during React rendering.

### [Semantic Hash]
Provides a global notification context leveraging Framer Motion physics for smooth entrance/exit notifications (Success/Error/Info).

### [Linkage]
- **Dependencies:** `lucide-react`, `framer-motion`, `React.createContext`
