---
State_ID: BigInt(0x2)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Lib.Actions.ActionToNaturalMessage

### [Signatures]
```ts
export function actionToNaturalMessage(
  action: string,
  params: Record<string, string | string[]> = {}
): string
```

### [Governance]
- **Type_Safety_Law:** `params.category`, `params.type`, `params.region` handled as `string | string[]` — array values resolved to first element before dictionary lookup.
- **Feature_Array_Law:** `features` filtered with type guard `(f): f is string => typeof f === 'string'` before mapping through `featureTranslations`.
- **Fallback_Law:** Unknown keys fall through to raw string value.

### [Semantic Hash]
Converts action names and parameter objects into natural Spanish messages for the chat. Handles category, region, feature, and price translations with safe array-to-scalar resolution.

### [Linkage]
- **Upstream:** AdaptiveCard action system
- **Downstream:** Chat message rendering
