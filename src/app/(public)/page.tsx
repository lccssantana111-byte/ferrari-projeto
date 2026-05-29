import { getFeaturedCars } from '@/lib/queries/cars'
import HeroSection from '@/components/home/HeroSection'
import FeaturedCars from '@/components/home/FeaturedCars'
import BrandManifesto from '@/components/home/BrandManifesto'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import WhySection from '@/components/home/WhySection'
import LocationSection from '@/components/home/LocationSection'
import WhatsAppCTA from '@/components/home/WhatsAppCTA'

export const revalidate = 60

export default async function HomePage() {
  let cars: Awaited<ReturnType<typeof getFeaturedCars>> = []
  try { cars = await getFeaturedCars() } catch { /* no-op */ }

  return (
    <>
      <HeroSection />
      <BrandManifesto />
      <FeaturedCars cars={cars} />
      <TestimonialsSection />
      <WhySection />
      <LocationSection />
      <WhatsAppCTA />
    </>
  )
}
