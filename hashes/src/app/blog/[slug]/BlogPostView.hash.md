---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @UI.Blog.PostView

### [Signatures]
```ts
export interface BlogPostViewProps {
  enPost: Post
  esPost: Post
}
export function BlogPostView({ enPost, esPost }: BlogPostViewProps): JSX.Element
```

### [Governance]
- **I18n_Law:** Accepts both English and Spanish post data, selects based on current locale.
- **Img_Law:** Uses native `<img>` for blog hero images with eslint-disable for Next.js img-element warning.

### [Semantic Hash]
Bilingual blog post view component. Renders hero image, title, content, and metadata from MDX-compiled post data.

### [Linkage]
- **Upstream:** MDX blog content pipeline
- **Downstream:** `@root/src/app/blog/[slug]/page.tsx`
