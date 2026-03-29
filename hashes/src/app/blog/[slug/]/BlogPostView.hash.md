---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/next.hash.md"
---

## @UI.Blog.PostView

### [Signatures]
```tsx
export function BlogPostView({ enPost, esPost }: BlogPostViewProps): JSX.Element
```

### [Governance]
- **Banner_Law:** Large hero banner using `w-full h-auto` and `object-contain` to preserve artistic intent.
- **Markdown_Law:** Renders content via `markdown-it` with custom CSS targeting (`prose-invert`).
- **I18n_Law:** Real-time content switching based on `useI18n().locale`.

### [Semantic Hash]
The primary display component for a single blog post. It features a premium, focused reading experience with back-navigation, metadata display, and responsive hero banners.

### [Linkage]
- **Upstream:** `useI18n`, `MarkdownIt`, `Header`, `Footer`
- **Downstream:** None (terminal component)
