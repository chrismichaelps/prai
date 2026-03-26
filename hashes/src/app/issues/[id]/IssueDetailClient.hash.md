---
State_ID: BigInt(0x0fc98cf)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Issues.IssueDetailClient

### [Signatures]
```ts
export function IssueDetailClient({ id }: { id: string }): JSX.Element
```

### [Governance]
- **Detail_Context_Lock:** Manages individual issue lifecycle (loading, errors, detail fetching) through `issuesSlice` anchored to a specific `id`.
- **Comment_Optimism_Law:** Strictly implements optimistic UI updates for all comment actions (add, update, delete) to ensure a high-fidelity, zero-latency interaction model.
- **Admin_Sovereignty:** Restricts destructive actions (Issue deletion, Status modification) to authenticated administrators or the verified original author.

### [Semantic Hash]
The dedicated resolution workspace for individual issues. It enables community-driven feedback through optimistic commenting and upvoting while maintaining a clean, markdown-supported discussion thread.

### [Linkage]
- **Dependencies:** `@/store/slices/issuesSlice`, `markdown-it`, `framer-motion`, `lucide-react`, `@/lib/effect/I18nProvider`, `@/contexts/AuthContext`
