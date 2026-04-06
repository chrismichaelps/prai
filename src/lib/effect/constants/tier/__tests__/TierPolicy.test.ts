/** @Test.TierPolicy */

import { describe, it, expect } from "vitest"
import { TierPolicies, getSafeContextThreshold } from "../TierPolicy"
import { ModelRegistry } from "../../model/ModelRegistry"

describe("TierPolicies", () => {
  it("free tier has 20 daily messages", () => {
    expect(TierPolicies.free.dailyMessages).toBe(20)
  })

  it("free tier resets daily", () => {
    expect(TierPolicies.free.resetInterval).toBe("daily")
  })

  it("pro tier resets monthly", () => {
    expect(TierPolicies.pro.resetInterval).toBe("monthly")
  })

  it("pro tier has a cost budget", () => {
    expect(TierPolicies.pro.dailyCostBudgetUSD).toBeGreaterThan(0)
  })

  it("free tier has no cost gate", () => {
    expect(TierPolicies.free.dailyCostBudgetUSD).toBe(0)
  })

  it("pro features include nativeWebSearch", () => {
    expect(TierPolicies.pro.features.nativeWebSearch).toBe(true)
  })

  it("free features do not include nativeWebSearch", () => {
    expect(TierPolicies.free.features.nativeWebSearch).toBe(false)
  })
})

describe("getSafeContextThreshold", () => {
  it("free threshold leaves room for output tokens", () => {
    const threshold = getSafeContextThreshold("free")
    const model = ModelRegistry[TierPolicies.free.modelKey]
    expect(threshold + model.maxOutputTokens).toBeLessThanOrEqual(model.contextWindow)
  })

  it("pro threshold leaves room for output tokens", () => {
    const threshold = getSafeContextThreshold("pro")
    const model = ModelRegistry[TierPolicies.pro.modelKey]
    expect(threshold + model.maxOutputTokens).toBeLessThanOrEqual(model.contextWindow)
  })

  it("free threshold is less than pro threshold", () => {
    expect(getSafeContextThreshold("free")).toBeLessThan(getSafeContextThreshold("pro"))
  })

  it("free threshold equals floor(16384 * 0.70) - 3000", () => {
    expect(getSafeContextThreshold("free")).toBe(Math.floor(16_384 * 0.70) - 3_000)
  })

  it("pro threshold equals floor(131072 * 0.85) - 8000", () => {
    expect(getSafeContextThreshold("pro")).toBe(Math.floor(131_072 * 0.85) - 8_000)
  })
})
