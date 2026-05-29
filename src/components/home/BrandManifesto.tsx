'use client'

import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'

const STATS = [
  { number: '500+', label: 'Veículos\nEntregues' },
  { number: '15', label: 'Anos de\nExperiência' },
  { number: '98%', label: 'Satisfação\nGarantida' },
]

export default function BrandManifesto() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const xMarquee = useTransform(scrollYProgress, [0, 1], ['0%', '-18%'])

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#F0EDE8]">

      {/* Faixa vermelha no topo */}
      <motion.div
        className="h-[3px] bg-ferrari-red origin-left"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Conteúdo */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-12 lg:px-20 pt-14 pb-12 sm:pt-28 sm:pb-20">

        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-10 sm:mb-16"
        >
          <span className="w-8 h-px bg-ferrari-red" />
          <span style={{ fontSize: '9px', letterSpacing: '0.5em', color: '#DC143C', textTransform: 'uppercase', fontWeight: 600 }}>
            Nossa Filosofia
          </span>
        </motion.div>

        {/* Headline principal */}
        <div className="mb-0">
          {/* Par 1 */}
          <div style={{ marginBottom: 'clamp(0.3rem, 1vw, 1rem)' }}>
            {[
              { text: 'Não vendemos', delay: 0.1 },
              { text: 'carros.', delay: 0.22, outline: true },
            ].map((line, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: line.delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="block font-black tracking-[-0.04em]"
                style={{
                  fontSize: 'clamp(2.6rem, 5vw, 5.5rem)',
                  lineHeight: 1.0,
                  color: line.outline ? '#F0EDE8' : '#0A0A0A',
                  WebkitTextStroke: line.outline ? '1.5px rgba(10,10,10,0.18)' : undefined,
                }}
              >
                {line.text}
              </motion.span>
            ))}
          </div>

          {/* Par 2 */}
          <div>
            {[
              { text: 'Entregamos', delay: 0.34 },
              { text: 'emoções.', delay: 0.46, red: true },
            ].map((line, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: line.delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="block font-black tracking-[-0.04em]"
                style={{
                  fontSize: 'clamp(2.6rem, 5vw, 5.5rem)',
                  lineHeight: 1.0,
                  color: line.red ? '#DC143C' : '#0A0A0A',
                }}
              >
                {line.text}
              </motion.span>
            ))}
          </div>
        </div>
      </div>

      {/* Marquee — no fluxo, entre headline e divisória */}
      <div className="relative overflow-hidden pointer-events-none select-none py-6 sm:py-10">
        <motion.div style={{ x: xMarquee }} className="flex items-center whitespace-nowrap">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className="font-black tracking-[-0.03em] mr-16 shrink-0"
              style={{
                fontSize: 'clamp(5rem, 18vw, 10rem)',
                lineHeight: 1,
                color: 'transparent',
                WebkitTextStroke: '1.5px rgba(10,10,10,0.13)',
                fontFamily: 'Georgia, "Times New Roman", serif',
              }}
            >
              Ferrari
            </span>
          ))}
        </motion.div>
      </div>

      {/* Linha divisória + stats + parágrafo */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-12 lg:px-20 pb-12 sm:pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.65, duration: 0.7 }}
          className="border-t border-[#0A0A0A]/10 pt-8 sm:pt-12 flex flex-col lg:flex-row gap-8 sm:gap-12 items-start bg-[#F0EDE8]"
        >
          {/* Parágrafo */}
          <p className="text-[#0A0A0A]/45 text-sm sm:text-base leading-[1.85] max-w-lg lg:flex-1">
            Cada Ferrari que passa pelas nossas mãos é tratado como uma obra de arte — selecionado com critério, inspecionado com rigor e entregue com a cerimônia que um ícone como esse merece.
          </p>

          {/* Stats — horizontal em mobile */}
          <div className="flex items-start gap-8 sm:gap-14 flex-wrap">
            {STATS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.75 + i * 0.1, duration: 0.5 }}
                className="flex flex-col"
              >
                <span
                  className="font-black text-[#0A0A0A] leading-none tracking-tight"
                  style={{ fontSize: 'clamp(2rem, 3vw, 2.6rem)' }}
                >
                  {s.number}
                </span>
                <span style={{ fontSize: '9px', color: 'rgba(10,10,10,0.35)', textTransform: 'uppercase', letterSpacing: '0.2em', marginTop: 6, whiteSpace: 'pre-line', lineHeight: 1.5 }}>
                  {s.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Faixa vermelha no fundo */}
      <motion.div
        className="h-[3px] bg-ferrari-red origin-right"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      />
    </section>
  )
}
