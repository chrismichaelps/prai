import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

/** @Route.Auth.Session */
export async function GET(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      { error: "Missing Supabase configuration" },
      { status: 500 }
    )
  }

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
  
  const { data: { session }, error } = await supabase.auth.getSession()

  if (error) {
    return NextResponse.json({ session: null, user: null }, { status: 200 })
  }

  return NextResponse.json({ session, user: session?.user ?? null })
}
