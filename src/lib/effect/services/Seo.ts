import { Effect } from "effect"
import { SeoError } from "../errors"
import { ConfigService } from "./Config"
import type { MetadataRoute } from "next"
import { AppConstants, SeoConstants, SeoPaths, RobotsConstants } from "@/lib/constants/app-constants"

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
        return AppConstants.DEV_URL
      }
      return config.siteUrl
    })

    return {
      getSitemapRoutes: Effect.gen(function* () {
        const baseUrl = yield* getBaseUrl

        const routes: Array<{ path: string, priority: number, changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' }> = [
          { path: "", priority: SeoConstants.PRIORITY.HOMEPAGE, changeFrequency: SeoConstants.CHANGE_FREQUENCY.DAILY },
          { path: "/chat", priority: SeoConstants.PRIORITY.HIGH, changeFrequency: SeoConstants.CHANGE_FREQUENCY.DAILY },
          { path: "/blog", priority: SeoConstants.PRIORITY.MEDIUM_HIGH, changeFrequency: SeoConstants.CHANGE_FREQUENCY.DAILY },
          { path: "/status", priority: SeoConstants.PRIORITY.MEDIUM_HIGH, changeFrequency: SeoConstants.CHANGE_FREQUENCY.DAILY },
          { path: "/pricing", priority: SeoConstants.PRIORITY.MEDIUM_HIGH, changeFrequency: SeoConstants.CHANGE_FREQUENCY.WEEKLY },
          { path: "/releases", priority: SeoConstants.PRIORITY.MEDIUM_HIGH, changeFrequency: SeoConstants.CHANGE_FREQUENCY.WEEKLY },
          { path: "/about", priority: SeoConstants.PRIORITY.MEDIUM, changeFrequency: SeoConstants.CHANGE_FREQUENCY.WEEKLY },
          { path: "/usage", priority: SeoConstants.PRIORITY.MEDIUM_LOW, changeFrequency: SeoConstants.CHANGE_FREQUENCY.WEEKLY },
          { path: "/issues", priority: SeoConstants.PRIORITY.MEDIUM_LOW, changeFrequency: SeoConstants.CHANGE_FREQUENCY.WEEKLY },
          { path: "/legal/terms", priority: SeoConstants.PRIORITY.LOW, changeFrequency: SeoConstants.CHANGE_FREQUENCY.MONTHLY },
          { path: "/legal/privacy", priority: SeoConstants.PRIORITY.LOW, changeFrequency: SeoConstants.CHANGE_FREQUENCY.MONTHLY },
          { path: "/legal/cookies", priority: SeoConstants.PRIORITY.LOW, changeFrequency: SeoConstants.CHANGE_FREQUENCY.MONTHLY }
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
            userAgent: RobotsConstants.USER_AGENT,
            allow: RobotsConstants.ALLOW_ROOT,
            disallow: [RobotsConstants.DISALLOW_API, RobotsConstants.DISALLOW_PROFILE, RobotsConstants.DISALLOW_AUTH],
          },
          sitemap: `${baseUrl}${SeoPaths.SITEMAP}`,
        }
      }).pipe(
        Effect.catchAll((cause) => Effect.fail(new SeoError({ message: "Failed to generate robots config", cause })))
      )
    } as const
  })
}) { }
