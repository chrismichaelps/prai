---
State_ID: BigInt(0x2)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @UI.Chat.SourcesSidebar

### [Signatures]
```ts
export const SourcesSidebar: React.FC
```

### [Governance]
- **Component_Law:** `"use client"` directive required. Uses Framer Motion `AnimatePresence` + `motion.aside` for slide-in animation. Redux `useAppSelector` / `useAppDispatch` for state.
- **Favicon_Law:** Source icons rendered as `<img>` with `onError` fallback to Globe icon. Globe icon always shown as overlay via `style.display = 'none'` on img error.

### [Implementation Notes]
- **Z-Index:** Uses `z-[110]` to appear above Header's `z-[100]`.
- **State Source:** `isSourcesOpen` and `selectedSources` from Redux `chat.chat` slice.
- **Domain Parsing:** Extracts domain via `new URL(source.url).hostname.replace('www.', '')` inside the render loop.
- **Linkage:** Dispatched by `closeSources` action on backdrop click and X button.
- **Empty State:** Shows `t('chat.no_sources')` when `selectedSources.sources.length === 0`.
- **Favicon Error Handling:** `onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}` — hides broken image, Globe icon remains visible.
