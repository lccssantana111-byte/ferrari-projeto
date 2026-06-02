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
          <p className="text-white/25 text-[10px] uppercase tracking-[0.3em] mb-2">Inventário</p>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {featured === 'true' ? 'Em Destaque' : 'Veículos'}
          </h1>
          <p className="text-white/35 text-sm mt-1">
            {cars.length} veículo{cars.length !== 1 ? 's' : ''}
            {featured === 'true' && (
              <Link href="/admin/carros" className="ml-2 text-white/25 hover:text-white/60 underline underline-offset-2 transition-colors duration-200">
                ver todos
              </Link>
            )}
          </p>
        </div>
        <Link
          href="/admin/carros/novo"
          className="flex items-center gap-2 ferrari-gradient text-white font-medium px-5 py-2.5 rounded-lg text-xs uppercase tracking-wider hover:opacity-90 transition-opacity min-h-[44px]"
        >
          <Plus size={14} />
          Novo Veículo
        </Link>
      </div>

      <CarTable cars={cars} />
    </div>
  )
}
