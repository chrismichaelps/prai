import type { Metadata } from 'next'
import { Providers } from '@/components/Providers'
import { I18nProvider } from '@/lib/effect/I18nProvider'
import { BuildInfoProvider } from '@/lib/effect/hooks/useBuildInfo'
import { CookieBanner } from '@/components/ui/CookieBanner'
import { ModelInfoBanner } from '@/components/ui/ModelInfoBanner'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: 'PR\\AI - Tu Asistente de Inteligencia Artificial en Puerto Rico',
  description:
    'Descubre playas, road trips, gastronomía y experiencias familiares en Puerto Rico con la inteligencia artificial oficial de PR\\AI.',
  keywords: [
    'Puerto Rico',
    'IA',
    'Inteligencia Artificial',
    'Turismo',
    'Playas',
    'Boricua',
    'Guía Local',
  ],
  authors: [{ name: 'PR\\AI Team' }],
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'PR\\AI - La IA Oficial de Puerto Rico',
    description:
      'Explora la isla con el asistente virtual más avanzado de Puerto Rico. Planifica tu viaje, descubre rutas y más.',
    url: 'https://prai.app',
    siteName: 'PR\\AI',
    locale: 'es_PR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PR\\AI - Tu IA Boricua',
    description: 'Todo sobre Puerto Rico al alcance de un chat.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport = {
  themeColor: '#090909',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="antialiased">
      <body className="font-body min-h-screen">
        <Providers>
          <I18nProvider>
            <BuildInfoProvider>
              {children}
              <CookieBanner />
              <ModelInfoBanner />
              <Toaster
                position="top-center"
                theme="dark"
                richColors
                expand={false}
              />
            </BuildInfoProvider>
          </I18nProvider>
        </Providers>
      </body>
    </html>
  )
}
