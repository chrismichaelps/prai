---
State_ID: BigInt(0x1)
Git_SHA: INIT
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Store.Redux.UISlice

### [Signatures]
```ts
export const { setModelInfoVisible } = uiSlice.actions

interface UIState {
  modelInfoVisible: boolean
}
```

### [Semantic Hash]
UI modal/overlay state. Controls the model info transparency toast visibility.

### [Linkage]
- **Upstream:** None
- **Downstream:** `@root/src/components/layout/Header.tsx`, UI modal components
