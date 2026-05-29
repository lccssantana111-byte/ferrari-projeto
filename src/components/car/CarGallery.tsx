'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useSwipe } from '@/hooks/useSwipe'

interface CarGalleryProps {
  images: string[]
  carName: string
}

export default function CarGallery({ images, carName }: CarGalleryProps) {
  const [selected, setSelected] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  function prev() { setSelected((s) => (s - 1 + images.length) % images.length) }
  function next() { setSelected((s) => (s + 1) % images.length) }

  const swipeRef = useSwipe<HTMLDivElement>(next, prev)

  if (!images.length) return null

  return (
    <>
      <div className="space-y-3">
        <motion.div
          ref={swipeRef}
          key={selected}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-graphite cursor-pointer group"
          onClick={() => setLightbox(true)}
        >
          <Image
            src={images[selected]}
            alt={`${carName} - foto ${selected + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 55vw"
            className="object-cover"
            priority={selected === 0}
          />
          {images.length > 1 && (
            <>
              <button
                className="absolute left-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center justify-center w-9 h-9 bg-carbon/60 text-white/70 hover:text-white hover:bg-carbon/80 transition-all rounded-full opacity-0 group-hover:opacity-100"
                onClick={(e) => { e.stopPropagation(); prev() }}
                aria-label="Anterior"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center justify-center w-9 h-9 bg-carbon/60 text-white/70 hover:text-white hover:bg-carbon/80 transition-all rounded-full opacity-0 group-hover:opacity-100"
                onClick={(e) => { e.stopPropagation(); next() }}
                aria-label="Próximo"
              >
                <ChevronRight size={18} />
              </button>
              <span className="absolute bottom-3 right-3 hidden sm:block text-white/40 text-xs bg-carbon/60 px-2 py-0.5 rounded-full">
                {selected + 1} / {images.length}
              </span>
            </>
          )}
        </motion.div>

        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <button
                key={img}
                onClick={() => setSelected(i)}
                className={`relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden transition-all ${
                  i === selected ? 'ring-2 ring-ferrari-red opacity-100' : 'opacity-40 hover:opacity-70'
                }`}
              >
                <Image src={img} alt={`${carName} ${i + 1}`} fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-carbon/95 flex items-center justify-center p-4"
            onClick={() => setLightbox(false)}
          >
            <button className="absolute top-4 right-4 text-white/60 hover:text-white p-2" onClick={() => setLightbox(false)}>
              <X size={24} />
            </button>

            <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-2" onClick={(e) => { e.stopPropagation(); prev() }}>
              <ChevronLeft size={32} />
            </button>

            <div className="relative w-full max-w-4xl aspect-[16/9]" onClick={(e) => e.stopPropagation()}>
              <Image src={images[selected]} alt={`${carName} - foto ${selected + 1}`} fill sizes="100vw" className="object-contain" />
            </div>

            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-2" onClick={(e) => { e.stopPropagation(); next() }}>
              <ChevronRight size={32} />
            </button>

            <span className="absolute bottom-4 text-white/30 text-sm">{selected + 1} / {images.length}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
