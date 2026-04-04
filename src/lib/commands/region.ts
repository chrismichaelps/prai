/** @Command.Region */

import { Effect, Schema } from "effect"
import type { ChatCommand } from "./types"
import { CommandError } from "../effect/errors"
import { RegionSchema, COMMAND_DEFS } from "../effect/schemas/CommandSchema"

const def = COMMAND_DEFS.region

const LABELS: Record<string, string> = {
  "norte": "North",
  "sur": "South",
  "este": "East",
  "oeste": "West",
  "metro": "Metro",
  "todos": "All regions",
}

/** @Logic.Region.Aliases */
const ALIASES: Record<string, string> = {
  "north": "norte",
  "south": "sur",
  "east": "este",
  "west": "oeste",
  "all": "todos",
}

export const regionCommand: ChatCommand = {
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
        try: () => Schema.decodeUnknownSync(RegionSchema)(normalized),
        catch: () => new CommandError({ code: "INVALID_ARGS", message: `Uso: ${def.name} norte|sur|este|oeste|metro|todos` })
      })

      return { type: "setting", key: def.settingKey, value: normalized, toast: `Region: ${LABELS[normalized] || normalized}` }
    })
}
