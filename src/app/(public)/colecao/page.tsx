import { getAllCars } from '@/lib/queries/cars'
import ColecaoFilters from '@/components/car/ColecaoFilters'
import type { Metadata } from 'next'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Coleção | Ferrari',
  description: 'Conheça todos os modelos Ferrari disponíveis em nosso estoque.',
}

export default async function ColecaoPage() {
  let cars: Awaited<ReturnType<typeof getAllCars>> = []
  try {
    cars = await getAllCars()
  } catch { /* no-op */ }

  return (
    <main className="min-h-screen bg-carbon pt-24 sm:pt-32 pb-20 sm:pb-24 px-5 sm:px-12 lg:px-20">
      <div className="max-w-[1400px] mx-auto">

        {/* Header */}
        <div className="mb-10 sm:mb-16">
          <div className="flex items-center gap-3 mb-2">
            <span className="h-px w-6 bg-ferrari-red" />
            <span style={{ fontSize: '9px', letterSpacing: '0.4em', color: '#DC143C', textTransform: 'uppercase', fontWeight: 600 }}>Estoque</span>
          </div>
          <h1
            className="font-black text-white mt-3 leading-[0.9] tracking-[-0.03em]"
            style={{ fontSize: 'clamp(2.8rem, 5vw, 4.5rem)' }}
          >
            Coleção
            <br />
            <span style={{ color: 'white', opacity: 0.28, fontStyle: 'italic' }}>
              Completa
            </span>
          </h1>
          <p className="text-white/40 mt-4 sm:mt-6 max-w-lg text-sm leading-relaxed">
            {cars.length} {cars.length === 1 ? 'veículo disponível' : 'veículos disponíveis'} em nosso estoque. Cada Ferrari é selecionado com rigor para garantir a mais alta qualidade.
          </p>
        </div>

        {/* Filters + Grid */}
        <ColecaoFilters cars={cars} />
      </div>
    </main>
  )
}
