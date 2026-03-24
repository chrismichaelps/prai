/** @Route.Chat.Chats */
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { HttpStatus } from "../../_lib/constants/status-codes"
import { ValidationError } from "../../_lib/errors"
import { ChatDbError, chatService } from "../services/chat"
import { decodeBody, decodeSearchParams, S } from "../../_lib/validation"
import { CreateChatSchema, UpdateChatSchema } from "../schemas"
import { exitResponse } from "../../_lib/response"
import { Effect, pipe } from "effect"

type ApiError = ValidationError | ChatDbError

/** @Route.Chat.Chats.GET */
export async function GET(request: NextRequest) {
  /** @Logic.Chat.GetChats */
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
        chatService.getChats(params.userId),
        Effect.mapError((e) => new ChatDbError({ error: e }))
      )
    )
  )

  return exitResponse(NextResponse.json)(program)
}

/** @Route.Chat.Chats.POST */
export async function POST(request: NextRequest) {
  /** @Logic.Chat.CreateChat */
  const program: Effect.Effect<unknown, ApiError> = pipe(
    decodeBody(CreateChatSchema)(request),
    Effect.flatMap((data) => 
      pipe(
        chatService.createChat(data.userId, data.title),
        Effect.mapError((e) => new ChatDbError({ error: e }))
      )
    )
  )

  return exitResponse((value) => NextResponse.json(value, { status: HttpStatus.CREATED }))(program)
}

/** @Route.Chat.Chats.PATCH */
export async function PATCH(request: NextRequest) {
  /** @Logic.Chat.UpdateChat */
  const program: Effect.Effect<unknown, ApiError> = pipe(
    decodeBody(UpdateChatSchema)(request),
    Effect.flatMap((data) => {
      const updates: { title?: string; is_archived?: boolean } = {}
      if (data.title !== undefined) updates.title = data.title
      if (data.is_archived !== undefined) updates.is_archived = data.is_archived
      
      if (Object.keys(updates).length === 0) {
        return Effect.fail<ApiError>(new ValidationError({ message: "No updates provided" }))
      }
      
      return pipe(
        chatService.updateChat(data.chatId, updates),
        Effect.mapError((e) => new ChatDbError({ error: e }))
      )
    })
  )

  return exitResponse(NextResponse.json)(program)
}

/** @Route.Chat.Chats.DELETE */
export async function DELETE(request: NextRequest) {
  /** @Logic.Chat.DeleteAll */
  const { searchParams } = new URL(request.url)
  
  const program: Effect.Effect<void, ApiError> = pipe(
    decodeSearchParams(
      S.Struct({
        userId: S.String.pipe(
          S.filter((s: string) => s.trim().length > 0, { message: () => "userId is required" })
        )
      })
    )(searchParams),
    Effect.flatMap((params) => 
      pipe(
        chatService.deleteAllChats(params.userId),
        Effect.mapError((e) => new ChatDbError({ error: e }))
      )
    )
  )

  return exitResponse(() => new NextResponse(null, { status: HttpStatus.NO_CONTENT }))(program)
}
