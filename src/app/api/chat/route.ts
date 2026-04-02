/** @Route.Chat.Completions */
import { NextResponse } from "next/server"
import { ValidationError, UnauthorizedError } from "../_lib/errors"
import { decodeBody, S, MessageRoleSchema } from "../_lib/validation"
import { exitResponse } from "../_lib/response"
import { HttpStatus } from "../_lib/constants/status-codes"
import { createClient } from "@/lib/supabase/server"
import type { SupabaseClient } from "@supabase/supabase-js"
import { Effect, Exit, pipe } from "effect"
import { UsageDefaults } from "@/lib/effect/constants/UsageConstants"
import { SubscriptionTier, SubscriptionDefaults, TierModelConfig, WebSearchTool } from "@/lib/effect/constants/SubscriptionConstants"
import { getUserUsage } from "../user/usage/services/usage"
import { ChatDbError } from "../_lib/errors/services"
import { ApiConstants, CacheControlConstants, SSEConstants } from "@/lib/constants/app-constants"
import type { SubscriptionTierType, ReasoningEffortType } from "@/lib/effect/constants/SubscriptionConstants"
import type { Database } from "@/types/database.types"
import { toolsToOpenRouter, executeTool, validateToolInput, isReadOnlyTool } from "@/lib/effect/services/tools"
import { runtime } from "@/lib/effect/runtime"
import { CompactionService } from "@/lib/effect/services/compaction"
import { SessionMemoryService } from "@/lib/effect/services/memory"
import { SkillsService } from "@/lib/effect/services/skills"
import { CostTrackerService } from "@/lib/effect/services/token"

type UserUsage = Database["public"]["Functions"]["get_user_usage"]["Returns"][number]

type AuthResult = {
  userId: string
  canSend: boolean
  tier: SubscriptionTierType
  usage: Pick<UserUsage, 'messages_used' | 'messages_limit' | 'messages_remaining' | 'usage_percentage' | 'can_send'>
  supabaseClient: SupabaseClient
}

type ModelConfig = {
  default: string
  reasoning: { reasoningEffort: ReasoningEffortType }
}

/** @Logic.Chat.GetModelConfig */
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
          return { user: null, supabaseClient: supabase }
        }
        return { user, supabaseClient: supabase }
      },
      catch: () => new UnauthorizedError({ message: "Authentication failed" })
    }),
    Effect.flatMap(({ user, supabaseClient }) => {
      if (!user) {
        return Effect.succeed({
          userId: "",
          canSend: true,
          tier: SubscriptionDefaults.tier,
          usage: { ...UsageDefaults },
          supabaseClient
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
          },
          supabaseClient
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


  /** @Logic.Chat.ToolCalling.AgenticLoop */
  const AGENTIC_TIMEOUT_MS = 60000
  const MAX_TOOL_ITERATIONS = 5
  const TOOL_EXECUTION_TIMEOUT_MS = 30000

  type AgentMessage = { role: string; content: string; name?: string; tool_calls?: unknown[] }

  /** @Logic.Chat.FetchWithRetry */
  const fetchWithRetry = async (url: string, options: RequestInit, maxRetries = 3): Promise<Response> => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const resp = await fetch(url, options)
      if (resp.status !== 429) return resp
      const retryAfter = resp.headers.get('retry-after')
      const delayMs = retryAfter
        ? parseInt(retryAfter, 10) * 1000
        : Math.min(2000 * Math.pow(2, attempt), 30000)
      await new Promise<void>(r => setTimeout(r, delayMs))
    }
    return fetch(url, options)
  }

  /** @Logic.Chat.PreFlight.MemoryAndSkills */
  const runPreflight = async (
    messages: AgentMessage[],
    supabaseClient: SupabaseClient,
    userId: string
  ): Promise<string> =>
    runtime.runPromise(
      Effect.gen(function* () {
        const skills = yield* SkillsService
        const memory = yield* SessionMemoryService

        const lastUserMsg = [...messages].reverse().find(m => m.role === "user")?.content || ""
        let systemPromptInsert = ""

        const match = yield* skills.matchSkill(lastUserMsg)
        if (match) {
          systemPromptInsert += skills.buildSkillPrompt(match) + "\n\n"
        }

        const hydrated = yield* memory.loadFromSupabase(supabaseClient, userId)

        const newMemories = yield* memory.extractMemories(messages)
        if (newMemories.length > 0) {
          yield* memory.storeMemories(newMemories)
          yield* Effect.asVoid(memory.persistToSupabase(supabaseClient, userId, newMemories))
        }

        const memoryPrompt = memory.buildMemoryPrompt(hydrated)
        if (memoryPrompt) {
          systemPromptInsert += memoryPrompt + "\n\n"
        }
        return systemPromptInsert
      })
    )

  /** @Logic.Chat.ApplyPreflight */
  const applyPreflight = (messages: AgentMessage[], preflight: string): AgentMessage[] => {
    if (!preflight.trim()) return messages
    const systemMsgIndex = messages.findIndex(m => m.role === "system")
    if (systemMsgIndex >= 0) {
      const existing = messages[systemMsgIndex]
      if (existing) {
        const updated = [...messages]
        updated[systemMsgIndex] = {
          ...existing,
          role: existing.role || "system",
          content: (existing.content || "") + "\n\n" + preflight
        }
        return updated
      }
    }
    return [{ role: "system", content: preflight }, ...messages]
  }

  /** @Logic.Chat.RunStreamingAgenticLoop */
  async function runStreamingAgenticLoop(
    initialMessages: AgentMessage[],
    userId: string,
    tier: SubscriptionTierType,
    supabaseClient: SupabaseClient,
    onChunk: (_chunk: string) => void
  ): Promise<{ success: boolean; error?: string }> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), AGENTIC_TIMEOUT_MS)

    const buildRequestBody = (msgs: typeof initialMessages) => {
      const tools = [
        ...(tier === SubscriptionTier.Pro ? [WebSearchTool] : []),
        ...(toolsToOpenRouter() as unknown[])
      ]
      const body = {
        model: getModelConfig(tier).default,
        messages: msgs,
        stream: true,
        user: userId || undefined,
        reasoning: { effort: getModelConfig(tier).reasoning.reasoningEffort },
        tools
      }
      return body
    }

    try {
      const preflight = await runPreflight(initialMessages, supabaseClient, userId)
      let messages = applyPreflight([...initialMessages], preflight)

      for (let i = 0; i < MAX_TOOL_ITERATIONS; i++) {

        /** @Logic.Chat.MicroCompaction */
        const compacted = await runtime.runPromise(
          Effect.gen(function* () {
            const compaction = yield* CompactionService
            return yield* compaction.microCompact(messages)
          })
        )
        const payloadMessages = compacted.messages

        const response = await fetchWithRetry(ApiConstants.OPENROUTER_CHAT_COMPLETIONS, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || '',
            'X-Title': 'PR\\AI Assistant',
          },
          body: JSON.stringify(buildRequestBody(payloadMessages)),
          signal: controller.signal
        })

        if (!response.ok) {
          return { success: false, error: `OpenRouter error: ${response.status}` }
        }

        const streamBody = response.body
        if (!streamBody) {
          return { success: false, error: "No stream body" }
        }

        const decoder = new TextDecoder()
        const reader = streamBody.getReader()
        let buffer = ''
        type MergedToolCall = { id: string; type: string; function: { name: string; arguments: string } }
        const toolCallMap = new Map<number, MergedToolCall>()
        let hasToolCalls = false

        while (true) {
          const { done, value } = await reader.read()

          if (done) {
            if (buffer.length > 0) {
              onChunk(buffer)
            }
            break
          }

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (!line.startsWith(SSEConstants.DATA_PREFIX)) {
              onChunk(line + '\n')
              continue
            }

            const data = line.slice(SSEConstants.DATA_PREFIX.length)
            if (data === SSEConstants.DONE) continue

            try {
              const parsed = JSON.parse(data)
              const delta = parsed.choices?.[0]?.delta

              if (delta?.tool_calls) {
                hasToolCalls = true
                for (const tc of delta.tool_calls as Array<{ index?: number; id?: string; type?: string; function?: { name?: string; arguments?: string } }>) {
                  const idx = tc.index ?? 0
                  const existing = toolCallMap.get(idx)
                  if (!existing) {
                    toolCallMap.set(idx, {
                      id: tc.id ?? '',
                      type: tc.type ?? 'function',
                      function: { name: tc.function?.name ?? '', arguments: tc.function?.arguments ?? '' }
                    })
                  } else {
                    toolCallMap.set(idx, {
                      ...existing,
                      function: {
                        ...existing.function,
                        arguments: existing.function.arguments + (tc.function?.arguments ?? '')
                      }
                    })
                  }
                }
                onChunk(line + '\n')
              }

              const hasAnnotations = Array.isArray(delta?.annotations) && (delta.annotations as unknown[]).length > 0
              if (delta?.content || hasAnnotations) {
                onChunk(line + '\n')
              }

              if (parsed.usage) {
                await runtime.runPromise(
                  Effect.gen(function* () {
                    const costTracker = yield* CostTrackerService
                    yield* costTracker.recordUsage(getModelConfig(tier).default, {
                      input_tokens: parsed.usage.prompt_tokens,
                      output_tokens: parsed.usage.completion_tokens
                    })
                  }).pipe(Effect.catchAll(() => Effect.succeed({})))
                )
              }
            } catch {
              onChunk(line + '\n')
            }
          }
        }

        const mergedToolCalls = [...toolCallMap.values()]

        if (!hasToolCalls || mergedToolCalls.length === 0) {
          clearTimeout(timeoutId)
          return { success: true }
        }

        const toolMessages: { role: string; tool_call_id: string; name: string; content: string }[] = []

        for (const tc of mergedToolCalls) {
          const { id, function: fn } = tc
          const toolName = fn.name

          if (!toolName) {
            continue
          }

          let args = {}
          try {
            if (fn.arguments && fn.arguments.trim() && fn.arguments.trim() !== "{}") {
              args = JSON.parse(fn.arguments)
            } else {
              toolMessages.push({
                role: "tool",
                tool_call_id: id,
                name: toolName,
                content: JSON.stringify({ error: "Invalid tool arguments" })
              })
              continue
            }
          } catch {
            toolMessages.push({
              role: "tool",
              tool_call_id: id,
              name: toolName,
              content: JSON.stringify({ error: "Invalid tool arguments" })
            })
            continue
          }

          const validation = validateToolInput(toolName, args)
          let toolResult: string

          if (!validation.success) {
            toolResult = JSON.stringify({ error: validation.error })
          } else {
            try {
              const execResult = await Effect.runPromise(
                Effect.timeout(executeTool(toolName, validation.parsed || args), TOOL_EXECUTION_TIMEOUT_MS)
              )
              toolResult = execResult
            } catch (execError) {
              toolResult = JSON.stringify({ error: `Tool execution failed: ${String(execError)}` })
            }
          }

          toolMessages.push({
            role: "tool",
            tool_call_id: id,
            name: toolName,
            content: toolResult
          })
        }

        messages = [
          ...messages,
          { role: "assistant", content: "", tool_calls: mergedToolCalls },
          ...toolMessages
        ]
      }

      clearTimeout(timeoutId)
      return { success: true }
    } catch (error) {
      clearTimeout(timeoutId)
      const isAbort = error instanceof DOMException && error.name === 'AbortError'
      return { success: false, error: isAbort ? "Request timeout" : String(error) }
    }
  }

  const runAgenticLoop = async (
    initialMessages: AgentMessage[],
    userId: string,
    tier: SubscriptionTierType,
    supabaseClient: SupabaseClient
  ): Promise<{ success: boolean; data?: unknown; error?: string }> => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), AGENTIC_TIMEOUT_MS)

    try {
      const buildRequestBody = (msgs: typeof initialMessages) => ({
        model: getModelConfig(tier).default,
        messages: msgs,
        stream: false,
        user: userId || undefined,
        reasoning: {
          effort: getModelConfig(tier).reasoning.reasoningEffort
        },
        tools: [
          ...(tier === SubscriptionTier.Pro ? [WebSearchTool] : []),
          ...(toolsToOpenRouter() as unknown[])
        ]
      })

      const preflight = await runPreflight(initialMessages, supabaseClient, userId)
      let messages = applyPreflight([...initialMessages], preflight)

      for (let i = 0; i < MAX_TOOL_ITERATIONS; i++) {

        /** @Logic.Chat.MicroCompaction */
        const compacted = await runtime.runPromise(
          Effect.gen(function* () {
            const compaction = yield* CompactionService
            return yield* compaction.microCompact(messages)
          })
        )
        const payloadMessages = compacted.messages

        const response = await fetchWithRetry(ApiConstants.OPENROUTER_CHAT_COMPLETIONS, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || '',
            'X-Title': 'PR\\AI Assistant',
          },
          body: JSON.stringify(buildRequestBody(payloadMessages)),
          signal: controller.signal
        })

        if (!response.ok) {
          return { success: false, error: `OpenRouter error: ${response.status}` }
        }

        const data = await response.json()
        const assistantMessage = data.choices?.[0]?.message

        if (data.usage) {
          await runtime.runPromise(
            Effect.gen(function* () {
              const costTracker = yield* CostTrackerService
              yield* costTracker.recordUsage(getModelConfig(tier).default, {
                input_tokens: data.usage.prompt_tokens,
                output_tokens: data.usage.completion_tokens
              })
            }).pipe(Effect.catchAll(() => Effect.succeed({})))
          )
        }

        if (!assistantMessage) {
          return { success: true, data }
        }

        const toolCalls = assistantMessage.tool_calls || []

        if (toolCalls.length === 0) {
          return { success: true, data }
        }

        const toolMessages: { role: string; tool_call_id: string; name: string; content: string }[] = []

        const parsedToolCalls: Array<{ id: string; name: string; args: Record<string, unknown> }> = []
        for (const tc of toolCalls) {
          const { id, function: fn } = tc as { id: string; function: { name: string; arguments: string } }
          try {
            const args = fn.arguments && fn.arguments.trim() ? JSON.parse(fn.arguments) : {}
            parsedToolCalls.push({ id, name: fn.name, args })
          } catch {
            parsedToolCalls.push({ id, name: fn.name, args: {} })
          }
        }

        const readOnlyCalls = parsedToolCalls.filter((tc: { name: string }) => isReadOnlyTool(tc.name))
        const writeCalls = parsedToolCalls.filter((tc: { name: string }) => !isReadOnlyTool(tc.name))

        const executeToolCall = async (id: string, toolName: string, args: Record<string, unknown>): Promise<string> => {
          const validation = validateToolInput(toolName, args)
          if (!validation.success) {
            return JSON.stringify({ error: validation.error })
          }
          try {
            const execResult = await Effect.runPromise(
              Effect.timeout(executeTool(toolName, validation.parsed || args), TOOL_EXECUTION_TIMEOUT_MS)
            )
            return execResult
          } catch (execError) {
            return JSON.stringify({ error: `Tool execution failed: ${String(execError)}` })
          }
        }

        if (readOnlyCalls.length > 0) {
          const readOnlyResults = await Promise.all(
            readOnlyCalls.map(async (tc: { id: string; name: string; args: Record<string, unknown> }) => {
              const result = await executeToolCall(tc.id, tc.name, tc.args)
              return { id: tc.id, name: tc.name, content: result }
            })
          )
          toolMessages.push(...readOnlyResults.map(r => ({
            role: "tool" as const,
            tool_call_id: r.id,
            name: r.name,
            content: r.content
          })))
        }

        for (const tc of writeCalls) {
          const result = await executeToolCall(tc.id, tc.name, tc.args)
          toolMessages.push({
            role: "tool",
            tool_call_id: tc.id,
            name: tc.name,
            content: result
          })
        }

        messages = [
          ...messages,
          { role: "assistant", content: assistantMessage.content || "", tool_calls: toolCalls },
          ...toolMessages
        ]
      }

      return { success: false, error: "Max tool iterations reached" }

    } catch (error) {
      const isAbort = error instanceof DOMException && error.name === 'AbortError'
      return { success: false, error: isAbort ? "Request timeout" : String(error) }
    } finally {
      clearTimeout(timeoutId)
    }
  }

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
      /** @Logic.Chat.OpenRouterInvocation */
      return Effect.tryPromise({
        try: async () => {
          const isStreaming = params.stream ?? true

          if (!isStreaming) {
            const result = await runAgenticLoop([...params.messages], auth.userId, auth.tier, auth.supabaseClient)
            const usageData = result.data && typeof result.data === 'object' ? (result.data as { usage?: { total_tokens?: number; cost?: number } }).usage || {} : {}
            const totalTokens = usageData.total_tokens || 0
            const cost = usageData.cost || 0

            if (auth.userId && totalTokens > 0) {
              try {
                await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/user/usage/increment`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ amount: 1, tokens: totalTokens, cost })
                })
              } catch { /** @Logic.Chat.SilentFailure */ }
            }

            return result.success
              ? NextResponse.json(result.data)
              : NextResponse.json({ error: result.error }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
          }

          const initialMessages = [...params.messages]

          const encoder = new TextEncoder()

          const transformStream = new ReadableStream({
            async start(controller) {
              try {
                const onChunk = (chunk: string) => {
                  try {
                    controller.enqueue(encoder.encode(chunk))
                  } catch { /*  */ }
                }

                const result = await runStreamingAgenticLoop(
                  initialMessages,
                  auth.userId,
                  auth.tier,
                  auth.supabaseClient,
                  onChunk
                )

                if (!result.success) {
                  const errorMessage = result.error || "Request failed"
                  onChunk(SSEConstants.DATA_PREFIX + JSON.stringify({
                    choices: [{ delta: { content: "" }, finish_reason: "stop", error: errorMessage }]
                  }) + '\n')
                }

                controller.enqueue(encoder.encode(SSEConstants.DATA_PREFIX + SSEConstants.DONE + '\n'))
                controller.close()
              } catch (error) {
                controller.error(error)
              }
            }
          })

          return new Response(transformStream, {
            headers: {
              'Content-Type': 'text/event-stream',
              'Cache-Control': CacheControlConstants.NO_CACHE_HEADER,
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
