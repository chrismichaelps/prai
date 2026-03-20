---
Language: Next.js
Version: 16.x
Fidelity: 100% (Physical Disk Reference)
State_ID: BigInt(0x1)
LSP_Discovery_Root: "@root/node_modules/next/package.json"
Grammar_Lock: "@root/hashes/grammar/next.hash.md"
---

/** [Project].Grammar.NextJS - Linguistic DNA anchor for Next.js 16.x */

## [SDK_Discovery_Map]
/** === Top-Level Declaration Files (23 files) === */
/** @Ref: @root/node_modules/next/index.d.ts */
/** @Ref: @root/node_modules/next/app.d.ts */
/** @Ref: @root/node_modules/next/cache.d.ts */
/** @Ref: @root/node_modules/next/client.d.ts */
/** @Ref: @root/node_modules/next/constants.d.ts */
/** @Ref: @root/node_modules/next/document.d.ts */
/** @Ref: @root/node_modules/next/dynamic.d.ts */
/** @Ref: @root/node_modules/next/error.d.ts */
/** @Ref: @root/node_modules/next/form.d.ts */
/** @Ref: @root/node_modules/next/head.d.ts */
/** @Ref: @root/node_modules/next/headers.d.ts */
/** @Ref: @root/node_modules/next/image.d.ts */
/** @Ref: @root/node_modules/next/jest.d.ts */
/** @Ref: @root/node_modules/next/link.d.ts */
/** @Ref: @root/node_modules/next/navigation.d.ts */
/** @Ref: @root/node_modules/next/og.d.ts */
/** @Ref: @root/node_modules/next/root-params.d.ts */
/** @Ref: @root/node_modules/next/router.d.ts */
/** @Ref: @root/node_modules/next/script.d.ts */
/** @Ref: @root/node_modules/next/server.d.ts */
/** @Ref: @root/node_modules/next/types.d.ts */
/** @Ref: @root/node_modules/next/web-vitals.d.ts */
/** @Ref: @root/node_modules/next/babel.d.ts */

## [SDK_Imports / Namespaces]
```ts
// Navigation (client)
import { useRouter, usePathname, useSearchParams, useParams, useSelectedLayoutSegment, useSelectedLayoutSegments, redirect, permanentRedirect, notFound } from "next/navigation"
// Server
import { NextRequest, NextResponse, NextFetchEvent, NextMiddleware, MiddlewareConfig, userAgent, URLPattern, after, connection } from "next/server"
// Headers (server only — async in Next 15+)
import { cookies, headers, draftMode } from "next/headers"
// Cache
import { unstable_cache, revalidatePath, revalidateTag, updateTag, refresh, cacheLife, cacheTag, unstable_noStore } from "next/cache"
// Components
import Image from "next/image"
import Link from "next/link"
import Script from "next/script"
import dynamic from "next/dynamic"
import Form from "next/form"
// OG image generation
import { ImageResponse } from "next/og"
// Pages Router (legacy)
import { useRouter as usePagesRouter } from "next/router"
import Head from "next/head"
import type { GetServerSideProps, GetStaticProps, GetStaticPaths, NextPage, InferGetServerSidePropsType, InferGetStaticPropsType } from "next"
```

## [Core_Primitives]
```ts
// App Router file conventions (app.d.ts, types.d.ts)
// page.tsx     — route UI                export default function Page(props)
// layout.tsx   — shared UI wrapper       export default function Layout({ children })
// loading.tsx  — loading UI (Suspense)   export default function Loading()
// error.tsx    — error boundary          "use client"; export default function Error({ error, reset })
// not-found.tsx — 404 UI                 export default function NotFound()
// route.ts     — API endpoint            export async function GET/POST/PUT/DELETE(request)
// template.tsx — re-mounted layout       export default function Template({ children })
// default.tsx  — parallel route fallback
// global-error.tsx — root error boundary
// middleware.ts — edge middleware         export function middleware(request: NextRequest)

// Metadata API (app.d.ts)
export const metadata: Metadata = { title, description, openGraph, twitter, ... }
export async function generateMetadata({ params, searchParams }): Promise<Metadata>

// Route segment config
export const dynamic = "auto" | "force-dynamic" | "error" | "force-static"
export const revalidate = false | 0 | number
export const runtime = "nodejs" | "edge"
export const fetchCache = "auto" | "only-cache" | "force-cache" | "default-cache" | "only-no-store" | "force-no-store" | "default-no-store"

// Server Actions
"use server"
async function createPost(formData: FormData): Promise<void>

// "use cache" directive (Next.js 15+)
"use cache"
async function getCachedData() { "use cache"; cacheLife("hours"); cacheTag("data"); return fetch(...) }

// Page props (root-params.d.ts)
type PageProps = { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | string[]>> }
type LayoutProps = { children: ReactNode; params: Promise<{ slug: string }> }
type GenerateStaticParams = () => Promise<{ slug: string }[]>

// NextRequest / NextResponse (server.d.ts)
class NextRequest extends Request {
  nextUrl: NextURL
  cookies: RequestCookies
  geo?: { city, country, region, latitude, longitude }
  ip?: string
}
class NextResponse extends Response {
  static json(body, init?): NextResponse
  static redirect(url, status?): NextResponse
  static rewrite(destination): NextResponse
  static next(init?): NextResponse
  cookies: ResponseCookies
}
```

## [Architectural_Laws]
- **Export_Law**: Pages and layouts are default exports. Server actions use `"use server"` directive. Route handlers export named HTTP methods. Metadata exported as `const metadata` or `generateMetadata()` function.
- **Transformation_Law**: By default components are Server Components. Add `"use client"` directive at file top for client components. Server ↔ Client boundary: pass serializable props only. Data fetching happens in Server Components or Route Handlers.
- **Propagation_Law**: Use `notFound()` for 404. Use `redirect()` / `permanentRedirect()` for navigation from server. Use `error.tsx` for route-level error boundaries. Use `revalidatePath()` / `revalidateTag()` for cache invalidation.

## [Syntax_Rules] | [Naming_Conventions]
- kebab-case: route directories (`/app/blog-posts/[slug]/page.tsx`)
- PascalCase: component files can be either PascalCase or lowercase (Next.js convention uses lowercase)
- File conventions: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `route.ts`
- `(group)` parenthesized directories: route groups (no URL segment)
- `@folder`: parallel routes (named slots)
- `[param]`: dynamic segments; `[...slug]`: catch-all; `[[...slug]]`: optional catch-all

## [Prohibited_Patterns]
- NO `getServerSideProps` / `getStaticProps` in App Router — use Server Components + fetch
- NO `useRouter().push()` in Server Components — use `redirect()`
- NO client-side `fetch` for initial data — fetch in Server Components
- NO `"use client"` on server-only files (with secrets/DB access)
- NO `window` / `document` in Server Components
- NO mutable state in Server Components — they don't re-render

## [Deprecated_Definitions]
```ts
// @deprecated Pages Router APIs (still functional but legacy) — router.d.ts, document.d.ts, head.d.ts
import { useRouter } from "next/router"     // use "next/navigation" instead
import Head from "next/head"                 // use Metadata API instead
import Document from "next/document"          // use root layout.tsx instead

// @deprecated Data fetching (Pages Router)
export const getServerSideProps: GetServerSideProps  // use Server Components
export const getStaticProps: GetStaticProps           // use Server Components
export const getStaticPaths: GetStaticPaths           // use generateStaticParams

// @deprecated NextPage type
type NextPage<P = {}> = React.FC<P>           // use typed function components

// @deprecated next/babel — babel.d.ts
// Replaced by SWC/Turbopack compilation
```

## [Standard_Library_Signatures]
```ts
// Navigation hooks (navigation.d.ts — client only)
useRouter(): AppRouterInstance  // { push, replace, refresh, prefetch, back, forward }
usePathname(): string
useSearchParams(): ReadonlyURLSearchParams
useParams(): Record<string, string | string[]>
useSelectedLayoutSegment(parallelRoutesKey?): string | null
useSelectedLayoutSegments(parallelRoutesKey?): string[]

// Server functions (headers.d.ts — async in Next 15+)
cookies(): Promise<ReadonlyRequestCookies>   // .get(), .getAll(), .has(), .set(), .delete()
headers(): Promise<ReadonlyHeaders>           // .get(), .getAll(), .has()
draftMode(): Promise<{ isEnabled: boolean; enable(); disable() }>

// Cache (cache.d.ts)
revalidatePath(path: string, type?: "page" | "layout"): void
revalidateTag(tag: string): void
updateTag(tag: string): void                 // Next 16+
refresh(): void                               // client cache refresh
unstable_cache<T>(fn: (...args) => Promise<T>, keyParts?: string[], options?: { revalidate?: number; tags?: string[] }): (...args) => Promise<T>

// Cache directives ("use cache" — Next 15+)
cacheLife(profile: "default" | "seconds" | "minutes" | "hours" | "days" | "weeks" | "max"): void
cacheLife(profile: { stale?: number; revalidate?: number; expire?: number }): void
cacheTag(...tags: string[]): void             // associate cache entry with tags

// Server utilities (server.d.ts)
after(callback: () => void | Promise<void>): void   // Run after response (background tasks)
connection(): Promise<void>                          // Wait for connection (opt out of prerendering)
URLPattern                                           // URL pattern matching (Edge Runtime)

// Image (image.d.ts)
<Image src={string | StaticImport} alt={string} width={number} height={number} fill? priority? quality? placeholder? blurDataURL? sizes? loading? />

// Link (link.d.ts)
<Link href={string | UrlObject} prefetch? replace? scroll? />

// Script (script.d.ts)
<Script src={string} strategy={"beforeInteractive" | "afterInteractive" | "lazyOnload" | "worker"} />

// Dynamic imports (dynamic.d.ts)
const Component = dynamic(() => import("./Component"), { loading: () => <Skeleton />, ssr: false })

// Form (form.d.ts) — Next.js 15+
<Form action={string | ServerAction} replace? scroll? />

// OG Image (og.d.ts)
new ImageResponse(element: JSX.Element, options?: { width, height, fonts, emoji, debug })

// Middleware (server.d.ts)
export function middleware(request: NextRequest): NextResponse | Response | void
export const config: MiddlewareConfig = { matcher: ["/api/:path*", "/dashboard/:path*"] }
```

## [Tactical_Patterns]
### "use cache" Pattern (Next.js 15+)
- Use `"use cache"` directive at file or function level for server-side caching.
- Use `cacheLife("hours")` to define cache lifetime profiles.
- Use `cacheTag("tag")` to tag entries for targeted `revalidateTag()` invalidation.

### Server Actions Pattern
- Create in separate `"use server"` file. Call from client via `<form action={serverAction}>` or `useActionState()`.
- Always validate input with Zod. Return `{ error }` pattern for client feedback.

### Streaming Pattern
- Wrap async components in `<Suspense fallback={<Loading/>}>` for streaming.
- Use `loading.tsx` for route-level loading states.
- Use `after()` for post-response background work (analytics, logging).

### Parallel & Intercepting Routes
- `@slot` named slots for parallel rendering. `(.)folder` for intercepting routes.
- Use `default.tsx` for unmatched parallel route fallbacks.