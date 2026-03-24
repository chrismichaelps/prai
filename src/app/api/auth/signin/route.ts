/** @Route.Auth.Signin */
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { HttpStatus } from "@/app/api/_lib/constants/status-codes"

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

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`
    }
  })

  const response = NextResponse.json({ url: data.url, error: error?.message })

  cookiesToSet.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options as Record<string, string | number | boolean>)
  })

  return response
}
