import { Effect } from "effect"

export interface BuildInfo {
  readonly buildHash: string
}

/** @Service.Effect.BuildInfo */
export class BuildInfoService extends Effect.Service<BuildInfoService>()("BuildInfo", {
  effect: Effect.gen(function* () {
    const fetchBuildInfo = Effect.tryPromise({
      try: async () => {
        const res = await fetch('/api/build-info')
        const data = await res.json() as { buildHash: string }
        return data.buildHash
      },
      catch: () => new Error("Failed to fetch build info"),
    })

    const buildHash = yield* fetchBuildInfo

    return {
      getBuildHash: () => Effect.succeed(buildHash),
    } as const
  })
}) {}
