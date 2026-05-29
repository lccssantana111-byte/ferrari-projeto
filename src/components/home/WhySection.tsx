'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ShieldCheck, FileSearch, Wrench, HeartHandshake, Clock, BadgeCheck } from 'lucide-react'

const EASE = [0.16, 1, 0.3, 1] as const

const ITEMS = [
  {
    icon: ShieldCheck,
    title: 'Histórico completo',
    body: 'Cada veículo chega com documentação completa, histórico de manutenção e rastreabilidade total de propriedade.',
  },
  {
    icon: FileSearch,
    title: 'Inspeção técnica',
    body: 'Mais de 120 pontos verificados por especialistas antes de qualquer veículo entrar no nosso portfólio.',
  },
  {
    icon: Wrench,
    title: 'Revisão inclusa',
    body: 'Todo veículo sai revisado, com fluidos renovados, pneus e pastilhas avaliados — pronto para rodar.',
  },
  {
    icon: BadgeCheck,
    title: 'Procedência garantida',
    body: 'Trabalhamos apenas com veículos de procedência verificada. Nenhum carro com restrição ou sinistro grave.',
  },
  {
    icon: HeartHandshake,
    title: 'Pós-venda real',
    body: 'Nosso relacionamento não termina na assinatura. Suporte direto para dúvidas, indicações e futuras trocas.',
  },
  {
    icon: Clock,
    title: '15 anos no mercado',
    body: 'Uma década e meia atendendo colecionadores e entusiastas. Reputação construída negócio a negócio.',
  },
]

export default function WhySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-60px' })

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ background: '#0D0D0D' }}
    >
      {/* grade pontilhada de fundo */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-12 lg:px-20 py-14 sm:py-24">

        {/* Header */}
        <div className="mb-10 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <div className="flex items-center gap-3 mb-4 sm:mb-5">
              <span className="h-px w-6 bg-ferrari-red" />
              <span style={{ fontSize: '9px', letterSpacing: '0.42em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
                Por que a Ferrari
              </span>
            </div>
            <h2
              className="font-black text-white tracking-[-0.04em]"
              style={{ fontSize: 'clamp(2.5rem, 4vw, 3.8rem)', lineHeight: 1.0 }}
            >
              O padrão que
              <br />
              <span style={{ color: 'white', opacity: 0.28, fontStyle: 'italic' }}>
                nos define
              </span>
            </h2>
          </motion.div>
        </div>

        {/* Grid de diferenciais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: 'rgba(255,255,255,0.05)' }}>
          {ITEMS.map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={i}
                className="relative flex flex-col items-center text-center sm:items-start sm:text-left gap-4 p-8 sm:p-8 group"
                style={{ background: '#0D0D0D' }}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.08 + i * 0.07, ease: EASE }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: 'rgba(220,20,60,0.04)' }} />
                <div className="absolute top-0 left-0 right-0 h-px scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" style={{ background: '#DC143C' }} />

                <div className="w-14 h-14 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0" style={{ border: '1px solid rgba(220,20,60,0.25)', background: 'rgba(220,20,60,0.06)' }}>
                  <Icon size={22} strokeWidth={1.6} className="sm:hidden" style={{ color: '#DC143C' }} />
                  <Icon size={16} strokeWidth={1.6} className="hidden sm:block" style={{ color: '#DC143C' }} />
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-white font-bold text-lg sm:text-base" style={{ letterSpacing: '-0.01em' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'rgba(255,255,255,0.38)' }} className="sm:text-sm">
                    {item.body}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
