/** @Service.Effect.JinaSearch */

import { Effect, Data } from "effect"
import { JinaApi, JinaLimits } from "@/lib/effect/constants/JinaConstants"

/** @Type.Jina.Result */
export interface JinaSearchResult {
  readonly title: string
  readonly url: string
  readonly content: string
  readonly description: string
}

/** @Type.Jina.ApiResponse */
interface JinaApiResponse {
  code: number
  status: number
  data: Array<{
    title: string
    url: string
    content: string
    description: string
  }>
  usage: {
    tokens: number
  }
}

/** @Error.Jina.Search */
export class JinaSearchError extends Data.TaggedError("JinaSearchError")<{
  readonly message: string
  readonly status?: number
  readonly cause?: unknown
}> {}

/** @Logic.Jina.Search */
export const searchWeb = (
  query: string,
  apiKey: string
): Effect.Effect<{ results: JinaSearchResult[]; tokensUsed: number }, JinaSearchError> =>
  Effect.tryPromise({
    try: async () => {
      const searchUrl = new URL(JinaApi.BASE_URL)
      searchUrl.searchParams.set("q", query)
      searchUrl.searchParams.set("gl", JinaApi.GEO_COUNTRY_CODE)
      searchUrl.searchParams.set("hl", JinaApi.LANGUAGE_CODE)
      searchUrl.searchParams.set("location", JinaApi.SEARCH_LOCATION)
      searchUrl.searchParams.set("num", String(JinaLimits.MAX_RESULTS_PER_SEARCH))

      const res = await fetch(searchUrl.toString(), {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      })

      if (!res.ok) {
        throw new JinaSearchError({
          message: `Jina search failed: ${res.status}`,
          status: res.status,
        })
      }

      const data: JinaApiResponse = await res.json()

      const results: JinaSearchResult[] = (data.data ?? []).slice(0, JinaLimits.MAX_RESULTS_PER_SEARCH).map((r) => ({
        title: r.title ?? "",
        url: r.url ?? "",
        content: r.content ?? "",
        description: r.description ?? "",
      }))

      return { results, tokensUsed: data.usage?.tokens ?? JinaLimits.ESTIMATED_TOKENS_PER_SEARCH }
    },
    catch: (err) => {
      if (err instanceof JinaSearchError) return err
      return new JinaSearchError({ message: String(err), cause: err })
    },
  })

const CONTENT_CHARS_PER_RESULT = 1_500

/** @Logic.Jina.IsRootUrl */
const isRootUrl = (url: string): boolean => {
  try { return new URL(url).pathname.length <= 1 } catch { return true }
}

/** @Logic.Jina.FormatResults */
export const formatJinaResults = (results: JinaSearchResult[]): string => {
  if (results.length === 0) return "No se encontraron resultados en la web."
  return results
    .map((r, i) => {
      const body = (r.content || r.description).slice(0, CONTENT_CHARS_PER_RESULT)
      const urlLabel = isRootUrl(r.url) ? `Sitio web: ${r.url}` : `Artículo: ${r.url}`
      return `[${i + 1}] ${r.title}\n${urlLabel}\n${body}`
    })
    .join("\n\n---\n\n")
}
