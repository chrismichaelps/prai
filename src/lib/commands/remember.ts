/** @Command.Remember */

import { Effect } from "effect"
import type { ChatCommand } from "./types"
import { CommandError } from "../effect/errors"
import { COMMAND_DEFS } from "../effect/schemas/CommandSchema"

const def = COMMAND_DEFS.remember

export const rememberCommand: ChatCommand = {
  type: def.type,
  name: def.name,
  aliases: [...def.aliases],
  description: def.description,
  argumentHint: def.argumentHint,
  category: def.category,
  execute: (args: string) =>
    Effect.gen(function* () {
      const text = args.trim()
      if (!text) {
        return yield* Effect.fail(
          new CommandError({ code: "INVALID_ARGS", message: `Uso: ${def.name} <texto a recordar>` })
        )
      }

      // Use timestamp in key so multiple facts can coexist
      const key = `user_note_${Date.now()}`

      return {
        type: "memory" as const,
        key,
        value: text,
        category: "fact" as const,
        toast: `Recordado`,
      }
    }),
}
