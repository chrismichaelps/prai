/** @Command.SettingsPrompt */

import type { ChatSettings } from "../effect/schemas/CommandSchema"

const PERSONALITY_LABELS: Record<string, string> = {
  "guía": "tour guide",
  "chef": "Boricua chef",
  "historiador": "historian",
  "aventurero": "adventurer",
  "local": "local expert",
}

const MODE_LABELS: Record<string, string> = {
  "experto": "expert",
  "casual": "casual",
  "turista": "tourist",
  "familia": "family",
}

const REGION_LABELS: Record<string, string> = {
  "norte": "north",
  "sur": "south",
  "este": "east",
  "oeste": "west",
  "metro": "metro area",
  "todos": "all regions",
}

const BUDGET_LABELS: Record<string, string> = {
  "económico": "budget-friendly",
  "moderado": "moderate",
  "lujo": "luxury",
}

/** @Logic.Command.SettingsPrompt.Build */
export const buildSettingsPrompt = (settings: ChatSettings): string | null => {
  const lines: string[] = []

  if (settings.language) {
    lines.push(`- Response language: ${settings.language === "es" ? "Spanish" : "English"}`)
  }
  if (settings.personality) {
    lines.push(`- Personality: ${PERSONALITY_LABELS[settings.personality] || settings.personality}`)
  }
  if (settings.mode) {
    lines.push(`- Mode: ${MODE_LABELS[settings.mode] || settings.mode}`)
  }
  if (settings.region) {
    lines.push(`- Region: ${REGION_LABELS[settings.region] || settings.region}`)
  }
  if (settings.budget) {
    lines.push(`- Budget: ${BUDGET_LABELS[settings.budget] || settings.budget}`)
  }
  if (settings.tripDate) {
    lines.push(`- Trip date: ${settings.tripDate}`)
  }

  if (lines.length === 0) return null

  return `[Active Configuration]\n${lines.join("\n")}\nAdapt your responses to match these settings.`
}
