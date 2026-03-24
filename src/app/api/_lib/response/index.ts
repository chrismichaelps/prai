import { Cause, Effect } from "effect"
import { NextResponse } from "next/server"
import { HttpStatus } from "../constants/status-codes"
import type {
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  SupabaseError,
  UniqueConstraintError,
  ForeignKeyError,
  InternalError
} from "../errors"

type ApiError =
  | ValidationError
  | NotFoundError
  | UnauthorizedError
  | SupabaseError
  | UniqueConstraintError
  | ForeignKeyError
  | InternalError

const errorStatusMap: Record<string, number> = {
  ValidationError: HttpStatus.BAD_REQUEST,
  NotFoundError: HttpStatus.NOT_FOUND,
  UnauthorizedError: HttpStatus.UNAUTHORIZED,
  UniqueConstraintError: HttpStatus.CONFLICT,
  ForeignKeyError: HttpStatus.BAD_REQUEST,
  SupabaseError: HttpStatus.INTERNAL_SERVER_ERROR,
  InternalError: HttpStatus.INTERNAL_SERVER_ERROR
}

const errorMessageMap: Record<string, (error: ApiError) => string> = {
  ValidationError: (e) => e.message,
  NotFoundError: (e) => `${(e as NotFoundError).resource} not found: ${(e as NotFoundError).id}`,
  UnauthorizedError: (e) => e.message,
  UniqueConstraintError: (e) => `Duplicate value: ${(e as UniqueConstraintError).field}`,
  ForeignKeyError: (e) => `Invalid reference: ${(e as ForeignKeyError).field}`,
  SupabaseError: () => "Database error",
  InternalError: (e) => e.message
}

/** @Logic.Api.HandleError */
const handleApiError = (apiError: ApiError): NextResponse => {
  const errorName = apiError.constructor.name
  const status = errorStatusMap[errorName] ?? HttpStatus.INTERNAL_SERVER_ERROR
  const messageFn = errorMessageMap[errorName]
  const message = messageFn ? messageFn(apiError) : "Unknown error"
  
  const response: { error: string; details?: string } = { error: message }
  if ('details' in apiError && apiError.details !== undefined) {
    response.details = typeof apiError.details === 'string' 
      ? apiError.details 
      : JSON.stringify(apiError.details)
  }

  return NextResponse.json(response, { status })
}

/** @Logic.Api.HandleCause */
const handleCause = (cause: Cause.Cause<ApiError>): NextResponse => {
  if (cause._tag === "Fail") {
    return handleApiError(cause.error)
  }
  if (cause._tag === "Die") {
    console.error("Unhandled error (Die):", Cause.pretty(cause))
    return NextResponse.json(
      { error: "Internal server error" },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    )
  }
  if (cause._tag === "Interrupt") {
    console.error("Unhandled error (Interrupt):", Cause.pretty(cause))
    return NextResponse.json(
      { error: "Request interrupted" },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    )
  }
  console.error("Unhandled error:", Cause.pretty(cause))
  return NextResponse.json(
    { error: "Internal server error" },
    { status: HttpStatus.INTERNAL_SERVER_ERROR }
  )
}

/** @Logic.Api.ToNextResponse */
export const toNextResponse = async <A>(
  effect: Effect.Effect<A, ApiError>,
  successStatus: number = HttpStatus.OK
): Promise<NextResponse> => {
  const exit = await Effect.runPromiseExit(effect)

  if (exit._tag === "Success") {
    if (successStatus === HttpStatus.NO_CONTENT) {
      return NextResponse.json(null, { status: successStatus })
    }
    return NextResponse.json(exit.value, { status: successStatus })
  }

  return handleCause(exit.cause)
}

/** @Logic.Api.ExitResponse */
export const exitResponse = <A, E, R extends NextResponse | Response>(
  onSuccess: (value: A) => R
) => async (effect: Effect.Effect<A, E>): Promise<R> => {
  const exit = await Effect.runPromiseExit(effect)

  if (exit._tag === "Success") {
    return onSuccess(exit.value)
  }

  return handleCause(exit.cause as unknown as Cause.Cause<ApiError>) as unknown as R
}
