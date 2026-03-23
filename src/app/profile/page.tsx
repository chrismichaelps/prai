import type { Metadata } from 'next'
import { ProfileClient } from './_components/ProfileClient'

/** @Route.Profile */
export const metadata: Metadata = {
  title: 'Mi Perfil | PR\\AI',
  description: 'Gestiona tu perfil en PR\\AI. Personaliza tu experiencia de turismo en Puerto Rico.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function ProfilePage() {
  return <ProfileClient />
}
