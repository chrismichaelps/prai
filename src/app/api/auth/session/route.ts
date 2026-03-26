/** @Route.Auth.Session */
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { HttpStatus } from "@/app/api/_lib/constants/status-codes"

/** @Route.Auth.Session.GET */
export async function GET(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      { error: "Missing Supabase configuration" },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    )
  }

  /** @Logic.Supabase.ServerClient */
  let _cookiesToSet: { name: string; value: string; options: Record<string, unknown> }[] = []

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookies) {
        _cookiesToSet = cookies
      }
    }
  })
  
  const { data: { session }, error } = await supabase.auth.getSession()

  if (error) {
    return NextResponse.json({ session: null, user: null }, { status: HttpStatus.OK })
  }

  return NextResponse.json({ session, user: session?.user ?? null })
}
