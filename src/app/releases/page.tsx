import { getChangelogReleasesSync } from '@/lib/effect/services/Changelog'
import { ReleasesPage } from './ReleasesClient'
import type { Metadata } from 'next'

export const dynamic = 'force-static'
export const revalidate = false

export const metadata: Metadata = {
  title: 'Release Notes | PR\\AI',
  description: 'The latest updates, features, and fixes for the PR\\AI platform.',
}

/** @Route.Releases */
export default function ReleasesPageRoute() {
  const releases = getChangelogReleasesSync()
  
  return <ReleasesPage releases={releases} />
}
