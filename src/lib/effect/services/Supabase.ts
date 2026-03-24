import { Effect, Context, Layer } from "effect"
import { SupabaseClient } from "@supabase/supabase-js"
import { createBrowserClient } from "@supabase/ssr"
import { ConfigError } from "../errors"

/** @Type.Effect.Supabase */
export type Supabase = SupabaseClient

/** @Type.Effect.SupabaseAdmin */
export type SupabaseAdmin = SupabaseClient

/** @Service.Effect.Supabase */
export const SupabaseService = Context.GenericTag<Supabase>("Supabase")

/** @Service.Effect.SupabaseAdmin */
export const SupabaseAdminService = Context.GenericTag<SupabaseAdmin>("SupabaseAdmin")

function createClient(): SupabaseClient {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

/** @Layer.Effect.Supabase */
export const SupabaseLayer = Layer.effect(
  SupabaseService,
  Effect.sync(() => createClient())
)

/** @Layer.Effect.SupabaseAdmin */
export const SupabaseAdminLayer = Layer.effect(
  SupabaseAdminService,
  Effect.gen(function* () {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      yield* Effect.fail(new ConfigError({ message: "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY" }))
    }

    return createBrowserClient(supabaseUrl!, serviceRoleKey!)
  })
)

let cachedClient: SupabaseClient | null = null

/** @Logic.Supabase.GetBrowserClient */
export function getSupabaseBrowserClient(): SupabaseClient {
  if (typeof window === 'undefined') {
    return createClient()
  }
  
  if (!cachedClient) {
    cachedClient = createClient()
  }
  
  return cachedClient
}
