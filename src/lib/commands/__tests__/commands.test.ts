/** @Test.Commands */

import { describe, it, expect, beforeEach } from "vitest"
import { Effect, Exit, Layer } from "effect"
import type { UnknownAction } from "@reduxjs/toolkit"

import { Redux } from "@/lib/effect/services/Redux"
import { ChatApi } from "@/lib/effect/services/ChatApi"
import { MemoryApi } from "@/lib/effect/services/MemoryApi"
import { ConfigService } from "@/lib/effect/services/Config"
import { I18n } from "@/lib/effect/services/I18n"
import { CommandError } from "@/lib/effect/errors"
import type { RootState } from "@/store"

import { getCommands, filterCommands } from "../registry"
import { applyResult } from "../executor"
import { COMMAND_DEFS } from "@/lib/effect/schemas/CommandSchema"
import type { CommandResult } from "@/lib/effect/schemas/CommandSchema"

type SettingResult = Extract<CommandResult, { type: "setting" }>
type SystemInjectResult = Extract<CommandResult, { type: "system_inject" }>
type NavigateResult = Extract<CommandResult, { type: "navigate" }>
type PayloadAction = { type: string; payload: Record<string, unknown> }
type CommandDef = { name: string; description: string; category: string; type: string; settingKey?: string }

const cmd = (name: string) => {
  const c = getCommands().find((c) => c.name === name)
  if (!c) throw new Error(`Command "${name}" not found in registry`)
  return c
}

const makeReduxLayer = (dispatched: UnknownAction[], stateOverride?: Partial<RootState>) =>
  Layer.succeed(
    Redux,
    Redux.of({
      _tag: "Redux" as const,
      dispatch: (action: UnknownAction) => Effect.sync(() => { dispatched.push(action); return action }),
      getState: () => Effect.sync(() => ({
        chat: { chatSettings: stateOverride ?? {} },
        ...stateOverride,
      } as RootState)),
    })
  )

const ChatApiNoopLayer = Layer.succeed(
  ChatApi,
  {
    addMessage: () => Effect.die("addMessage called unexpectedly"),
    getMessages: () => Effect.die("getMessages called unexpectedly"),
    updateChat: () => Effect.die("updateChat called unexpectedly"),
    getChat: () => Effect.die("getChat called unexpectedly"),
    updateSettings: () => Effect.void,
    updateUserLanguage: () => Effect.void,
  }
)

const makeMemoryApiLayer = (saved: Array<{ key: string; value: string }> = [], forgotten: string[] = []) =>
  Layer.succeed(
    MemoryApi,
    {
      save: (payload) => Effect.sync(() => { saved.push({ key: payload.key, value: payload.value }) }),
      forget: (key) => Effect.sync(() => { forgotten.push(key) }),
    }
  )

const ConfigNoopLayer = Layer.succeed(
  ConfigService,
  ConfigService.of({
    _tag: "Config" as const,
    openRouterBaseUrl: "",
    models: { default: "test-model", premium: "" },
    apiKey: "",
    siteUrl: "",
    systemPrompt: "",
    errorMessages: { connectionError: "", configError: "", adaptiveParsingError: "" },
    chatRequestConfig: { stream: false, temperature: 0.7, maxTokens: 1000 },
  })
)

const I18nNoopLayer = Layer.succeed(
  I18n,
  {
    t: (key: string) => key,
    locale: Effect.succeed("es" as const),
    setLocale: () => Effect.void,
  }
)

const makeCommandLayer = (dispatched: UnknownAction[]) =>
  Layer.mergeAll(makeReduxLayer(dispatched), ChatApiNoopLayer, makeMemoryApiLayer(), ConfigNoopLayer, I18nNoopLayer)

const runCommand = <A>(
  effect: Effect.Effect<A, CommandError, Redux | ChatApi | ConfigService | I18n>,
  dispatched: UnknownAction[] = []
) =>
  Effect.runPromiseExit(
    effect.pipe(Effect.provide(makeCommandLayer(dispatched)))
  )

const runExecutor = <A>(
  effect: Effect.Effect<A, CommandError, Redux | ChatApi | MemoryApi>,
  dispatched: UnknownAction[] = []
) =>
  Effect.runPromiseExit(
    effect.pipe(
      Effect.provide(Layer.mergeAll(makeReduxLayer(dispatched), ChatApiNoopLayer, makeMemoryApiLayer()))
    )
  )

const isSuccess = <A>(exit: Exit.Exit<A, unknown>): exit is Exit.Success<A, unknown> =>
  Exit.isSuccess(exit)

const isFailure = <E>(exit: Exit.Exit<unknown, E>): exit is Exit.Failure<unknown, E> =>
  Exit.isFailure(exit)

const getError = (exit: Exit.Exit<unknown, CommandError>): CommandError => {
  if (!isFailure(exit)) throw new Error("Expected failure")
  const cause = exit.cause
  if (cause._tag === "Fail") return cause.error as CommandError
  throw new Error("Unexpected cause: " + cause._tag)
}

describe("COMMAND_DEFS", () => {
  it("all descriptions are in Spanish (no English words as first word)", () => {
    const englishFirstWords = ["Change", "Set", "Adjust", "Scope", "Show", "Start", "Clear", "Inject"]
    for (const [key, def] of Object.entries(COMMAND_DEFS)) {
      const firstWord = def.description.split(" ")[0]!
      expect(
        englishFirstWords.includes(firstWord),
        `${key}.description starts with English word "${firstWord}": "${def.description}"`
      ).toBe(false)
    }
  })

  it("region argumentHint uses Spanish values", () => {
    expect(COMMAND_DEFS.region.argumentHint).toContain("norte")
    expect(COMMAND_DEFS.region.argumentHint).toContain("sur")
    expect(COMMAND_DEFS.region.argumentHint).toContain("todos")
  })

  it("mode argumentHint uses Spanish values", () => {
    expect(COMMAND_DEFS.mode.argumentHint).toContain("experto")
    expect(COMMAND_DEFS.mode.argumentHint).toContain("turista")
    expect(COMMAND_DEFS.mode.argumentHint).toContain("familia")
  })

  it("personality argumentHint uses Spanish values", () => {
    expect(COMMAND_DEFS.personality.argumentHint).toContain("guía")
    expect(COMMAND_DEFS.personality.argumentHint).toContain("historiador")
    expect(COMMAND_DEFS.personality.argumentHint).toContain("aventurero")
  })

  it("budget argumentHint uses Spanish values", () => {
    expect(COMMAND_DEFS.budget.argumentHint).toContain("económico")
    expect(COMMAND_DEFS.budget.argumentHint).toContain("moderado")
    expect(COMMAND_DEFS.budget.argumentHint).toContain("lujo")
  })

  it("all commands have name, description, category, type", () => {
    for (const [key, def] of Object.entries(COMMAND_DEFS)) {
      expect(def.name, `${key}.name`).toBeTruthy()
      expect(def.description, `${key}.description`).toBeTruthy()
      expect(def.category, `${key}.category`).toBeTruthy()
      expect(def.type, `${key}.type`).toBeTruthy()
    }
  })
})

describe("registry", () => {
  describe("getCommands", () => {
    it("returns a non-empty list", () => {
      expect(getCommands().length).toBeGreaterThan(0)
    })

    it("contains all expected commands", () => {
      const names = getCommands().map((c) => c.name)
      expect(names).toContain("/region")
      expect(names).toContain("/mode")
      expect(names).toContain("/personality")
      expect(names).toContain("/budget")
      expect(names).toContain("/language")
      expect(names).toContain("/trip")
      expect(names).toContain("/system")
      expect(names).toContain("/clear")
      expect(names).toContain("/new")
      expect(names).toContain("/help")
    })

    it("every command has a name starting with /", () => {
      for (const cmd of getCommands()) {
        expect(cmd.name.startsWith("/"), `"${cmd.name}" should start with /`).toBe(true)
      }
    })

    it("no duplicate command names", () => {
      const names = getCommands().map((c) => c.name)
      expect(names.length).toBe(new Set(names).size)
    })
  })

  describe("filterCommands", () => {
    it("returns all visible commands on empty query", () => {
      const all = filterCommands("")
      expect(all.length).toBeGreaterThan(0)
      expect(all.every((c) => !c.isHidden)).toBe(true)
    })

    it("matches by exact name (without slash)", () => {
      const result = filterCommands("region")
      expect(result.some((c) => c.name === "/region")).toBe(true)
    })

    it("matches by alias", () => {
      const result = filterCommands("modo")
      expect(result.some((c) => c.name === "/mode")).toBe(true)
    })

    it("matches by alias — /idioma → /language", () => {
      const result = filterCommands("idioma")
      expect(result.some((c) => c.name === "/language")).toBe(true)
    })

    it("matches by description keyword (Spanish)", () => {
      const result = filterCommands("presupuesto")
      expect(result.some((c) => c.name === "/budget")).toBe(true)
    })

    it("returns empty array for unrecognized query", () => {
      const result = filterCommands("zzznomatch999")
      expect(result).toHaveLength(0)
    })

    it("is case-insensitive", () => {
      const lower = filterCommands("region")
      const upper = filterCommands("REGION")
      expect(lower.map((c) => c.name)).toEqual(upper.map((c) => c.name))
    })

    it("partial prefix match works", () => {
      const result = filterCommands("reg")
      expect(result.some((c) => c.name === "/region")).toBe(true)
    })

    it("does not include hidden commands", () => {
      const result = filterCommands("")
      expect(result.every((c) => !c.isHidden)).toBe(true)
    })
  })
})

describe("/region", () => {
  let dispatched: UnknownAction[]
  beforeEach(() => { dispatched = [] })

  // Valid Spanish values
  const spanishValues = ["norte", "sur", "este", "oeste", "metro", "todos"] as const

  for (const value of spanishValues) {
    it(`accepts Spanish value "${value}"`, async () => {
      const exit = await runCommand(cmd("/region").execute(value), dispatched)
      expect(isSuccess(exit)).toBe(true)
      if (isSuccess(exit)) {
        expect(exit.value.type).toBe("setting")
        expect((exit.value as SettingResult).value).toBe(value)
      }
    })
  }

  // English aliases
  const aliases: [string, string][] = [
    ["north", "norte"],
    ["south", "sur"],
    ["east", "este"],
    ["west", "oeste"],
    ["all", "todos"],
  ]

  for (const [english, spanish] of aliases) {
    it(`maps English alias "${english}" → "${spanish}"`, async () => {
      const exit = await runCommand(cmd("/region").execute(english), dispatched)
      expect(isSuccess(exit)).toBe(true)
      if (isSuccess(exit)) {
        expect((exit.value as SettingResult).value).toBe(spanish)
      }
    })
  }

  it("accepts metro (same in both languages)", async () => {
    const exit = await runCommand(cmd("/region").execute("metro"), dispatched)
    expect(isSuccess(exit)).toBe(true)
  })

  it("toast is in Spanish", async () => {
    const exit = await runCommand(cmd("/region").execute("norte"), dispatched)
    if (isSuccess(exit)) {
      expect((exit.value as SettingResult).toast).toContain("North")
    }
  })

  it("execute does not dispatch (dispatch is executor's job)", async () => {
    await runCommand(cmd("/region").execute("norte"), dispatched)
    expect(dispatched).toHaveLength(0)
  })

  it("rejects unknown value", async () => {
    const exit = await runCommand(cmd("/region").execute("central"), dispatched)
    expect(isFailure(exit)).toBe(true)
    const err = getError(exit as Exit.Exit<unknown, CommandError>)
    expect(err.code).toBe("INVALID_ARGS")
    expect(err.message).toContain("norte")
    expect(err.message).toMatch(/Uso:/i)
  })

  it("rejects empty string", async () => {
    const exit = await runCommand(cmd("/region").execute(""), dispatched)
    expect(isFailure(exit)).toBe(true)
  })

  it("trims whitespace before validating", async () => {
    const exit = await runCommand(cmd("/region").execute("  norte  "), dispatched)
    expect(isSuccess(exit)).toBe(true)
  })

  it("is case-insensitive", async () => {
    const exit = await runCommand(cmd("/region").execute("NORTE"), dispatched)
    expect(isSuccess(exit)).toBe(true)
  })

  it("does not dispatch on validation failure", async () => {
    await runCommand(cmd("/region").execute("invalid"), dispatched)
    expect(dispatched).toHaveLength(0)
  })
})

describe("/mode", () => {
  let dispatched: UnknownAction[]
  beforeEach(() => { dispatched = [] })

  const spanishValues = ["experto", "casual", "turista", "familia"] as const

  for (const value of spanishValues) {
    it(`accepts Spanish value "${value}"`, async () => {
      const exit = await runCommand(cmd("/mode").execute(value), dispatched)
      expect(isSuccess(exit)).toBe(true)
      if (isSuccess(exit)) {
        expect((exit.value as SettingResult).value).toBe(value)
      }
    })
  }

  const aliases: [string, string][] = [
    ["expert", "experto"],
    ["tourist", "turista"],
    ["family", "familia"],
  ]

  for (const [english, spanish] of aliases) {
    it(`maps English alias "${english}" → "${spanish}"`, async () => {
      const exit = await runCommand(cmd("/mode").execute(english), dispatched)
      expect(isSuccess(exit)).toBe(true)
      if (isSuccess(exit)) {
        expect((exit.value as SettingResult).value).toBe(spanish)
      }
    })
  }

  it("casual has no alias (same in English)", async () => {
    const exit = await runCommand(cmd("/mode").execute("casual"), dispatched)
    expect(isSuccess(exit)).toBe(true)
  })

  it("error message uses Spanish values", async () => {
    const exit = await runCommand(cmd("/mode").execute("invalid"), dispatched)
    const err = getError(exit as Exit.Exit<unknown, CommandError>)
    expect(err.message).toContain("experto")
    expect(err.message).toMatch(/Uso:/i)
  })

  it("execute does not dispatch (dispatch is executor's job)", async () => {
    await runCommand(cmd("/mode").execute("experto"), dispatched)
    expect(dispatched).toHaveLength(0)
  })

  it("rejects empty string", async () => {
    const exit = await runCommand(cmd("/mode").execute(""), dispatched)
    expect(isFailure(exit)).toBe(true)
  })

  it("is case-insensitive", async () => {
    const exit = await runCommand(cmd("/mode").execute("CASUAL"), dispatched)
    expect(isSuccess(exit)).toBe(true)
  })
})

describe("/personality", () => {
  let dispatched: UnknownAction[]
  beforeEach(() => { dispatched = [] })

  const spanishValues = ["guía", "chef", "historiador", "aventurero", "local"] as const

  for (const value of spanishValues) {
    it(`accepts Spanish value "${value}"`, async () => {
      const exit = await runCommand(cmd("/personality").execute(value), dispatched)
      expect(isSuccess(exit)).toBe(true)
    })
  }

  const aliases: [string, string][] = [
    ["guide", "guía"],
    ["historian", "historiador"],
    ["adventurer", "aventurero"],
  ]

  for (const [english, spanish] of aliases) {
    it(`maps English alias "${english}" → "${spanish}"`, async () => {
      const exit = await runCommand(cmd("/personality").execute(english), dispatched)
      expect(isSuccess(exit)).toBe(true)
      if (isSuccess(exit)) {
        expect((exit.value as SettingResult).value).toBe(spanish)
      }
    })
  }

  it("empty args defaults to guía without dispatching", async () => {
    const exit = await runCommand(cmd("/personality").execute(""), dispatched)
    expect(isSuccess(exit)).toBe(true)
    if (isSuccess(exit)) {
      expect((exit.value as SettingResult).value).toBe("guía")
      expect((exit.value as SettingResult).toast).toBe("Personality: tour guide")
    }
    // No dispatch for default case
    expect(dispatched).toHaveLength(0)
  })

  it("chef and local have no English alias (same word)", async () => {
    for (const value of ["chef", "local"] as const) {
      const exit = await runCommand(cmd("/personality").execute(value), dispatched)
      expect(isSuccess(exit)).toBe(true)
    }
  })

  it("error message uses Spanish values", async () => {
    const exit = await runCommand(cmd("/personality").execute("pirate"), dispatched)
    const err = getError(exit as Exit.Exit<unknown, CommandError>)
    expect(err.message).toContain("guía")
    expect(err.message).toMatch(/Uso:/i)
  })

  it("execute does not dispatch (dispatch is executor's job)", async () => {
    await runCommand(cmd("/personality").execute("guide"), dispatched)
    expect(dispatched).toHaveLength(0)
  })

  it("is case-insensitive", async () => {
    const exit = await runCommand(cmd("/personality").execute("CHEF"), dispatched)
    expect(isSuccess(exit)).toBe(true)
  })
})

describe("/budget", () => {
  let dispatched: UnknownAction[]
  beforeEach(() => { dispatched = [] })

  const spanishValues = ["económico", "moderado", "lujo"] as const

  for (const value of spanishValues) {
    it(`accepts Spanish value "${value}"`, async () => {
      const exit = await runCommand(cmd("/budget").execute(value), dispatched)
      expect(isSuccess(exit)).toBe(true)
      if (isSuccess(exit)) {
        expect((exit.value as SettingResult).value).toBe(value)
      }
    })
  }

  const aliases: [string, string][] = [
    ["budget", "económico"],
    ["moderate", "moderado"],
    ["luxury", "lujo"],
  ]

  for (const [english, spanish] of aliases) {
    it(`maps English alias "${english}" → "${spanish}"`, async () => {
      const exit = await runCommand(cmd("/budget").execute(english), dispatched)
      expect(isSuccess(exit)).toBe(true)
      if (isSuccess(exit)) {
        expect((exit.value as SettingResult).value).toBe(spanish)
      }
    })
  }

  it("toast label is in Spanish", async () => {
    const exit = await runCommand(cmd("/budget").execute("lujo"), dispatched)
    if (isSuccess(exit)) {
      expect((exit.value as SettingResult).toast).toContain("Luxury")
    }
  })

  it("rejects unknown value", async () => {
    const exit = await runCommand(cmd("/budget").execute("premium"), dispatched)
    expect(isFailure(exit)).toBe(true)
    const err = getError(exit as Exit.Exit<unknown, CommandError>)
    expect(err.message).toContain("económico")
  })

  it("execute does not dispatch (dispatch is executor's job)", async () => {
    await runCommand(cmd("/budget").execute("moderado"), dispatched)
    expect(dispatched).toHaveLength(0)
  })

  it("is case-insensitive", async () => {
    const exit = await runCommand(cmd("/budget").execute("LUJO"), dispatched)
    expect(isSuccess(exit)).toBe(true)
  })
})

describe("/language", () => {
  let dispatched: UnknownAction[]
  beforeEach(() => { dispatched = [] })

  it("accepts 'es'", async () => {
    const exit = await runCommand(cmd("/language").execute("es"), dispatched)
    expect(isSuccess(exit)).toBe(true)
    if (isSuccess(exit)) {
      expect((exit.value as SettingResult).value).toBe("es")
      expect((exit.value as SettingResult).toast).toBe("Language: Español")
    }
  })

  it("accepts 'en'", async () => {
    const exit = await runCommand(cmd("/language").execute("en"), dispatched)
    expect(isSuccess(exit)).toBe(true)
    if (isSuccess(exit)) {
      expect((exit.value as SettingResult).value).toBe("en")
      expect((exit.value as SettingResult).toast).toBe("Language: English")
    }
  })

  it("rejects unknown language code", async () => {
    const exit = await runCommand(cmd("/language").execute("fr"), dispatched)
    expect(isFailure(exit)).toBe(true)
    const err = getError(exit as Exit.Exit<unknown, CommandError>)
    expect(err.code).toBe("INVALID_ARGS")
  })

  it("rejects empty string", async () => {
    const exit = await runCommand(cmd("/language").execute(""), dispatched)
    expect(isFailure(exit)).toBe(true)
  })

  it("execute does not dispatch (dispatch is executor's job)", async () => {
    await runCommand(cmd("/language").execute("es"), dispatched)
    expect(dispatched).toHaveLength(0)
  })

  it("is case-insensitive", async () => {
    const exit = await runCommand(cmd("/language").execute("ES"), dispatched)
    expect(isSuccess(exit)).toBe(true)
  })
})

describe("/trip", () => {
  let dispatched: UnknownAction[]
  beforeEach(() => { dispatched = [] })

  it("sets a trip date", async () => {
    const exit = await runCommand(cmd("/trip").execute("2025-03-15"), dispatched)
    expect(isSuccess(exit)).toBe(true)
    if (isSuccess(exit)) {
      expect((exit.value as SettingResult).value).toBe("2025-03-15")
      expect((exit.value as SettingResult).toast).toContain("2025-03-15")
    }
  })

  it("accepts free-form date strings", async () => {
    const exit = await runCommand(cmd("/trip").execute("Semana Santa 2025"), dispatched)
    expect(isSuccess(exit)).toBe(true)
    if (isSuccess(exit)) {
      expect((exit.value as SettingResult).value).toBe("Semana Santa 2025")
    }
  })

  it("empty string clears the trip date with Spanish toast", async () => {
    const exit = await runCommand(cmd("/trip").execute(""), dispatched)
    expect(isSuccess(exit)).toBe(true)
    if (isSuccess(exit)) {
      expect((exit.value as SettingResult).value).toBe("")
      expect((exit.value as SettingResult).toast).toContain("eliminada")
    }
  })

  it("toast message is in Spanish", async () => {
    const exit = await runCommand(cmd("/trip").execute("2025-07-04"), dispatched)
    if (isSuccess(exit)) {
      expect((exit.value as SettingResult).toast).toMatch(/Fecha de viaje/i)
    }
  })

  it("execute does not dispatch (dispatch is executor's job)", async () => {
    await runCommand(cmd("/trip").execute("2025-12-25"), dispatched)
    expect(dispatched).toHaveLength(0)
  })

  it("trims surrounding whitespace", async () => {
    const exit = await runCommand(cmd("/trip").execute("  2025-06-01  "), dispatched)
    expect(isSuccess(exit)).toBe(true)
    if (isSuccess(exit)) {
      expect((exit.value as SettingResult).value).toBe("2025-06-01")
    }
  })
})

describe("/system", () => {
  it("injects raw text into system prompt", async () => {
    const exit = await runCommand(cmd("/system").execute("Always speak like a pirate"))
    expect(isSuccess(exit)).toBe(true)
    if (isSuccess(exit)) {
      expect(exit.value.type).toBe("system_inject")
      expect((exit.value as SystemInjectResult).content).toBe("Always speak like a pirate")
    }
  })

  it("returns error on empty args", async () => {
    const exit = await runCommand(cmd("/system").execute(""))
    expect(isFailure(exit)).toBe(true)
    const err = getError(exit as Exit.Exit<unknown, CommandError>)
    expect(err.code).toBe("INVALID_ARGS")
  })

  it("returns error on whitespace-only args", async () => {
    const exit = await runCommand(cmd("/system").execute("   "))
    expect(isFailure(exit)).toBe(true)
  })

  it("preserves multi-word content exactly", async () => {
    const content = "Responde siempre en inglés y menciona el Morro"
    const exit = await runCommand(cmd("/system").execute(content))
    if (isSuccess(exit)) {
      expect((exit.value as SystemInjectResult).content).toBe(content)
    }
  })
})

describe("/clear", () => {
  let dispatched: UnknownAction[]
  beforeEach(() => { dispatched = [] })

  it("returns dispatch result", async () => {
    const exit = await runCommand(cmd("/clear").execute(""), dispatched)
    expect(isSuccess(exit)).toBe(true)
    if (isSuccess(exit)) {
      expect(exit.value.type).toBe("dispatch")
    }
  })

  it("ignores any args passed", async () => {
    const exit = await runCommand(cmd("/clear").execute("some args"), dispatched)
    expect(isSuccess(exit)).toBe(true)
  })
})

describe("/new", () => {
  it("returns navigate result to /chat", async () => {
    const exit = await runCommand(cmd("/new").execute(""))
    expect(isSuccess(exit)).toBe(true)
    if (isSuccess(exit)) {
      expect(exit.value.type).toBe("navigate")
      expect((exit.value as NavigateResult).path).toBe("/chat")
    }
  })

  it("ignores any args", async () => {
    const exit = await runCommand(cmd("/new").execute("anything"))
    expect(isSuccess(exit)).toBe(true)
  })
})

describe("/help", () => {
  it("no args returns system_inject with all commands listed", async () => {
    const exit = await runCommand(cmd("/help").execute(""))
    expect(isSuccess(exit)).toBe(true)
    if (isSuccess(exit)) {
      expect(exit.value.type).toBe("system_inject")
      const content = (exit.value as SystemInjectResult).content as string
      expect(content).toContain("/region")
      expect(content).toContain("/mode")
      expect(content).toContain("/budget")
      expect(content).toContain("/personality")
      expect(content).toContain("/clear")
      expect(content).toContain("/help")
    }
  })

  it("lists heading in Spanish", async () => {
    const exit = await runCommand(cmd("/help").execute(""))
    if (isSuccess(exit)) {
      expect((exit.value as SystemInjectResult).content).toMatch(/comandos disponibles/i)
    }
  })

  it("specific command lookup returns that command info", async () => {
    const exit = await runCommand(cmd("/help").execute("region"))
    expect(isSuccess(exit)).toBe(true)
    if (isSuccess(exit)) {
      expect(exit.value.type).toBe("system_inject")
      expect((exit.value as SystemInjectResult).content).toContain("/region")
    }
  })

  it("specific command lookup via alias works", async () => {
    const exit = await runCommand(cmd("/help").execute("modo"))
    expect(isSuccess(exit)).toBe(true)
    if (isSuccess(exit)) {
      expect((exit.value as SystemInjectResult).content).toContain("/mode")
    }
  })

  it("unrecognized command falls back to full list", async () => {
    const exit = await runCommand(cmd("/help").execute("zzz"))
    expect(isSuccess(exit)).toBe(true)
    if (isSuccess(exit)) {
      // Falls back to full list when not found
      expect((exit.value as SystemInjectResult).content).toContain("/region")
    }
  })

  it("listed commands include their argument hints", async () => {
    const exit = await runCommand(cmd("/help").execute(""))
    if (isSuccess(exit)) {
      const content = (exit.value as SystemInjectResult).content as string
      expect(content).toContain("[norte|sur|este|oeste|metro|todos]")
    }
  })
})

describe("executor / applyResult", () => {
  let dispatched: UnknownAction[]
  beforeEach(() => { dispatched = [] })

  it("setting result dispatches updateChatSettings", async () => {
    const exit = await runExecutor(
      applyResult({ type: "setting", key: "region", value: "norte", toast: "Region: North" }, null),
      dispatched
    )
    expect(isSuccess(exit)).toBe(true)
    expect(dispatched.some((a) => a.type === "chat/updateChatSettings")).toBe(true)
    const action = dispatched.find((a) => a.type === "chat/updateChatSettings") as PayloadAction | undefined
    expect(action?.payload.key).toBe("region")
    expect(action.payload.value).toBe("norte")
  })

  it("system_inject result dispatches addMessage", async () => {
    const exit = await runExecutor(
      applyResult({ type: "system_inject", content: "Be concise" }, null),
      dispatched
    )
    expect(isSuccess(exit)).toBe(true)
    expect(dispatched.some((a) => a.type === "chat/addMessage")).toBe(true)
    const action = dispatched.find((a) => a.type === "chat/addMessage") as PayloadAction | undefined
    expect(action?.payload.role).toBe("system")
    expect(action.payload.content).toBe("Be concise")
  })

  it("dispatch result dispatches the wrapped action", async () => {
    const innerAction = { type: "chat/clearHistory" }
    const exit = await runExecutor(
      applyResult({ type: "dispatch", action: innerAction }, null),
      dispatched
    )
    expect(isSuccess(exit)).toBe(true)
    expect(dispatched.some((a) => a.type === "chat/clearHistory")).toBe(true)
  })

  it("navigate result does not dispatch anything (uses window.location)", async () => {
    const exit = await runExecutor(
      applyResult({ type: "navigate", path: "/chat" }, null),
      dispatched
    )
    expect(isSuccess(exit)).toBe(true)
    expect(dispatched).toHaveLength(0)
  })

  it("setting with chatId=null skips API call", async () => {
    // ChatApiNoopLayer would die if updateSettings were called — this should not throw
    const exit = await runExecutor(
      applyResult({ type: "setting", key: "mode", value: "experto", toast: "Mode: Expert" }, null),
      dispatched
    )
    expect(isSuccess(exit)).toBe(true)
  })

  const settingCases: Array<{ key: string; value: string; toast: string }> = [
    { key: "region", value: "norte", toast: "Region: North" },
    { key: "mode", value: "experto", toast: "Mode: Experto" },
    { key: "personality", value: "guía", toast: "Personality: tour guide" },
    { key: "budget", value: "moderado", toast: "Budget: Moderate" },
    { key: "tripDate", value: "2025-07-04", toast: "Fecha de viaje: 2025-07-04" },
  ]

  for (const { key, value, toast } of settingCases) {
    it(`setting "${key}" dispatches updateChatSettings with correct payload`, async () => {
      await runExecutor(applyResult({ type: "setting", key, value, toast }, null), dispatched)
      const action = dispatched.find((a) => a.type === "chat/updateChatSettings") as PayloadAction | undefined
      expect(action, `no updateChatSettings dispatched for "${key}"`).toBeDefined()
      expect(action?.payload.key).toBe(key)
      expect(action?.payload.value).toBe(value)
    })
  }

  it("language setting dispatches updateChatSettings with key 'language'", async () => {
    await runExecutor(applyResult({ type: "setting", key: "language", value: "es", toast: "Language: Español" }, null), dispatched)
    const action = dispatched.find((a) => a.type === "chat/updateChatSettings") as PayloadAction | undefined
    expect(action?.payload.key).toBe("language")
    expect(action.payload.value).toBe("es")
  })
})

describe("command metadata", () => {
  const cmds = getCommands()

  it("every command has a valid category", () => {
    const validCategories = ["persona", "mode", "content", "history", "system", "navigation"]
    for (const cmd of cmds) {
      expect(validCategories, `${cmd.name} has invalid category "${cmd.category}"`).toContain(cmd.category)
    }
  })

  it("every command has a valid type", () => {
    const validTypes = ["local", "prompt", "setting"]
    for (const cmd of cmds) {
      expect(validTypes, `${cmd.name} has invalid type "${cmd.type}"`).toContain(cmd.type)
    }
  })

  it("every command has an execute function", () => {
    for (const cmd of cmds) {
      expect(typeof cmd.execute, `${cmd.name}.execute`).toBe("function")
    }
  })

  it("all aliases start with /", () => {
    for (const cmd of cmds) {
      for (const alias of cmd.aliases ?? []) {
        expect(alias.startsWith("/"), `alias "${alias}" on ${cmd.name} should start with /`).toBe(true)
      }
    }
  })

  it("no alias collides with another command name", () => {
    for (const cmd of cmds) {
      for (const alias of cmd.aliases ?? []) {
        const collidesWithDifferentCmd = cmds.some(
          (other) => other.name !== cmd.name && other.name === alias
        )
        expect(collidesWithDifferentCmd, `alias "${alias}" on ${cmd.name} collides with another command`).toBe(false)
      }
    }
  })

  it("setting commands have a settingKey in COMMAND_DEFS", () => {
    const settingCmds = cmds.filter((c) => c.type === "setting")
    for (const cmd of settingCmds) {
      const def = Object.values(COMMAND_DEFS).find((d) => d.name === cmd.name)
      expect(def, `no COMMAND_DEF for ${cmd.name}`).toBeTruthy()
      expect((def as CommandDef).settingKey, `${cmd.name} missing settingKey`).toBeTruthy()
    }
  })
})
