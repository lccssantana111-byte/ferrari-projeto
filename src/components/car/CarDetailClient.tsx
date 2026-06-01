'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, ArrowRight, Check } from 'lucide-react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { testDriveSchema, type TestDriveFormData } from '@/lib/validators'
import { getWhatsAppLink } from '@/lib/constants'
import CarVideo from '@/components/car/CarVideo'
import FinanciamentoCarDetail from '@/components/financiamento/FinanciamentoCarDetail'
import ConfiguradorVisual from '@/components/car/ConfiguradorVisual'
import type { Car } from '@/types'

const EASE = [0.16, 1, 0.3, 1] as const

const SPEC_LABELS: Record<string, string> = {
  engine: 'Motor',
  horsepower: 'Potência',
  torque: 'Torque',
  transmission: 'Câmbio',
  drivetrain: 'Tração',
  acceleration: '0–100 km/h',
  top_speed: 'Vel. Máxima',
  weight: 'Peso',
  fuel_economy: 'Consumo',
}

const STATUS_LABEL: Record<string, string> = { active: 'Disponível', sold: 'Vendido', reserved: 'Reservado' }
const STATUS_COLOR: Record<string, string> = {
  active: '#4ade80',
  sold: 'rgba(255,255,255,0.3)',
  reserved: '#facc15',
}

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

interface Props {
  car: Car
  formattedPrice: string
  otherCars?: Car[]
}

const VISIBLE = 4

export default function CarDetailClient({ car, formattedPrice, otherCars = [] }: Props) {
  const othersRef = useRef(null)
  const othersInView = useInView(othersRef, { once: true, margin: '-60px' })
  const [slideIndex, setSlideIndex] = useState(0)
  const [slideDir, setSlideDir] = useState(1)
  const [activeImg, setActiveImg] = useState(0)

  const totalSlides = Math.ceil(otherCars.length / VISIBLE)
  function slidePrev() { setSlideDir(-1); setSlideIndex(i => (i - 1 + totalSlides) % totalSlides) }
  function slideNext() { setSlideDir(1);  setSlideIndex(i => (i + 1) % totalSlides) }
  const visibleCars = otherCars.slice(slideIndex * VISIBLE, slideIndex * VISIBLE + VISIBLE)
  const [lightbox, setLightbox] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<TestDriveFormData>({
    resolver: zodResolver(testDriveSchema),
    defaultValues: { car_id: car.id },
  })

  const images = car.images.length ? car.images : []
  const specs = Object.entries(car.specs ?? {}).filter(([, v]) => v !== null && v !== undefined && v !== '')

  function prevImg() { setActiveImg((s) => (s - 1 + images.length) % images.length) }
  function nextImg() { setActiveImg((s) => (s + 1) % images.length) }

  const touchStartX = useRef<number | null>(null)
  function handleTouchStart(e: React.TouchEvent) { touchStartX.current = e.touches[0].clientX }
  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) diff > 0 ? nextImg() : prevImg()
    touchStartX.current = null
  }

  async function onSubmit(data: TestDriveFormData) {
    setLoading(true)
    setFormError(null)
    try {
      const res = await fetch('/api/test-drive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      setSubmitted(true)
      const msg = `Olá! Gostaria de agendar uma visita para conhecer o ${car.name}.`
      setTimeout(() => { window.open(getWhatsAppLink(msg), '_blank') }, 800)
    } catch {
      setFormError('Erro ao enviar. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: '#0A0A0A' }}>

      {/* ── HERO: imagem full-bleed com overlay ── */}
      {images.length > 0 && (
        <div
          className="relative w-full overflow-hidden"
          style={{ height: 'clamp(380px, 55vh, 680px)' }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeImg}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <Image
                src={images[activeImg]}
                alt={`${car.name} — foto ${activeImg + 1}`}
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
            </motion.div>
          </AnimatePresence>

          {/* Gradientes */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/60 via-transparent to-transparent" />


          {/* Navegação hero */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImg}
                className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 items-center justify-center transition-all duration-200"
                style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#DC143C'; (e.currentTarget as HTMLButtonElement).style.color = '#fff' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.15)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.5)' }}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={nextImg}
                className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 items-center justify-center transition-all duration-200"
                style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#DC143C'; (e.currentTarget as HTMLButtonElement).style.color = '#fff' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.15)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.5)' }}
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}

          {/* Contador */}
          <div className="absolute bottom-8 right-8 z-10" style={{ fontSize: '10px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.35)', fontWeight: 700 }}>
            {String(activeImg + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
          </div>

          {/* Clique para lightbox */}
          <button
            onClick={() => setLightbox(true)}
            className="absolute inset-0 z-[5] cursor-zoom-in"
            aria-label="Abrir galeria"
          />
        </div>
      )}

      {/* ── CONTEÚDO ── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 md:px-12 lg:px-20">

        {/* Miniaturas */}
        {images.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-hide">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className="relative flex-shrink-0 overflow-hidden transition-all duration-200"
                style={{
                  width: 80, height: 52,
                  border: i === activeImg ? '1.5px solid #DC143C' : '1.5px solid rgba(255,255,255,0.07)',
                  opacity: i === activeImg ? 1 : 0.45,
                }}
              >
                <Image src={img} alt={`${car.name} ${i + 1}`} fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Grid: info + painel */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_440px] gap-16 mt-14 pb-24">

          {/* ── COLUNA ESQUERDA ── */}
          <div className="flex flex-col gap-12">

            {/* Nome + status + preço */}
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-4 mb-4">
                <span
                  className="flex items-center gap-1.5"
                  style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, color: STATUS_COLOR[car.status] }}
                >
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: STATUS_COLOR[car.status] }} />
                  {STATUS_LABEL[car.status]}
                </span>
                {car.year && (
                  <>
                    <span style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.1)', display: 'inline-block' }} />
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em' }}>{car.year}</span>
                  </>
                )}
              </div>

              <h1
                className="font-black text-white tracking-[-0.04em]"
                style={{ fontSize: 'clamp(2.8rem, 3.5vw, 3.5rem)', lineHeight: 1.0 }}
              >
                {car.name}
              </h1>

              {car.short_tagline && (
                <p className="mt-3" style={{ fontSize: '16px', color: 'rgba(255,255,255,0.38)', lineHeight: 1.6 }}>
                  {car.short_tagline}
                </p>
              )}

              <div className="mt-6 flex items-baseline justify-center sm:justify-start gap-3">
                <span className="font-black" style={{ fontSize: 'clamp(2.2rem, 2.8vw, 2.6rem)', color: '#DC143C', letterSpacing: '-0.03em', lineHeight: 1 }}>
                  {formattedPrice}
                </span>
              </div>
            </div>

            {/* Specs destacados (aceleração, potência, vel max + km rodados) */}
            {(() => {
              const highlight = ['acceleration', 'horsepower', 'top_speed']
              const featuredSpecs = specs.filter(([k]) => highlight.includes(k))
              const hasMileage = car.mileage != null
              if (!featuredSpecs.length && !hasMileage) return null
              const cols = featuredSpecs.length + (hasMileage ? 1 : 0)
              return (
                <div
                  className="grid gap-px"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    gridTemplateColumns: `repeat(${Math.min(cols, 2)}, 1fr)`,
                  }}
                >
                  {featuredSpecs.map(([k, v]) => (
                    <div key={k} className="flex flex-col gap-1.5 px-6 py-5" style={{ background: '#0A0A0A' }}>
                      <span className="font-black text-white leading-none" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', letterSpacing: '-0.03em' }}>
                        {String(v)}
                      </span>
                      <span style={{ fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)' }}>
                        {SPEC_LABELS[k] ?? k}
                      </span>
                    </div>
                  ))}
                  {hasMileage && (
                    <div className="flex flex-col gap-1.5 px-6 py-5" style={{ background: '#0A0A0A' }}>
                      <span className="font-black text-white leading-none" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', letterSpacing: '-0.03em' }}>
                        {new Intl.NumberFormat('pt-BR').format(car.mileage!)}
                      </span>
                      <span style={{ fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)' }}>
                        KM Rodados
                      </span>
                    </div>
                  )}
                </div>
              )
            })()}

            {/* Descrição */}
            {car.description && (
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '2rem' }}>
                <div className="flex items-center gap-3 mb-5">
                  <span className="h-px w-5 bg-ferrari-red" />
                  <span style={{ fontSize: '9px', letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
                    Sobre o veículo
                  </span>
                </div>
                <p style={{ fontSize: '15px', lineHeight: 1.85, color: 'rgba(255,255,255,0.45)' }}>
                  {car.description}
                </p>
              </div>
            )}

            {/* Todas as specs */}
            {specs.length > 0 && (
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '2rem' }}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="h-px w-5 bg-ferrari-red" />
                  <span style={{ fontSize: '9px', letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
                    Especificações
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-px" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  {specs.map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between px-5 py-4" style={{ background: '#0A0A0A' }}>
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.04em' }}>
                        {SPEC_LABELS[k] ?? k}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>
                        {String(v)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <ConfiguradorVisual car={car} formattedPrice={formattedPrice} />

            {/* Vídeo */}
            {car.video_url && (
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '2rem' }}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="h-px w-5 bg-ferrari-red" />
                  <span style={{ fontSize: '9px', letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
                    Vídeo
                  </span>
                </div>
                <CarVideo url={car.video_url} />
              </div>
            )}

            {/* Simulador de financiamento */}
            {car.status === 'active' && <FinanciamentoCarDetail car={car} />}
          </div>

          {/* ── COLUNA DIREITA: painel sticky ── */}
          <div className="lg:sticky lg:top-[108px] lg:self-start flex flex-col gap-4">

            {/* Formulário test drive */}
            {car.status === 'active' && (
              <div style={{ border: '1px solid rgba(255,255,255,0.07)', background: '#111111' }}>
                <div className="px-7 pt-7 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center gap-3">
                    <span className="h-px w-5 bg-ferrari-red" />
                    <span style={{ fontSize: '9px', letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
                      Agendar Visita
                    </span>
                  </div>
                </div>

                <div className="p-7">
                  {submitted ? (
                    <div className="flex flex-col items-center gap-3 py-4 text-center">
                      <div className="w-10 h-10 flex items-center justify-center" style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)' }}>
                        <Check size={18} style={{ color: '#4ade80' }} />
                      </div>
                      <p className="text-white font-semibold" style={{ fontSize: '14px' }}>Solicitação enviada!</p>
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>Redirecionando para o WhatsApp...</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                      <input type="hidden" {...register('car_id')} />

                      <div className="flex flex-col gap-1">
                        <input
                          {...register('name')}
                          placeholder="Nome completo"
                          className="w-full py-3.5 px-4 text-white placeholder-white/20 text-sm outline-none transition-colors duration-200"
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
                        className="w-full py-4 mt-1 transition-all duration-300 disabled:opacity-50"
                        style={{ border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.24em', background: 'transparent' }}
                        onMouseEnter={e => { const b = e.currentTarget; b.style.borderColor = '#DC143C'; b.style.color = '#DC143C' }}
                        onMouseLeave={e => { const b = e.currentTarget; b.style.borderColor = 'rgba(255,255,255,0.12)'; b.style.color = 'rgba(255,255,255,0.6)' }}
                      >
                        {loading ? 'Enviando...' : 'Solicitar Visita'}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}

            {/* Garantias */}
            <div className="flex flex-col gap-0" style={{ border: '1px solid rgba(255,255,255,0.07)', background: '#111111' }}>
              {[
                'Histórico completo do veículo',
                'Inspeção técnica de 120 pontos',
                'Revisão inclusa na entrega',
                'Procedência verificada',
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-6 py-4"
                  style={{ borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                >
                  <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#DC143C' }} />
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.02em' }}>{item}</span>
                </div>
              ))}
            </div>

            {/* CTA WhatsApp */}
            <a
              href={getWhatsAppLink(`Olá! Tenho interesse no ${car.name}. Poderia me passar mais informações?`)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 py-5 w-full transition-all duration-300"
              style={{ background: '#DC143C', color: '#fff', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.24em' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#A50E2D')}
              onMouseLeave={e => (e.currentTarget.style.background = '#DC143C')}
            >
              <WhatsAppIcon />
              Tenho interesse
            </a>

          </div>
        </div>
      </div>

      {/* ── OUTROS CARROS ── */}
      {otherCars.length > 0 && (
        <section ref={othersRef} className="pt-8 pb-14 sm:py-24" style={{ background: '#0D0D0D' }}>
          <div className="max-w-[1400px] mx-auto px-5 sm:px-12 lg:px-20">

            <div className="flex items-end justify-between mb-8 sm:mb-12">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="h-px w-6 bg-ferrari-red" />
                  <span style={{ fontSize: '9px', letterSpacing: '0.4em', color: '#DC143C', textTransform: 'uppercase', fontWeight: 600 }}>Também disponíveis</span>
                </div>
                <h2
                  className="font-black text-white mt-2 tracking-[-0.03em]"
                  style={{ fontSize: 'clamp(2.5rem, 4.5vw, 4rem)', lineHeight: 1.0 }}
                >
                  Outros<br />
                  <span style={{ color: '#DC143C' }}>veículos</span>
                </h2>
              </div>
            </div>

            {/* Mobile: scroll horizontal com snap */}
            <div
              className="flex sm:hidden overflow-x-auto gap-3 pb-1 snap-x snap-mandatory -mx-5"
              style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch', paddingLeft: '20px' } as React.CSSProperties}
            >
              {otherCars.map((c) => (
                <div key={c.id} className="flex-none w-[72vw] snap-start">
                  <Link href={`/carros/${c.slug}`} className="group block">
                    <div className="relative overflow-hidden mb-3" style={{ aspectRatio: '4/3', background: '#1A1A1A' }}>
                      {c.images[0] ? (
                        <Image
                          src={c.images[0]}
                          alt={c.name}
                          fill
                          sizes="72vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-white/10 text-4xl font-bold">{c.name[0]}</span>
                        </div>
                      )}
                    </div>
                    <div className="px-0.5">
                      <h3 className="text-white font-bold leading-tight mb-1" style={{ fontSize: '0.95rem' }}>{c.name}</h3>
                      {c.short_tagline && (
                        <p className="text-white/50 leading-snug mb-1.5" style={{ fontSize: '0.72rem' }}>{c.short_tagline}</p>
                      )}
                      <span className="text-ferrari-red font-bold" style={{ fontSize: '0.9rem' }}>
                        {c.price ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(c.price) : '—'}
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Desktop: grid animado com paginação */}
            <div className="relative hidden sm:block">
              {totalSlides > 1 && (
                <div className="flex items-center justify-end gap-2 mb-6">
                  <button
                    onClick={slidePrev}
                    className="w-11 h-11 flex items-center justify-center border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all duration-200"
                    style={{ background: '#0D0D0D' }}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={slideNext}
                    className="w-11 h-11 flex items-center justify-center border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all duration-200"
                    style={{ background: '#0D0D0D' }}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
              <div className="overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={slideIndex}
                    className="grid grid-cols-3 lg:grid-cols-4 gap-4"
                    initial={{ opacity: 0, x: slideDir > 0 ? 80 : -80 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: slideDir > 0 ? -80 : 80 }}
                    transition={{ duration: 0.5, ease: EASE }}
                  >
                    {visibleCars.map((c, i) => (
                      <motion.div
                        key={c.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06, duration: 0.45, ease: EASE }}
                      >
                        <Link href={`/carros/${c.slug}`} className="group block">
                          <div className="relative overflow-hidden mb-4" style={{ aspectRatio: '16/10', background: '#1A1A1A' }}>
                            {c.images[0] ? (
                              <Image
                                src={c.images[0]}
                                alt={c.name}
                                fill
                                sizes="25vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-white/10 text-4xl font-bold">{c.name[0]}</span>
                              </div>
                            )}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.6), transparent)' }} />
                          </div>
                          <div className="px-1">
                            <div className="flex items-start justify-between mb-1">
                              <h3 className="text-white font-bold text-base group-hover:text-ferrari-red transition-colors leading-tight">{c.name}</h3>
                              <ArrowRight size={14} className="text-white/15 group-hover:text-ferrari-red group-hover:translate-x-1 transition-all mt-0.5 flex-shrink-0" />
                            </div>
                            {c.short_tagline && (
                              <p className="text-white/30 text-xs mb-2 leading-relaxed">{c.short_tagline}</p>
                            )}
                            <span style={{ color: '#DC143C', fontWeight: 700, fontSize: '14px' }}>
                              {c.price ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(c.price) : '—'}
                            </span>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              {totalSlides > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  {Array.from({ length: totalSlides }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setSlideDir(i > slideIndex ? 1 : -1); setSlideIndex(i) }}
                      className="h-px transition-all duration-300"
                      style={{ width: i === slideIndex ? 32 : 16, background: i === slideIndex ? '#DC143C' : 'rgba(255,255,255,0.15)' }}
                    />
                  ))}
                </div>
              )}
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
      )}

      {/* ── LIGHTBOX ── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[200] flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.95)' }}
            onClick={() => setLightbox(false)}
          >
            <button
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center transition-colors duration-200"
              style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)' }}
              onClick={() => setLightbox(false)}
            >
              <X size={16} />
            </button>

            <button
              className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center"
              style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)' }}
              onClick={(e) => { e.stopPropagation(); prevImg() }}
            >
              <ChevronLeft size={18} />
            </button>

            <div className="relative w-full max-w-5xl aspect-[16/9] px-4 sm:px-20" onClick={(e) => e.stopPropagation()}>
              <Image src={images[activeImg]} alt={`${car.name} ${activeImg + 1}`} fill sizes="100vw" className="object-contain" />
            </div>

            <button
              className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center"
              style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)' }}
              onClick={(e) => { e.stopPropagation(); nextImg() }}
            >
              <ChevronRight size={18} />
            </button>

            <span className="absolute bottom-6" style={{ fontSize: '10px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.3)' }}>
              {String(activeImg + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
