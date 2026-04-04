/** @Command.Budget */

import { Effect, Schema } from "effect"
import type { ChatCommand } from "./types"
import { CommandError } from "../effect/errors"
import { BudgetSchema, COMMAND_DEFS } from "../effect/schemas/CommandSchema"

const def = COMMAND_DEFS.budget

const LABELS: Record<string, string> = {
  "económico": "Budget-friendly",
  "moderado": "Moderate",
  "lujo": "Luxury",
}

/** @Logic.Budget.Aliases */
const ALIASES: Record<string, string> = {
  "budget": "económico",
  "moderate": "moderado",
  "luxury": "lujo",
}

export const budgetCommand: ChatCommand = {
  type: def.type,
  name: def.name,
  aliases: [...def.aliases],
  description: def.description,
  argumentHint: def.argumentHint,
  category: def.category,
  execute: (args: string) =>
    Effect.gen(function* () {
      const raw = args.trim().toLowerCase()
      const normalized = ALIASES[raw] ?? raw
      yield* Effect.try({
        try: () => Schema.decodeUnknownSync(BudgetSchema)(normalized),
        catch: () => new CommandError({ code: "INVALID_ARGS", message: `Uso: ${def.name} económico|moderado|lujo` })
      })

      return { type: "setting", key: def.settingKey, value: normalized, toast: `Budget: ${LABELS[normalized] || normalized}` }
    })
}
