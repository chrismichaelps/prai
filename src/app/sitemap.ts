import { Effect, Layer, ManagedRuntime } from "effect"
import { ConfigLayer, nextJsConfigProvider } from "@/lib/effect/runtime"
import { SeoService } from "@/lib/effect/services/Seo"
import type { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const SeoRuntimeLayer = SeoService.Default.pipe(
    Layer.provideMerge(ConfigLayer),
    Layer.provide(Layer.setConfigProvider(nextJsConfigProvider))
  )
  const isolatedRuntime = ManagedRuntime.make(SeoRuntimeLayer)

  return isolatedRuntime.runPromise(
    Effect.flatMap(SeoService, (service) => service.getSitemapRoutes)
  )
}
