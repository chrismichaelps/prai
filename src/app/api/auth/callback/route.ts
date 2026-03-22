import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

/** @Route.Auth.Callback */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const error = requestUrl.searchParams.get("error")
  const errorDescription = requestUrl.searchParams.get("error_description")

  if (error) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/?error=${encodeURIComponent(errorDescription || error)}`)
  }

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseAnonKey) {
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
      
      const { data } = await supabase.auth.exchangeCodeForSession(code)
      
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
      const response = NextResponse.redirect(`${siteUrl}/?auth=success`)
      
      cookiesToSet.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options as Record<string, string | number | boolean>)
      })
      
      return response
    }
  }

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/`)
}
