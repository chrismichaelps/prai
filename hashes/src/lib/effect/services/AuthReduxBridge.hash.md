---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Lib.Effect.Services.AuthReduxBridge

### [Signatures]
```ts
export const ReduxAuthBridgeService: Context.Tag<ReduxAuthBridge>
export const ReduxAuthBridgeLayer: Layer<ReduxAuthBridge, never, AuthService>
```

### [Governance]
- **Legacy_Law:** Deprecated. Use `@Context.Auth` instead.

### [Semantic Hash]
Bridge between Effect Auth and Redux for legacy compatibility.

### [Linkage]
- **Dependencies:** `@root/src/lib/effect/services/Auth.ts`
