import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getAllCarsAdmin } from '@/lib/queries/admin'
import CarTable from '@/components/admin/CarTable'

interface Props {
  searchParams: Promise<{ featured?: string }>
}

export default async function AdminCarsPage({ searchParams }: Props) {
  const { featured } = await searchParams
  const allCars = await getAllCarsAdmin()
  const cars = featured === 'true' ? allCars.filter(c => c.featured) : allCars

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {featured === 'true' ? 'Veículos em Destaque' : 'Veículos'}
          </h1>
          <p className="text-white/40 text-sm mt-1">
            {cars.length} veículo(s)
            {featured === 'true' && (
              <Link href="/admin/carros" className="ml-2 text-white/30 hover:text-white underline underline-offset-2 transition-colors">
                ver todos
              </Link>
            )}
          </p>
        </div>
        <Link
          href="/admin/carros/novo"
          className="flex items-center gap-2 ferrari-gradient text-white font-semibold px-5 py-2.5 rounded-lg text-sm hover:opacity-90 transition-opacity min-h-[44px]"
        >
          <Plus size={16} />
          Novo Veículo
        </Link>
      </div>

      <CarTable cars={cars} />
    </div>
  )
}
