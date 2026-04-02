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

  const _buildRequestBody = (messages: { role: string; content: string; name?: string; tool_calls?: unknown[] }[]) => ({
    model: getModelConfig(auth.tier).default,
    messages,
    stream: false,
    user: auth.userId || undefined,
    reasoning: {
      effort: getModelConfig(auth.tier).reasoning.reasoningEffort
    },
    tools: toolsToOpenRouter(),
    ...(auth.tier === SubscriptionTier.Pro ? { plugins: WebSearchPlugins } : {})
  })

/** @Logic.Chat.ToolCalling.AgenticLoop */
const AGENTIC_TIMEOUT_MS = 60000
const MAX_TOOL_ITERATIONS = 5
const TOOL_EXECUTION_TIMEOUT_MS = 30000

/** @Logic.Chat.RunStreamingAgenticLoop */
async function runStreamingAgenticLoop(
  initialMessages: { role: string; content: string; name?: string; tool_calls?: unknown[] }[],
  userId: string,
  tier: SubscriptionTierType,
  onChunk: (chunk: string) => void
): Promise<{ success: boolean; error?: string }> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), AGENTIC_TIMEOUT_MS)

  const buildRequestBody = (msgs: typeof initialMessages) => ({
    model: getModelConfig(tier).default,
    messages: msgs,
    stream: true,
    user: userId || undefined,
    reasoning: { effort: getModelConfig(tier).reasoning.reasoningEffort },
    tools: toolsToOpenRouter(),
    ...(tier === SubscriptionTier.Pro ? { plugins: WebSearchPlugins } : {})
  })

  try {
    let messages = [...initialMessages]

    /** @Logic.Chat.PreFlight.MemoryAndSkills */
    const preflight = await runtime.runPromise(
      Effect.gen(function* () {
        const skills = yield* SkillsService
        const memory = yield* SessionMemoryService
        
        const lastUserMsg = [...messages].reverse().find(m => m.role === "user")?.content || ""
        let systemPromptInsert = ""
        
        const match = yield* skills.matchSkill(lastUserMsg)
        if (match) {
           systemPromptInsert += skills.buildSkillPrompt(match) + "\n\n"
        }
        
        const newMemories = yield* memory.extractMemories(messages)
        if (newMemories.length > 0) {
           yield* memory.storeMemories(newMemories)
        }
        const currentMemory = yield* memory.getMemory()
        const memoryPrompt = memory.buildMemoryPrompt(currentMemory)
        if (memoryPrompt) {
           systemPromptInsert += memoryPrompt + "\n\n"
        }
        return systemPromptInsert
      })
    )

    if (preflight.trim()) {
      const systemMsgIndex = messages.findIndex(m => m.role === "system")
      if (systemMsgIndex >= 0) {
        const existing = messages[systemMsgIndex]
        if (existing) {
          messages[systemMsgIndex] = { 
            ...existing, 
            role: existing.role || "system",
            content: (existing.content || "") + "\n\n" + preflight 
          }
        }
      } else {
        messages = [{ role: "system", content: preflight }, ...messages]
      }
    }

    for (let i = 0; i < MAX_TOOL_ITERATIONS; i++) {
      console.log(`[StreamToolLoop] Iteration ${i + 1}/${MAX_TOOL_ITERATIONS}`)

      /** @Logic.Chat.MicroCompaction */
      const compacted = await runtime.runPromise(
        Effect.gen(function* () {
          const compaction = yield* CompactionService
          return yield* compaction.microCompact(messages)
        })
      )
      const payloadMessages = compacted.messages

      const response = await fetch(ApiConstants.OPENROUTER_CHAT_COMPLETIONS, {
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
      let toolCallsBuffer: unknown[] = []
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
              toolCallsBuffer.push(...delta.tool_calls)
            }

            if (delta?.content) {
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

      if (!hasToolCalls || toolCallsBuffer.length === 0) {
        clearTimeout(timeoutId)
        return { success: true }
      }

      console.log(`[StreamToolLoop] Executing ${toolCallsBuffer.length} tool(s)`)

      const toolMessages: { role: string; tool_call_id: string; name: string; content: string }[] = []

      for (const tc of toolCallsBuffer) {
        const { id, function: fn } = tc as { id: string; function: { name: string; arguments: string } }
        const toolName = fn.name
        const args = JSON.parse(fn.arguments)

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
            console.error(`[StreamToolLoop] Tool error: ${toolName}`, execError)
            toolResult = JSON.stringify({ error: `Tool execution failed: ${String(execError)}` })
          }
        }

        toolMessages.push({
          role: "tool",
          tool_call_id: id,
          name: toolName,
          content: toolResult
        })

        const toolResultLine = SSEConstants.DATA_PREFIX + JSON.stringify({
          choices: [{ delta: { role: "tool", content: toolResult }, finish_reason: null }]
        }) + '\n'
        onChunk(toolResultLine)
      }

      messages = [
        ...messages,
        { role: "assistant", content: "", tool_calls: toolCallsBuffer },
        ...toolMessages
      ]

      const doneLine = SSEConstants.DATA_PREFIX + SSEConstants.DONE + '\n'
      onChunk(doneLine)

      toolCallsBuffer = []
    }

    clearTimeout(timeoutId)
    return { success: true }
  } catch (error) {
    clearTimeout(timeoutId)
    const isAbort = error instanceof DOMException && error.name === 'AbortError'
    console.error(`[StreamToolLoop] ${isAbort ? 'Timeout' : 'Error'}`, error)
    return { success: false, error: isAbort ? "Request timeout" : String(error) }
  }
}

const runAgenticLoop = async (
  initialMessages: { role: string; content: string; name?: string; tool_calls?: unknown[] }[],
  userId: string,
  tier: SubscriptionTierType
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
      tools: toolsToOpenRouter(),
      ...(tier === SubscriptionTier.Pro ? { plugins: WebSearchPlugins } : {})
    })

    let messages = [...initialMessages]

    /** @Logic.Chat.PreFlight.MemoryAndSkills */
    const preflight = await runtime.runPromise(
      Effect.gen(function* () {
        const skills = yield* SkillsService
        const memory = yield* SessionMemoryService
        
        const lastUserMsg = [...messages].reverse().find(m => m.role === "user")?.content || ""
        let systemPromptInsert = ""
        
        const match = yield* skills.matchSkill(lastUserMsg)
        if (match) {
           systemPromptInsert += skills.buildSkillPrompt(match) + "\n\n"
        }
        
        const newMemories = yield* memory.extractMemories(messages)
        if (newMemories.length > 0) {
           yield* memory.storeMemories(newMemories)
        }
        const currentMemory = yield* memory.getMemory()
        const memoryPrompt = memory.buildMemoryPrompt(currentMemory)
        if (memoryPrompt) {
           systemPromptInsert += memoryPrompt + "\n\n"
        }
        return systemPromptInsert
      })
    )

    if (preflight.trim()) {
      const systemMsgIndex = messages.findIndex(m => m.role === "system")
      if (systemMsgIndex >= 0) {
        const existing = messages[systemMsgIndex]
        if (existing) {
          messages[systemMsgIndex] = { 
            ...existing, 
            role: existing.role || "system",
            content: (existing.content || "") + "\n\n" + preflight 
          }
        }
      } else {
        messages = [{ role: "system", content: preflight }, ...messages]
      }
    }

    for (let i = 0; i < MAX_TOOL_ITERATIONS; i++) {
      console.log(`[ToolLoop] Iteration ${i + 1}/${MAX_TOOL_ITERATIONS}`)

      /** @Logic.Chat.MicroCompaction */
      const compacted = await runtime.runPromise(
        Effect.gen(function* () {
          const compaction = yield* CompactionService
          return yield* compaction.microCompact(messages)
        })
      )
      const payloadMessages = compacted.messages

      const response = await fetch(ApiConstants.OPENROUTER_CHAT_COMPLETIONS, {
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
        const errorBody = await response.text()
        console.error(`[ToolLoop] OpenRouter error: ${response.status}`, errorBody)
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

      console.log(`[ToolLoop] Executing ${toolCalls.length} tool(s)`)

      const toolMessages: { role: string; tool_call_id: string; name: string; content: string }[] = []

      const parsedToolCalls: Array<{ id: string; name: string; args: Record<string, unknown> }> = toolCalls.map((tc: { id: string; function: { name: string; arguments: string } }) => {
        const { id, function: fn } = tc
        return { id, name: fn.name, args: JSON.parse(fn.arguments) }
      })

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
          console.error(`[ToolLoop] Tool execution error: ${toolName}`, execError)
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

    console.warn(`[ToolLoop] Max iterations reached (${MAX_TOOL_ITERATIONS})`)
    return { success: false, error: "Max tool iterations reached" }

  } catch (error) {
    const isAbort = error instanceof DOMException && error.name === 'AbortError'
    console.error(`[ToolLoop] ${isAbort ? 'Timeout' : 'Error'}`, error)
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
            const result = await runAgenticLoop([...params.messages], auth.userId, auth.tier)
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
                  controller.enqueue(encoder.encode(chunk))
                }

                const result = await runStreamingAgenticLoop(
                  initialMessages,
                  auth.userId,
                  auth.tier,
                  onChunk
                )

                if (!result.success) {
                  const errorChunk = SSEConstants.DATA_PREFIX + JSON.stringify({
                    choices: [{ delta: { content: `[Error: ${result.error}]` }, finish_reason: "stop" }]
                  }) + '\n'
                  controller.enqueue(encoder.encode(errorChunk))
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
