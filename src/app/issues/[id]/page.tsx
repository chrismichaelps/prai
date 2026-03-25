/** @Route.Issues.Detail */
import type { Metadata } from 'next'
import { IssueDetailClient } from './IssueDetailClient'

export const metadata: Metadata = {
  title: 'Reporte | PR\\AI',
}

/** @Route.Issues.Detail */
export default async function IssueDetailRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <IssueDetailClient issueId={id} />
}
