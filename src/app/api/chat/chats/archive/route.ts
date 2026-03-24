/** @Route.Chat.ChatsArchive */
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { HttpStatus } from "../../../_lib/constants/status-codes"
import type { ValidationError } from "../../../_lib/errors"
import { ChatDbError, chatService } from "../../services/chat"
import { decodeBody, S } from "../../../_lib/validation"
import { exitResponse } from "../../../_lib/response"
import { Effect, pipe } from "effect"

type ApiError = ValidationError | ChatDbError

/** @Route.Chat.ChatsArchive.POST */
export async function POST(request: NextRequest) {
  /** @Logic.Chat.ArchiveAll */
  const program: Effect.Effect<void, ApiError> = pipe(
    decodeBody(
      S.Struct({
        userId: S.String.pipe(
          S.filter((s: string) => s.trim().length > 0, { message: () => "userId is required" })
        )
      })
    )(request),
    Effect.flatMap((data) => 
      pipe(
        chatService.archiveAllChats(data.userId),
        Effect.mapError((e) => new ChatDbError({ error: e }))
      )
    )
  )

  return exitResponse(() => new NextResponse(null, { status: HttpStatus.NO_CONTENT }))(program)
}
