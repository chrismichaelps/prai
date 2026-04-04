/** @Command.Clear */

import { Effect } from "effect"
import type { ChatCommand } from "./types"
import { COMMAND_DEFS } from "../effect/schemas/CommandSchema"
import { clearHistory } from "../../store/slices/chatSlice"

const def = COMMAND_DEFS.clear

export const clearCommand: ChatCommand = {
  type: def.type,
  name: def.name,
  aliases: [...def.aliases],
  description: def.description,
  category: def.category,
  execute: () =>
    Effect.succeed({ type: "dispatch", action: clearHistory() })
}
