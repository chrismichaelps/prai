/** @Route.Chat.Messages */
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { HttpStatus } from "../../_lib/constants/status-codes"
import type { ValidationError } from "../../_lib/errors"
import { ChatDbError, chatService } from "../services/chat"
import { decodeBody, decodeSearchParams, S } from "../../_lib/validation"
import { CreateMessageSchema } from "../schemas"
import { exitResponse } from "../../_lib/response"
import { Effect, pipe } from "effect"

type ApiError = ValidationError | ChatDbError

/** @Route.Chat.Messages.POST */
export async function POST(request: NextRequest) {
  /** @Logic.Chat.AddMessage */
  const program: Effect.Effect<unknown, ApiError> = pipe(
    decodeBody(CreateMessageSchema)(request),
    Effect.flatMap((msg) => 
      pipe(
        chatService.addMessage(msg.chatId, { 
          role: msg.role, 
          content: msg.content, 
          metadata: msg.metadata 
        }),
        Effect.mapError((e) => new ChatDbError({ error: e }))
      )
    )
  )

  return exitResponse((data) => NextResponse.json(data, { status: HttpStatus.CREATED }))(program)
}

/** @Route.Chat.Messages.GET */
export async function GET(request: NextRequest) {
  /** @Logic.Chat.GetMessages */
  const { searchParams } = new URL(request.url)
  
  const program: Effect.Effect<unknown, ApiError> = pipe(
    decodeSearchParams(
      S.Struct({
        chatId: S.String.pipe(
          S.filter((s: string) => s.trim().length > 0, { message: () => "chatId is required" })
        )
      })
    )(searchParams),
    Effect.flatMap((params) => 
      pipe(
        chatService.getMessages(params.chatId),
        Effect.mapError((e) => new ChatDbError({ error: e }))
      )
    )
  )

  return exitResponse(NextResponse.json)(program)
}
