import type { Metadata } from 'next'

/** @Route.Legal.Privacy.Layout */
export const metadata: Metadata = {
  title: 'Política de Privacidad - PR\\AI',
  description: 'Conoce cómo protegemos tus datos y aseguramos tu privacidad mientras exploras Puerto Rico con nuestra inteligencia artificial.',
  openGraph: {
    title: 'Privacidad en PR\\AI - Tu Seguridad es Primero',
    description: 'Nuestras políticas de manejo de datos para una experiencia segura.',
    url: 'https://prai-tourism.com/legal/privacy',
    type: 'website',
  },
}

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
