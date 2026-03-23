---
State_ID: BigInt(0x0fc98cc)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @App.Sitemap

### [Signatures]
```ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap>
```

### [Governance]
- **Isolated_Runtime_Law:** Just like `robots.ts`, `sitemap.ts` boots a strictly isolated `ManagedRuntime` injected with `SeoService` and `ConfigLayer`.
- **Dynamic_Resolution:** The route relies entirely on `SeoService.getSitemapRoutes` to dynamically resolve all indexable URL paths recursively from the system structure.

### [Semantic Hash]
Dynamic `sitemap.xml` builder. Decouples SEO generation logic from Next.js by delegating route discovery entirely to the internal Effect service layer.

### [Linkage]
- **Dependencies:** `effect`, `@/lib/effect/runtime`, `@/lib/effect/services/Seo`, `next` (MetadataRoute)
