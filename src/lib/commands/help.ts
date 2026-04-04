/** @Command.Help */

import { Effect } from "effect"
import type { ChatCommand } from "./types"
import { COMMAND_DEFS } from "../effect/schemas/CommandSchema"
import { getCommands } from "./registry"

const def = COMMAND_DEFS.help

export const helpCommand: ChatCommand = {
  type: def.type,
  name: def.name,
  aliases: [...def.aliases],
  description: def.description,
  argumentHint: def.argumentHint,
  category: def.category,
  execute: (args: string) =>
    Effect.gen(function* () {
      const query = args.trim().toLowerCase()
      const all = getCommands()

      if (query) {
        const found = all.find(
          (c) => c.name === `/${query}` || c.aliases?.includes(`/${query}`)
        )
        if (found) {
          return {
            type: "system_inject" as const,
            content: `${found.name} — ${found.description}${found.argumentHint ? ` Args: ${found.argumentHint}` : ""}`,
          }
        }
      }

      const list = all
        .filter((c) => !c.isHidden)
        .map((c) => `${c.name}${c.argumentHint ? ` ${c.argumentHint}` : ""} — ${c.description}`)
        .join("\n")

      return { type: "system_inject", content: `Comandos disponibles:\n${list}` }
    })
}
