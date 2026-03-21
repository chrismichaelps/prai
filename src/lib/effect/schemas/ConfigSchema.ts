import { Schema } from "effect"

/** @Type.Effect.Config.ErrorMessages */
export const ErrorMessagesSchema = Schema.Struct({
  connectionError: Schema.String.pipe(Schema.minLength(1)),
  configError: Schema.String.pipe(Schema.minLength(1)),
  adaptiveParsingError: Schema.String.pipe(Schema.minLength(1))
})

/** @Schema.Effect.Config */
export const ConfigSchema = Schema.Struct({
  openRouterBaseUrl: Schema.String.pipe(Schema.minLength(1)),
  modelName: Schema.String.pipe(Schema.minLength(1)),
  apiKey: Schema.String.pipe(Schema.minLength(1)),
  siteUrl: Schema.String,
  systemPrompt: Schema.String,
  errorMessages: ErrorMessagesSchema
})

export interface Config extends Schema.Schema.Type<typeof ConfigSchema> { }

