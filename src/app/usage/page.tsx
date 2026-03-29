/** @Route.Usage */
import type { Metadata } from 'next'
import { UsagePage } from './UsageClient'

export const metadata: Metadata = {
  title: 'Uso | PR\\AI',
  description: 'Gestiona tu uso de mensajes en PR\\AI.',
}

/** @Route.Usage */
export default function UsageRoute() {
  return <UsagePage />
}
