/** @Test.UsageEngine */

import { describe, it, expect, vi } from "vitest"
import { Effect, Exit, Layer } from "effect"
import { canSend, checkAndCompact } from "../UsageEngine"
import { CompactionService } from "../../compaction"
import { TokenEstimationService } from "../../token"
import { getTierContextThreshold } from "../../../constants/compaction/CompactionConstants"

/** @Logic.Test.MockSupabase */
const makeSupabaseMock = (rpcResult: { allowed: boolean; reason: string }) => ({
  rpc: vi.fn().mockResolvedValue({
    data: [rpcResult],
    error: null,
  }),
})

describe("canSend", () => {
  it("returns allowed:true when RPC returns ok", async () => {
    const supabase = makeSupabaseMock({ allowed: true, reason: "ok" })
    const exit = await Effect.runPromiseExit(
      canSend("user-123", "free", supabase as never)
    )
    expect(Exit.isSuccess(exit)).toBe(true)
    if (Exit.isSuccess(exit)) {
      expect(exit.value.allowed).toBe(true)
    }
  })

  it("returns allowed:false with reason global_quota", async () => {
    const supabase = makeSupabaseMock({ allowed: false, reason: "global_quota" })
    const exit = await Effect.runPromiseExit(
      canSend("user-123", "free", supabase as never)
    )
    expect(Exit.isSuccess(exit)).toBe(true)
    if (Exit.isSuccess(exit)) {
      expect(exit.value.allowed).toBe(false)
      if (!exit.value.allowed) {
        expect(exit.value.reason).toBe("global_quota")
      }
    }
  })

  it("returns allowed:false with reason daily_messages", async () => {
    const supabase = makeSupabaseMock({ allowed: false, reason: "daily_messages" })
    const exit = await Effect.runPromiseExit(
      canSend("user-123", "free", supabase as never)
    )
    expect(Exit.isSuccess(exit)).toBe(true)
    if (Exit.isSuccess(exit)) {
      expect(exit.value.allowed).toBe(false)
      if (!exit.value.allowed) {
        expect(exit.value.reason).toBe("daily_messages")
      }
    }
  })

  it("returns allowed:false with reason daily_cost for pro", async () => {
    const supabase = makeSupabaseMock({ allowed: false, reason: "daily_cost" })
    const exit = await Effect.runPromiseExit(
      canSend("user-456", "pro", supabase as never)
    )
    expect(Exit.isSuccess(exit)).toBe(true)
    if (Exit.isSuccess(exit)) {
      expect(exit.value.allowed).toBe(false)
      if (!exit.value.allowed) {
        expect(exit.value.reason).toBe("daily_cost")
      }
    }
  })

  it("returns UsageEngineError when RPC call fails", async () => {
    const supabase = {
      rpc: vi.fn().mockResolvedValue({ data: null, error: { message: "db error" } }),
    }
    const exit = await Effect.runPromiseExit(
      canSend("user-123", "free", supabase as never)
    )
    expect(Exit.isFailure(exit)).toBe(true)
  })

  it("passes tier to the RPC", async () => {
    const supabase = makeSupabaseMock({ allowed: true, reason: "ok" })
    await Effect.runPromise(
      canSend("user-123", "pro", supabase as never)
    )
    expect(supabase.rpc).toHaveBeenCalledWith(
      "check_and_increment_openrouter_quota",
      expect.objectContaining({ p_tier: "pro" })
    )
  })
})

/** @Logic.Test.ContextGuardLayer */
const ContextGuardLayer = Layer.merge(
  CompactionService.Default,
  TokenEstimationService.Default
)

type CompactableMessage = { role: string; content: string; name?: string }

const runCheckAndCompact = async (
  messages: CompactableMessage[],
  tier: "free" | "pro"
) =>
  Effect.runPromiseExit(
    checkAndCompact(messages, tier).pipe(
      Effect.provide(ContextGuardLayer)
    )
  )

describe("checkAndCompact", () => {
  it("returns messages unchanged when below free threshold", async () => {
    const messages: CompactableMessage[] = [
      { role: "system", content: "System" },
      { role: "user", content: "Hola" },
      { role: "assistant", content: "Hola, ¿en qué puedo ayudarte?" },
    ]
    const exit = await runCheckAndCompact(messages, "free")
    expect(Exit.isSuccess(exit)).toBe(true)
    if (Exit.isSuccess(exit)) {
      expect(exit.value).toHaveLength(3)
    }
  })

  it("reduces total content when tool results exceed free threshold", async () => {
    const threshold = getTierContextThreshold("free");
    const largeToolContent = "a".repeat(Math.floor(threshold * 4 / 7) + 500)
    const messages: CompactableMessage[] = [
      { role: "user", content: "Search for restaurants" },
      ...Array.from({ length: 7 }, (_, i) => ([
        { role: "assistant", content: `Calling tool ${i + 1}` },
        { role: "tool", content: largeToolContent },
      ])).flat(),
      { role: "user", content: "Thanks" },
    ]
    const totalContentBefore = messages.reduce((sum, m) => sum + m.content.length, 0)
    const exit = await runCheckAndCompact(messages, "free")
    expect(Exit.isSuccess(exit)).toBe(true)
    if (Exit.isSuccess(exit)) {
      const totalContentAfter = exit.value.reduce((sum, m) => sum + m.content.length, 0)
      expect(totalContentAfter).toBeLessThan(totalContentBefore)
    }
  })

  it("preserves system message after compaction", async () => {
    const threshold = getTierContextThreshold("free")
    const largeToolContent = "a".repeat(Math.floor(threshold * 4 / 7) + 500)
    const messages: CompactableMessage[] = [
      { role: "system", content: "System prompt" },
      { role: "user", content: "Hello" },
      ...Array.from({ length: 7 }, (_, i) => ([
        { role: "assistant", content: `Tool call ${i + 1}` },
        { role: "tool", content: largeToolContent },
      ])).flat(),
      { role: "user", content: "Thanks" },
    ]
    const exit = await runCheckAndCompact(messages, "free")
    expect(Exit.isSuccess(exit)).toBe(true)
    if (Exit.isSuccess(exit)) {
      expect(exit.value.some((m: CompactableMessage) => m.role === "system")).toBe(true)
    }
  })
})
