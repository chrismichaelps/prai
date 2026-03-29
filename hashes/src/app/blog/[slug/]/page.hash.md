---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/next.hash.md"
---

## @Page.Blog.Slug

### [Signatures]
```ts
export default async function BlogPostPage({ params }): Promise<JSX.Element>
```

### [Governance]
- **Static_Law:** Generates static params for all slugs found in the default locale.
- **Metadata_Law:** Static metadata is generated primarily in Spanish.

### [Semantic Hash]
Static route handler for individual blog posts. It resolves the content for both supported languages and passes it to the detail view.

### [Linkage]
- **Upstream:** `generateStaticParams`, `resolvePostBySlug`
- **Downstream:** `BlogPostView` component
