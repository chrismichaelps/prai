---
State_ID: BigInt(0x2)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @UI.Component.ErrorToast

### [Signatures]
```ts
export function ErrorToast(): React.ReactElement
```

### [Governance]
- **Component_Law:** `"use client"` directive required. Uses Framer Motion `AnimatePresence` + `motion.div` for toast animation. Redux `useAppSelector` / `useAppDispatch` for state.
- **AutoClose_Law:** Toast auto-closes after 8 seconds via `useEffect`.
- **ErrorMapping_Law:** Error code mapped to i18n key `error.api.{code}` (e.g., `error.api.429`). Falls back to `error.message` or `error.api.unknown`.

### [Implementation Notes]
- **State Source:** `apiError` from Redux `ui.apiError` slice.
- **Z-Index:** Uses `z-[120]` to appear above ModelInfoBanner (`z-[100]`) and SourcesSidebar (`z-[110]`).
- **Color Scheme:** Matches input search styling with neutral colors (`bg-[#1a1a1a]`, `border-white/[0.08]`, `text-white/60`). No red accents or error codes displayed — only user-friendly i18n message.
- **Layout:** Pill-shaped `rounded-[1.5rem]` container with icon, message, and close button.
- **Linkage:** Imported and rendered in `@root/src/app/layout.tsx`.
