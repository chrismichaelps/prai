/** @Service.ToolExecutor */

import { Effect, Schema } from "effect"
import { getToolByName, isReadOnlyTool } from "./types"
import { ToolError } from "../../errors"
import { SessionMemoryService } from "../memory"
import type { MemoryCategory } from "../../schemas/memory/SessionMemorySchema"

/** @Schema.ToolExecutionContext */
export const ToolExecutionContextSchema = Schema.Struct({
  toolName: Schema.String,
  args: Schema.Record({ key: Schema.String, value: Schema.Unknown }),
  startTime: Schema.Number
})

/** @Type.ToolExecutionContext */
export interface ToolExecutionContext {
  readonly toolName: string
  readonly args: Record<string, unknown>
  readonly startTime: number
}

/** @Schema.ToolPartitionResult */
export const ToolPartitionResultSchema = Schema.Struct({
  readOnly: Schema.Array(ToolExecutionContextSchema),
  write: Schema.Array(ToolExecutionContextSchema)
})

/** @Type.ToolPartitionResult */
export interface ToolPartitionResult {
  readonly readOnly: ToolExecutionContext[]
  readonly write: ToolExecutionContext[]
}

/** @Logic.PartitionTools */
function partitionTools(toolCalls: Array<{ name: string; args: Record<string, unknown> }>): ToolPartitionResult {
  const result: ToolPartitionResult = { readOnly: [], write: [] }
  
  for (const tc of toolCalls) {
    const context: ToolExecutionContext = {
      toolName: tc.name,
      args: tc.args,
      startTime: Date.now()
    }
    
    if (isReadOnlyTool(tc.name)) {
      result.readOnly.push(context)
    } else {
      result.write.push(context)
    }
  }
  
  return result
}

/** @Logic.ExecuteSingleTool */
async function executeSingleTool(
  toolName: string, 
  args: Record<string, unknown>,
  timeoutMs?: number,
  retries?: number
): Promise<string> {
  const tool = getToolByName(toolName)
  if (!tool) {
    throw new ToolError({ toolName, message: `Herramienta no encontrada: ${toolName}`, cause: undefined })
  }
  
  const effectiveTimeout = timeoutMs ?? tool.timeoutMs ?? 30000
  const maxRetries = retries ?? 0
  const startTime = Date.now()
  
  let lastError: Error | undefined
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await Effect.runPromise(
        Effect.timeout(executeToolEffect(toolName, args), effectiveTimeout)
      )
      
      recordMetric(toolName, attempt > 0, Date.now() - startTime)
      return result
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      
      if (attempt < maxRetries) {
        const backoffMs = Math.min(1000 * Math.pow(2, attempt), 10000)
        console.log(`[ToolRetry] ${toolName} failed, retrying in ${backoffMs}ms (attempt ${attempt + 1}/${maxRetries})`)
        await new Promise(resolve => setTimeout(resolve, backoffMs))
      }
    }
  }
  
  throw lastError || new Error(`Tool execution failed after ${maxRetries + 1} attempts`)
}

/** @Schema.ToolMetric */
export const ToolMetricSchema = Schema.Struct({
  toolName: Schema.String,
  totalCalls: Schema.Number,
  successfulCalls: Schema.Number,
  failedCalls: Schema.Number,
  totalLatencyMs: Schema.Number,
  startTime: Schema.Number
})

/** @Type.ToolMetric */
export interface ToolMetric {
  readonly toolName: string
  readonly totalCalls: number
  readonly successfulCalls: number
  readonly failedCalls: number
  readonly totalLatencyMs: number
  readonly startTime: number
}

const metricStore = new Map<string, ToolMetric>()

/** @Logic.RecordMetric */
function recordMetric(toolName: string, _wasRetry: boolean, latencyMs: number): void {
  const existing = metricStore.get(toolName) || {
    toolName,
    totalCalls: 0,
    successfulCalls: 0,
    failedCalls: 0,
    totalLatencyMs: 0,
    startTime: Date.now()
  }
  
  metricStore.set(toolName, {
    ...existing,
    totalCalls: existing.totalCalls + 1,
    successfulCalls: existing.successfulCalls + 1,
    totalLatencyMs: existing.totalLatencyMs + latencyMs
  })
}

/** @Logic.RecordToolFailure */
export function recordToolFailure(toolName: string): void {
  const existing = metricStore.get(toolName) || {
    toolName,
    totalCalls: 0,
    successfulCalls: 0,
    failedCalls: 0,
    totalLatencyMs: 0,
    startTime: Date.now()
  }
  
  metricStore.set(toolName, {
    ...existing,
    totalCalls: existing.totalCalls + 1,
    failedCalls: existing.failedCalls + 1
  })
}

/** @Logic.GetToolMetrics */
export function getToolMetrics(): Record<string, { calls: number; success: number; failures: number; avgLatencyMs: number }> {
  const result: Record<string, { calls: number; success: number; failures: number; avgLatencyMs: number }> = {}
  
  for (const [toolName, metric] of metricStore) {
    result[toolName] = {
      calls: metric.totalCalls,
      success: metric.successfulCalls,
      failures: metric.failedCalls,
      avgLatencyMs: metric.totalCalls > 0 ? Math.round(metric.totalLatencyMs / metric.totalCalls) : 0
    }
  }
  
  return result
}

/** @Logic.ClearToolMetrics */
export function clearToolMetrics(): void {
  metricStore.clear()
}

/** @Logic.ExecuteToolEffect */
function executeToolEffect(toolName: string, args: Record<string, unknown>): Effect.Effect<string, ToolError> {
  return Effect.gen(function* () {
    const tool = getToolByName(toolName)
    if (!tool) {
      return yield* Effect.fail(new ToolError({ toolName, message: `Tool not found: ${toolName}` }))
    }
    
    const result = yield* executeWriteTool(toolName, args)
    return result
  })
}

/** @Logic.ExecuteWriteTool */
function executeWriteTool(toolName: string, args: Record<string, unknown>): Effect.Effect<string, ToolError> {
  switch (toolName) {
    case "save_favorite": {
      const { placeName, placeType, location, notes } = args as { 
        placeName: string
        placeType?: string
        location?: string
        notes?: string
      }
      return Effect.succeed(
        `[TOOL_INVOKED] save_favorite saved: "${placeName}" (${placeType || 'place'}) at ${location || 'unspecified location'}. ` +
        `Notes: ${notes || 'none'}. This will be persisted to user's favorites.`
      )
    }
    case "save_itinerary": {
      const { title, days, notes } = args as {
        title: string
        days?: Array<{ date: string; activities: Array<{ time: string; place: string; notes?: string }> }>
        notes?: string
      }
      const dayCount = days?.length || 0
      const activityCount = days?.reduce((sum, d) => sum + (d.activities?.length || 0), 0) || 0
      return Effect.succeed(
        `[TOOL_INVOKED] save_itinerary saved: "${title}" with ${dayCount} days and ${activityCount} activities. ` +
        `Notes: ${notes || 'none'}. This will be persisted to user's itineraries.`
      )
    }
    case "remember_user_fact": {
      const { key, value, category } = args as { key: string; value: string; category?: string }
      return Effect.tryPromise({
        try: () => import("../../runtime").then(({ runtime }) =>
          runtime.runPromise(
            Effect.gen(function* () {
              const mem = yield* SessionMemoryService
              yield* mem.storeMemories([{
                key,
                value,
                category: (category ?? "fact") as MemoryCategory,
                extractedAt: Date.now()
              }])
              return `Recordado: "${key}" → "${value}"`
            })
          )
        ),
        catch: (e) => new ToolError({ toolName: "remember_user_fact", message: `Store failed: ${String(e)}`, cause: e })
      })
    }
    default:
      return Effect.succeed(`[TOOL_INVOKED] ${toolName} with params: ${JSON.stringify(args)}`)
  }
}

/** @Logic.ExecuteTool */
export const executeTool = (toolName: string, args: Record<string, unknown>): Effect.Effect<string, ToolError> => {
  return executeToolEffect(toolName, args)
}

/** @Logic.ExecuteToolsConcurrently */
export const executeToolsConcurrently = async (
  toolCalls: Array<{ name: string; args: Record<string, unknown> }>
): Promise<Array<{ toolName: string; result: string; error?: string }>> => {
  const partitioned = partitionTools(toolCalls)
  const results: Array<{ toolName: string; result: string; error?: string }> = []
  
  if (partitioned.readOnly.length > 0) {
    const readOnlyResults = await Promise.all(
      partitioned.readOnly.map(async (ctx: ToolExecutionContext) => {
        try {
          const result = await executeSingleTool(ctx.toolName, ctx.args)
          return { toolName: ctx.toolName, result, error: undefined }
        } catch (e) {
          return { toolName: ctx.toolName, result: '', error: String(e) }
        }
      })
    )
    results.push(...readOnlyResults)
  }
  
  for (const ctx of partitioned.write) {
    try {
      const result = await executeSingleTool(ctx.toolName, ctx.args)
      results.push({ toolName: ctx.toolName, result, error: undefined })
    } catch (e) {
      results.push({ toolName: ctx.toolName, result: '', error: String(e) })
    }
  }
  
  return results
}