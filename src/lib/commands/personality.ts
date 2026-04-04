/** @Command.Personality */

import { Effect, Schema } from "effect"
import type { ChatCommand } from "./types"
import { CommandError } from "../effect/errors"
import { PersonalitySchema, COMMAND_DEFS } from "../effect/schemas/CommandSchema"

const def = COMMAND_DEFS.personality

const LABELS: Record<string, string> = {
  "guía": "tour guide",
  "chef": "Boricua chef",
  "historiador": "historian",
  "aventurero": "adventurer",
  "local": "local expert",
}

/** @Logic.Personality.Aliases */
const ALIASES: Record<string, string> = {
  "guide": "guía",
  "historian": "historiador",
  "adventurer": "aventurero",
}

export const personalityCommand: ChatCommand = {
  type: def.type,
  name: def.name,
  aliases: [...def.aliases],
  description: def.description,
  argumentHint: def.argumentHint,
  category: def.category,
  execute: (args: string) =>
    Effect.gen(function* () {
      const raw = args.trim().toLowerCase()
      if (!raw) {
        return { type: "setting", key: def.settingKey, value: "guía", toast: "Personality: tour guide" }
      }
      const normalized = ALIASES[raw] ?? raw
      yield* Effect.try({
        try: () => Schema.decodeUnknownSync(PersonalitySchema)(normalized),
        catch: () => new CommandError({ code: "INVALID_ARGS", message: `Uso: ${def.name} guía|chef|historiador|aventurero|local` })
      })

      return { type: "setting", key: def.settingKey, value: normalized, toast: `Personality: ${LABELS[normalized] || normalized}` }
    })
}
