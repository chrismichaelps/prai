import type { Metadata } from 'next'

/** @Route.Legal.Cookies.Layout */
export const metadata: Metadata = {
  title: 'Política de Cookies - PR\\AI',
  description: 'Conoce cómo utilizamos las cookies para mejorar tu experiencia en PR\\AI y cómo puedes gestionarlas.',
  openGraph: {
    title: 'Cookies en PR\\AI',
    description: 'Transparencia sobre el uso de cookies en nuestra plataforma.',
    url: 'https://prai.app/legal/cookies',
    type: 'website',
  },
}

export default function CookiesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
