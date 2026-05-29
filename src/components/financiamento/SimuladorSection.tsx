'use client'

import { useRef, useState, useMemo } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ArrowRight, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import type { Car } from '@/types'

const EASE = [0.16, 1, 0.3, 1] as const
const PRAZOS = [24, 36, 48, 60]

function calcParcela(preco: number, entradaPct: number, prazo: number) {
  const principal = preco * (1 - entradaPct / 100)
  const taxa = 0.012
  if (prazo === 0 || principal <= 0) return 0
  return (principal * taxa * Math.pow(1 + taxa, prazo)) / (Math.pow(1 + taxa, prazo) - 1)
}

function fmt(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

interface Props { carros: Car[] }

export default function SimuladorSection({ carros }: Props) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const [modeloIdx, setModeloIdx] = useState(0)
  const [entrada, setEntrada] = useState(30)
  const [prazoIdx, setPrazoIdx] = useState(2)
  const [page, setPage] = useState(0)

  const PER_PAGE = 6
  const totalPages = Math.ceil(carros.length / PER_PAGE)
  const carrosPagina = carros.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE)

  const globalIdx = page * PER_PAGE + modeloIdx
  const modelo = carros[Math.min(globalIdx, carros.length - 1)]

  const prazo = PRAZOS[prazoIdx]
  const valorEntrada = modelo.price * (entrada / 100)
  const parcela = useMemo(() => calcParcela(modelo.price, entrada, prazo), [modelo.price, entrada, prazo])
  const totalFinanciado = modelo.price - valorEntrada
  const totalPago = valorEntrada + parcela * prazo
  const imagem = modelo.images?.[0] ?? ''

  const whatsappMsg =
    `Olá! Gostaria de simular o financiamento do ${modelo.name}.\n\n` +
    `Valor do veículo: ${fmt(modelo.price)}\n` +
    `Entrada (${entrada}%): ${fmt(valorEntrada)}\n` +
    `Valor financiado: ${fmt(totalFinanciado)}\n` +
    `Prazo: ${prazo}x\n` +
    `Parcela estimada: ${fmt(parcela)}/mês\n\n` +
    `Poderia me passar as condições reais?`

  function goPage(dir: 1 | -1) {
    const next = page + dir
    if (next < 0 || next >= totalPages) return
    setPage(next)
    setModeloIdx(0)
  }

  return (
    <section ref={ref} className="py-14 sm:py-28 bg-carbon" id="simulador">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-12 lg:px-20">

        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <span className="h-px w-6 bg-ferrari-red" />
          <span style={{ fontSize: '9px', letterSpacing: '0.42em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
            Simulador
          </span>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          className="font-black tracking-[-0.04em] text-white mb-3"
          style={{ fontSize: 'clamp(2rem, 5vw, 5rem)', lineHeight: 1.0 }}
        >
          Simule o seu<br />
          <span style={{ color: '#DC143C' }}>financiamento.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.6, ease: EASE }}
          className="text-white/30 text-sm mb-10 sm:mb-16 max-w-lg leading-relaxed"
        >
          Valores ilustrativos baseados em taxa média de 1,2% a.m. Condições reais mediante análise de crédito.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.25, duration: 0.7, ease: EASE }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-px"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        >

          {/* ── Controles ── */}
          <div className="flex flex-col gap-7 sm:gap-10 p-5 sm:p-10 lg:p-12" style={{ background: '#0D0D0D' }}>

            {/* Modelo */}
            <div>
              <div className="flex items-center justify-between mb-4 sm:mb-5">
                <p style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
                  Modelo
                  <span className="ml-2" style={{ color: 'rgba(255,255,255,0.15)' }}>({carros.length} disponíveis)</span>
                </p>
                {totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => goPage(-1)}
                      disabled={page === 0}
                      className="w-7 h-7 flex items-center justify-center transition-colors disabled:opacity-20"
                      style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M6.5 2L3.5 5L6.5 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                      </svg>
                    </button>
                    <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.2)' }}>{page + 1}/{totalPages}</span>
                    <button
                      onClick={() => goPage(1)}
                      disabled={page === totalPages - 1}
                      className="w-7 h-7 flex items-center justify-center transition-colors disabled:opacity-20"
                      style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M3.5 2L6.5 5L3.5 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={page}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="grid grid-cols-2 gap-2"
                >
                  {carrosPagina.map((m, i) => {
                    const isSelected = modeloIdx === i
                    return (
                      <button
                        key={m.id}
                        onClick={() => setModeloIdx(i)}
                        className="relative text-left px-3 sm:px-4 min-h-[52px] py-3 transition-all duration-300"
                        style={{
                          background: isSelected ? 'rgba(220,20,60,0.08)' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${isSelected ? 'rgba(220,20,60,0.4)' : 'rgba(255,255,255,0.06)'}`,
                        }}
                      >
                        {isSelected && <span className="absolute top-0 left-0 right-0 h-px bg-ferrari-red" />}
                        <span
                          className="block font-bold uppercase leading-tight"
                          style={{ fontSize: '10px', letterSpacing: '0.06em', color: isSelected ? '#DC143C' : 'rgba(255,255,255,0.5)' }}
                        >
                          {m.name.replace(/ferrari\s*/i, '')}
                          {m.year ? ` ${m.year}` : ''}
                        </span>
                        <span className="block mt-1" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)' }}>
                          {fmt(m.price)}
                        </span>
                      </button>
                    )
                  })}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slider entrada */}
            <div>
              <div className="flex items-end justify-between mb-4 sm:mb-5">
                <p style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>Entrada</p>
                <span className="font-black text-white" style={{ fontSize: 'clamp(1.3rem, 4vw, 1.5rem)', letterSpacing: '-0.02em' }}>{entrada}%</span>
              </div>
              <div className="relative py-2">
                <input
                  type="range"
                  min={20}
                  max={80}
                  step={5}
                  value={entrada}
                  onChange={e => setEntrada(Number(e.target.value))}
                  className="w-full cursor-pointer relative z-10"
                  style={{ background: 'transparent' }}
                />
                <div className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2 pointer-events-none" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div className="h-full" style={{ background: '#DC143C', width: `${((entrada - 20) / 60) * 100}%` }} />
                </div>
              </div>
              <div className="flex justify-between mt-2">
                <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>20%</span>
                <span className="font-semibold" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>{fmt(valorEntrada)}</span>
                <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>80%</span>
              </div>
            </div>

            {/* Prazo */}
            <div>
              <p style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 16 }}>Prazo</p>
              <div className="grid grid-cols-4 gap-2">
                {PRAZOS.map((p, i) => (
                  <button
                    key={p}
                    onClick={() => setPrazoIdx(i)}
                    className="min-h-[44px] text-center text-sm font-bold transition-all duration-200"
                    style={{
                      background: prazoIdx === i ? '#DC143C' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${prazoIdx === i ? '#DC143C' : 'rgba(255,255,255,0.06)'}`,
                      color: prazoIdx === i ? 'white' : 'rgba(255,255,255,0.35)',
                    }}
                  >
                    {p}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Resultado ── */}
          <div className="flex flex-col justify-between p-5 sm:p-10 lg:p-12 relative overflow-hidden" style={{ background: '#0A0A0A' }}>

            {/* Imagem fantasma de fundo */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${page}-${modeloIdx}`}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="absolute inset-0 pointer-events-none"
              >
                {imagem && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imagem} alt="" className="w-full h-full object-cover" style={{ opacity: 0.07, filter: 'grayscale(1)' }} />
                )}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0A0A0A 0%, transparent 60%)' }} />
              </motion.div>
            </AnimatePresence>

            <div className="relative z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${page}-${modeloIdx}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <p style={{ fontSize: '9px', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 4 }}>Simulando</p>
                  <h3 className="font-black text-white tracking-[-0.03em] mb-6 sm:mb-8" style={{ fontSize: 'clamp(1.2rem, 3vw, 2rem)' }}>
                    {modelo.name}{modelo.year ? ` ${modelo.year}` : ''}
                  </h3>
                </motion.div>
              </AnimatePresence>

              <div className="flex flex-col gap-0 mb-6 sm:mb-8">
                {[
                  { label: 'Valor do veículo', valor: fmt(modelo.price) },
                  { label: `Entrada (${entrada}%)`, valor: fmt(valorEntrada) },
                  { label: 'Total financiado', valor: fmt(totalFinanciado) },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span className="text-white/35 text-sm">{row.label}</span>
                    <span className="text-white/70 font-semibold text-sm">{row.valor}</span>
                  </div>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${page}-${modeloIdx}-${entrada}-${prazoIdx}`}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: EASE }}
                  className="p-5 sm:p-6 mb-6 sm:mb-8 relative"
                  style={{ background: 'rgba(220,20,60,0.06)', border: '1px solid rgba(220,20,60,0.2)' }}
                >
                  <span className="absolute top-0 left-0 right-0 h-px bg-ferrari-red" />
                  <p style={{ fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#DC143C', marginBottom: 8 }}>{prazo}x de</p>
                  <p className="font-black text-white leading-none tracking-tight" style={{ fontSize: 'clamp(1.7rem, 5vw, 3rem)' }}>
                    {fmt(parcela)}
                  </p>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', marginTop: 8 }}>Total: {fmt(totalPago)} · Taxa 1,2% a.m.</p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="relative z-10">
              <Link
                href={`https://wa.me/5511999999999?text=${encodeURIComponent(whatsappMsg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-3 w-full ferrari-gradient text-white font-bold uppercase min-h-[44px] px-6 sm:px-8 py-4 sm:py-5 hover:opacity-90 transition-opacity"
                style={{ fontSize: '10px', letterSpacing: '0.22em' }}
              >
                <MessageCircle size={12} />
                Enviar via WhatsApp
                <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.15)', textAlign: 'center', marginTop: 12 }}>
                Sem compromisso · Resposta em até 48h
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
