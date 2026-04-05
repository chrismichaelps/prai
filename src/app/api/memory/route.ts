/** @Route.Memory */
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { Effect, pipe, Schema as S } from "effect"
import { UnauthorizedError, ValidationError } from "@/app/api/_lib/errors"
import { exitResponse } from "../_lib/response"

const SaveMemoryBodySchema = S.Struct({
  key: S.String.pipe(S.minLength(1)),
  value: S.String.pipe(S.minLength(1)),
  category: S.Literal("preference", "fact", "itinerary", "contact"),
})

const DeleteMemoryBodySchema = S.Struct({
  key: S.String.pipe(S.minLength(1)),
})

/** @Route.Memory.POST */
export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const program = pipe(
    Effect.tryPromise({
      try: () => request.json(),
      catch: (e) => new ValidationError({ message: `Failed to parse JSON: ${String(e)}` }),
    }),
    Effect.flatMap((data) =>
      pipe(
        S.decodeUnknown(SaveMemoryBodySchema)(data),
        Effect.mapError((e) => new ValidationError({ message: "Cuerpo inválido", details: String(e) }))
      )
    ),
    Effect.flatMap((body) =>
      Effect.tryPromise({
        try: async () => {
          const supabase = await createClient()
          const { data: { session } } = await supabase.auth.getSession()
          if (!session?.user) throw new UnauthorizedError({ message: "Autenticación requerida" })

          const now = Date.now()
          const { error } = await supabase
            .from("session_memory")
            .upsert(
              {
                user_id: session.user.id,
                memory_key: body.key,
                memory_value: body.value,
                category: body.category,
                extracted_at: now,
                updated_at: new Date().toISOString(),
              },
              { onConflict: "user_id,memory_key" }
            )

          if (error) throw new Error(error.message)
          return { key: body.key, category: body.category, saved: true }
        },
        catch: (e) =>
          e instanceof UnauthorizedError ? e : new ValidationError({ message: String(e) }),
      })
    )
  )

  return exitResponse(NextResponse.json, {
    spanName: "memory.save",
    method: "POST",
    path: request.url,
    searchParams,
  })(program)
}

/** @Route.Memory.DELETE */
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const program = pipe(
    Effect.tryPromise({
      try: () => request.json(),
      catch: (e) => new ValidationError({ message: `Failed to parse JSON: ${String(e)}` }),
    }),
    Effect.flatMap((data) =>
      pipe(
        S.decodeUnknown(DeleteMemoryBodySchema)(data),
        Effect.mapError((e) => new ValidationError({ message: "Cuerpo inválido", details: String(e) }))
      )
    ),
    Effect.flatMap((body) =>
      Effect.tryPromise({
        try: async () => {
          const supabase = await createClient()
          const { data: { session } } = await supabase.auth.getSession()
          if (!session?.user) throw new UnauthorizedError({ message: "Autenticación requerida" })

          const { error } = await supabase
            .from("session_memory")
            .delete()
            .eq("user_id", session.user.id)
            .eq("memory_key", body.key)

          if (error) throw new Error(error.message)
          return { key: body.key, deleted: true }
        },
        catch: (e) =>
          e instanceof UnauthorizedError ? e : new ValidationError({ message: String(e) }),
      })
    )
  )

  return exitResponse(NextResponse.json, {
    spanName: "memory.delete",
    method: "DELETE",
    path: request.url,
    searchParams,
  })(program)
}
