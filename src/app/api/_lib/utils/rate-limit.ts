/** @Lib.RateLimit */
import type { NextRequest } from "next/server"
import { RateLimitConstants, HttpHeaderConstants, AppConstants } from "@/lib/constants/app-constants"

const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

const RATE_LIMIT_WINDOW_MS = RateLimitConstants.WINDOW_MS
const RATE_LIMIT_MAX_REQUESTS = RateLimitConstants.MAX_REQUESTS

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetTime) {
    const resetTime = now + RATE_LIMIT_WINDOW_MS
    rateLimitMap.set(ip, { count: 1, resetTime })
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1, resetTime }
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime }
  }

  record.count++
  return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - record.count, resetTime: record.resetTime }
}

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get(HttpHeaderConstants.X_FORWARDED_FOR)
  if (forwarded && forwarded.includes(',')) {
    return forwarded.split(',')[0]?.trim() || AppConstants.DEFAULT_UNKNOWN
  }
  if (forwarded) {
    return forwarded.trim()
  }
  const realIp = request.headers.get(HttpHeaderConstants.X_REAL_IP)
  return realIp || AppConstants.DEFAULT_UNKNOWN
}
