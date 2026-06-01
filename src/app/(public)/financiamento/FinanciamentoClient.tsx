'use client'

import { useRef, useState } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, MessageCircle, Shield, Clock, FileCheck, TrendingUp, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { getWhatsAppLink } from '@/lib/constants'
import SimuladorSection from '@/components/financiamento/SimuladorSection'
import type { Car } from '@/types'

const EASE = [0.16, 1, 0.3, 1] as const

const DIFERENCIAIS = [
  {
    icon: Shield,
    titulo: 'Aprovação discreta',
    corpo: 'Processo 100% confidencial. Seu patrimônio e histórico financeiro tratados com o mesmo cuidado que damos ao carro.',
  },
  {
    icon: Clock,
    titulo: 'Resposta em 48h',
    corpo: 'Análise ágil com bancos parceiros especializados em ativos de alto valor. Sem burocracia desnecessária.',
  },
  {
    icon: FileCheck,
    titulo: 'Documentação simplificada',
    corpo: 'Cuidamos de todo o processo documental. Você foca na escolha do veículo, nós resolvemos o resto.',
  },
  {
    icon: TrendingUp,
    titulo: 'Taxas competitivas',
    corpo: 'Acesso a linhas exclusivas com condições que o mercado convencional não oferece para este segmento.',
  },
]

const FAQS = [
  {
    pergunta: 'Qual o valor mínimo de entrada?',
    resposta: 'Trabalhamos com entradas a partir de 30% do valor do veículo. Em casos específicos, podemos estruturar condições diferenciadas dependendo do perfil do cliente e do modelo escolhido.',
  },
  {
    pergunta: 'Quais documentos são necessários?',
    resposta: 'Para pessoa física: RG, CPF, comprovante de renda e residência. Para PJ: contrato social, CNPJ e balanço dos últimos 12 meses. Nosso time orienta todo o processo.',
  },
  {
    pergunta: 'É possível usar outro veículo como parte do pagamento?',
    resposta: 'Sim. Aceitamos veículos de alto padrão como parte da entrada. Fazemos a avaliação e integramos ao financiamento de forma transparente.',
  },
  {
    pergunta: 'O financiamento cobre seguros e impostos?',
    resposta: 'Podemos incluir IPVA e seguro no financiamento mediante análise. Temos parceiros especializados em seguros para Ferrari com coberturas exclusivas.',
  },
  {
    pergunta: 'Atende clientes fora do estado?',
    resposta: 'Atendemos todo o Brasil. O processo é conduzido remotamente com toda documentação digital. A entrega do veículo pode ser feita em qualquer capital.',
  },
]

function FaqItem({ pergunta, resposta, index }: { pergunta: string; resposta: string; index: number }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.07, duration: 0.55, ease: EASE }}
      style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 sm:py-7 text-left group"
      >
        <span className="font-semibold text-white/80 group-hover:text-white transition-colors text-sm sm:text-base pr-6 leading-snug">
          {pergunta}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="flex-shrink-0 text-ferrari-red"
        >
          <ChevronDown size={18} />
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.35, ease: EASE }}
        style={{ overflow: 'hidden' }}
      >
        <p className="text-white/40 text-sm sm:text-base leading-[1.85] pb-5 sm:pb-7 max-w-2xl">
          {resposta}
        </p>
      </motion.div>
    </motion.div>
  )
}

export default function FinanciamentoClient({ carros }: { carros: Car[] }) {
  const heroRef = useRef(null)
  const manifestoRef = useRef(null)
  const diferenciaisRef = useRef(null)
  const ctaRef = useRef(null)

  const manifestoInView = useInView(manifestoRef, { once: true, margin: '-80px' })
  const diferenciaisInView = useInView(diferenciaisRef, { once: true, margin: '-80px' })
  const ctaInView = useInView(ctaRef, { once: true, margin: '-80px' })

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <div className="bg-carbon text-white overflow-x-hidden">

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative h-[100svh] min-h-[560px] sm:min-h-[700px] flex items-end overflow-hidden bg-carbon">

        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <div className="absolute inset-0" style={{ background: '#0C0C0C' }} />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
              backgroundSize: '80px 80px',
            }}
          />
          <div className="absolute" style={{
            right: '-15%', top: '-10%',
            width: 'clamp(400px, 70vw, 1000px)', height: 'clamp(400px, 70vw, 1000px)',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(220,20,60,0.12) 0%, rgba(220,20,60,0.04) 40%, transparent 70%)',
            filter: 'blur(40px)',
          }} />
          <div className="absolute" style={{
            right: '-12%', top: '5%',
            width: 'clamp(400px, 65vw, 950px)', height: 'clamp(400px, 65vw, 950px)',
            borderRadius: '50%', border: '1px solid rgba(220,20,60,0.12)',
          }} />
          <div className="absolute" style={{
            top: 0, right: '30%', width: '1px', height: '140%',
            background: 'linear-gradient(to bottom, transparent 0%, rgba(220,20,60,0.2) 35%, rgba(220,20,60,0.4) 55%, rgba(220,20,60,0.1) 80%, transparent 100%)',
            transform: 'rotate(10deg)', transformOrigin: 'top center',
          }} />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(10,10,10,0.7)_100%)]" />
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 w-full max-w-[1400px] mx-auto px-5 sm:px-16 lg:px-28 pb-14 sm:pb-20"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="flex items-center gap-3 mb-6 sm:mb-8"
          >
            <span className="w-8 h-px bg-ferrari-red" />
            <span style={{ fontSize: '9px', letterSpacing: '0.45em', color: '#DC143C', textTransform: 'uppercase', fontWeight: 600 }}>Financiamento</span>
          </motion.div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 sm:gap-12">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.7, ease: EASE }}
                className="font-black tracking-[-0.04em] text-white"
                style={{ fontSize: 'clamp(3rem, 5vw, 5.5rem)', lineHeight: 0.88 }}
              >
                O carro dos
              </motion.h1>
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.7, ease: EASE }}
                className="font-black tracking-[-0.04em]"
                style={{ fontSize: 'clamp(3rem, 5vw, 5.5rem)', lineHeight: 0.88, paddingBottom: '0.18em', color: '#DC143C' }}
              >
                seus sonhos.
              </motion.h1>
              <motion.h1
                initial={{ opacity: 0, y: 48 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.26, duration: 0.7, ease: EASE }}
                className="font-black tracking-[-0.04em]"
                style={{ fontSize: 'clamp(3rem, 5vw, 5.5rem)', lineHeight: 0.88, paddingBottom: '0.18em', color: 'white', mixBlendMode: 'overlay', opacity: 0.6 }}
              >
                No seu tempo.
              </motion.h1>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6, ease: EASE }}
              className="max-w-sm"
            >
              <p className="text-white/40 text-sm sm:text-base leading-[1.85] mb-6 sm:mb-8">
                Estruturamos financiamentos sob medida para que a aquisição de uma Ferrari seja tão elegante quanto o próprio veículo.
              </p>
              <Link
                href="#simulador"
                className="group inline-flex w-full sm:w-auto items-center justify-center gap-3 ferrari-gradient text-white font-bold uppercase min-h-[44px] px-8 py-4 hover:opacity-90 transition-opacity"
                style={{ fontSize: '10px', letterSpacing: '0.28em' }}
              >
                Simular agora
                <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        >
          <motion.div
            animate={{ scaleY: [1, 1.4, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            className="w-px h-10 sm:h-12 bg-gradient-to-b from-transparent via-white/40 to-transparent mx-auto"
          />
        </motion.div>
      </section>

      {/* ── MANIFESTO ── */}
      <section ref={manifestoRef} style={{ background: '#F0EDE8' }} className="relative overflow-hidden py-14 sm:py-28">
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 font-black leading-none pointer-events-none select-none"
          style={{ fontSize: 'clamp(8rem, 30vw, 28rem)', color: 'rgba(10,10,10,0.04)', letterSpacing: '-0.04em' }}
        >
          %
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-12 lg:px-20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12 sm:gap-16">
            <div className="lg:max-w-xl">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={manifestoInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, ease: EASE }}
                className="flex items-center gap-3 mb-8 sm:mb-10"
              >
                <span className="h-px w-6 bg-ferrari-red" />
                <span style={{ fontSize: '9px', letterSpacing: '0.42em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.35)', fontWeight: 600 }}>
                  Nossa abordagem
                </span>
              </motion.div>

              {[
                { text: 'Não financiamos', delay: 0.1, style: { color: '#0A0A0A' } },
                { text: 'carros.', delay: 0.18, style: { color: '#F0EDE8', WebkitTextStroke: '1.5px rgba(10,10,10,0.18)' } },
                { text: 'Realizamos', delay: 0.26, style: { color: '#0A0A0A' } },
                { text: 'conquistas.', delay: 0.34, style: { color: '#DC143C' } },
              ].map((line, i) => (
                <motion.h2
                  key={i}
                  initial={{ opacity: 0, y: 24 + i * 6 }}
                  animate={manifestoInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: line.delay, duration: 0.7, ease: EASE }}
                  className="font-black tracking-[-0.04em]"
                  style={{ fontSize: 'clamp(2.6rem, 4vw, 4.5rem)', lineHeight: 0.92, paddingBottom: '0.06em', ...line.style }}
                >
                  {line.text}
                </motion.h2>
              ))}
            </div>

            {/* Stats — horizontal em mobile */}
            <div className="flex flex-row lg:flex-col gap-8 sm:gap-10 flex-wrap">
              {[
                { num: '98%', label: 'taxa de\naprovação' },
                { num: '48h', label: 'resposta\nmáxima' },
                { num: '12+', label: 'bancos\nparceiros' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={manifestoInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.6, ease: EASE }}
                  className="flex flex-col"
                >
                  <span className="font-black tracking-tight text-[#0A0A0A] leading-none" style={{ fontSize: 'clamp(2rem, 3.5vw, 3.2rem)' }}>
                    {stat.num}
                  </span>
                  <span className="text-[#0A0A0A]/40 uppercase whitespace-pre-line mt-2" style={{ fontSize: '9px', letterSpacing: '0.2em' }}>
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DIFERENCIAIS ── */}
      <section ref={diferenciaisRef} className="relative py-14 sm:py-28" style={{ background: '#0D0D0D' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
        <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-12 lg:px-20">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <span className="h-px w-6 bg-ferrari-red" />
            <span style={{ fontSize: '9px', letterSpacing: '0.42em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
              Por que conosco
            </span>
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={diferenciaisInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
            className="font-black tracking-[-0.04em] text-white mb-10 sm:mb-20"
            style={{ fontSize: 'clamp(2.6rem, 3.5vw, 3.5rem)', lineHeight: 1.0 }}
          >
            O padrão que<br />
            <span style={{ color: 'white', opacity: 0.25, fontStyle: 'italic' }}>nos separa.</span>
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px" style={{ background: 'rgba(255,255,255,0.05)' }}>
            {DIFERENCIAIS.map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  animate={diferenciaisInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.55, ease: EASE }}
                  className="relative flex flex-col items-center text-center sm:items-start sm:text-left gap-5 p-6 sm:p-10 group"
                  style={{ background: '#0D0D0D' }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: 'rgba(220,20,60,0.04)' }} />
                  <motion.div
                    className="absolute top-0 left-0 right-0 h-px origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    style={{ background: '#DC143C' }}
                  />
                  <div className="w-14 h-14 sm:w-11 sm:h-11 flex items-center justify-center flex-shrink-0" style={{ border: '1px solid rgba(220,20,60,0.25)', background: 'rgba(220,20,60,0.06)' }}>
                    <Icon size={22} strokeWidth={1.5} className="sm:hidden" style={{ color: '#DC143C' }} />
                    <Icon size={18} strokeWidth={1.5} className="hidden sm:block" style={{ color: '#DC143C' }} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-2 sm:mb-3 text-lg sm:text-base" style={{ letterSpacing: '-0.01em' }}>{item.titulo}</h3>
                    <p style={{ fontSize: '14px', lineHeight: 1.85, color: 'rgba(255,255,255,0.38)' }}>{item.corpo}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── SIMULADOR ── */}
      <SimuladorSection carros={carros} />

      {/* ── FAQ ── */}
      <section style={{ background: '#0D0D0D' }} className="py-14 sm:py-28">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-12 lg:px-20">
          <div className="flex flex-col lg:flex-row lg:gap-24">
            <div className="lg:w-80 flex-shrink-0 mb-10 sm:mb-16 lg:mb-0">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <span className="h-px w-6 bg-ferrari-red" />
                <span style={{ fontSize: '9px', letterSpacing: '0.42em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
                  Dúvidas frequentes
                </span>
              </div>
              <h2 className="font-black tracking-[-0.04em] text-white leading-[0.92]" style={{ fontSize: 'clamp(2.6rem, 3vw, 3rem)' }}>
                Tudo que você precisa saber.
              </h2>
            </div>
            <div className="flex-1">
              {FAQS.map((faq, i) => (
                <FaqItem key={i} {...faq} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section ref={ctaRef} className="relative py-20 sm:py-36 overflow-hidden bg-carbon">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(220,20,60,0.12) 0%, transparent 70%)' }} />
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '36px 36px' }} />

        <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-12 lg:px-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: EASE }}
            className="flex items-center justify-center gap-3 mb-8 sm:mb-10"
          >
            <span className="h-px w-6 bg-ferrari-red" />
            <span style={{ fontSize: '9px', letterSpacing: '0.42em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>Pronto para começar</span>
            <span className="h-px w-6 bg-ferrari-red" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7, ease: EASE }}
            className="font-black tracking-[-0.04em] text-white leading-[0.9] mb-6 sm:mb-8"
            style={{ fontSize: 'clamp(2.8rem, 5vw, 5rem)' }}
          >
            Fale com um<br />
            <span style={{ color: '#DC143C' }}>especialista.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={ctaInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.25, duration: 0.6, ease: EASE }}
            className="text-white/35 text-sm sm:text-base leading-relaxed mb-10 sm:mb-14 max-w-md mx-auto"
          >
            Sem compromisso. Uma conversa para entender seu perfil e estruturar a melhor condição para você.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.35, duration: 0.5, ease: EASE }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3"
          >
            <Link
              href={getWhatsAppLink('Olá, quero simular um financiamento para uma Ferrari.')}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-3 ferrari-gradient text-white font-bold uppercase min-h-[44px] px-8 sm:px-10 py-4 sm:py-5 hover:opacity-90 transition-opacity"
              style={{ fontSize: '10px', letterSpacing: '0.28em' }}
            >
              <MessageCircle size={12} />
              Iniciar simulação
              <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <Link
              href="/colecao"
              className="group flex items-center justify-center gap-3 border border-white/15 text-white/50 hover:text-white hover:border-white/40 font-bold uppercase min-h-[44px] px-8 sm:px-10 py-4 sm:py-5 transition-all duration-300"
              style={{ fontSize: '10px', letterSpacing: '0.28em' }}
            >
              Ver coleção
              <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
