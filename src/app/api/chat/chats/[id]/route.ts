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
  request: NextRequest,
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
      chatService.getMessages(validated.id)
    )
  )

  return exitResponse(NextResponse.json, {
    spanName: "chat.chats.messages.get",
    method: "GET",
    path: request.url,
    searchParams: new URL(request.url).searchParams
  })(program)
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
          chatService.updateChat(validated.id, { is_archived: body.is_archived })
        )
      )
    )
  )

  return exitResponse(NextResponse.json, {
    spanName: "chat.chats.patch",
    method: "PATCH",
    path: request.url,
    payload: await request.clone().json().catch(() => undefined)
  })(program)
}

/** @Route.Chat.ChatById.DELETE */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  /** @Logic.Chat.DeleteChat */
  const resolvedParams = await params
  const { searchParams } = new URL(request.url)
  
  const program: Effect.Effect<void, ApiError> = pipe(
    decodeParams(
      S.Struct({
        id: S.String.pipe(
          S.filter((s: string) => s.trim().length > 0, { message: () => "Invalid chat ID" })
        )
      })
    )(resolvedParams),
    Effect.flatMap((validated) => 
      chatService.deleteChat(validated.id)
    )
  )

  return exitResponse(() => new NextResponse(null, { status: HttpStatus.NO_CONTENT }), {
    spanName: "chat.chats.delete",
    method: "DELETE",
    path: request.url,
    searchParams
  })(program)
}
