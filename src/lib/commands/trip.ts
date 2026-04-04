/** @Command.Trip */

import { Effect } from "effect"
import type { ChatCommand } from "./types"
import { COMMAND_DEFS } from "../effect/schemas/CommandSchema"

const def = COMMAND_DEFS.trip

export const tripCommand: ChatCommand = {
  type: def.type,
  name: def.name,
  aliases: [...def.aliases],
  description: def.description,
  argumentHint: def.argumentHint,
  category: def.category,
  execute: (args: string) =>
    Effect.gen(function* () {
      const raw = args.trim()
      if (!raw) {
        return { type: "setting", key: def.settingKey, value: "", toast: "Fecha de viaje eliminada" }
      }

      return { type: "setting", key: def.settingKey, value: raw, toast: `Fecha de viaje: ${raw}` }
    })
}
