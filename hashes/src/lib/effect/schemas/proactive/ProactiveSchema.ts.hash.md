---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Schema.Agent.Proactive

### [Signatures]
```ts
export const ProactiveAlertSchema = Schema.Struct({ ... })
export type ProactiveAlert = Schema.Schema.Type<typeof ProactiveAlertSchema>
```

### [Governance]
- **Alert_Law:** Proactive synthetic alerts must strictly conform to ID, Urgency, and Content constraints defined within this schema.

### [Semantic Hash]
The data contracts mapping out Environmental Triggers allowing the AI to safely inject system events back into the chat loop without breaking rendering streams.

### [Linkage]
- **Upstream:** None
- **Downstream:** \`@root/src/lib/effect/services/proactive/Proactive.ts\`
