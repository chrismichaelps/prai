---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Route.Telemetry

### [Config]
| File | Role |
|------|------|
| `instrumentation.ts` | Next.js OpenTelemetry registration hook. |

### [Governance]
- **Telemetry_Law**: Registers the `prai` service for metrics/traces via `@vercel/otel`.

### [Linkage]
- **Upstream**: `@vercel/otel`.
- **Downstream**: Next.js core runtime.
