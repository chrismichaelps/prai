---
State_ID: BigInt(0x3)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/next.hash.md"
---

## @Script.AppVersion

### [Signatures]
```js
// scripts/generate-app-version.mjs
export default function generateAppVersion()
```

### [Governance]
- **PostBuild_Law:** Runs AFTER `next build` via `package.json` build script. Hashes `.next/` output files.
- **Filtering_Law:** Excludes `/cache/`, `/server/`, and blur image files — these change per request/run.
- **Output_Law:** Writes `{ version, generated }` to `public/app-version.json`.
- **ESM_Law:** Uses `.mjs` extension since `package.json` has `"type": "module"`. No TypeScript annotations.

### [Semantic Hash]
Post-build script that hashes the `.next/` build output to produce a deterministic app version. Changes only when actual build artifacts change.

### [Linkage]
- **Upstream:** `.next/` directory (build output)
- **Downstream:** `@root/src/app/api/build-info/route.ts` (reads `public/app-version.json`)
