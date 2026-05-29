import CarForm from '@/components/admin/CarForm'

export default function NewCarPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Novo Veículo</h1>
        <p className="text-white/40 text-sm mt-1">Preencha os dados do veículo</p>
      </div>
      <CarForm />
    </div>
  )
}
