---
State_ID: BigInt(0x0fc98cc)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @App.Robots

### [Signatures]
```ts
export default async function robots(): Promise<MetadataRoute.Robots>
```

### [Governance]
- **Isolated_Runtime_Law:** To prevent global state leakage during Next.js static prerendering, `robots.ts` spins up a completely isolated Effect `ManagedRuntime` injected solely with `SeoService` and `ConfigLayer`.
- **Fault_Tolerance:** Enforces a `.catch()` fallback to a hardcoded robot configuration in the event that environment variables (like `NEXT_PUBLIC_SITE_URL`) drop during build phases.

### [Semantic Hash]
Dynamic SEO robots.txt generator. Bridges the functional Effect ecosystem with Next.js imperative Build routing via `runPromise`.

### [Linkage]
- **Dependencies:** `effect`, `@/lib/effect/runtime`, `@/lib/effect/services/Seo`, `next` (MetadataRoute)
