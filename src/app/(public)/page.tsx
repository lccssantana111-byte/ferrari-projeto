import type { Metadata } from 'next'
import { getFeaturedCars } from '@/lib/queries/cars'
import HeroSection from '@/components/home/HeroSection'
import FeaturedCars from '@/components/home/FeaturedCars'
import BrandManifesto from '@/components/home/BrandManifesto'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import WhySection from '@/components/home/WhySection'
import LocationSection from '@/components/home/LocationSection'
import WhatsAppCTA from '@/components/home/WhatsAppCTA'
import { BRAND_NAME, SITE_URL } from '@/lib/constants'

export const revalidate = 60

export const metadata: Metadata = {
  title: `${BRAND_NAME} — Veículos Premium`,
  description: 'A melhor seleção de Ferraris do Brasil. Compre seu Ferrari com segurança, financiamento e atendimento exclusivo.',
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: `${BRAND_NAME} — Veículos Premium`,
    description: 'A melhor seleção de Ferraris do Brasil. Compre seu Ferrari com segurança, financiamento e atendimento exclusivo.',
    url: SITE_URL,
    images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: `${BRAND_NAME} — Veículos Premium` }],
  },
  twitter: {
    title: `${BRAND_NAME} — Veículos Premium`,
    description: 'A melhor seleção de Ferraris do Brasil.',
    images: ['/og-default.jpg'],
  },
}

export default async function HomePage() {
  let cars: Awaited<ReturnType<typeof getFeaturedCars>> = []
  try { cars = await getFeaturedCars() } catch { /* no-op */ }

  return (
    <>
      <HeroSection cars={cars} />
      <BrandManifesto />
      <FeaturedCars cars={cars} />
      <TestimonialsSection />
      <WhySection />
      <LocationSection />
      <WhatsAppCTA />
    </>
  )
}
