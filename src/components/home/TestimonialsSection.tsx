'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

const TESTIMONIALS = [
  {
    name: 'Ricardo Almeida',
    location: 'São Paulo, SP',
    car: 'Ferrari 488 GTB',
    rating: 5,
    text: 'Experiência impecável do início ao fim. A equipe da Ferrari conhece cada detalhe do carro e me ajudou a escolher exatamente o que eu queria. A entrega foi uma cerimônia à parte.',
    initials: 'RA',
  },
  {
    name: 'Fernanda Costa',
    location: 'Rio de Janeiro, RJ',
    car: 'Ferrari Roma',
    rating: 5,
    text: 'Comprei meu Roma sem nem precisar sair de casa. O atendimento pelo WhatsApp foi surpreendentemente eficiente e transparente. Quando o carro chegou, estava em condições perfeitas.',
    initials: 'FC',
  },
  {
    name: 'Marcos Teixeira',
    location: 'Belo Horizonte, MG',
    car: 'Ferrari F8 Tributo',
    rating: 5,
    text: 'Procurei muito antes de comprar meu F8 Tributo e a Ferrari foi a única que me passou total confiança. Documentação transparente, histórico completo do veículo e um pós-venda exemplar.',
    initials: 'MT',
  },
  {
    name: 'Juliana Pereira',
    location: 'Curitiba, PR',
    car: 'Ferrari SF90 Stradale',
    rating: 5,
    text: 'Nunca imaginei que comprar um Ferrari fosse tão fácil. A equipe me guiou em cada etapa, desde a escolha do modelo até o financiamento. O SF90 superou todas as minhas expectativas.',
    initials: 'JP',
  },
  {
    name: 'André Souza',
    location: 'Porto Alegre, RS',
    car: 'Ferrari 812 Superfast',
    rating: 5,
    text: 'Terceiro Ferrari que compro na Ferrari. Voltei porque o nível de serviço é simplesmente inigualável no Brasil. Eles tratam cada cliente como se fosse o único.',
    initials: 'AS',
  },
  {
    name: 'Camila Mendes',
    location: 'Brasília, DF',
    car: 'Ferrari Portofino M',
    rating: 5,
    text: 'Fiz o test drive e me apaixonei. A equipe não me pressionou em nenhum momento — deixaram que o próprio carro fizesse o trabalho. Compra concluída em menos de uma semana.',
    initials: 'CM',
  },
]

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function go(index: number, dir: number) {
    setDirection(dir)
    setCurrent(index)
  }

  function prev() { go(current === 0 ? TESTIMONIALS.length - 1 : current - 1, -1) }
  function next() { go((current + 1) % TESTIMONIALS.length, 1) }

  function startAuto() {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setDirection(1)
      setCurrent(c => (c + 1) % TESTIMONIALS.length)
    }, 5000)
  }

  useEffect(() => {
    startAuto()
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleNav(fn: () => void) { fn(); startAuto() }

  const t = TESTIMONIALS[current]

  return (
    <section
      className="py-14 sm:py-28 px-5 sm:px-12 lg:px-20"
      style={{ background: 'linear-gradient(160deg, #141414 0%, #0f0f0f 50%, #1a0a0d 100%)', borderTop: '1px solid rgba(220,20,60,0.12)' }}
    >
      <div className="max-w-[1400px] mx-auto">

        {/* Header — em mobile, badge e controles vão abaixo do título */}
        <div className="mb-10 sm:mb-16">
          {/* Título */}
          <div className="mb-6 sm:mb-0">
            <span style={{ fontSize: '9px', letterSpacing: '0.4em', color: '#DC143C', textTransform: 'uppercase', fontWeight: 600 }}>Depoimentos</span>
            <h2
              className="font-black text-white mt-2 tracking-[-0.03em]"
              style={{ fontSize: 'clamp(2.5rem, 4.5vw, 4rem)', lineHeight: 1.0 }}
            >
              O que nossos<br />
              <span style={{
                background: 'linear-gradient(90deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.2) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>clientes dizem</span>
            </h2>
          </div>

          {/* Badge Google + controles — em mobile ficam na mesma linha abaixo do título */}
          <div className="flex items-center justify-between mt-5 sm:hidden">
            {/* Badge compacto */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>4.9</span>
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} width="9" height="9" viewBox="0 0 24 24" fill="#FBBC05">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
            </div>

            {/* Controles mobile */}
            <div className="flex items-center gap-2">
              <button onClick={() => handleNav(prev)} className="w-11 h-11 border border-white/10 flex items-center justify-center text-white/40">
                <ChevronLeft size={16} />
              </button>
              <button onClick={() => handleNav(next)} className="w-11 h-11 border border-white/10 flex items-center justify-center text-white/40">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Badge + controles desktop */}
          <div className="hidden sm:flex items-end justify-between mt-0 -mt-[calc(clamp(2rem,6vw,5.5rem)*2+0.5rem)]">
            <div />
            <div className="flex flex-col items-end gap-4">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>4.9</span>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(i => (
                        <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill="#FBBC05">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}>Google Reviews · 200+ avaliações</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleNav(prev)} className="w-11 h-11 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all">
                  <ChevronLeft size={16} />
                </button>
                <button onClick={() => handleNav(next)} className="w-11 h-11 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Slide */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              initial={{ opacity: 0, x: direction * 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -50 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Aspas decorativas */}
              <div className="text-ferrari-red/10 font-black leading-none select-none -mb-4 sm:-mb-8 -ml-1" style={{ fontSize: 'clamp(3.5rem, 12vw, 8rem)' }}>&ldquo;</div>

              {/* Estrelas */}
              <div className="flex gap-1 mb-4 sm:mb-6">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={12} className="fill-ferrari-red text-ferrari-red" />
                ))}
              </div>

              <blockquote
                className="text-white relative z-10 mb-6 sm:mb-8"
                style={{ fontSize: 'clamp(1.1rem, 2.8vw, 1.45rem)', fontWeight: 300, lineHeight: 1.7, letterSpacing: '-0.01em' }}
              >
                {t.text}
              </blockquote>

              {/* Autor */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-ferrari-red/20 border border-ferrari-red/40 flex items-center justify-center text-ferrari-red text-xs sm:text-sm font-bold flex-shrink-0">
                  {t.initials}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-white/30 text-xs mt-0.5">{t.location} · <span className="text-ferrari-red/70">{t.car}</span></p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex items-center gap-2 mt-8 sm:mt-12">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => handleNav(() => go(i, i > current ? 1 : -1))}
              className="h-10 flex items-center flex-1 max-w-[48px]"
            >
              <span className="relative overflow-hidden block w-full" style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }}>
                <motion.span
                  className="absolute inset-0 bg-ferrari-red"
                  initial={false}
                  animate={{ scaleX: i === current ? 1 : 0 }}
                  style={{ originX: 0 }}
                  transition={{ duration: i === current ? 5 : 0.3, ease: 'linear' }}
                />
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
