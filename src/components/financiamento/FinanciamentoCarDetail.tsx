'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Check, MessageCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { financingLeadSchema, type FinancingLeadFormData } from '@/lib/validators'
import { getWhatsAppLink } from '@/lib/constants'
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

export default function FinanciamentoCarDetail({ car }: { car: Car }) {
  const [entrada, setEntrada] = useState(30)
  const [prazoIdx, setPrazoIdx] = useState(2)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const prazo = PRAZOS[prazoIdx]
  const valorEntrada = car.price * (entrada / 100)
  const totalFinanciado = car.price - valorEntrada
  const parcela = useMemo(() => calcParcela(car.price, entrada, prazo), [car.price, entrada, prazo])
  const totalPago = valorEntrada + parcela * prazo

  const { register, handleSubmit, formState: { errors } } = useForm<FinancingLeadFormData>({
    resolver: zodResolver(financingLeadSchema),
    defaultValues: { car_id: car.id, entrada_pct: entrada, prazo, parcela_estimada: Math.round(parcela) },
  })

  async function onSubmit(data: FinancingLeadFormData) {
    setLoading(true)
    setFormError(null)
    const payload = { ...data, entrada_pct: entrada, prazo, parcela_estimada: Math.round(parcela) }
    try {
      const res = await fetch('/api/financing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error()
      setSubmitted(true)
      const msg =
        `Olá! Gostaria de simular o financiamento do ${car.name}.\n\n` +
        `Valor do veículo: ${fmt(car.price)}\n` +
        `Entrada (${entrada}%): ${fmt(valorEntrada)}\n` +
        `Valor financiado: ${fmt(totalFinanciado)}\n` +
        `Prazo: ${prazo}x\n` +
        `Parcela estimada: ${fmt(parcela)}/mês\n\n` +
        `Poderia me passar as condições reais?`
      setTimeout(() => { window.open(getWhatsAppLink(msg), '_blank') }, 800)
    } catch {
      setFormError('Erro ao enviar. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '2rem' }}>
      <div className="flex items-center gap-3 mb-8">
        <span className="h-px w-5 bg-ferrari-red" />
        <span style={{ fontSize: '9px', letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
          Simular Financiamento
        </span>
      </div>

      <div
        className="grid grid-cols-1 gap-px"
        style={{ background: 'rgba(255,255,255,0.06)' }}
      >
        {/* Controles */}
        <div className="flex flex-col gap-7 p-6 sm:p-8" style={{ background: '#0D0D0D' }}>

          {/* Slider entrada */}
          <div>
            <div className="flex items-end justify-between mb-4">
              <p style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>Entrada</p>
              <span className="font-black text-white" style={{ fontSize: '1.4rem', letterSpacing: '-0.02em' }}>{entrada}%</span>
            </div>
            <div className="relative py-2">
              <input
                type="range"
                min={20} max={80} step={5}
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
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.4)' }}>{fmt(valorEntrada)}</span>
              <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>80%</span>
            </div>
          </div>

          {/* Prazo */}
          <div>
            <p style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>Prazo</p>
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

          {/* Resultado */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${entrada}-${prazoIdx}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: EASE }}
            >
              <div className="flex flex-col gap-0 mb-5">
                {[
                  { label: 'Valor do veículo', valor: fmt(car.price) },
                  { label: `Entrada (${entrada}%)`, valor: fmt(valorEntrada) },
                  { label: 'Total financiado', valor: fmt(totalFinanciado) },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>{row.label}</span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>{row.valor}</span>
                  </div>
                ))}
              </div>

              <div
                className="p-5 mb-6 relative"
                style={{ background: 'rgba(220,20,60,0.06)', border: '1px solid rgba(220,20,60,0.2)' }}
              >
                <span className="absolute top-0 left-0 right-0 h-px bg-ferrari-red" />
                <p style={{ fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#DC143C', marginBottom: 6 }}>{prazo}x de</p>
                <p className="font-black text-white leading-none tracking-tight" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)' }}>
                  {fmt(parcela)}
                </p>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', marginTop: 8 }}>
                  Total: {fmt(totalPago)} · Taxa 1,2% a.m.
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Formulário de lead */}
          {submitted ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <div className="w-10 h-10 flex items-center justify-center" style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)' }}>
                <Check size={18} style={{ color: '#4ade80' }} />
              </div>
              <p className="text-white font-semibold" style={{ fontSize: '14px' }}>Simulação enviada!</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>Abrindo WhatsApp...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
              <input type="hidden" {...register('car_id')} />

              <div className="flex flex-col gap-1">
                <input
                  {...register('name')}
                  placeholder="Nome completo"
                  className="w-full py-3.5 px-4 text-white placeholder-white/20 outline-none transition-colors duration-200"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', fontSize: '13px' }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(220,20,60,0.5)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
                />
                {errors.name && <p style={{ fontSize: '11px', color: '#DC143C' }}>{errors.name.message}</p>}
              </div>

              <div className="flex flex-col gap-1">
                <input
                  {...register('phone')}
                  placeholder="WhatsApp (11) 99999-9999"
                  type="tel"
                  className="w-full py-3.5 px-4 text-white placeholder-white/20 outline-none transition-colors duration-200"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', fontSize: '13px' }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(220,20,60,0.5)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
                />
                {errors.phone && <p style={{ fontSize: '11px', color: '#DC143C' }}>{errors.phone.message}</p>}
              </div>

              <div className="flex flex-col gap-1">
                <input
                  {...register('email')}
                  placeholder="Email (opcional)"
                  type="email"
                  className="w-full py-3.5 px-4 text-white placeholder-white/20 outline-none transition-colors duration-200"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', fontSize: '13px' }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(220,20,60,0.5)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
                />
                {errors.email && <p style={{ fontSize: '11px', color: '#DC143C' }}>{errors.email.message}</p>}
              </div>

              {formError && <p style={{ fontSize: '11px', color: '#DC143C' }}>{formError}</p>}

              <button
                type="submit"
                disabled={loading}
                className="group flex items-center justify-center gap-3 w-full ferrari-gradient text-white font-bold uppercase min-h-[52px] px-6 py-4 hover:opacity-90 transition-opacity disabled:opacity-50"
                style={{ fontSize: '10px', letterSpacing: '0.22em' }}
              >
                <MessageCircle size={12} />
                {loading ? 'Enviando...' : 'Quero este financiamento'}
                {!loading && <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform duration-200" />}
              </button>
              <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.15)', textAlign: 'center' }}>
                Sem compromisso · Valores ilustrativos a 1,2% a.m.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
