---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/next.hash.md"
---

## @UI.Blog.List

### [Signatures]
```tsx
export function BlogList({ enPosts, esPosts }: BlogListProps): JSX.Element
```

### [Governance]
- **Layout_Law:** Horizontal, image-led list using `rounded-xl` and `aspect-square`.
- **Motion_Law:** Uses `framer-motion` for subtle entry animations.
- **I18n_Law:** Switches between `enPosts` and `esPosts` based on `useI18n().locale`.

### [Semantic Hash]
Client-side component that renders a list of blog articles. It handles high-performance language toggling by holding both localized lists in memory (passed from server).

### [Linkage]
- **Upstream:** `useI18n`, `PraiLogo`, `Header`, `Footer`
- **Downstream:** Individual `BlogItem` sub-components
