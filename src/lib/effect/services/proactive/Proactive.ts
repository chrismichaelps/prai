/** @Service.Effect.Proactive */

import { Effect } from "effect"
import type { ProactiveAlert, ProactiveConfig, ProactiveAlertType, ProactivePriority } from "../../schemas/proactive/ProactiveSchema"

/** @Constant.Proactive.DefaultConfig */
const DEFAULT_CONFIG: ProactiveConfig = {
  enabled: false,
  tickIntervalMs: 300_000,
  categories: ["weather_change", "event_reminder", "travel_advisory", "price_alert"],
  throttleMs: 600_000
}

/** @Service.Effect.Proactive.Class */
export class ProactiveService extends Effect.Service<ProactiveService>()("Proactive", {
  effect: Effect.gen(function* () {
    let alertHistory: ProactiveAlert[] = []
    let config: ProactiveConfig = { ...DEFAULT_CONFIG }

    const createAlert = (
      type: ProactiveAlertType,
      message: string,
      priority: ProactivePriority,
      expiresInMs?: number
    ): Effect.Effect<ProactiveAlert> =>
      Effect.sync(() => {
        const now = Date.now()
        const alert: ProactiveAlert = {
          type,
          message,
          priority,
          timestamp: now,
          expiresAt: expiresInMs ? now + expiresInMs : undefined
        }
        alertHistory = [...alertHistory, alert]
        return alert
      })

    const shouldNotify = (
      alertType: ProactiveAlertType
    ): Effect.Effect<boolean> =>
      Effect.sync(() => {
        if (!config.enabled) return false
        if (!config.categories.includes(alertType)) return false

        const lastOfType = alertHistory
          .filter((a) => a.type === alertType)
          .sort((a, b) => b.timestamp - a.timestamp)[0]

        if (!lastOfType) return true
        return Date.now() - lastOfType.timestamp >= config.throttleMs
      })

    const getActiveAlerts = (): Effect.Effect<ProactiveAlert[]> =>
      Effect.sync(() => {
        const now = Date.now()
        return alertHistory.filter(
          (a) => !a.expiresAt || a.expiresAt > now
        )
      })

    const updateConfig = (
      updates: Partial<ProactiveConfig>
    ): Effect.Effect<ProactiveConfig> =>
      Effect.sync(() => {
        config = { ...config, ...updates }
        return config
      })

    const getConfig = (): Effect.Effect<ProactiveConfig> =>
      Effect.sync(() => config)

    const reset = (): Effect.Effect<void> =>
      Effect.sync(() => {
        alertHistory = []
        config = { ...DEFAULT_CONFIG }
      })

    return { createAlert, shouldNotify, getActiveAlerts, updateConfig, getConfig, reset } as const
  })
}) {}
