/** @Command.Registry */

import type { ChatCommand } from "./types"
import { languageCommand } from "./language"
import { personalityCommand } from "./personality"
import { modeCommand } from "./mode"
import { regionCommand } from "./region"
import { budgetCommand } from "./budget"
import { tripCommand } from "./trip"
import { systemCommand } from "./system"
import { clearCommand } from "./clear"
import { newChatCommand } from "./newChat"
import { helpCommand } from "./help"
import { rememberCommand } from "./remember"
import { forgetCommand } from "./forget"

const COMMANDS: ChatCommand[] = [
  languageCommand,
  personalityCommand,
  modeCommand,
  regionCommand,
  budgetCommand,
  tripCommand,
  systemCommand,
  clearCommand,
  newChatCommand,
  helpCommand,
  rememberCommand,
  forgetCommand,
]

/** @Logic.Command.Registry.Get */
export const getCommands = (): ChatCommand[] => COMMANDS

/** @Logic.Command.Registry.Filter */
export const filterCommands = (query: string): ChatCommand[] => {
  const q = query.toLowerCase().trim()
  if (!q) return COMMANDS.filter((c) => !c.isHidden)

  return COMMANDS.filter((c) => {
    if (c.isHidden) return false

    const nameMatch = c.name.toLowerCase().includes(q) || c.name.replace("/", "").startsWith(q)
    const aliasMatch = c.aliases?.some(
      (a) => a.toLowerCase().includes(q) || a.replace("/", "").startsWith(q)
    )
    const descMatch = c.description.toLowerCase().includes(q)

    return nameMatch || aliasMatch || descMatch
  })
}
