import { Effect, Layer, ManagedRuntime } from "effect"
import { ConfigLayer, nextJsConfigProvider } from "@/lib/effect/runtime"
import { SeoService } from "@/lib/effect/services/Seo"
import type { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const SeoRuntimeLayer = SeoService.Default.pipe(
      Layer.provideMerge(ConfigLayer),
      Layer.provide(Layer.setConfigProvider(nextJsConfigProvider))
    )
    const isolatedRuntime = ManagedRuntime.make(SeoRuntimeLayer)

    return isolatedRuntime.runPromise(
      Effect.flatMap(SeoService, (service) => service.getSitemapRoutes)
    )
  } catch {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://prai-tourism.com"
    return [
      { url: siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
      { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
      { url: `${siteUrl}/chat`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    ]
  }
}
