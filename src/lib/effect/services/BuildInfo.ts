import { Effect } from "effect"
import { BuildInfoError } from "../errors"

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
      catch: () => new BuildInfoError({ message: "Failed to fetch build info" }),
    })

    const buildHash = yield* fetchBuildInfo

    return {
      getBuildHash: () => Effect.succeed(buildHash),
    } as const
  })
}) {}
