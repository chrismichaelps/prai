/** @Type.Effect.Command */

import type { Effect } from "effect"
import type { CommandResult } from "@/lib/effect/schemas/CommandSchema"
import type { Redux } from "@/lib/effect/services/Redux"
import type { ConfigService } from "@/lib/effect/services/Config"
import type { ChatApi } from "@/lib/effect/services/ChatApi"
import type { I18n } from "@/lib/effect/services/I18n"
import type { CommandError } from "@/lib/effect/errors"

export type CommandCategory =
  | "persona"
  | "mode"
  | "content"
  | "history"
  | "system"
  | "navigation"

export type CommandType = "local" | "prompt" | "setting"

export interface ChatCommand {
  type: CommandType
  name: string
  aliases?: string[]
  description: string
  argumentHint?: string
  category: CommandCategory
  isHidden?: boolean
  isEnabled?: () => boolean
  execute: (
    args: string
  ) => Effect.Effect<CommandResult, CommandError, Redux | ConfigService | ChatApi | I18n>
}
