import { Effect, Context } from "effect"

export type Locale = "es" | "en"

/** @Const.Locale */
export const Locales = {
  EN: "en",
  ES: "es",
} as const

/** @Service.Effect.I18n */
export class I18n extends Context.Tag("I18n")<
  I18n,
  {
    readonly t: (key: string, params?: Record<string, string>) => string
    readonly locale: Effect.Effect<Locale>
    readonly setLocale: (locale: Locale) => Effect.Effect<void>
  }
>() {}
