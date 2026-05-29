import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import LenisProvider from '@/components/layout/LenisProvider'
import Preloader from '@/components/layout/Preloader'
import { BRAND_NAME } from '@/lib/constants'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: `${BRAND_NAME} — Veículos Premium`,
    template: `%s | ${BRAND_NAME}`,
  },
  description: 'A melhor seleção de veículos premium do Brasil. Ferrari, Porsche, Lamborghini e mais.',
  metadataBase: new URL('https://ferrarim.com.br'),
  openGraph: {
    siteName: BRAND_NAME,
    type: 'website',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.variable} antialiased bg-carbon text-white`}>
        <Preloader />
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  )
}
