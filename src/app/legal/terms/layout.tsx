import type { Metadata } from 'next'

/** @Route.Legal.Terms.Layout */
export const metadata: Metadata = {
  title: 'Términos de Servicio - PR\\AI',
  description: 'Lee nuestros términos de servicio para entender las reglas y condiciones de uso de la plataforma PR\\AI.',
  openGraph: {
    title: 'Términos de Servicio PR\\AI',
    description: 'Reglas y condiciones para el uso de nuestra inteligencia artificial boricua.',
    url: 'https://prai-tourism.com/legal/terms',
    type: 'website',
  },
}

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
