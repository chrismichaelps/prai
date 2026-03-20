---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/next.hash.md"
---

## @Config.Next

### [Signatures]
```js
// next.config.mjs (ESM)
export default {}
```

### [Governance]
- **ESM_Law:** Uses `.mjs` extension due to `"type": "module"` in `package.json`.
- **Minimal_Law:** No `generateBuildId` override. App version is derived from `.next/` hash by `scripts/generate-app-version.mjs` (post-build).

### [Semantic Hash]
Next.js configuration file. Empty config — app version is handled by the post-build hash script instead of `generateBuildId`.

### [Linkage]
- **Downstream:** `@root/scripts/generate-app-version.mjs` (app version derived post-build)
