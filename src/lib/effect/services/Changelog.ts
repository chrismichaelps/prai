import { Effect, Chunk } from "effect"
import { ChangelogError } from "@/lib/effect/errors"

/** @Type.Changelog.Release */
export interface Release {
  readonly date: string
  readonly content: string
}

/** @Logic.Changelog.Parser */
const parseReleases = (content: string): Chunk.Chunk<Release> => {
  const lines = content.split("\n")
  const releases: Release[] = []
  let currentRelease: Release | null = null
  let currentContent: string[] = []

  for (const line of lines) {
    const trimmed = line.trim()

    if (trimmed.startsWith("# Changelog")) continue

    if (line.startsWith("## ")) {
      if (currentRelease) {
        releases.push({ ...currentRelease, content: currentContent.join("\n").trim() })
      }
      currentRelease = { date: line.replace("##", "").trim(), content: "" }
      currentContent = []
      continue
    }

    if (currentRelease) {
      currentContent.push(line)
    }
  }

  if (currentRelease) {
    releases.push({ ...currentRelease, content: currentContent.join("\n").trim() })
  }

  return Chunk.fromIterable(releases)
}

/** @Service.Effect.Changelog */
export class ChangelogService extends Effect.Service<ChangelogService>()("Changelog", {
  effect: Effect.gen(function* () {
    const getReleases = Effect.tryPromise({
      try: async () => {
        const fs = await import("node:fs/promises")
        const path = await import("node:path")
        const filePath = path.join(process.cwd(), "CHANGELOG.md")
        const content = await fs.readFile(filePath, "utf8")
        return parseReleases(content)
      },
      catch: (cause) =>
        new ChangelogError({
          message: "Failed to read CHANGELOG.md file",
          cause
        })
    })

    return {
      getReleases
    } as const
  })
}) { }

/** @Logic.Changelog.GetReleasesSync */
export const getChangelogReleasesSync = (): Release[] => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const fs = require("node:fs")
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const path = require("node:path")
  const filePath = path.join(process.cwd(), "CHANGELOG.md")
  const content = fs.readFileSync(filePath, "utf8")
  return Chunk.toArray(parseReleases(content))
}
