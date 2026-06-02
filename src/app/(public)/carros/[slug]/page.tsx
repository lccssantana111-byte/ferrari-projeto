import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getCarBySlug, getAllCarSlugs, getAllCars } from '@/lib/queries/cars'
import { formatPrice } from '@/lib/utils'
import { BRAND_NAME, SITE_URL } from '@/lib/constants'
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

  const rawDesc = car.description ?? car.short_tagline ?? `${car.name} — ${BRAND_NAME}`
  const description = rawDesc.length > 155 ? rawDesc.slice(0, 152) + '…' : rawDesc
  const url = `${SITE_URL}/carros/${car.slug}`
  const images = car.images[0]
    ? [{ url: car.images[0], width: 1200, height: 630, alt: car.name }]
    : [{ url: '/og-default.jpg', width: 1200, height: 630, alt: car.name }]

  return {
    title: car.name,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${car.name} | ${BRAND_NAME}`,
      description,
      url,
      type: 'website',
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${car.name} | ${BRAND_NAME}`,
      description,
      images: images.map((i) => i.url),
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

  const url = `${SITE_URL}/carros/${car.slug}`
  const vehicleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: car.name,
    brand: { '@type': 'Brand', name: 'Ferrari' },
    url,
    description: car.description ?? car.short_tagline ?? car.name,
    image: car.images,
    ...(car.year && { vehicleModelDate: String(car.year) }),
    ...(car.mileage != null && {
      mileageFromOdometer: {
        '@type': 'QuantitativeValue',
        value: car.mileage,
        unitCode: 'KMT',
      },
    }),
    ...(car.specs?.horsepower && {
      vehicleEngine: {
        '@type': 'EngineSpecification',
        enginePower: {
          '@type': 'QuantitativeValue',
          value: car.specs.horsepower,
          unitCode: 'BHP',
        },
      },
    }),
    offers: {
      '@type': 'Offer',
      price: car.price,
      priceCurrency: 'BRL',
      availability:
        car.status === 'active'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/SoldOut',
      url,
      seller: { '@type': 'AutoDealer', name: BRAND_NAME, url: SITE_URL },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(vehicleSchema) }}
      />
      <CarDetailClient car={car} formattedPrice={formatPrice(car.price)} otherCars={otherCars} />
    </>
  )
}
