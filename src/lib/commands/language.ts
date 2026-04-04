/** @Command.Language */

import { Effect, Schema } from "effect"
import type { ChatCommand } from "./types"
import { CommandError } from "../effect/errors"
import { LanguageSchema, COMMAND_DEFS } from "../effect/schemas/CommandSchema"

const def = COMMAND_DEFS.language

export const languageCommand: ChatCommand = {
  type: def.type,
  name: def.name,
  aliases: [...def.aliases],
  description: def.description,
  argumentHint: def.argumentHint,
  category: def.category,
  execute: (args: string) =>
    Effect.gen(function* () {
      const raw = args.trim().toLowerCase()
      yield* Effect.try({
        try: () => Schema.decodeUnknownSync(LanguageSchema)(raw),
        catch: () => new CommandError({ code: "INVALID_ARGS", message: `Usage: ${def.name} es  or  ${def.name} en` })
      })

      return { type: "setting", key: def.settingKey, value: raw, toast: `Language: ${raw === "es" ? "Español" : "English"}` }
    })
}
