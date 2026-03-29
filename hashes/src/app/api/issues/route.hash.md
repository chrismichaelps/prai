---
State_ID: BigInt(0x0fc98d2)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Route.Api.Issues

### [Signatures]
```ts
export async function GET(request: NextRequest): Promise<NextResponse>
export async function POST(request: NextRequest): Promise<NextResponse>
```

### [Governance]
- **Effect_Silo_Pattern:** Mandates the wrapping of all business logic and service calls within `Effect` programs to ensure explicit error handling and side-effect management.
- **Validation_Hard_Lock:** Strictly enforces Schema-based decoding for all incoming data (search params and request bodies) via `@/app/api/_lib/validation`.
- **Auth_Gate_POST:** Prevents unauthenticated issue creation by requiring a valid Supabase user session before delegating to the `issueService`.
- **HttpStatus_Convention:** Uses `HttpStatus` constants instead of magic numbers for response status codes.

### [Semantic Hash]
The main REST boundary for collective issue operations. It serves as a secure, validated gateway for retrieving filtered lists of community reports and submitting new feedback into the system.

### [Linkage]
- **Dependencies:** `./services/issue`, `@/app/api/_lib/validation`, `@/app/api/_lib/response`, `@/lib/supabase/server`, `effect`
