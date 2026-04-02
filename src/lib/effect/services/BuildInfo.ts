import { Effect } from "effect"

export interface BuildInfo {
  readonly buildHash: string
}

/** @Service.Effect.BuildInfo */
export class BuildInfoService extends Effect.Service<BuildInfoService>()("BuildInfo", {
  effect: Effect.gen(function* () {
    const fetchBuildInfo = Effect.tryPromise({
      try: async () => {
        try {
          const res = await fetch('/api/build-info')
          if (res.ok) {
            const data = await res.json() as { buildHash: string }
            return data.buildHash
          }
        } catch {
          return "dev-build"
        }
        return "dev-build"
      },
      catch: () => "dev-build",
    })

    const buildHash = yield* fetchBuildInfo

    return {
      getBuildHash: () => Effect.succeed(buildHash),
    } as const
  })
}) {}
