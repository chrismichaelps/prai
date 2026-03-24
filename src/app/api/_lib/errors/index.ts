/** @Type.Api.Errors */
import { Data } from "effect"
import type { PostgrestError } from "@supabase/supabase-js"
import { HttpStatus } from "../constants/status-codes"

export class ValidationError extends Data.TaggedError("ValidationError")<{
  readonly message: string
  readonly details?: unknown
}> {}

export class NotFoundError extends Data.TaggedError("NotFoundError")<{
  readonly resource: string
  readonly id: string
}> {}

export class UnauthorizedError extends Data.TaggedError("UnauthorizedError")<{
  readonly message: string
}> {}

export class SupabaseError extends Data.TaggedError("SupabaseError")<{
  readonly original: unknown
  readonly status: number
}> {}

export class UniqueConstraintError extends Data.TaggedError("UniqueConstraintError")<{
  readonly field: string
}> {}

export class ForeignKeyError extends Data.TaggedError("ForeignKeyError")<{
  readonly field: string
}> {}

export class InternalError extends Data.TaggedError("InternalError")<{
  readonly message: string
}> {}

/** @Logic.Api.MapSupabaseError */
export const mapSupabaseError = (error: unknown): SupabaseError | UniqueConstraintError | ForeignKeyError | InternalError => {
  if (error && typeof error === "object") {
    const err = error as PostgrestError & { code?: string }
    
    if (err.code === "23505") {
      return new UniqueConstraintError({ field: err.message || "unique_constraint" })
    }
    
    if (err.code === "23503") {
      return new ForeignKeyError({ field: err.message || "foreign_key" })
    }
    
    return new SupabaseError({ 
      original: err, 
      status: HttpStatus.INTERNAL_SERVER_ERROR 
    })
  }
  
  return new InternalError({ message: "An unexpected error occurred" })
}
