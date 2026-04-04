/** @Service.Effect.Command */

import { Effect } from "effect"
import type { ChatCommand } from "@/lib/commands/types"
import { getCommands, filterCommands } from "@/lib/commands/registry"
import { applyResult } from "@/lib/commands/executor"
import type { CommandResult } from "@/lib/effect/schemas/CommandSchema"
import { FB_OK, FB_ERR, FB_INFO, FB_NAV } from "@/lib/constants/command-figures"

/** @Type.Command.ParsedInput */
export interface ParsedCommand {
  cmd: ChatCommand
  args: string
}

/** @Type.Command.Feedback */
export interface CommandFeedback {
  text: string
  type: 'success' | 'error' | 'info'
}

/** @Logic.Command.Parse */
const parseInput = (value: string): ParsedCommand | null => {
  if (!value.startsWith("/")) return null
  const [rawCmd, ...rest] = value.slice(1).split(/\s+/)
  if (!rawCmd) return null
  const cmdName = "/" + rawCmd.toLowerCase()
  const cmd = getCommands().find(
    (c) => c.name === cmdName || c.aliases?.includes(cmdName)
  )
  if (!cmd) return null
  return { cmd, args: rest.join(" ").trim() }
}

/** @Logic.Command.FeedbackFromResult */
const feedbackFromResult = (result: CommandResult, cmd: ChatCommand): CommandFeedback => {
  switch (result.type) {
    case "setting":
      return { text: result.toast, type: "success" }
    case "system_inject":
      if (cmd.name === "/help") return { text: `${FB_INFO} Comandos disponibles en el chat`, type: "info" }
      return { text: `${FB_OK} Contexto del sistema actualizado`, type: "success" }
    case "dispatch":
      return { text: `${FB_OK} Historial limpiado`, type: "success" }
    case "navigate":
      return { text: `${FB_NAV} Iniciando nueva conversación...`, type: "info" }
    case "memory":
      return { text: result.toast, type: "success" }
    case "memory_delete":
      return { text: result.toast, type: "success" }
    default:
      return { text: `${FB_OK} Listo`, type: "success" }
  }
}

/** @Service.Effect.CommandService */
export class CommandService extends Effect.Service<CommandService>()(
  "CommandService",
  {
    succeed: {
      /** @Logic.Command.GetAll */
      getAll: (): ChatCommand[] => getCommands(),

      /** @Logic.Command.Filter */
      filter: (query: string): ChatCommand[] => filterCommands(query),

      /** @Logic.Command.Parse */
      parse: (value: string): ParsedCommand | null => parseInput(value),

      /** @Logic.Command.Execute */
      execute: (cmd: ChatCommand, args: string, chatId: string | null) =>
        cmd.execute(args).pipe(
          Effect.flatMap((result) => applyResult(result, chatId)),
        ),

      /** @Logic.Command.Run */
      run: (cmd: ChatCommand, args: string, chatId: string | null) =>
        cmd.execute(args).pipe(
          Effect.flatMap((result) =>
            applyResult(result, chatId).pipe(
              Effect.map((): CommandFeedback => feedbackFromResult(result, cmd))
            )
          ),
          Effect.catchAll((err) =>
            Effect.succeed<CommandFeedback>({
              text: `${FB_ERR} ${err.message}`,
              type: "error",
            })
          ),
        ),
    },
  }
) { }
