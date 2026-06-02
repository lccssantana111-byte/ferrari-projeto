import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import LenisProvider from '@/components/layout/LenisProvider'
import Preloader from '@/components/layout/Preloader'
import { BRAND_NAME, SITE_URL } from '@/lib/constants'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const viewport: Viewport = {
  viewportFit: 'cover',
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0A0A0A',
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND_NAME} — Veículos Premium`,
    template: `%s | ${BRAND_NAME}`,
  },
  description: 'A melhor seleção de Ferraris do Brasil. Compre seu Ferrari com segurança, financiamento e atendimento exclusivo.',
  keywords: ['Ferrari', 'carros de luxo', 'veículos premium', 'Ferrari à venda', 'concessionária Ferrari', 'carros esportivos', 'supercarros Brasil'],
  authors: [{ name: BRAND_NAME }],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    siteName: BRAND_NAME,
    type: 'website',
    locale: 'pt_BR',
    url: SITE_URL,
    title: `${BRAND_NAME} — Veículos Premium`,
    description: 'A melhor seleção de Ferraris do Brasil. Compre seu Ferrari com segurança, financiamento e atendimento exclusivo.',
    images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: `${BRAND_NAME} — Veículos Premium` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BRAND_NAME} — Veículos Premium`,
    description: 'A melhor seleção de Ferraris do Brasil.',
    images: ['/og-default.jpg'],
  },
}

const autoDealer = {
  '@context': 'https://schema.org',
  '@type': 'AutoDealer',
  name: BRAND_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/og-default.jpg`,
  description: 'A melhor seleção de Ferraris do Brasil.',
  areaServed: { '@type': 'Country', name: 'Brazil' },
  currenciesAccepted: 'BRL',
  priceRange: '$$$',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    availableLanguage: { '@type': 'Language', name: 'Portuguese' },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.variable} antialiased bg-carbon text-white`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(autoDealer) }}
        />
        <Preloader />
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  )
}
