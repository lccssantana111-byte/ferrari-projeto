'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, ArrowRight } from 'lucide-react'
import { getWhatsAppLink } from '@/lib/constants'

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1920&q=95&auto=format&fit=crop',
    objectPosition: 'center 40%',
    index: '01',
    model: '488 GTB',
    tagline: ['Não é um carro.', 'É uma sentença.'],
    line2Style: { color: '#DC143C' } as React.CSSProperties,
    specs: [
      { value: '710', unit: 'cv', label: 'Potência' },
      { value: '3.1', unit: 's', label: '0–100' },
      { value: '325', unit: 'km/h', label: 'Vel. Máx.' },
    ],
  },
  {
    image: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=1920&q=95&auto=format&fit=crop',
    objectPosition: 'center 50%',
    index: '02',
    model: 'Roma',
    tagline: ['Roma foi feita', 'para ser vista.'],
    line2Style: { color: 'white', mixBlendMode: 'overlay', opacity: 0.8 } as React.CSSProperties,
    specs: [
      { value: '620', unit: 'cv', label: 'Potência' },
      { value: '3.4', unit: 's', label: '0–100' },
      { value: '320', unit: 'km/h', label: 'Vel. Máx.' },
    ],
  },
  {
    image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1920&q=95&auto=format&fit=crop',
    objectPosition: 'center 35%',
    index: '03',
    model: 'SF90',
    tagline: ['Elétrico na alma.', 'Ferrari no sangue.'],
    line2Style: {
      background: 'linear-gradient(90deg, rgba(220,20,60,0.9) 0%, rgba(255,255,255,0.5) 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    } as React.CSSProperties,
    specs: [
      { value: '1000', unit: 'cv', label: 'Potência' },
      { value: '2.5', unit: 's', label: '0–100' },
      { value: '340', unit: 'km/h', label: 'Vel. Máx.' },
    ],
  },
  {
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&q=95&auto=format&fit=crop',
    objectPosition: 'center 45%',
    index: '04',
    model: 'F8 Tributo',
    tagline: ['720 cv de', 'argumento.'],
    line2Style: { color: 'white', fontStyle: 'italic', opacity: 0.55, letterSpacing: '0.02em' } as React.CSSProperties,
    specs: [
      { value: '720', unit: 'cv', label: 'Potência' },
      { value: '2.9', unit: 's', label: '0–100' },
      { value: '340', unit: 'km/h', label: 'Vel. Máx.' },
    ],
  },
]

const DURATION = 5000

export default function HeroSection() {
  const [current, setCurrent] = useState(0)
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function startCycle(index = current) {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (progressRef.current) clearInterval(progressRef.current)
    setProgress(0)
    const step = 100 / (DURATION / 50)
    progressRef.current = setInterval(() => setProgress(p => Math.min(p + step, 100)), 50)
    intervalRef.current = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), DURATION)
  }

  useEffect(() => {
    startCycle()
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (progressRef.current) clearInterval(progressRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    startCycle(current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current])

  function goTo(index: number) {
    if (index === current) return
    setCurrent(index)
  }

  function scrollToCollection() {
    document.getElementById('colecao')?.scrollIntoView({ behavior: 'smooth' })
  }

  const slide = SLIDES[current]

  return (
    <section className="relative h-[100svh] min-h-[600px] overflow-hidden bg-carbon select-none">

      {/* ── Background crossfade + Ken Burns ── */}
      <AnimatePresence initial={false}>
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.06 }}
            animate={{ scale: 1.0 }}
            transition={{ duration: DURATION / 1000 + 1.4, ease: 'linear' }}
          >
            <Image
              src={slide.image}
              alt={slide.model}
              fill
              priority={current === 0}
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: slide.objectPosition }}
            />
          </motion.div>
          {/* Gradiente mobile — mais denso na parte inferior para legibilidade */}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.35)_0%,rgba(10,10,10,0.1)_35%,rgba(10,10,10,0.55)_65%,rgba(10,10,10,0.92)_100%)]" />
          {/* Gradiente lateral — só desktop */}
          <div className="absolute inset-0 hidden sm:block bg-[linear-gradient(110deg,rgba(10,10,10,0.75)_0%,rgba(10,10,10,0.3)_45%,transparent_70%)]" />
        </motion.div>
      </AnimatePresence>

      {/* ── Índice do slide — canto superior direito ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`idx-${current}`}
          className="absolute top-[calc(92px+20px)] right-5 sm:right-10 z-20 flex flex-col items-end gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span style={{ fontSize: '9px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>
            {slide.index} / 04
          </span>
          <div className="w-4 h-px" style={{ background: '#DC143C' }} />
        </motion.div>
      </AnimatePresence>

      {/* ── Main content ── */}
      <div className="relative z-10 h-full flex flex-col justify-end px-5 sm:px-12 lg:px-28 max-w-[1400px] mx-auto">

        {/* Label do modelo */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`label-${current}`}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 mb-3 sm:mb-4"
          >
            <span className="w-5 sm:w-6 h-px bg-ferrari-red" />
            <span style={{ fontSize: '9px', letterSpacing: '0.4em', color: '#DC143C', textTransform: 'uppercase', fontWeight: 600 }}>
              Ferrari {slide.model}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Headline */}
        <AnimatePresence mode="wait">
          <motion.div key={`title-${current}`} className="tracking-[-0.04em] mb-5 sm:mb-7">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="font-black text-white"
              style={{ fontSize: 'clamp(2.4rem, 8.5vw, 6.5rem)', lineHeight: 0.9 }}
            >
              {slide.tagline[0]}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="font-black"
              style={{
                fontSize: 'clamp(2.4rem, 8.5vw, 6.5rem)',
                lineHeight: 0.9,
                paddingBottom: '0.18em',
                ...slide.line2Style,
              }}
            >
              {slide.tagline[1]}
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Specs — linha horizontal em mobile, lado a lado no desktop */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`specs-${current}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="flex items-center gap-0 mb-5 sm:mb-6"
          >
            {slide.specs.map((s, i) => (
              <div key={i} className="flex items-center">
                <div className="flex flex-col pr-4 sm:pr-6">
                  <span className="font-bold text-white leading-none" style={{ fontSize: 'clamp(0.85rem, 3vw, 1.3rem)', letterSpacing: '-0.01em' }}>
                    {s.value}
                    <span className="text-ferrari-red font-normal ml-0.5" style={{ fontSize: '0.5em' }}>{s.unit}</span>
                  </span>
                  <span className="text-white/25 uppercase mt-1" style={{ fontSize: '7px', letterSpacing: '0.18em' }}>{s.label}</span>
                </div>
                {i < slide.specs.length - 1 && (
                  <div className="w-px h-6 bg-white/10 mr-4 sm:mr-6" />
                )}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="flex items-center gap-2 sm:gap-3 mb-5 sm:mb-6"
        >
          <button
            onClick={scrollToCollection}
            className="group flex items-center gap-2 ferrari-gradient text-white font-bold uppercase min-h-[44px] px-5 sm:px-6 hover:opacity-90 transition-opacity"
            style={{ fontSize: '9px', letterSpacing: '0.22em' }}
          >
            Ver Coleção
            <ArrowRight size={9} className="group-hover:translate-x-0.5 transition-transform duration-200" />
          </button>
          <Link
            href={getWhatsAppLink('Olá, quero agendar uma visita.')}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 border border-white/20 text-white/55 hover:text-white hover:border-white/35 font-bold uppercase min-h-[44px] px-5 sm:px-6 transition-all duration-300"
            style={{ fontSize: '9px', letterSpacing: '0.22em' }}
          >
            <MessageCircle size={9} className="shrink-0" />
            Agendar
          </Link>
        </motion.div>

        {/* Dots de navegação */}
        <div className="flex items-center gap-2 pb-5 sm:pb-7">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              className="relative flex items-center justify-center h-11 pr-2 pl-0"
            >
              <span
                className="relative overflow-hidden block transition-all duration-300"
                style={{ height: '1px', width: i === current ? 28 : 14, background: 'rgba(255,255,255,0.18)' }}
              >
                {i === current && (
                  <motion.span
                    className="absolute inset-y-0 left-0 bg-ferrari-red"
                    style={{ width: `${progress}%` }}
                  />
                )}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
