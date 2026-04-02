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

        const seenKeys = new Set<string>()

        for (const msg of messages) {
          if (msg.role !== "user") continue
          const content = msg.content.toLowerCase()

          const preferencePatterns: Array<{ pattern: RegExp; key: string; valueExtractor?: RegExp }> = [
            // Food preferences
            { pattern: /(?:prefiero|me gusta(?: mucho)?|favorito|prefer(?:ir)?)\s+(?:comer\s+)?(.+?)(?:\.|$)/i, key: "food_preference" },
            { pattern: /(?:no\s+me\s+gusta|odio|detesto)\s+(?:comer\s+)?(.+?)(?:\.|$)/i, key: "food_dislike" },
            { pattern: /(?:como\s+vegetariano|como\s+vegano|soy\s+vegetariano|soy\s+vegano)/i, key: "dietary" },
            { pattern: /(?:sin\s+gluten|gluten.free|celiaco)/i, key: "dietary" },
            
            // Allergies - comprehensive
            { pattern: /(?:soy\s+)?alérgico(?:\s+a)?\s+(?:los\s+)?(?:mariscos?|pescados?|mariscos y|pescados y|camarones|langosta|jaiba|langostinos|cangrejos|paella)\b/i, key: "allergy" },
            { pattern: /(?:tengo\s+)?alergia\s+(?:a|al)?\s*(?:los\s+)?(?:mariscos?|pescados?|mariscos y|pescados y|camarones|langosta|langostinos|cangrejos)\b/i, key: "allergy" },
            { pattern: /(?:alérgico\s+a)\s+(?:los\s+)?mariscos/i, key: "allergy" },
            { pattern: /(?:no\s+puedo\s+comer|me\s+causa\s+(?:alergia|problema))\s+(?:mariscos?|pescado)/i, key: "allergy" },
            { pattern: /(?:mariscos|pescados?|camarones|langosta)\s+(?:me\s+)?(?:causan|hacen|dan)\s+alergia/i, key: "allergy" },
            { pattern: /alergia\s+a\s+(?:los\s+)?(?:mariscos?|camarones)/i, key: "allergy" },
            { pattern: /(?:soy\s+)?alérgico.*(?:mariscos?|camarones|langosta|pescados?|jaiba)/i, key: "allergy" },
            { pattern: /(?:alérgia|alergia)\s+(?:a|al)\s+los?\s+mariscos/i, key: "allergy" },
            
            // General allergies
            { pattern: /(?:tengo\s+)?alergia\s+(?:a|al)\s+(.+?)(?:\.|$)/i, key: "allergy", valueExtractor: /alergia\s+a\s+(.+?)(?:\.|$)/i },
            
            // Budget
            { pattern: /(?:presupuesto|budget)\s*(?:de|del)?\s*(?:mi)?\s*(?:es|de)?\s*\$?\s*(\d+(?:\.\d+)?(?:\s*(?:dollars?|dolares?|usd|pesos?))?)/i, key: "budget" },
            { pattern: /(?:tengo\s+)?(?:un\s+)?presupuesto\s+de\s+\$?(\d+)/i, key: "budget" },
            { pattern: /(?:gast(?:aré|o)|quiero\s+gastar)\s+(?:entre|como|máximo|hasta)?\s*\$?(\d+)/i, key: "budget" },
            
            // Travel group
            { pattern: /(?:viajo|voy)\s+con\s+(mi\s+)?(?:familia|pareja|amigos|niños|hijo|hija|esposa|esposo|novia|novio|hermanos?|madre|padre)/i, key: "travel_group" },
            { pattern: /(?:tengo|con)\s+(?:niños|niñas|hijos?|hijas|chicos?|chicas)\s+(?:pequeños?|chicos?|pequeños)/i, key: "travel_group" },
            { pattern: /(?:soy\s+)?(?:padre|madre)\s+de\s+(?:niños|niñas|chicos?|pequeños)/i, key: "travel_group" },
            { pattern: /(?:viaje\s+)?(?:familiar|familiar con hijos|con familia)/i, key: "travel_group" },
            
            // Accommodation preferences
            { pattern: /(?:hotel|hostal|resort|airbnb|casa|apartamento|villa)\s+(?:en|para|cerca)\s+(.+?)(?:\.|$)/i, key: "accommodation" },
            { pattern: /(?:me\s+)?(?:quedo|alojo|hospedo)\s+en\s+(.+?)(?:\.|$)/i, key: "accommodation" },
            { pattern: /(?:busco|quiero)\s+alojamiento\s+(?:en|cerca)\s+(.+?)(?:\.|$)/i, key: "accommodation" },
            
            // Family/children
            { pattern: /(?:niños|niñas|hijos?|hijas|chicos?|chicas|pequeños?|bebés?|bebes?)\s*(?:pequeños?|chicos?|pequeños)?/i, key: "family" },
            { pattern: /(?:con\s+)?(?:niños|niñas|hijos?|chicos?)\s+(?:pequeños?|chicos?)?/i, key: "family" },
            { pattern: /(?:soy|esto)\s+(?:con)\s+(?:mi\s+)?familia/i, key: "family" },
            
            // Dietary restrictions
            { pattern: /(?:vegetariano|vegano|sin\s+carne|como\s+verduras)/i, key: "dietary" },
            { pattern: /(?:intolerante|sensibilidad)\s+(?:a|al)\s+(?:lactosa|gluten)/i, key: "dietary" },
            { pattern: /(?:halal|kosher|religioso)/i, key: "dietary" },
            
            // Activities/interests
            { pattern: /(?:me\s+gusta(?: mucho)?|disfruto|disfruto\s+de)\s+(?:hacer|ver|visitar|explorar)\s+(.+?)(?:\.|$)/i, key: "interests" },
            { pattern: /(?:quiero|hacer|visitar)\s+(?:un|una)\s+(?:tour|excursión|viaje)\s+de\s+(.+?)(?:\.|$)/i, key: "interests" },
            { pattern: /(?:me\s+interesa|interesado)\s+(?:en)\s+(.+?)(?:\.|$)/i, key: "interests" },
            
            // Transportation
            { pattern: /(?:tengo|llego\s+con|viajando\s+en)\s+(?:carro|coche|rent|alquiler|uber|taxi|avión|vuelo)/i, key: "transport" },
            { pattern: /(?:sin\s+carro|sin\s+vehiculo|sin\s+carro)/i, key: "transport" },
            
            // Dates/times
            { pattern: /(?:estoy|voy)\s+del?\s+(\d+\s+de\s+\w+)\s+al\s+(\d+\s+de\s+\w+)/i, key: "dates", valueExtractor: /estoy\s+del?\s+(.+?)\s+al\s+(.+?)(?:\.|$)/i },
            { pattern: /(?:viaje|duración)\s+de\s+(\d+)\s+días?/i, key: "dates" },
          ]

          for (const { pattern, key, valueExtractor } of preferencePatterns) {
            const match = content.match(pattern)
            if (match) {
              const value = valueExtractor 
                ? (content.match(valueExtractor)?.[1] || match[0]).trim()
                : (match[1]?.trim() || match[0].trim())
              
              if (!seenKeys.has(key)) {
                seenKeys.add(key)
                extracted.push({
                  key,
                  value,
                  category: "preference" as MemoryCategory,
                  extractedAt: now
                })
              }
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
