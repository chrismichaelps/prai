/** @Route.User.Usage.Jina */
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { JinaLimits } from "@/lib/effect/constants/JinaConstants"

export type JinaUsage = {
  searches_used: number
  searches_remaining: number
  daily_limit: number
  reset_at: string | null
}

/** @Route.User.Usage.Jina.GET */
export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("jina_searches_used, jina_searches_reset")
      .eq("id", user.id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: "Failed to fetch Jina usage" }, { status: 500 })
    }

    const daily_limit = JinaLimits.USER_DAILY_SEARCHES
    const searches_used = data.jina_searches_used ?? 0
    const reset_at = data.jina_searches_reset ?? null

    /** @Logic.Jina.DailyReset */
    const wasReset =
      reset_at !== null &&
      new Date(reset_at).getTime() < Date.now() - 24 * 60 * 60 * 1000

    const effective_used = wasReset ? 0 : searches_used

    return NextResponse.json({
      searches_used: effective_used,
      searches_remaining: Math.max(0, daily_limit - effective_used),
      daily_limit,
      reset_at,
    } satisfies JinaUsage)
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
