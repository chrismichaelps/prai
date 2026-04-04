/** @Command.System */

import { Effect } from "effect"
import type { ChatCommand } from "./types"
import { CommandError } from "../effect/errors"
import { COMMAND_DEFS } from "../effect/schemas/CommandSchema"

const def = COMMAND_DEFS.system

export const systemCommand: ChatCommand = {
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
        return yield* new CommandError({ code: "INVALID_ARGS", message: `Usage: ${def.name} <text to inject>` })
      }

      return { type: "system_inject", content: raw }
    })
}
