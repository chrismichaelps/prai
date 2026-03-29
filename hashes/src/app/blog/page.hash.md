---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/next.hash.md"
---

## @Page.Blog

### [Signatures]
```ts
export default async function BlogPage(): Promise<JSX.Element>
```

### [Governance]
- **Preload_Law:** Fetches all posts for both languages on the server.
- **Component_Law:** delegates rendering to `BlogList`.

### [Semantic Hash]
The main entry point for the blog. It serves as a static container that pre-fetches the entire blog index for both English and Spanish locales.

### [Linkage]
- **Upstream:** `resolveAllPosts` (Blog Service)
- **Downstream:** `BlogList` component
