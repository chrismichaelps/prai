/** @Command.Forget */

import { Effect } from "effect"
import type { ChatCommand } from "./types"
import { CommandError } from "../effect/errors"
import { COMMAND_DEFS } from "../effect/schemas/CommandSchema"

const def = COMMAND_DEFS.forget

export const forgetCommand: ChatCommand = {
  type: def.type,
  name: def.name,
  aliases: [...def.aliases],
  description: def.description,
  argumentHint: def.argumentHint,
  category: def.category,
  execute: (args: string) =>
    Effect.gen(function* () {
      const key = args.trim()
      if (!key) {
        return yield* Effect.fail(
          new CommandError({ code: "INVALID_ARGS", message: `Uso: ${def.name} <clave del dato a olvidar>` })
        )
      }

      return {
        type: "memory_delete" as const,
        key,
        toast: `Olvidado`,
      }
    }),
}
