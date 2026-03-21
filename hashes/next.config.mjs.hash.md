---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/next.hash.md"
---

## @Config.Next

### [Signatures]
```js
// next.config.mjs (ESM)
export default {
  productionBrowserSourceMaps: false,
  webpack: (config, { dev }) => {
    if (!dev) {
      config.devtool = false; // Hardened against source map leakage
    }
    return config;
  }
}
```

### [Governance]
- **ESM_Law:** Uses `.mjs` extension due to `"type": "module"` in `package.json`.
- **Minimal_Law:** No `generateBuildId` override. App version is derived from `.next/` hash by `scripts/generate-app-version.mjs` (post-build).
- **Security_Law:** `productionBrowserSourceMaps` and `devtool` MUST be strictly disabled in production builds to prevent source leakage.

### [Semantic Hash]
Next.js configuration file customized for strict security by explicitly stripping source maps from production output.

### [Linkage]
- **Downstream:** `@root/scripts/generate-app-version.mjs` (app version derived post-build)
