/** @Hook.Haptics */

import { useWebHaptics } from "web-haptics/react"

export type HapticType = "success" | "warning" | "error" | "light" | "medium" | "heavy" | "selection"

interface HapticsReturn {
  trigger: (type: HapticType) => void
  success: () => void
  warning: () => void
  error: () => void
  light: () => void
  medium: () => void
  heavy: () => void
  selection: () => void
}

export function useHaptics(): HapticsReturn {
  const { trigger } = useWebHaptics()

  const success = () => trigger("success")
  const warning = () => trigger("warning")
  const error = () => trigger("error")
  const light = () => trigger("light")
  const medium = () => trigger("medium")
  const heavy = () => trigger("heavy")
  const selection = () => trigger("selection")

  return {
    trigger,
    success,
    warning,
    error,
    light,
    medium,
    heavy,
    selection,
  }
}
