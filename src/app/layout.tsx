import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { Providers } from '@/components/Providers'
import { I18nProvider } from '@/lib/effect/I18nProvider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

import { BuildInfoProvider } from '@/lib/effect/hooks/useBuildInfo'
import { CookieBanner } from '@/components/ui/CookieBanner'
import { ModelInfoBanner } from '@/components/ui/ModelInfoBanner'
import { ErrorToast } from '@/components/ui/ErrorToast'
import { ToastProvider } from '@/components/ui/ToastProvider'
import { AuthProvider } from '@/contexts/AuthContext'
import { SkipLink } from '@/components/ui/SkipLink'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://prai-tourism.com'),
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
    url: 'https://prai-tourism.com',
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
  verification: {
    google: 'tSl-5AerWZ_QVANu60Zx3xj6q7RABQ0gVef8WCaK2ok',
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
    <html
      lang="es"
      className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
    >
      <body className="font-body min-h-screen">
        <SkipLink />
        <Providers>
          <I18nProvider>
            <BuildInfoProvider>
              <ToastProvider>
                <AuthProvider>
                  {children}
                  <CookieBanner />
                  <ModelInfoBanner />
                  <ErrorToast />
                </AuthProvider>
              </ToastProvider>
            </BuildInfoProvider>
          </I18nProvider>
        </Providers>
      </body>
    </html>
  )
}
