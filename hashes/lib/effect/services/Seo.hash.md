---
Language: Architecture Registry
Fidelity: 100%
State_ID: BigInt(0x1)
---

/** @Service.Effect.Seo - Architectural grammar anchor for the SeoService Layer */

## [Layer.Definition]
- **Service**: `SeoService`
- **Dependency**: `ConfigService`
- **Purpose**: Generates dynamic SEO configurations (`MetadataRoute.Sitemap` and `MetadataRoute.Robots`) using absolute environment-aware URLs without relying on raw `process.env`.
- **Error_Boundaries**: `SeoError`

## [Export.Contracts]
- `getSitemapRoutes`: Returns `MetadataRoute.Sitemap` derived from defined public routes.
- `getRobotsConfig`: Returns `MetadataRoute.Robots` containing crawling rules and the sitemap URL.

## [Grammar.Rules]
- MUST NOT use `any`.
- MUST construct URLs dynamically strictly via `ConfigService` `siteUrl` derived strictly from `NEXT_PUBLIC_SITE_URL` environment variables.
- **Runtime Isolation**: Next.js static Route Handlers (`sitemap.ts`, `robots.ts`) MUST construct and use lightweight, isolated `ManagedRuntime` contexts exclusively mapped to `SeoService.Default`. They MUST entirely bypass the global application `runtime.ts` `MainLayer`. This structurally safeguards the build generation trace from eagerly triggering full app API side-effects (e.g., `BuildInfoError`).
- Next.js callers (`sitemap.ts`, `robots.ts`) MUST safely catch routing failures and provide static secure defaults for crawler safety.
