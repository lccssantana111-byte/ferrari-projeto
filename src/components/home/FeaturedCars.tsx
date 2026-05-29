'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { formatPrice, cn } from '@/lib/utils'
import type { Car } from '@/types'

const STATUS_LABELS: Record<string, string> = { active: 'Disponível', sold: 'Vendido', reserved: 'Reservado' }
const STATUS_COLORS: Record<string, string> = {
  active:   'text-green-400 bg-green-400/10 border-green-400/20',
  sold:     'text-white/40 bg-white/5 border-white/10',
  reserved: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
}

const SLIDE_DURATION = 4500
const VISIBLE = 4

interface Props { cars: Car[] }

export default function FeaturedCars({ cars }: Props) {
  const featured = cars.slice(0, Math.min(cars.length, 9))
  const total = featured.length
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [paused, setPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null)
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const go = useCallback((next: number, dir: number) => {
    setDirection(dir)
    setIndex(((next % total) + total) % total)
    setProgress(0)
  }, [total])

  const prev = useCallback(() => go(index - 1, -1), [index, go])
  const next = useCallback(() => go(index + 1, 1), [index, go])

  useEffect(() => {
    if (paused) return
    if (timerRef.current)    clearInterval(timerRef.current)
    if (progressRef.current) clearInterval(progressRef.current)
    setProgress(0)
    const step = 100 / (SLIDE_DURATION / 40)
    progressRef.current = setInterval(() => setProgress(p => Math.min(p + step, 100)), 40)
    timerRef.current = setInterval(() => next(), SLIDE_DURATION)
    return () => {
      if (timerRef.current)    clearInterval(timerRef.current)
      if (progressRef.current) clearInterval(progressRef.current)
    }
  }, [index, paused, next])

  if (!total) return null

  const visibleIndices = Array.from({ length: VISIBLE }, (_, i) => ((index + i) % total))

  return (
    <section
      id="colecao"
      className="py-14 sm:py-24 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Header */}
      <div className="max-w-[1400px] mx-auto px-5 sm:px-12 lg:px-20">
        <div className="flex items-end justify-between mb-8 sm:mb-12">
          <div>
            <span style={{ fontSize: '9px', letterSpacing: '0.4em', color: '#DC143C', textTransform: 'uppercase', fontWeight: 600 }}>Coleção</span>
            <h2
              className="font-black text-white mt-2 tracking-[-0.03em]"
              style={{ fontSize: 'clamp(2rem, 6vw, 5.5rem)', lineHeight: 1.0 }}
            >
              Veículos em<br />
              <span style={{ color: '#DC143C' }}>Destaque</span>
            </h2>
          </div>

          {/* Botões ← → */}
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              className="w-11 h-11 flex items-center justify-center border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all duration-200"
              aria-label="Anterior"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={next}
              className="w-11 h-11 flex items-center justify-center border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all duration-200"
              aria-label="Próximo"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Slider */}
      <div className="w-full px-3 sm:px-6 lg:px-10">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={index}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
            initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {visibleIndices.map((carIdx, slot) => {
              const car = featured[carIdx]
              return (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: slot * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link href={`/carros/${car.slug}`} className="group block">
                    {/* Imagem */}
                    <div
                      className="relative overflow-hidden bg-graphite mb-3 sm:mb-5"
                      style={{ aspectRatio: '4/3' }}
                    >
                      {car.images[0] ? (
                        <Image
                          src={car.images[0]}
                          alt={car.name}
                          fill
                          sizes="(max-width: 640px) 48vw, (max-width: 1024px) 48vw, 26vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-graphite to-carbon flex items-center justify-center">
                          <span className="text-white/10 text-4xl font-bold">{car.name[0]}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-carbon/60 via-carbon/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4">
                        <span className={cn('text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border', STATUS_COLORS[car.status])}>
                          {STATUS_LABELS[car.status]}
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="px-0.5">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="text-white font-bold group-hover:text-ferrari-red transition-colors leading-tight" style={{ fontSize: 'clamp(0.8rem, 2.5vw, 1.1rem)' }}>
                          {car.name}
                        </h3>
                        <ArrowRight size={14} className="text-white/20 group-hover:text-ferrari-red group-hover:translate-x-0.5 transition-all mt-0.5 flex-shrink-0 hidden sm:block" />
                      </div>
                      {car.short_tagline && (
                        <p className="text-white/35 text-xs mb-2 leading-relaxed hidden sm:block">{car.short_tagline}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-ferrari-red font-bold" style={{ fontSize: 'clamp(0.75rem, 2.2vw, 1rem)' }}>
                          {formatPrice(car.price)}
                        </span>
                        {car.year && (
                          <span className="text-white/25 text-xs hidden sm:block">{car.year}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots + CTA */}
      <div className="max-w-[1400px] mx-auto px-5 sm:px-12 lg:px-20">
        <div className="flex items-center justify-center gap-2 mt-8 sm:mt-10">
          {featured.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i, i > index ? 1 : -1)}
              className="relative flex items-center justify-center h-10 px-1"
              aria-label={`Slide ${i + 1}`}
            >
              <span
                className="relative overflow-hidden block transition-all duration-300"
                style={{ height: '1px', width: i === index ? 32 : 14, background: 'rgba(255,255,255,0.12)' }}
              >
                {i === index && (
                  <motion.span
                    className="absolute inset-y-0 left-0 bg-ferrari-red"
                    style={{ width: `${progress}%` }}
                  />
                )}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-8 sm:mt-12 flex items-center justify-center">
          <Link
            href="/colecao"
            className="group flex items-center gap-3 ferrari-gradient text-white font-bold uppercase min-h-[44px] px-8 sm:px-10 hover:opacity-90 transition-opacity"
            style={{ fontSize: '10px', letterSpacing: '0.22em' }}
          >
            Ver coleção completa
            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </section>
  )
}
