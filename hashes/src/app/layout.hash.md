---
State_ID: BigInt(0x0fc98cc)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @App.RootLayout

### [Signatures]
```ts
export const metadata: Metadata
export const viewport: Viewport
export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element
```

### [Governance]
- **SEO_Law:** Enforces global Next.js Metadata and Viewport configuration, establishing baseline PR\\AI branding, OpenGraph, and Twitter tags for social sharing.
- **Provider_Stack_Law:** Establishes the strict hierarchical order of global context providers:
  1. `<Providers>` (Redux/Query Client)
  2. `<I18nProvider>` (Language context)
  3. `<BuildInfoProvider>` (Version tracking)
  4. `<ToastProvider>` (Notifications)
  5. `<AuthProvider>` (Supabase identity)
- **Global_UI_Law:** Mounts application-wide non-routed overlay components: `<CookieBanner>`, `<ModelInfoBanner>`, and `<ErrorToast>`.

### [Semantic Hash]
The absolute root Next.js layout boundary. It wraps the entire component tree in necessary Effect-driven providers and global state contexts while injecting structural HTML/Body tags.

### [Linkage]
- **Dependencies:** `@/components/Providers`, `@/lib/effect/I18nProvider`, `@/lib/effect/hooks/useBuildInfo`, `@/components/ui/CookieBanner`, `@/components/ui/ModelInfoBanner`, `@/components/ui/ErrorToast`, `@/components/ui/ToastProvider`, `@/contexts/AuthContext`
