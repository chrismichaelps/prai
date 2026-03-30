import { Effect, Layer, ManagedRuntime } from "effect"
import { ConfigLayer, nextJsConfigProvider } from "@/lib/effect/runtime"
import { SeoService } from "@/lib/effect/services/Seo"
import { RobotsConstants, SeoPaths } from "@/lib/constants/app-constants"
import type { MetadataRoute } from "next"

export default async function robots(): Promise<MetadataRoute.Robots> {
  const SeoRuntimeLayer = SeoService.Default.pipe(
    Layer.provideMerge(ConfigLayer),
    Layer.provide(Layer.setConfigProvider(nextJsConfigProvider))
  )
  const isolatedRuntime = ManagedRuntime.make(SeoRuntimeLayer)

  return isolatedRuntime.runPromise(
    Effect.flatMap(SeoService, (service) => service.getRobotsConfig)
  ).catch(() => ({
    rules: {
      userAgent: RobotsConstants.USER_AGENT,
      allow: RobotsConstants.ALLOW_ROOT,
      disallow: [RobotsConstants.DISALLOW_API, RobotsConstants.DISALLOW_PROFILE, RobotsConstants.DISALLOW_AUTH],
    },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || ""}${SeoPaths.SITEMAP}`,
  }))
}
