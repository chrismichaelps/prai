/** @Route.Auth.Signout */
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { HttpStatus } from "@/app/api/_lib/constants/status-codes"

/** @Route.Auth.Signout.POST */
export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      { error: "Missing Supabase configuration" },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    )
  }

  /** @Logic.Supabase.ServerClient */
  let cookiesToSet: { name: string; value: string; options: Record<string, unknown> }[] = []

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookies) {
        cookiesToSet = cookies
      }
    }
  })

  const { error } = await supabase.auth.signOut()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: HttpStatus.BAD_REQUEST })
  }

  const response = NextResponse.json({ success: true })

  for (const cookie of cookiesToSet) {
    response.cookies.set(cookie.name, cookie.value, cookie.options as Parameters<typeof response.cookies.set>[2])
  }

  return response
}
