import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getAllCarsAdmin } from '@/lib/queries/admin'
import CarTable from '@/components/admin/CarTable'

export default async function AdminCarsPage() {
  const cars = await getAllCarsAdmin()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Veículos</h1>
          <p className="text-white/40 text-sm mt-1">{cars.length} veículo(s) cadastrado(s)</p>
        </div>
        <Link
          href="/admin/carros/novo"
          className="flex items-center gap-2 ferrari-gradient text-white font-semibold px-5 py-2.5 rounded-lg text-sm hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          Novo Veículo
        </Link>
      </div>

      <CarTable cars={cars} />
    </div>
  )
}
