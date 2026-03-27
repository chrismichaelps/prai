---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @UI.Mentions.MentionInput

### [Component]
| File | Role |
|------|------|
| `MentionInput.tsx` | Custom textarea component supporting `@handle` triggers, user lookup APIs, and keyboard navigation. |

### [Governance]
- **Search_Law**: Triggers `fetch('/api/users/search')` debounced securely to prevent API spam.
- **Input_Law**: Injects properly formatted `@handle` triggers back into the text representation.

### [Linkage]
- **Upstream**: `/api/users/search`, Framer Motion.
- **Downstream**: Used in Issue tracking/comments inputs.
