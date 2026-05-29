'use client'

import { useRef, useState } from 'react'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

const EASE = [0.16, 1, 0.3, 1] as const

const SPACES = [
  {
    id: '01',
    src: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600&q=90&auto=format&fit=crop',
    alt: 'Salão principal',
    label: 'Salão Principal',
    objectPosition: 'center 30%',
  },
  {
    id: '02',
    src: 'https://images.unsplash.com/photo-1567538096621-38d2284b23ff?w=1600&q=90&auto=format&fit=crop',
    alt: 'Lounge VIP',
    label: 'Lounge VIP',
    objectPosition: 'center 40%',
  },
  {
    id: '03',
    src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=90&auto=format&fit=crop',
    alt: 'Recepção',
    label: 'Recepção',
    objectPosition: 'center 50%',
  },
  {
    id: '04',
    src: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1600&q=90&auto=format&fit=crop',
    alt: 'Sala Privativa',
    label: 'Sala Privativa',
    objectPosition: 'center 35%',
  },
]

export default function ShowroomSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-60px' })
  const [active, setActive] = useState(0)

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const yImg = useTransform(scrollYProgress, [0, 1], ['-5%', '5%'])

  return (
    <section
      ref={sectionRef}
      id="showroom"
      className="relative overflow-hidden"
      style={{ background: '#E8E4DE' }}
    >
      {/* faixa vermelha topo */}
      <motion.div
        className="h-[3px] bg-ferrari-red origin-left"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.1, ease: EASE }}
      />

      {/* Mobile: imagem em cima, tabs em baixo */}
      {/* Desktop: grid lado a lado */}
      <div className="flex flex-col lg:grid lg:grid-cols-[400px_1fr] xl:grid-cols-[460px_1fr]" style={{ minHeight: 'clamp(520px, 80vw, 700px)' }}>

        {/* Imagem — acima no mobile, direita no desktop */}
        <motion.div
          className="relative overflow-hidden order-first lg:order-last"
          style={{ minHeight: 'clamp(220px, 52vw, 700px)' }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1.0, delay: 0.1, ease: EASE }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              <motion.div className="absolute inset-[-6%]" style={{ y: yImg }}>
                <Image
                  src={SPACES[active].src}
                  alt={SPACES[active].alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 65vw"
                  className="object-cover"
                  style={{ objectPosition: SPACES[active].objectPosition }}
                  priority={active === 0}
                />
              </motion.div>
              <div className="absolute inset-0" style={{ boxShadow: 'inset 0 -40px 60px rgba(232,228,222,0.25)' }} />
            </motion.div>
          </AnimatePresence>

          {/* Contador */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`num-${active}`}
              className="absolute bottom-4 right-5 z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <span className="font-black" style={{ fontSize: '10px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.45)' }}>
                {SPACES[active].id} / 04
              </span>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Painel de texto + tabs */}
        <motion.div
          className="flex flex-col justify-between px-5 sm:px-10 xl:px-14 py-8 sm:py-14 order-last lg:order-first"
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <div>
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <span className="h-px w-6 bg-ferrari-red" />
              <span style={{ fontSize: '9px', letterSpacing: '0.42em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.4)', fontWeight: 600 }}>
                A Concessionária
              </span>
            </div>

            <h2
              className="font-black tracking-[-0.04em]"
              style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', lineHeight: 1.0, color: '#0A0A0A' }}
            >
              Conheça
              <br />
              nosso
              <br />
              <span style={{ color: '#0A0A0A', opacity: 0.25, fontStyle: 'italic' }}>
                espaço
              </span>
            </h2>
          </div>

          {/* Abas de navegação */}
          <div className="flex flex-col mt-8 sm:mt-12 gap-0" style={{ borderTop: '1px solid rgba(10,10,10,0.1)' }}>
            {SPACES.map((space, i) => (
              <button
                key={space.id}
                onClick={() => setActive(i)}
                className="relative flex items-center gap-4 sm:gap-5 min-h-[44px] py-3 text-left transition-all duration-200"
                style={{ borderBottom: '1px solid rgba(10,10,10,0.08)' }}
              >
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-[2px]"
                  animate={{ background: active === i ? '#DC143C' : 'transparent' }}
                  transition={{ duration: 0.2 }}
                />
                <span style={{
                  fontSize: '9px', letterSpacing: '0.2em', fontWeight: 700,
                  color: active === i ? '#DC143C' : 'rgba(10,10,10,0.25)',
                  transition: 'color 0.2s', minWidth: '18px', paddingLeft: '10px',
                }}>
                  {space.id}
                </span>
                <span style={{
                  fontSize: '13px', fontWeight: 600,
                  color: active === i ? '#0A0A0A' : 'rgba(10,10,10,0.38)',
                  transition: 'color 0.2s',
                }}>
                  {space.label}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* faixa vermelha fundo */}
      <motion.div
        className="h-[3px] bg-ferrari-red origin-right"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.1, delay: 0.2, ease: EASE }}
      />
    </section>
  )
}
