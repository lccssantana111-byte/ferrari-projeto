import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getCarBySlug, getAllCarSlugs, getAllCars } from '@/lib/queries/cars'
import { formatPrice } from '@/lib/utils'
import { BRAND_NAME } from '@/lib/constants'
import CarDetailClient from '@/components/car/CarDetailClient'
import type { Car } from '@/types'

export const revalidate = 3600

export async function generateStaticParams() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return []
  try {
    const slugs = await getAllCarSlugs()
    return slugs.map((s) => ({ slug: s.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const car = await getCarBySlug(params.slug)
  if (!car) return { title: 'Veículo não encontrado' }
  return {
    title: car.name,
    description: car.description ?? car.short_tagline ?? `${car.name} — ${BRAND_NAME}`,
    openGraph: {
      title: car.name,
      description: car.description ?? undefined,
      images: car.images[0] ? [{ url: car.images[0], width: 1200, height: 630 }] : [],
    },
  }
}

export default async function CarDetailPage({ params }: { params: { slug: string } }) {
  const car = await getCarBySlug(params.slug)
  if (!car) notFound()

  let otherCars: Car[] = []
  try {
    const all = await getAllCars()
    otherCars = all.filter((c) => c.slug !== params.slug)
  } catch { }

  return <CarDetailClient car={car} formattedPrice={formatPrice(car.price)} otherCars={otherCars} />
}
