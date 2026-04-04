---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Command.Language

### [Signatures]
```ts
export const languageCommand: ChatCommand
// name: "/language", aliases: ["/lang", "/idioma"]
// execute(args) → Effect<{ type: "setting", key: "language", value: "es"|"en", toast: string }, CommandError>
```

### [Governance]
- **Validation_Law:** Args decoded via `Schema.decodeUnknownSync(LanguageSchema)` — rejects anything other than `"es"` or `"en"`.
- **Result_Law:** Always returns `type: "setting"` — triggers Redux update and DB persist via executor.

### [Semantic Hash]
Slash command for switching the assistant response language between Spanish (`es`) and English (`en`).

### [Linkage]
- **Upstream:** `@/lib/effect/schemas/CommandSchema` (LanguageSchema, COMMAND_DEFS.language)
- **Downstream:** `@/lib/commands/registry`
