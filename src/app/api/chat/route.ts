/** @Route.Chat.Completions */
import { NextResponse } from "next/server"
import { ValidationError, UnauthorizedError } from "../_lib/errors"
import { decodeBody, S, MessageRoleSchema } from "../_lib/validation"
import { exitResponse } from "../_lib/response"
import { HttpStatus } from "../_lib/constants/status-codes"
import { createClient } from "@/lib/supabase/server"
import { Effect, Exit, pipe } from "effect"
import { UsageDefaults } from "@/lib/effect/constants/UsageConstants"
import { SubscriptionTier, SubscriptionDefaults, TierModelConfig, WebSearchPlugins } from "@/lib/effect/constants/SubscriptionConstants"
import { getUserUsage } from "../user/usage/services/usage"
import { ChatDbError } from "../_lib/errors/services"
import type { SubscriptionTierType, ReasoningEffortType } from "@/lib/effect/constants/SubscriptionConstants"
import type { Database } from "@/types/database.types"

type UserUsage = Database["public"]["Functions"]["get_user_usage"]["Returns"][number]

type AuthResult = {
  userId: string
  canSend: boolean
  tier: SubscriptionTierType
  usage: Pick<UserUsage, 'messages_used' | 'messages_limit' | 'messages_remaining' | 'usage_percentage' | 'can_send'>
}

type ModelConfig = {
  default: string
  reasoning: { reasoningEffort: ReasoningEffortType }
}

const getModelConfig = (tier: SubscriptionTierType): ModelConfig => {
  const defaultModel = process.env.NEXT_PUBLIC_MODEL_NAME || ''
  const premiumModel = process.env.NEXT_PUBLIC_MODEL_NAME_PREMIUM || ''
  const isPremium = tier === SubscriptionTier.Pro && premiumModel
  return {
    default: isPremium ? premiumModel : defaultModel,
    reasoning: { reasoningEffort: TierModelConfig[tier].reasoningEffort }
  }
}

/** @Logic.Chat.GetAuthAndUsage */
const getAuthAndUsage = (): Effect.Effect<AuthResult, UnauthorizedError | ChatDbError> =>
  pipe(
    Effect.tryPromise({
      try: async () => {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
          return { user: null }
        }
        return { user }
      },
      catch: (_e) => new UnauthorizedError({ message: "Authentication failed" })
    }),
    Effect.flatMap(({ user }) => {
      if (!user) {
        return Effect.succeed({
          userId: "",
          canSend: true,
          tier: SubscriptionDefaults.tier,
          usage: { ...UsageDefaults }
        })
      }
      return pipe(
        getUserUsage(user.id),
        Effect.map((usage) => ({
          userId: user.id,
          canSend: usage.can_send,
          tier: (usage.subscription_tier as SubscriptionTierType) || SubscriptionDefaults.tier,
          usage: {
            messages_used: usage.messages_used,
            messages_limit: usage.messages_limit,
            messages_remaining: usage.messages_remaining,
            usage_percentage: usage.usage_percentage,
            can_send: usage.can_send
          }
        }))
      )
    })
  )

/** @Route.Chat.Completions.POST */
export async function POST(req: Request) {
  /** @Logic.Chat.AuthAndUsage */
  const authExit = await Effect.runPromiseExit(getAuthAndUsage())

  if (Exit.isFailure(authExit)) {
    return NextResponse.json(
      { error: "Failed to check usage" },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    )
  }

  const auth = authExit.value

  if (!auth.canSend) {
    return NextResponse.json(
      { 
        error: "Message limit reached",
        usage: auth.usage
      },
      { status: HttpStatus.FORBIDDEN }
    )
  }

  /** @Logic.Chat.StreamProgram */
  const { searchParams } = new URL(req.url)
  const program = pipe(
    decodeBody(
      S.Struct({
        messages: S.Array(
          S.Struct({
            role: MessageRoleSchema,
            content: S.String,
            name: S.optional(S.String)
          })
        ),
        model: S.optional(S.String),
        stream: S.optional(S.Boolean)
      })
    )(req),
    Effect.flatMap((params) => {
      /** @Logic.Chat.ModelResolution */
      const modelConfig = getModelConfig(auth.tier)
      const tierModel = modelConfig.default
      const model = params.model || tierModel

      const requestBody: Record<string, unknown> = {
        model,
        messages: params.messages,
        stream: params.stream ?? true,
        user: auth.userId || undefined,
        reasoning: {
          effort: modelConfig.reasoning.reasoningEffort
        }
      }

      /** @Logic.Chat.InjectPlugins */
      if (auth.tier === SubscriptionTier.Pro) {
        requestBody.plugins = WebSearchPlugins
      }

      /** @Logic.Chat.OpenRouterInvocation */
      return Effect.tryPromise({
        try: async () => {
          const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
              'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || '',
              'X-Title': 'PR\\AI Assistant',
            },
            body: JSON.stringify(requestBody),
          })

          if (!response.ok) {
            throw new Error('OpenRouter error')
          }

          /** @Logic.Chat.SyncUsageTracking */
          if (!(params.stream ?? true)) {
            const data = await response.json()
            const usageData = data.usage || {}
            const totalTokens = usageData.total_tokens || 0
            const cost = usageData.cost || 0

            if (auth.userId && totalTokens > 0) {
              try {
                await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/user/usage/increment`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    amount: 1,
                    tokens: totalTokens,
                    cost: cost
                  })
                })
              } catch {
                // Silent failure
              }
            }

            return NextResponse.json(data)
          }

          /** @Logic.Chat.StreamUsageTracking */
          const userId = auth.userId
          const responseBody = response.body
          
          if (!responseBody) {
            return new Response(null, { status: 500 })
          }

          const encoder = new TextEncoder()
          const decoder = new TextDecoder()
          let buffer = ''
          
          const transformStream = new ReadableStream({
            async start(controller) {
              const reader = responseBody.getReader()
              
              try {
                while (true) {
                  const { done, value } = await reader.read()
                  
                  if (done) {
                    if (buffer.length > 0 && userId) {
                      const lines = buffer.split('\n')
                      for (const line of lines) {
                        if (line.startsWith('data: ')) {
                          const data = line.slice(6)
                          if (data === '[DONE]') continue
                          try {
                            const parsed = JSON.parse(data)
                            if (parsed.usage) {
                              const totalTokens = parsed.usage.total_tokens || 0
                              const cost = parsed.usage.cost || 0
                              if (totalTokens > 0) {
                                fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/user/usage/increment`, {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ amount: 1, tokens: totalTokens, cost })
                                }).catch(() => { })
                              }
                            }
                          } catch { /* ignore parse errors */ }
                        }
                      }
                    }

                    // Fallback: track message after stream completes (for models that don't include usage in stream)
                    if (userId) {
                      setTimeout(() => {
                        fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/user/usage/increment`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ amount: 1, tokens: 0, cost: 0 })
                        }).catch(() => { })
                      }, 1000)
                    }
                    controller.close()
                    break
                  }
                  
                  buffer += decoder.decode(value, { stream: true })
                  const lines = buffer.split('\n')
                  buffer = lines.pop() || ''
                  
                  for (const line of lines) {
                    controller.enqueue(encoder.encode(line + '\n'))
                  }
                }
              } catch (error) {
                controller.error(error)
              }
            }
          })

          return new Response(transformStream, {
            headers: {
              'Content-Type': 'text/event-stream',
              'Cache-Control': 'no-cache',
              'Connection': 'keep-alive',
            },
          })
        },
        catch: (e) => new ValidationError({ message: String(e) })
      })
    })
  )

  /** @Logic.Effect.ExitResponse */
  return exitResponse((response: Response) => response, {
    spanName: "chat.completions",
    method: "POST",
    path: req.url,
    searchParams,
    payload: await req.clone().json().catch(() => undefined)
  })(program)
}
