/** @Route.Users */
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { UnauthorizedError } from "@/app/api/_lib/errors"
import { decodeSearchParams, S, pipe } from "@/app/api/_lib/validation"
import { exitResponse } from "@/app/api/_lib/response"
import { Effect, pipe as pipeEffect } from "effect"
import { UsersDbError } from "../services/user"

const SearchParamsSchema = S.Struct({
  q: S.optional(
    pipe(
      S.String,
      S.trimmed(),
      S.maxLength(100)
    )
  ),
  offset: S.optional(S.String),
  limit: S.optional(S.String),
})

type RawParams = S.Schema.Type<typeof SearchParamsSchema>

const parseSearchParams = (params: RawParams) => ({
  q: params.q?.trim() ?? "",
  offset: params.offset ? Math.max(0, parseInt(params.offset, 10) || 0) : 0,
  limit: Math.min(50, Math.max(1, parseInt(params.limit ?? "10", 10) || 10)),
})

/** @Route.Users.Search.GET */
export async function GET(request: NextRequest) {
  const program = pipeEffect(
    decodeSearchParams(SearchParamsSchema)(request.nextUrl.searchParams),
    Effect.flatMap((rawParams) =>
      pipeEffect(
        Effect.tryPromise({
          try: async () => {
            const supabase = await createClient()
            const { data: { session } } = await supabase.auth.getSession()
            if (!session?.user) throw new UnauthorizedError({ message: "Authentication required" })
            const user = session.user
            return { supabase, user, params: parseSearchParams(rawParams) }
          },
          catch: (e) => e instanceof UnauthorizedError ? e : new UsersDbError({ error: e })
        }),
        Effect.flatMap(({ supabase, user, params }) =>
          Effect.tryPromise({
            try: async () => {
              const { data, error } = await supabase.rpc("search_users", {
                search_term: params.q,
                requesting_user_id: user.id,
                result_limit: params.limit,
                result_offset: params.offset,
              })

              if (error) {
                console.error("Search RPC error:", error)
                throw new UsersDbError({ error })
              }

              return {
                users: data ?? [],
                pagination: {
                  offset: params.offset,
                  limit: params.limit,
                  has_more: (data?.length ?? 0) === params.limit
                }
              }
            },
            catch: (e) => new UsersDbError({ error: e })
          })
        )
      )
    )
  )

  return exitResponse((data: unknown) => NextResponse.json(data))(program)
}
