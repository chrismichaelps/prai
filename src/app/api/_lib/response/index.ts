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
import { IssueDbError, NotificationDbError, UsersDbError, ChatDbError, AccountDbError, HealthCheckError } from "../errors/services"

type ApiError =
  | ValidationError
  | NotFoundError
  | UnauthorizedError
  | SupabaseError
  | UniqueConstraintError
  | ForeignKeyError
  | InternalError
  | IssueDbError
  | NotificationDbError
  | UsersDbError
  | ChatDbError
  | AccountDbError
  | HealthCheckError

const errorStatusMap: Record<string, number> = {
  ValidationError: HttpStatus.BAD_REQUEST,
  NotFoundError: HttpStatus.NOT_FOUND,
  UnauthorizedError: HttpStatus.UNAUTHORIZED,
  UniqueConstraintError: HttpStatus.CONFLICT,
  ForeignKeyError: HttpStatus.BAD_REQUEST,
  SupabaseError: HttpStatus.INTERNAL_SERVER_ERROR,
  InternalError: HttpStatus.INTERNAL_SERVER_ERROR,
  IssueDbError: HttpStatus.INTERNAL_SERVER_ERROR,
  NotificationDbError: HttpStatus.INTERNAL_SERVER_ERROR,
  UsersDbError: HttpStatus.INTERNAL_SERVER_ERROR,
  ChatDbError: HttpStatus.INTERNAL_SERVER_ERROR,
  AccountDbError: HttpStatus.INTERNAL_SERVER_ERROR,
  HealthCheckError: HttpStatus.SERVICE_UNAVAILABLE
}

const errorMessageMap: Record<string, (error: ApiError) => string> = {
  ValidationError: (e) => e.message,
  NotFoundError: (e) => `${(e as NotFoundError).resource} not found: ${(e as NotFoundError).id}`,
  UnauthorizedError: (e) => e.message,
  UniqueConstraintError: (e) => `Duplicate value: ${(e as UniqueConstraintError).field}`,
  ForeignKeyError: (e) => `Invalid reference: ${(e as ForeignKeyError).field}`,
  SupabaseError: () => "Database error",
  InternalError: (e) => e.message,
  IssueDbError: () => "Database error",
  NotificationDbError: () => "Database error",
  UsersDbError: () => "Database error",
  ChatDbError: () => "Database error",
  AccountDbError: () => "Account operation failed",
  HealthCheckError: (e) => `Health check failed for ${(e as HealthCheckError).service}`
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
    const error = cause.error as unknown
    Effect.logError({
      message: `API Error: ${cause.error.constructor.name}`,
      error: error instanceof Error ? error : String(error)
    })
    return handleApiError(cause.error)
  }

  if (cause._tag === "Die") {
    Effect.logError({
      message: "Unhandled defect (Die)",
      cause: Cause.pretty(cause)
    })
    return NextResponse.json(
      { error: "Internal server error" },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    )
  }

  if (cause._tag === "Interrupt") {
    Effect.logWarning({
      message: "Request interrupted",
      cause: Cause.pretty(cause)
    })
    return NextResponse.json(
      { error: "Request interrupted" },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    )
  }

  Effect.logError({
    message: "Unknown error",
    cause: Cause.pretty(cause)
  })
  return NextResponse.json(
    { error: "Internal server error" },
    { status: HttpStatus.INTERNAL_SERVER_ERROR }
  )
}

/** @Logic.Api.ExtractSpanAttributes */
export function extractSpanAttributes(
  method: string,
  path: string,
  searchParams?: URLSearchParams,
  userId?: string
): Record<string, string> {
  const attributes: Record<string, string> = {
    "http.method": method,
    "http.url": path,
    "http.target": path.split('?')[0] || "/"
  }

  if (searchParams && searchParams.toString()) {
    attributes["http.query"] = searchParams.toString()
  }

  if (userId) {
    attributes["user.id"] = userId
  }

  return attributes
}

/** @Logic.Api.WithApiSpan */
export function withApiSpan<A, E>(
  name: string,
  options: {
    method?: string
    path?: string
    searchParams?: URLSearchParams
    userId?: string
    payload?: unknown
    attributes?: Record<string, string>
  } = {}
) {
  const { method = "GET", path = "", searchParams, userId, payload, attributes: extraAttrs } = options

  const baseAttrs = extractSpanAttributes(method, path, searchParams, userId)

  if (payload) {
    try {
      const payloadSize = JSON.stringify(payload).length
      baseAttrs["request.payload_size"] = String(payloadSize)
      baseAttrs["request.payload_type"] = typeof payload
    } catch {
      // Ignore serialization errors
    }
  }

  const mergedAttrs = { ...baseAttrs, ...extraAttrs }

  return (effect: Effect.Effect<A, E>): Effect.Effect<A, E> =>
    effect.pipe(
      Effect.withSpan(name, { attributes: mergedAttrs }),
      Effect.tapError((error) => {
        let errorStr = String(error)
        let current: unknown = error
        let deepest = ""
        while (current && typeof current === "object") {
          const obj = current as Record<string, unknown>
          const msg = obj.message
          const code = obj.code
          deepest = (typeof msg === "string" ? msg : typeof code === "string" ? code : "") || deepest
          current = obj.error
        }
        if (deepest) errorStr = deepest
        return Effect.logError({
          message: `Error in ${name}`,
          error: errorStr
        })
      }),
      Effect.tap((_value) =>
        Effect.annotateCurrentSpan({ "response.status": "success" })
      )
    )
}

/** @Logic.Api.ToNextResponse */
export const toNextResponse = async <A>(
  effect: Effect.Effect<A, ApiError>,
  successStatus: number = HttpStatus.OK,
  options?: {
    spanName?: string
    method?: string
    path?: string
    searchParams?: URLSearchParams
    userId?: string
    payload?: unknown
  }
): Promise<NextResponse> => {
  const {
    spanName,
    method = "GET",
    path = "",
    searchParams,
    userId,
    payload
  } = options || {}

  const tracedEffect = spanName
    ? withApiSpan<A, ApiError>(spanName, {
      method,
      path,
      searchParams,
      userId,
      payload
    })(effect)
    : effect

  const exit = await Effect.runPromiseExit(tracedEffect)

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
  onSuccess: (value: A) => R,
  options?: string | {
    spanName?: string
    method?: string
    path?: string
    searchParams?: URLSearchParams
    userId?: string
    payload?: unknown
  }
) => async (effect: Effect.Effect<A, E>): Promise<R> => {
  const normalizedOptions = typeof options === "string"
    ? { spanName: options }
    : options

  const {
    spanName,
    method = "GET",
    path = "",
    searchParams,
    userId,
    payload
  } = normalizedOptions || {}

  const tracedEffect = spanName
    ? withApiSpan<A, E>(spanName, {
      method,
      path,
      searchParams,
      userId,
      payload
    })(effect)
    : effect

  const exit = await Effect.runPromiseExit(tracedEffect)

  if (exit._tag === "Success") {
    return onSuccess(exit.value)
  }

  return handleCause(exit.cause as unknown as Cause.Cause<ApiError>) as unknown as R
}