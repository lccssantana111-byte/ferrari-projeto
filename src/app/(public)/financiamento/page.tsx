import type { Metadata } from 'next'
import { getAllCars } from '@/lib/queries/cars'
import FinanciamentoClient from './FinanciamentoClient'
import type { Car } from '@/types'
import { BRAND_NAME, SITE_URL } from '@/lib/constants'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Financiamento',
  description: 'Financie seu Ferrari com as melhores condições do mercado. Simule parcelas, escolha o prazo e realize o sonho do seu supercar.',
  alternates: { canonical: `${SITE_URL}/financiamento` },
  openGraph: {
    title: `Financiamento | ${BRAND_NAME}`,
    description: 'Financie seu Ferrari com as melhores condições do mercado. Simule parcelas, escolha o prazo e realize o sonho do seu supercar.',
    url: `${SITE_URL}/financiamento`,
    images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: `Financiamento | ${BRAND_NAME}` }],
  },
  twitter: {
    title: `Financiamento | ${BRAND_NAME}`,
    description: 'Financie seu Ferrari com as melhores condições do mercado.',
    images: ['/og-default.jpg'],
  },
}

const FALLBACK_CARS: Car[] = [
  {
    id: 'f1', name: 'Ferrari 488 GTB', slug: '488-gtb', price: 2800000,
    images: ['https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=85&auto=format&fit=crop'],
    description: null, short_tagline: null, video_url: null, model_url: null,
    specs: { horsepower: 710 }, featured: true, year: 2020, mileage: null,
    color_options: [], status: 'active', created_at: '', updated_at: '',
  },
  {
    id: 'f2', name: 'Ferrari Roma', slug: 'roma', price: 2200000,
    images: ['https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=800&q=85&auto=format&fit=crop'],
    description: null, short_tagline: null, video_url: null, model_url: null,
    specs: { horsepower: 620 }, featured: true, year: 2022, mileage: null,
    color_options: [], status: 'active', created_at: '', updated_at: '',
  },
  {
    id: 'f3', name: 'Ferrari SF90', slug: 'sf90', price: 5100000,
    images: ['https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=85&auto=format&fit=crop'],
    description: null, short_tagline: null, video_url: null, model_url: null,
    specs: { horsepower: 1000 }, featured: true, year: 2023, mileage: null,
    color_options: [], status: 'active', created_at: '', updated_at: '',
  },
  {
    id: 'f4', name: 'Ferrari F8 Tributo', slug: 'f8-tributo', price: 3100000,
    images: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=85&auto=format&fit=crop'],
    description: null, short_tagline: null, video_url: null, model_url: null,
    specs: { horsepower: 720 }, featured: false, year: 2021, mileage: null,
    color_options: [], status: 'active', created_at: '', updated_at: '',
  },
]

export default async function FinanciamentoPage() {
  let carros: Car[] = []
  try {
    carros = await getAllCars()
  } catch {
    carros = []
  }
  if (carros.length === 0) carros = FALLBACK_CARS

  return <FinanciamentoClient carros={carros} />
}
