---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/effect.hash.md"
---

## @Service.Blog

### [Signatures]
```ts
export class BlogService extends Context.Tag("@Service/Blog")<
  BlogService,
  {
    readonly getAllPosts: (locale: Locale) => Effect.Effect<readonly BlogPost[], BlogError>
    readonly getPostBySlug: (
      slug: string,
      locale: Locale
    ) => Effect.Effect<BlogPost, BlogError>
  }
>() {}

export interface BlogPost {
  readonly slug: string
  readonly title: string
  readonly description: string
  readonly content: string
  readonly date: string
  readonly author: string
  readonly image?: string
  readonly tags: readonly string[]
}
```

### [Governance]
- **Storage_Law:** Content stored in `public/content/blog/{locale}/{slug}.mdx`.
- **Parsing_Law:** Uses `markdown-it` for body rendering and custom frontmatter parser.
- **Locale_Law:** Must provide `Locale` to all fetching operations to ensure correct directory resolution.
- **Mascot_Law:** The `cotorra.png` mascot is the default for general communications.

### [Semantic Hash]
Standardized blog service for managing localized markdown content. Handles dual-locale pre-fetching to support seamless client-side language switching without layout shifts or re-routing.

### [Linkage]
- **Upstream:** `FileSystem`, `Path` (via `@effect/platform`)
- **Downstream:** `src/app/blog/page.tsx`, `src/app/blog/[slug]/page.tsx`
