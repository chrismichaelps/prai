import type { Metadata } from 'next'

/** @Route.Chat.Layout */
export const metadata: Metadata = {
  title: 'Chat con PR\\AI - Tu Guía Inteligente',
  description: 'Chatea con PR\\AI para planificar tu próxima aventura en Puerto Rico. Pregunta sobre playas, comida, rutas y mucho más.',
  openGraph: {
    title: 'PR\\AI Chat - Tu Guía en Puerto Rico',
    description: 'Planifica tu viaje y descubre Puerto Rico interactuando con nuestra IA.',
    url: 'https://prai.app/chat',
    type: 'website',
  },
}

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
