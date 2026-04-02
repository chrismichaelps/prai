/** @Service.Effect.SessionMemory */

import { Effect } from "effect"
import type { MemoryEntry, SessionMemory, MemoryCategory } from "../../schemas/memory/SessionMemorySchema"
import { createClient } from "@/lib/supabase/server"

type SessionMemoryRow = {
  memory_key: string
  memory_value: string
  category: string
  extracted_at: number
}

/** @Service.Effect.SessionMemory.Class */
export class SessionMemoryService extends Effect.Service<SessionMemoryService>()("SessionMemory", {
  effect: Effect.gen(function* () {
    let currentMemory: SessionMemory = { entries: [], conversationSummary: undefined }

    const loadFromSupabase = (
      uid: string
    ): Effect.Effect<SessionMemory> =>
      Effect.gen(function* () {
        const supabase = yield* Effect.promise(() => createClient())
        const { data, error } = yield* Effect.promise(() =>
          supabase
            .from("session_memory")
            .select("memory_key, memory_value, category, extracted_at")
            .eq("user_id", uid)
        )

        if (error) {
          console.error("[SessionMemory] Failed to load from Supabase:", error)
          return { entries: [], conversationSummary: undefined }
        }

        if (!data || data.length === 0) {
          return { entries: [], conversationSummary: undefined }
        }

        const entries: MemoryEntry[] = (data as SessionMemoryRow[]).map((row) => ({
          key: row.memory_key,
          value: row.memory_value,
          category: row.category as MemoryCategory,
          extractedAt: row.extracted_at
        }))

        return { entries, conversationSummary: undefined }
      })

    const persistToSupabase = (
      uid: string,
      entries: ReadonlyArray<MemoryEntry>
    ): Effect.Effect<void> =>
      Effect.gen(function* () {
        const supabase = yield* Effect.promise(() => createClient())
        const records = entries.map((entry) => ({
          user_id: uid,
          memory_key: entry.key,
          memory_value: entry.value,
          category: entry.category,
          extracted_at: entry.extractedAt
        }))

        const { error } = yield* Effect.promise(() =>
          supabase
            .from("session_memory")
            .upsert(records, { onConflict: "user_id,memory_key" })
        )

        if (error) {
          console.error("[SessionMemory] Persist error:", error)
        }
      })

    const extractMemories = (
      messages: ReadonlyArray<{ readonly role: string; readonly content: string }>
    ): Effect.Effect<MemoryEntry[]> =>
      Effect.sync(() => {
        const extracted: MemoryEntry[] = []
        const now = Date.now()

        for (const msg of messages) {
          if (msg.role !== "user") continue
          const content = msg.content.toLowerCase()

          const preferencePatterns: Array<{ pattern: RegExp; key: string }> = [
            { pattern: /(?:prefiero|me gusta|favorito|prefer)\s+(.+)/i, key: "food_preference" },
            { pattern: /(?:vegetariano|vegano|sin gluten|vegan|vegetarian|gluten.free)/i, key: "dietary" },
            { pattern: /(?:presupuesto|budget)\s*(?:de|of|:)?\s*\$?(\d+)/i, key: "budget" },
            { pattern: /(?:viajo con|traveling with)\s+(.+)/i, key: "travel_group" },
            { pattern: /(?:hotel|hospedaje|staying)\s+(?:en|at|in)\s+(.+)/i, key: "accommodation" },
            { pattern: /(?:niños|kids|children|familia|family)/i, key: "family_travel" }
          ]

          for (const { pattern, key } of preferencePatterns) {
            const match = content.match(pattern)
            if (match) {
              extracted.push({
                key,
                value: match[1]?.trim() || match[0].trim(),
                category: "preference" as MemoryCategory,
                extractedAt: now
              })
            }
          }
        }

        return extracted
      })

    const storeMemories = (
      entries: ReadonlyArray<MemoryEntry>
    ): Effect.Effect<SessionMemory> =>
      Effect.sync(() => {
        const existingKeys = new Set(currentMemory.entries.map((e) => e.key))
        const newEntries = entries.filter((e) => !existingKeys.has(e.key))
        currentMemory = {
          ...currentMemory,
          entries: [...currentMemory.entries, ...newEntries]
        }
        return currentMemory
      })

    const buildMemoryPrompt = (
      memory: SessionMemory
    ): string => {
      if (memory.entries.length === 0) return ""

      const grouped = memory.entries.reduce<Record<string, MemoryEntry[]>>((acc, entry) => {
        const cat = entry.category
        if (!acc[cat]) acc[cat] = []
        acc[cat].push(entry)
        return acc
      }, {})

      const sections = Object.entries(grouped).map(([category, entries]) => {
        const items = entries.map((e) => `- ${e.key}: ${e.value}`).join("\n")
        return `[${category}]\n${items}`
      })

      return `<session_memory>\n${sections.join("\n\n")}\n</session_memory>`
    }

    const getMemory = (): Effect.Effect<SessionMemory> =>
      Effect.sync(() => currentMemory)

    const reset = (): Effect.Effect<void> =>
      Effect.sync(() => {
        currentMemory = { entries: [], conversationSummary: undefined }
      })

    return { 
      extractMemories, 
      storeMemories, 
      buildMemoryPrompt, 
      getMemory, 
      reset,
      loadFromSupabase,
      persistToSupabase
    } as const
  })
}) {}
