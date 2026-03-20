'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { Effect } from 'effect'
import { runtime } from '../runtime'
import { BuildInfoService } from '../services/BuildInfo'

interface BuildInfoContextType {
  buildHash: string | null
}

const BuildInfoContext = createContext<BuildInfoContextType>({ buildHash: null })

/** @UI.Provider.BuildInfo */
export function BuildInfoProvider({ children }: { children: React.ReactNode }) {
  const [buildHash, setBuildHash] = useState<string | null>(null)

  useEffect(() => {
    runtime.runPromise(
      Effect.flatMap(BuildInfoService, (b) => b.getBuildHash())
    ).then(setBuildHash)
  }, [])

  return (
    <BuildInfoContext.Provider value={{ buildHash }}>
      {children}
    </BuildInfoContext.Provider>
  )
}

/** @UI.Hook.BuildInfo */
export function useBuildInfo(): string | null {
  return useContext(BuildInfoContext).buildHash
}
