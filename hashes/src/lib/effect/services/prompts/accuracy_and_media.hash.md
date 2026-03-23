---
State_ID: BigInt(0x0fc98cc)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Service.Prompts.AccuracyAndMedia

### [Signatures]
```ts
export const accuracy_and_media: string
```

### [Governance]
- **AI_Hallucination_Law:** Strictly mandates that the OpenRouter model must provide 1-3 explicit, functional URL references for every recommendation.
- **Media_Linkage_Constraint:** Enforces the use of exact dynamic search query patterns (e.g., `?search_query=`, `ss=`) instead of hallucinating static IDs for YouTube, Booking.com, and Viator to guarantee link survival.
- **Brand_Safety:** Prohibits markdown in media descriptions, bans visual emojis, and completely shields generation from adult content (Child-friendly lock).

### [Semantic Hash]
The core instructional prompt layer injected into the System Message. It hardcodes the linguistic boundaries for the AI Assistant's domain knowledge regarding travel in Puerto Rico.

### [Linkage]
- **Dependencies:** N/A (Pure String Constant)
