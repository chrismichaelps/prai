/** @Command.Mode */

import { Effect, Schema } from "effect"
import type { ChatCommand } from "./types"
import { CommandError } from "../effect/errors"
import { ModeSchema, COMMAND_DEFS } from "../effect/schemas/CommandSchema"

const def = COMMAND_DEFS.mode

const LABELS: Record<string, string> = {
  "experto": "Expert",
  "casual": "Casual",
  "turista": "Tourist",
  "familia": "Family",
}

/** @Logic.Mode.Aliases */
const ALIASES: Record<string, string> = {
  "expert": "experto",
  "tourist": "turista",
  "family": "familia",
}

export const modeCommand: ChatCommand = {
  type: def.type,
  name: def.name,
  aliases: [...def.aliases],
  description: def.description,
  argumentHint: def.argumentHint,
  category: def.category,
  execute: (args: string) =>
    Effect.gen(function* () {
      const raw = args.trim().toLowerCase()
      const normalized = ALIASES[raw] ?? raw
      yield* Effect.try({
        try: () => Schema.decodeUnknownSync(ModeSchema)(normalized),
        catch: () => new CommandError({ code: "INVALID_ARGS", message: `Uso: ${def.name} experto|casual|turista|familia` })
      })

      return { type: "setting", key: def.settingKey, value: normalized, toast: `Mode: ${LABELS[normalized] || normalized}` }
    })
}
