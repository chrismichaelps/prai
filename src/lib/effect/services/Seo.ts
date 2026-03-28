import { Effect } from "effect"
import { SeoError } from "../errors"
import { ConfigService } from "./Config"
import type { MetadataRoute } from "next"

export interface Seo {
  readonly getSitemapRoutes: Effect.Effect<MetadataRoute.Sitemap, SeoError, ConfigService>
  readonly getRobotsConfig: Effect.Effect<MetadataRoute.Robots, SeoError, ConfigService>
}

/** @Service.Effect.Seo */
export class SeoService extends Effect.Service<SeoService>()("Seo", {
  effect: Effect.gen(function* () {
    const config = yield* ConfigService

    const getBaseUrl = Effect.gen(function* () {
      if (process.env.NODE_ENV !== "production") {
        return "http://localhost:3000"
      }
      return config.siteUrl
    })

    return {
      getSitemapRoutes: Effect.gen(function* () {
        const baseUrl = yield* getBaseUrl

        const routes: Array<{ path: string, priority: number, changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' }> = [
          { path: "", priority: 1.0, changeFrequency: "daily" },
          { path: "/chat", priority: 0.9, changeFrequency: "daily" },
          { path: "/status", priority: 0.8, changeFrequency: "daily" },
          { path: "/pricing", priority: 0.8, changeFrequency: "weekly" },
          { path: "/releases", priority: 0.8, changeFrequency: "weekly" },
          { path: "/about", priority: 0.7, changeFrequency: "weekly" },
          { path: "/usage", priority: 0.6, changeFrequency: "weekly" },
          { path: "/issues", priority: 0.6, changeFrequency: "weekly" },
          { path: "/legal/terms", priority: 0.5, changeFrequency: "monthly" },
          { path: "/legal/privacy", priority: 0.5, changeFrequency: "monthly" },
          { path: "/legal/cookies", priority: 0.5, changeFrequency: "monthly" }
        ]

        return routes.map((route) => ({
          url: `${baseUrl}${route.path}`,
          lastModified: new Date(),
          changeFrequency: route.changeFrequency,
          priority: route.priority
        }))
      }).pipe(
        Effect.catchAll((cause) => Effect.fail(new SeoError({ message: "Failed to generate sitemap routes", cause })))
      ),

      getRobotsConfig: Effect.gen(function* () {
        const baseUrl = yield* getBaseUrl

        return {
          rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/api/", "/profile/", "/auth/"],
          },
          sitemap: `${baseUrl}/sitemap.xml`,
        }
      }).pipe(
        Effect.catchAll((cause) => Effect.fail(new SeoError({ message: "Failed to generate robots config", cause })))
      )
    } as const
  })
}) { }
