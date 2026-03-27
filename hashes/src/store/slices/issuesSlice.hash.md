---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Logic.Issues.Slice

### [Store]
| File | Role |
|------|------|
| `issuesSlice.ts` | Redux Toolkit slice managing the state for fetching, creating, updating, commenting, and deleting issues. |

### [Governance]
- **State_Law**: State mutation must be pure or handled via Immer's `castDraft`.
- **Network_Law**: Async interactions structured as `createAsyncThunk` mapping to `/api/issues` endpoints.
- **Optimism_Law**: Implements `optimisticToggleUpvote` for immediate UI response.

### [Linkage]
- **Upstream**: `@/lib/effect/schemas/IssueSchema`.
- **Downstream**: `store/index.ts`, `IssuesClient.tsx`.
