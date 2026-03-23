---
State_ID: BigInt(0x0fc98cc)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Lib.Effect.Schemas.Config

### [Signatures]
```ts
/** @Type.Effect.Config.ErrorMessages */
export const ErrorMessagesSchema = Schema.Struct({
  connectionError: Schema.String.pipe(Schema.minLength(1)),
  configError: Schema.String.pipe(Schema.minLength(1)),
  adaptiveParsingError: Schema.String.pipe(Schema.minLength(1))
})

/** @Schema.Effect.Config */
export const ConfigSchema = Schema.Struct({
  openRouterBaseUrl: Schema.String,
  modelName: Schema.String,
  apiKey: Schema.String,
  siteUrl: Schema.String,
  systemPrompt: Schema.String,
  errorMessages: ErrorMessagesSchema
})

export interface Config extends Schema.Schema.Type<typeof ConfigSchema> { }
```

### [Governance]
- **Schema_Law:** Utilizes `@effect/schema` for compile-time and runtime strict data validation.
- **Constraints:** `minLength(1)` explicitly enforced for nested error mapping to prevent empty failure states during network drops. Root config strings tolerate empty definitions dynamically during static prerendering (Vercel builds).

### [Semantic Hash]
Global configuration domain schema mapping application-wide environment requirements and standardizing error string formats. 

### [Linkage]
- **Dependencies:** `effect/Schema`
