/** @Route.Chat.ArchivedChats */
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import type { ValidationError } from "../../../_lib/errors"
import { ChatDbError, chatService } from "../../services/chat"
import { decodeSearchParams, S } from "../../../_lib/validation"
import { exitResponse } from "../../../_lib/response"
import { Effect, pipe } from "effect"

type ApiError = ValidationError | ChatDbError

/** @Route.Chat.ArchivedChats.GET */
export async function GET(request: NextRequest) {
  /** @Logic.Chat.GetArchived */
  const { searchParams } = new URL(request.url)
  
  const program: Effect.Effect<unknown, ApiError> = pipe(
    decodeSearchParams(
      S.Struct({
        userId: S.String.pipe(
          S.filter((s: string) => s.trim().length > 0, { message: () => "userId is required" })
        )
      })
    )(searchParams),
    Effect.flatMap((params) => 
      pipe(
        chatService.getArchivedChats(params.userId),
        Effect.mapError((e) => new ChatDbError({ error: e }))
      )
    )
  )

  return exitResponse(NextResponse.json)(program)
}
