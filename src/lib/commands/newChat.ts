/** @Command.NewChat */

import { Effect } from "effect"
import type { ChatCommand } from "./types"
import { COMMAND_DEFS } from "../effect/schemas/CommandSchema"

const def = COMMAND_DEFS.newChat

export const newChatCommand: ChatCommand = {
  type: def.type,
  name: def.name,
  aliases: [...def.aliases],
  description: def.description,
  category: def.category,
  execute: () =>
    Effect.succeed({ type: "navigate", path: "/chat" })
}
