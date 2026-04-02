/** @Service.Effect.TokenEstimation */

import { Effect } from "effect"
import type { TokenEstimate } from "../../schemas/token/TokenEstimationSchema"
import { BYTES_PER_TOKEN, MESSAGE_ROLE_OVERHEAD_TOKENS } from "../../constants/token/CostConstants"
import { TokenEstimationError } from "../../errors"

/** @Logic.TokenEstimation.IsJsonLike */
const isJsonLike = (content: string): boolean =>
  (content.startsWith("{") && content.endsWith("}")) ||
  (content.startsWith("[") && content.endsWith("]"))

/** @Logic.TokenEstimation.GetBytesPerToken */
const getBytesPerToken = (content: string): number =>
  isJsonLike(content) ? BYTES_PER_TOKEN.json : BYTES_PER_TOKEN.text

/** @Logic.TokenEstimation.CountSync */
const countSync = (content: string): number => {
  const bytesPerToken = getBytesPerToken(content)
  return Math.ceil(content.length / bytesPerToken)
}

/** @Service.Effect.TokenEstimation.Class */
export class TokenEstimationService extends Effect.Service<TokenEstimationService>()("TokenEstimation", {
  effect: Effect.gen(function* () {
    const estimateTokens = (
      content: string
    ): Effect.Effect<TokenEstimate, TokenEstimationError> =>
      Effect.try({
        try: () => {
          const tokens = countSync(content)
          return { text: content, tokens, method: "rough" as const }
        },
        catch: (e) =>
          new TokenEstimationError({
            message: `Failed to estimate tokens: ${String(e)}`,
            cause: e
          })
      })

    const estimateTokenCount = (content: string): number => countSync(content)

    const estimateMessagesTokens = (
      messages: ReadonlyArray<{ readonly role: string; readonly content: string }>
    ): Effect.Effect<number, TokenEstimationError> =>
      Effect.try({
        try: () =>
          messages.reduce((total, msg) => {
            const contentTokens = countSync(msg.content)
            return total + contentTokens + MESSAGE_ROLE_OVERHEAD_TOKENS
          }, 0),
        catch: (e) =>
          new TokenEstimationError({
            message: `Failed to estimate message tokens: ${String(e)}`,
            cause: e
          })
      })

    return { estimateTokens, estimateTokenCount, estimateMessagesTokens } as const
  })
}) {}
