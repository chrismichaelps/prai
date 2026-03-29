/** @Route.Status */
import type { Metadata } from 'next'
import StatusClient from './StatusClient'

export const metadata: Metadata = {
  title: 'Status | PR\\AI',
  description: 'Estado de los servicios de PR\\AI.',
}

/** @Route.Status */
export default function StatusRoute() {
  return <StatusClient />
}
