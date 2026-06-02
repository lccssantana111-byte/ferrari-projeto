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
  active: 'text-green-400 bg-green-400/[0.08] border border-green-400/15',
  sold: 'text-red-400 bg-red-400/[0.08] border border-red-400/15',
  reserved: 'text-yellow-400 bg-yellow-400/[0.08] border border-yellow-400/15',
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
      <div className="glass rounded-xl p-16 text-center border border-white/[0.06]">
        <p className="text-white/20 text-sm mb-4">Nenhum veículo cadastrado.</p>
        <Link href="/admin/carros/novo" className="ferrari-gradient text-white px-6 py-2.5 rounded-lg text-xs font-medium uppercase tracking-wider inline-block hover:opacity-90 transition-opacity">
          Adicionar Primeiro Veículo
        </Link>
      </div>
    )
  }

  return (
    <>
      {/* Mobile: cards */}
      <div className="flex flex-col gap-2.5 sm:hidden">
        {cars.map((car) => (
          <div key={car.id} className="glass rounded-xl p-4 flex items-center gap-3 border border-white/[0.06]">
            <div className="relative w-16 h-11 rounded-lg overflow-hidden bg-graphite/50 flex-shrink-0 border border-white/[0.06]">
              {car.images[0] ? (
                <Image src={car.images[0]} alt={car.name} fill sizes="64px" className="object-cover" />
              ) : (
                <div className="w-full h-full bg-graphite/50" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">{car.name}</p>
              <p className="text-white/25 text-[11px] mt-0.5">{car.year ?? '—'}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-ferrari-red font-semibold text-xs">{formatPrice(car.price)}</span>
                <span className={cn('text-[11px] px-2 py-0.5 rounded-full', STATUS_COLORS[car.status])}>
                  {STATUS_LABELS[car.status]}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-0 flex-shrink-0">
              <button
                onClick={() => handleToggleFeatured(car)}
                disabled={togglingId === car.id}
                className={cn('p-2 transition-colors', car.featured ? 'text-yellow-400' : 'text-white/15 hover:text-white/40')}
              >
                <Star size={15} fill={car.featured ? 'currentColor' : 'none'} />
              </button>
              <Link href={`/admin/carros/${car.id}`} className="text-white/20 hover:text-white/70 transition-colors p-2">
                <Edit2 size={15} />
              </Link>
              <button
                onClick={() => handleDelete(car.id)}
                disabled={deletingId === car.id}
                className="text-white/20 hover:text-ferrari-red transition-colors p-2 disabled:opacity-30"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: tabela */}
      <div className="hidden sm:block glass rounded-xl overflow-x-auto border border-white/[0.06]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left px-6 py-4 text-white/25 text-[10px] uppercase tracking-[0.2em] font-medium">Veículo</th>
              <th className="text-left px-4 py-4 text-white/25 text-[10px] uppercase tracking-[0.2em] font-medium">Preço</th>
              <th className="text-left px-4 py-4 text-white/25 text-[10px] uppercase tracking-[0.2em] font-medium">Status</th>
              <th className="text-left px-4 py-4 text-white/25 text-[10px] uppercase tracking-[0.2em] font-medium">Destaque</th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car.id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors duration-150 group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-16 h-10 rounded-lg overflow-hidden bg-graphite/50 flex-shrink-0 border border-white/[0.06]">
                      {car.images[0] ? (
                        <Image src={car.images[0]} alt={car.name} fill sizes="64px" className="object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full bg-graphite/50" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-medium text-sm truncate">{car.name}</p>
                      <p className="text-white/25 text-xs mt-0.5">{car.year ?? '—'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-ferrari-red font-semibold text-sm whitespace-nowrap">{formatPrice(car.price)}</td>
                <td className="px-4 py-4">
                  <span className={cn('text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap tracking-wide', STATUS_COLORS[car.status])}>
                    {STATUS_LABELS[car.status]}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <button
                    onClick={() => handleToggleFeatured(car)}
                    disabled={togglingId === car.id}
                    className={cn('transition-colors p-1 duration-200', car.featured ? 'text-yellow-400' : 'text-white/15 hover:text-white/40')}
                  >
                    <Star size={15} fill={car.featured ? 'currentColor' : 'none'} />
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-0 justify-end">
                    <Link href={`/carros/${car.slug}`} target="_blank" className="text-white/20 hover:text-white/60 transition-colors duration-200 p-2 flex items-center justify-center">
                      <ExternalLink size={14} />
                    </Link>
                    <Link href={`/admin/carros/${car.id}`} className="text-white/20 hover:text-white/60 transition-colors duration-200 p-2 flex items-center justify-center">
                      <Edit2 size={14} />
                    </Link>
                    <button
                      onClick={() => handleDelete(car.id)}
                      disabled={deletingId === car.id}
                      className="text-white/20 hover:text-ferrari-red transition-colors duration-200 p-2 flex items-center justify-center disabled:opacity-30"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
