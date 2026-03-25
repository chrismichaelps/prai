/** @Route.Issues.List */
import type { Metadata } from 'next'
import { IssuesPage } from './IssuesClient'

export const metadata: Metadata = {
  title: 'Reportar Error | PR\\AI',
  description: 'Reporta errores, sugiere mejoras y ayúdanos a mejorar PR\\AI.',
}

/** @Route.Issues */
export default function IssuesRoute() {
  return <IssuesPage />
}
