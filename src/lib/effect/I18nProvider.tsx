'use client'

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { Effect } from 'effect'
import { runtime } from './runtime'
import { I18n, type Locale } from './services/I18n'
import { translate } from './i18n'
import { RuntimeError } from './errors'

interface I18nContextType {
  locale: Locale
  t: (key: string) => string
  setLocale: (l: Locale) => void
}

const I18nContext = createContext<I18nContextType | null>(null)

/** @UI.Provider.I18n */
export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('es')

  useEffect(() => {
    // Initialize from runtime service
    const init = Effect.gen(function* () {
      const service = yield* I18n
      const current = yield* service.locale
      setLocaleState(current)
    })
    runtime.runPromise(init)
  }, [])

  const contextValue = useMemo(() => ({
    locale,
    t: (key: string) => translate(locale, key),
    setLocale: (l: Locale) => {
      const action = Effect.gen(function* () {
        const service = yield* I18n
        yield* service.setLocale(l)
        setLocaleState(l)
      })
      runtime.runPromise(action)
    }
  }), [locale])

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  )
}

/** @UI.Hook.I18n */
export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new RuntimeError({
      message: 'useI18n must be used within an I18nProvider',
    })
  }
  return context
}
