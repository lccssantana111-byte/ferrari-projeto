import { notFound } from 'next/navigation'
import { getCarById } from '@/lib/queries/admin'
import CarForm from '@/components/admin/CarForm'

interface Props {
  params: { id: string }
}

export default async function EditCarPage({ params }: Props) {
  const car = await getCarById(params.id)
  if (!car) notFound()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Editar Veículo</h1>
        <p className="text-white/40 text-sm mt-1">{car.name}</p>
      </div>
      <CarForm car={car} />
    </div>
  )
}
