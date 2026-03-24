/** @Route.BuildInfo */
import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

export const dynamic = 'force-static'

interface VersionData {
  version: string
}

/** @Route.BuildInfo.GET */
export async function GET() {
  try {
    const versionData = await readFile(
      join(process.cwd(), 'public', 'app-version.json'),
      'utf-8',
    )
    const { version } = JSON.parse(versionData) as VersionData
    return NextResponse.json({ buildHash: version.substring(0, 12) })
  } catch {
    return NextResponse.json({ buildHash: 'dev' })
  }
}
