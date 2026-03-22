---
Language: Supabase JS
Version: 2.x
Fidelity: 100% (Physical Disk Reference)
State_ID: BigInt(0x1)
LSP_Discovery_Root: "@root/node_modules/@supabase/supabase-js/package.json"
Grammar_Lock: "@root/hashes/grammar/supabase-js.hash.md"
---

/** [Project].Grammar.SupabaseJS - Linguistic DNA anchor for Supabase JS v2.x */

## [SDK_Discovery_Map]
/** === @supabase/supabase-js (entry) === */
/** @Ref: @root/node_modules/@supabase/supabase-js/dist/index.d.mts */
/** @Ref: @root/node_modules/@supabase/supabase-js/dist/cors.d.mts */
/** === @supabase/postgrest-js (database queries) === */
/** @Ref: @root/node_modules/@supabase/postgrest-js/dist/index.d.mts */
/** === @supabase/auth-js (authentication — 20+ files) === */
/** @Ref: @root/node_modules/@supabase/auth-js/dist/main/index.d.ts */
/** @Ref: @root/node_modules/@supabase/auth-js/dist/main/GoTrueClient.d.ts */
/** @Ref: @root/node_modules/@supabase/auth-js/dist/main/GoTrueAdminApi.d.ts */
/** @Ref: @root/node_modules/@supabase/auth-js/dist/main/AuthClient.d.ts */
/** @Ref: @root/node_modules/@supabase/auth-js/dist/main/AuthAdminApi.d.ts */
/** @Ref: @root/node_modules/@supabase/auth-js/dist/main/lib/types.d.ts */
/** @Ref: @root/node_modules/@supabase/auth-js/dist/main/lib/errors.d.ts */
/** @Ref: @root/node_modules/@supabase/auth-js/dist/main/lib/error-codes.d.ts */
/** @Ref: @root/node_modules/@supabase/auth-js/dist/main/lib/constants.d.ts */
/** @Ref: @root/node_modules/@supabase/auth-js/dist/main/lib/fetch.d.ts */
/** @Ref: @root/node_modules/@supabase/auth-js/dist/main/lib/helpers.d.ts */
/** @Ref: @root/node_modules/@supabase/auth-js/dist/main/lib/local-storage.d.ts */
/** @Ref: @root/node_modules/@supabase/auth-js/dist/main/lib/locks.d.ts */
/** @Ref: @root/node_modules/@supabase/auth-js/dist/main/lib/polyfills.d.ts */
/** @Ref: @root/node_modules/@supabase/auth-js/dist/main/lib/version.d.ts */
/** @Ref: @root/node_modules/@supabase/auth-js/dist/main/lib/webauthn.d.ts */
/** @Ref: @root/node_modules/@supabase/auth-js/dist/main/lib/webauthn.dom.d.ts */
/** @Ref: @root/node_modules/@supabase/auth-js/dist/main/lib/web3/ethereum.d.ts */
/** @Ref: @root/node_modules/@supabase/auth-js/dist/main/lib/web3/solana.d.ts */
/** @Ref: @root/node_modules/@supabase/auth-js/dist/main/lib/base64url.d.ts */
/** === @supabase/realtime-js (11+ files) === */
/** @Ref: @root/node_modules/@supabase/realtime-js/dist/main/index.d.ts */
/** @Ref: @root/node_modules/@supabase/realtime-js/dist/main/RealtimeChannel.d.ts */
/** @Ref: @root/node_modules/@supabase/realtime-js/dist/main/RealtimeClient.d.ts */
/** @Ref: @root/node_modules/@supabase/realtime-js/dist/main/RealtimePresence.d.ts */
/** @Ref: @root/node_modules/@supabase/realtime-js/dist/main/lib/constants.d.ts */
/** @Ref: @root/node_modules/@supabase/realtime-js/dist/main/lib/push.d.ts */
/** @Ref: @root/node_modules/@supabase/realtime-js/dist/main/lib/serializer.d.ts */
/** @Ref: @root/node_modules/@supabase/realtime-js/dist/main/lib/timer.d.ts */
/** @Ref: @root/node_modules/@supabase/realtime-js/dist/main/lib/transformers.d.ts */
/** @Ref: @root/node_modules/@supabase/realtime-js/dist/main/lib/version.d.ts */
/** @Ref: @root/node_modules/@supabase/realtime-js/dist/main/lib/websocket-factory.d.ts */
/** === @supabase/storage-js === */
/** @Ref: @root/node_modules/@supabase/storage-js/package.json */
/** === @supabase/functions-js (10 files) === */
/** @Ref: @root/node_modules/@supabase/functions-js/dist/main/index.d.ts */
/** @Ref: @root/node_modules/@supabase/functions-js/dist/main/FunctionsClient.d.ts */
/** @Ref: @root/node_modules/@supabase/functions-js/dist/main/types.d.ts */
/** @Ref: @root/node_modules/@supabase/functions-js/dist/main/helper.d.ts */
/** @Ref: @root/node_modules/@supabase/functions-js/dist/main/version.d.ts */

## [SDK_Imports / Namespaces]
```ts
import { createClient } from "@supabase/supabase-js"
import type { SupabaseClient, SupabaseClientOptions } from "@supabase/supabase-js"
import type { Database } from "./database.types"  // generated via `supabase gen types typescript`

// Type-safe client
const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth?: { autoRefreshToken?, detectSessionInUrl?, persistSession?, storage?, flowType? },
  db?: { schema?: string },
  global?: { headers?: Record<string, string>, fetch?: typeof fetch },
  realtime?: RealtimeClientOptions,
})
```

## [Database_Module]
```ts
// PostgREST query builder (via @supabase/postgrest-js)
// SELECT
const { data, error, count } = await supabase
  .from("users")
  .select("id, email, name, posts(id, title, created_at)")  // join via FK
  .eq("role", "admin")                         // where role = 'admin'
  .neq("status", "banned")                     // where status != 'banned'
  .gt("age", 18)                               // where age > 18
  .gte("age", 18)  .lt("age", 65)  .lte("age", 65)
  .like("name", "%John%")                      // LIKE
  .ilike("name", "%john%")                     // ILIKE (case insensitive)
  .is("deleted_at", null)                      // IS NULL
  .in("role", ["admin", "moderator"])           // IN
  .contains("tags", ["typescript"])             // @> (array contains)
  .containedBy("tags", ["ts", "js", "rust"])    // <@ (array contained by)
  .overlaps("tags", ["ts"])                     // && (array overlaps)
  .textSearch("title", "hello & world", { type: "websearch" })
  .not("role", "eq", "banned")                 // NOT
  .or("role.eq.admin,role.eq.moderator")        // OR
  .filter("name", "eq", "Alice")               // generic filter
  .match({ role: "admin", active: true })       // exact match multiple
  .order("created_at", { ascending: false })
  .range(0, 9)                                  // OFFSET 0 LIMIT 10
  .limit(10)
  .single()                                     // expect exactly 1 row
  .maybeSingle()                                // expect 0 or 1 row
  .csv()                                        // return as CSV
  .returns<CustomType[]>()                      // override return type

// INSERT
const { data, error } = await supabase.from("users").insert({ email: "a@b.com", name: "Alice" }).select()
const { data, error } = await supabase.from("users").insert([...bulk]).select()

// UPSERT
const { data, error } = await supabase.from("users").upsert({ id: "1", email: "a@b.com" }, { onConflict: "email" }).select()

// UPDATE
const { data, error } = await supabase.from("users").update({ name: "Bob" }).eq("id", "1").select()

// DELETE
const { data, error } = await supabase.from("users").delete().eq("id", "1").select()

// RPC (stored procedures)
const { data, error } = await supabase.rpc("function_name", { arg1: "value" })
```

## [Auth_Module]
```ts
// Authentication (GoTrueClient.d.ts, AuthClient.d.ts)
// Sign up
const { data: { user, session }, error } = await supabase.auth.signUp({ email, password, options?: { data?: Record<string, any>, emailRedirectTo?, captchaToken? } })

// Sign in
const { data: { user, session }, error } = await supabase.auth.signInWithPassword({ email, password })
const { data, error } = await supabase.auth.signInWithOtp({ email, options?: { emailRedirectTo? } })
const { data, error } = await supabase.auth.signInWithOAuth({ provider: "google" | "github" | "apple" | ..., options?: { redirectTo?, scopes?, queryParams? } })
const { data, error } = await supabase.auth.signInWithIdToken({ provider, token, nonce? })
const { data, error } = await supabase.auth.signInWithSSO({ providerId?: string, domain?: string })
const { data, error } = await supabase.auth.signInAnonymously()

// Session
const { data: { session } } = await supabase.auth.getSession()
const { data: { user } } = await supabase.auth.getUser()
const { data: { user }, error } = await supabase.auth.updateUser({ email?, password?, phone?, data?: Record<string, any> })
await supabase.auth.refreshSession()

// Sign out
await supabase.auth.signOut({ scope?: "global" | "local" | "others" })

// Password reset
await supabase.auth.resetPasswordForEmail(email, { redirectTo? })

// Auth state listener
const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
  // event: "INITIAL_SESSION" | "SIGNED_IN" | "SIGNED_OUT" | "TOKEN_REFRESHED" | "USER_UPDATED" | "PASSWORD_RECOVERY" | "MFA_CHALLENGE_VERIFIED"
})
subscription.unsubscribe()

// MFA
await supabase.auth.mfa.enroll({ factorType: "totp", friendlyName? })
await supabase.auth.mfa.challenge({ factorId })
await supabase.auth.mfa.verify({ factorId, challengeId, code })
await supabase.auth.mfa.unenroll({ factorId })
await supabase.auth.mfa.listFactors()
await supabase.auth.mfa.getAuthenticatorAssuranceLevel()

// Admin (GoTrueAdminApi.d.ts — requires service_role key)
await supabase.auth.admin.listUsers({ page?, perPage? })
await supabase.auth.admin.getUserById(userId)
await supabase.auth.admin.createUser({ email, password, email_confirm?, user_metadata? })
await supabase.auth.admin.updateUserById(userId, { email?, password?, user_metadata?, ban_duration? })
await supabase.auth.admin.deleteUser(userId, shouldSoftDelete?)
await supabase.auth.admin.inviteUserByEmail(email, { redirectTo?, data? })
await supabase.auth.admin.generateLink({ type, email, password?, redirectTo? })
```

## [Realtime_Module]
```ts
// Realtime channels (RealtimeChannel.d.ts, RealtimePresence.d.ts)
const channel = supabase.channel("room1")

// Postgres Changes (listen to DB changes)
channel.on("postgres_changes", { event: "INSERT" | "UPDATE" | "DELETE" | "*", schema: "public", table: "messages", filter?: "room_id=eq.1" }, (payload) => {
  // payload: { eventType, new: Record, old: Record, schema, table, commit_timestamp, errors }
}).subscribe()

// Broadcast (ephemeral messages)
channel.on("broadcast", { event: "cursor-move" }, (payload) => { ... }).subscribe()
await channel.send({ type: "broadcast", event: "cursor-move", payload: { x: 100, y: 200 } })

// Presence (online status tracking)
channel.on("presence", { event: "sync" }, () => { const state = channel.presenceState() })
channel.on("presence", { event: "join" }, ({ key, currentPresences, newPresences }) => {})
channel.on("presence", { event: "leave" }, ({ key, currentPresences, leftPresences }) => {})
await channel.track({ user_id: "1", online_at: new Date().toISOString() })
await channel.untrack()

// Cleanup
supabase.removeChannel(channel)
supabase.removeAllChannels()
```

## [Storage_Module]
```ts
// Storage (via @supabase/storage-js)
const { data, error } = await supabase.storage.from("avatars").upload("path/file.png", file, { contentType: "image/png", upsert?: boolean, cacheControl?: string })
const { data, error } = await supabase.storage.from("avatars").download("path/file.png")
const { data, error } = await supabase.storage.from("avatars").remove(["path/file.png"])
const { data, error } = await supabase.storage.from("avatars").list("folder", { limit?, offset?, sortBy?, search? })
const { data, error } = await supabase.storage.from("avatars").move("old/path.png", "new/path.png")
const { data, error } = await supabase.storage.from("avatars").copy("source.png", "dest.png")
const { data } = supabase.storage.from("avatars").getPublicUrl("path/file.png", { transform?: { width, height, quality, format, resize } })
const { data, error } = await supabase.storage.from("avatars").createSignedUrl("path/file.png", 3600)
const { data, error } = await supabase.storage.from("avatars").createSignedUrls(["path1.png", "path2.png"], 3600)
const { data, error } = await supabase.storage.from("avatars").createSignedUploadUrl("path/file.png")

// Bucket management
await supabase.storage.createBucket("avatars", { public?: boolean, fileSizeLimit?, allowedMimeTypes? })
await supabase.storage.getBucket("avatars")
await supabase.storage.listBuckets()
await supabase.storage.updateBucket("avatars", { public: true })
await supabase.storage.deleteBucket("avatars")
await supabase.storage.emptyBucket("avatars")
```

## [Functions_Module]
```ts
// Edge Functions (FunctionsClient.d.ts)
const { data, error } = await supabase.functions.invoke("function-name", {
  body?: any,
  headers?: Record<string, string>,
  method?: "POST" | "GET" | "PUT" | "PATCH" | "DELETE",
})
```

## [Architectural_Laws]
- **Export_Law**: Generate types via `supabase gen types typescript > database.types.ts`. Pass `Database` generic to `createClient<Database>()`. Export typed client from `lib/supabase.ts`.
- **Transformation_Law**: PostgREST query builder chains filter → select → modifier. RLS (Row Level Security) enforced server-side. Anon key for client, service_role key for admin operations.
- **Propagation_Law**: All operations return `{ data, error }` tuple — NEVER throws. Check `error` first. Use `.single()` to get one row (errors if 0 or 2+). Use `.maybeSingle()` for optional.

## [Prohibited_Patterns]
- NO service_role key on client-side — only anon key in browser
- NO `.select("*")` without explicit column list in production — leaks data
- NO ignoring `error` return — always check before accessing `data`
- NO RPC without RLS policies — exposed via anon key