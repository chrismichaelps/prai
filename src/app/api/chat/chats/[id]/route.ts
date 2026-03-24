/** @Route.Chat.ChatById */
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { HttpStatus } from "../../../_lib/constants/status-codes"
import type { ValidationError } from "../../../_lib/errors"
import { ChatDbError, chatService } from "../../services/chat"
import { decodeParams, decodeBody, S } from "../../../_lib/validation"
import { exitResponse } from "../../../_lib/response"
import { Effect, pipe } from "effect"

type ApiError = ValidationError | ChatDbError

/** @Route.Chat.ChatById.GET */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  /** @Logic.Chat.GetMessages */
  const resolvedParams = await params
   
  const program: Effect.Effect<unknown, ApiError> = pipe(
    decodeParams(
      S.Struct({
        id: S.String.pipe(
          S.filter((s: string) => s.trim().length > 0, { message: () => "Invalid chat ID" })
        )
      })
    )(resolvedParams),
    Effect.flatMap((validated) => 
      pipe(
        chatService.getMessages(validated.id),
        Effect.mapError((e) => new ChatDbError({ error: e }))
      )
    )
  )

  return exitResponse(NextResponse.json)(program)
}

/** @Route.Chat.ChatById.PATCH */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  /** @Logic.Chat.UpdateChat */
  const resolvedParams = await params
   
  const program: Effect.Effect<unknown, ApiError> = pipe(
    decodeParams(
      S.Struct({
        id: S.String.pipe(
          S.filter((s: string) => s.trim().length > 0, { message: () => "Invalid chat ID" })
        )
      })
    )(resolvedParams),
    Effect.flatMap((validated) =>
      pipe(
        decodeBody(
          S.Struct({
            is_archived: S.Boolean
          })
        )(request),
        Effect.flatMap((body) => 
          pipe(
            chatService.updateChat(validated.id, { is_archived: body.is_archived }),
            Effect.mapError((e) => new ChatDbError({ error: e }))
          )
        )
      )
    )
  )

  return exitResponse(NextResponse.json)(program)
}

/** @Route.Chat.ChatById.DELETE */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  /** @Logic.Chat.DeleteChat */
  const resolvedParams = await params
   
  const program: Effect.Effect<void, ApiError> = pipe(
    decodeParams(
      S.Struct({
        id: S.String.pipe(
          S.filter((s: string) => s.trim().length > 0, { message: () => "Invalid chat ID" })
        )
      })
    )(resolvedParams),
    Effect.flatMap((validated) => 
      pipe(
        chatService.deleteChat(validated.id),
        Effect.mapError((e) => new ChatDbError({ error: e }))
      )
    )
  )

  return exitResponse(() => new NextResponse(null, { status: HttpStatus.NO_CONTENT }))(program)
}
