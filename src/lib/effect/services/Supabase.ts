import { Effect, Context, Layer } from "effect"
import { createClient, SupabaseClient } from "@supabase/supabase-js"
import { ConfigError } from "../errors"

/** @Type.Effect.Supabase */
export type Supabase = SupabaseClient

/** @Type.Effect.SupabaseAdmin */
export type SupabaseAdmin = SupabaseClient

/** @Service.Effect.Supabase */
export const SupabaseService = Context.GenericTag<Supabase>("Supabase")

/** @Service.Effect.SupabaseAdmin */
export const SupabaseAdminService = Context.GenericTag<SupabaseAdmin>("SupabaseAdmin")

/** @Layer.Effect.Supabase */
export const SupabaseLayer = Layer.effect(
  SupabaseService,
  Effect.gen(function* () {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      yield* Effect.fail(new ConfigError({ message: "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY" }))
    }

    return createClient(supabaseUrl as string, supabaseAnonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      }
    })
  })
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

    return createClient(supabaseUrl as string, serviceRoleKey as string, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  })
)
