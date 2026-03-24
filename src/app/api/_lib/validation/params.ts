import * as S from "effect/Schema"
import { Effect, pipe } from "effect"
import { ValidationError } from "../errors"

/** @Logic.Api.Validation.DecodeBody */
export const decodeBody = <A>(
  schema: S.Schema<A>
) => (request: Request): Effect.Effect<A, ValidationError> =>
  pipe(
    Effect.tryPromise({
      try: () => request.json(),
      catch: (e) => new ValidationError({ message: `Failed to parse JSON: ${String(e)}` })
    }),
    Effect.flatMap((data) =>
      pipe(
        S.decodeUnknown(schema)(data),
        Effect.mapError((error) => 
          new ValidationError({ 
            message: "Invalid request body",
            details: formatSchemaErrors(error)
          })
        )
      )
    )
  )

/** @Logic.Api.Validation.DecodeParams */
export const decodeParams = <A>(
  schema: S.Schema<A>
) => (params: Record<string, string | string[] | undefined>): Effect.Effect<A, ValidationError> =>
  pipe(
    S.decodeUnknown(schema)(params),
    Effect.mapError((error) =>
      new ValidationError({
        message: "Invalid path parameters",
        details: formatSchemaErrors(error)
      })
    )
  )

/** @Logic.Api.Validation.DecodeSearchParams */
export const decodeSearchParams = <A>(
  schema: S.Schema<A>
) => (searchParams: URLSearchParams | Record<string, string | string[] | undefined>): Effect.Effect<A, ValidationError> => {
  const asRecord = searchParams instanceof URLSearchParams
    ? Object.fromEntries(searchParams)
    : searchParams

  return pipe(
    S.decodeUnknown(schema)(asRecord),
    Effect.mapError((error) =>
      new ValidationError({
        message: "Invalid query parameters",
        details: formatSchemaErrors(error)
      })
    )
  )
}

export const formatSchemaErrors = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  return String(error)
}

export { Effect, pipe }
