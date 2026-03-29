---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/effect.hash.md"
---

## @Service.API.User.Usage

### [Signatures]
```ts
export const getUserUsage: (userId: string) => Effect.Effect<UserUsage, UsageServiceError>
export const incrementUserUsage: (userId: string, amount?: number, tokens?: number, cost?: number) => Effect.Effect<UserUsage, UsageServiceError>
```

### [Governance]
- **Rpc_Law:** Uses Supabase RPC functions `get_user_usage` and `increment_user_usage`.
- **Effect_Law:** Returns Effect with typed error channel.

### [Implementation Notes]
- getUserUsage calculates next_reset_date as last_reset_date + 24 hours
- incrementUserUsage also tracks token usage if provided

### [Semantic Hash]
Effect service for fetching and incrementing user usage via Supabase RPC.

### [Linkage]
- **Upstream:** Database RPC functions
- **Downstream:** `@root/src/app/api/user/usage/route.ts`, `@root/src/app/api/user/usage/increment/route.ts`
