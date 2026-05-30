'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { formatPrice, cn } from '@/lib/utils'
import type { Car } from '@/types'

function formatMileage(km: number) {
  if (km === 0) return '0 km'
  return km.toLocaleString('pt-BR') + ' km'
}

const STATUS_LABELS: Record<string, string> = { active: 'Disponível', sold: 'Vendido', reserved: 'Reservado' }
const STATUS_COLORS: Record<string, string> = {
  active: 'text-green-400 bg-green-400/10 border-green-400/20',
  sold: 'text-white/40 bg-white/5 border-white/10',
  reserved: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
}

interface CarCardProps {
  car: Car
  index?: number
}

export default function CarCard({ car, index = 0 }: CarCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/carros/${car.slug}`} className="group block">
        <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-graphite mb-4">
          {car.images[0] ? (
            <Image
              src={car.images[0]}
              alt={car.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-expo-out"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-graphite to-carbon flex items-center justify-center">
              <span className="text-white/10 text-4xl font-bold">{car.name[0]}</span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-carbon/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="absolute top-4 left-4">
            <span className={cn('text-xs px-3 py-1 rounded-full border', STATUS_COLORS[car.status])}>
              {STATUS_LABELS[car.status]}
            </span>
          </div>
        </div>

        <div className="px-1">
          <div className="flex items-start justify-between mb-1">
            <h3 className="text-white font-semibold text-lg group-hover:text-ferrari-red transition-colors">{car.name}</h3>
            <ArrowRight size={18} className="text-white/20 group-hover:text-ferrari-red group-hover:translate-x-1 transition-all mt-1 flex-shrink-0" />
          </div>

          {car.short_tagline && (
            <p className="text-white/40 text-sm mb-3">{car.short_tagline}</p>
          )}

          <div className="flex flex-wrap gap-x-3 gap-y-1.5 mb-3">
            {car.mileage != null && (
              <span className="text-white/35 text-xs">{formatMileage(car.mileage)}</span>
            )}
            {car.specs?.transmission && (
              <span className="text-white/35 text-xs">{car.specs.transmission}</span>
            )}
            {car.specs?.engine && (
              <span className="text-white/35 text-xs">{car.specs.engine}</span>
            )}
            {car.specs?.horsepower && (
              <span className="text-white/35 text-xs">{car.specs.horsepower} cv</span>
            )}
            {car.specs?.acceleration && (
              <span className="text-white/35 text-xs">{car.specs.acceleration}</span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-ferrari-red font-bold text-lg">{formatPrice(car.price)}</span>
            {car.year && <span className="text-white/25 text-sm">{car.year}</span>}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
