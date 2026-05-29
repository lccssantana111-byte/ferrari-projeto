'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Edit2, Trash2, Star, ExternalLink } from 'lucide-react'
import { formatPrice, cn } from '@/lib/utils'
import type { Car } from '@/types'

const STATUS_LABELS: Record<string, string> = { active: 'Disponível', sold: 'Vendido', reserved: 'Reservado' }
const STATUS_COLORS: Record<string, string> = {
  active: 'text-green-400 bg-green-400/10',
  sold: 'text-red-400 bg-red-400/10',
  reserved: 'text-yellow-400 bg-yellow-400/10',
}

interface CarTableProps {
  cars: Car[]
}

export default function CarTable({ cars }: CarTableProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja apagar este veículo?')) return
    setDeletingId(id)
    await fetch(`/api/admin/cars/${id}`, { method: 'DELETE' })
    setDeletingId(null)
    router.refresh()
  }

  async function handleToggleFeatured(car: Car) {
    setTogglingId(car.id)
    await fetch(`/api/admin/cars/${car.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ featured: !car.featured }),
    })
    setTogglingId(null)
    router.refresh()
  }

  if (!cars.length) {
    return (
      <div className="glass rounded-xl p-12 text-center">
        <p className="text-white/30">Nenhum veículo cadastrado.</p>
        <Link href="/admin/carros/novo" className="ferrari-gradient text-white px-6 py-2 rounded-lg text-sm mt-4 inline-block hover:opacity-90">
          Adicionar Primeiro Veículo
        </Link>
      </div>
    )
  }

  return (
    <div className="glass rounded-xl overflow-x-auto">
      <table className="w-full min-w-[500px]">
        <thead>
          <tr className="border-b border-white/5">
            <th className="text-left px-4 sm:px-6 py-4 text-white/40 text-xs uppercase tracking-widest font-medium">Veículo</th>
            <th className="text-left px-4 py-4 text-white/40 text-xs uppercase tracking-widest font-medium">Preço</th>
            <th className="text-left px-4 py-4 text-white/40 text-xs uppercase tracking-widest font-medium hidden sm:table-cell">Status</th>
            <th className="text-left px-4 py-4 text-white/40 text-xs uppercase tracking-widest font-medium hidden md:table-cell">Destaque</th>
            <th className="px-4 sm:px-6 py-4" />
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <tr key={car.id} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
              <td className="px-4 sm:px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-8 sm:w-16 sm:h-10 rounded-lg overflow-hidden bg-graphite flex-shrink-0">
                    {car.images[0] ? (
                      <Image src={car.images[0]} alt={car.name} fill sizes="64px" className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-graphite" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-medium text-sm truncate">{car.name}</p>
                    <p className="text-white/30 text-xs">{car.year ?? '—'}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 text-white/70 text-sm whitespace-nowrap">
                {formatPrice(car.price)}
              </td>
              <td className="px-4 py-4 hidden sm:table-cell">
                <span className={cn('text-xs px-2 py-1 rounded-full whitespace-nowrap', STATUS_COLORS[car.status])}>
                  {STATUS_LABELS[car.status]}
                </span>
              </td>
              <td className="px-4 py-4 hidden md:table-cell">
                <button
                  onClick={() => handleToggleFeatured(car)}
                  disabled={togglingId === car.id}
                  className={cn('transition-colors p-1', car.featured ? 'text-yellow-400' : 'text-white/20 hover:text-white/50')}
                >
                  <Star size={16} fill={car.featured ? 'currentColor' : 'none'} />
                </button>
              </td>
              <td className="px-4 sm:px-6 py-4">
                <div className="flex items-center gap-1 justify-end">
                  <Link href={`/carros/${car.slug}`} target="_blank" className="text-white/30 hover:text-white transition-colors p-2 min-w-[36px] min-h-[36px] flex items-center justify-center">
                    <ExternalLink size={15} />
                  </Link>
                  <Link href={`/admin/carros/${car.id}`} className="text-white/30 hover:text-white transition-colors p-2 min-w-[36px] min-h-[36px] flex items-center justify-center">
                    <Edit2 size={15} />
                  </Link>
                  <button
                    onClick={() => handleDelete(car.id)}
                    disabled={deletingId === car.id}
                    className="text-white/30 hover:text-ferrari-red transition-colors p-2 min-w-[36px] min-h-[36px] flex items-center justify-center disabled:opacity-30"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
