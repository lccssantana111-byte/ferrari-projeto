'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { getWhatsAppLink } from '@/lib/constants'
import type { Car } from '@/types'

const EASE = [0.16, 1, 0.3, 1] as const

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

interface Props {
  car: Car
  formattedPrice: string
}

export default function ConfiguradorVisual({ car, formattedPrice }: Props) {
  if (!car.color_options?.length) return null

  const [selectedColorIdx, setSelectedColorIdx] = useState(0)

  const selectedColor = car.color_options[selectedColorIdx]

  // Usa a foto vinculada à cor; fallback para a primeira foto do carro
  const previewImage = selectedColor.image || car.images[0] || null

  function selectColor(idx: number) {
    setSelectedColorIdx(idx)
  }

  const whatsappMsg = `Olá! Gostaria de solicitar o ${car.name} na cor ${selectedColor.name}. Poderia me informar disponibilidade e condições?`

  return (
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '2rem' }}>

      {/* Cabeçalho */}
      <div className="flex items-center gap-3 mb-6">
        <span className="h-px w-5 bg-ferrari-red" />
        <span style={{ fontSize: '9px', letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
          Configurador Visual
        </span>
      </div>

      {/* Painel de preview */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/9', background: '#111' }}>

        {previewImage ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={previewImage}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <Image
                src={previewImage}
                alt={`${car.name} — ${selectedColor.name}`}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
        ) : (
          <div
            className="absolute inset-0 transition-colors duration-700"
            style={{ background: `linear-gradient(135deg, #111 60%, ${selectedColor.hex}20)` }}
          />
        )}

        {/* Gradiente permanente de fundo */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.75) 0%, transparent 55%)' }} />

        {/* Overlay de cor animada */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedColor.hex}
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            style={{
              background: `linear-gradient(135deg, ${selectedColor.hex}00 40%, ${selectedColor.hex}30 70%, ${selectedColor.hex}55 100%)`,
              mixBlendMode: 'screen',
            }}
          />
        </AnimatePresence>

        {/* Badge da cor no canto inferior esquerdo */}
        <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
          <div style={{
            width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
            background: selectedColor.hex,
            border: '1px solid rgba(255,255,255,0.25)',
            boxShadow: `0 0 8px ${selectedColor.hex}80`,
          }} />
          <AnimatePresence mode="wait">
            <motion.span
              key={selectedColor.name}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 4 }}
              transition={{ duration: 0.22, ease: EASE }}
              style={{ fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}
            >
              {selectedColor.name}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Swatches */}
      <div className="flex items-start flex-wrap gap-4 mt-6">
        {car.color_options.map((c, idx) => {
          const isSelected = idx === selectedColorIdx
          return (
            <button
              key={c.hex + idx}
              onClick={() => selectColor(idx)}
              className="flex flex-col items-center gap-2 relative"
              style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
              aria-label={c.name}
            >
              <div className="relative" style={{ width: 52, height: 52 }}>
                {/* Anel de seleção com layoutId para transição fluida */}
                {isSelected && (
                  <motion.div
                    layoutId="color-ring"
                    className="absolute"
                    style={{
                      inset: -5,
                      borderRadius: '50%',
                      border: '1.5px solid #DC143C',
                    }}
                    transition={{ duration: 0.35, ease: EASE }}
                  />
                )}
                <motion.div
                  animate={{
                    scale: isSelected ? 1.12 : 1,
                    boxShadow: isSelected
                      ? `0 0 16px 2px ${c.hex}40`
                      : '0 0 0 0 transparent',
                  }}
                  transition={{ duration: 0.3, ease: EASE }}
                  style={{
                    width: 52, height: 52, borderRadius: '50%',
                    background: c.hex,
                    border: '2px solid rgba(255,255,255,0.1)',
                    boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.15)',
                  }}
                />
              </div>
              <motion.span
                animate={{ color: isSelected ? '#ffffff' : 'rgba(255,255,255,0.22)' }}
                transition={{ duration: 0.25 }}
                style={{ fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600, lineHeight: 1.2, maxWidth: 64, textAlign: 'center' }}
              >
                {c.name}
              </motion.span>
            </button>
          )
        })}
      </div>

      {/* Barra de summary */}
      <div
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mt-6 pt-6"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        {/* Esquerda: Sua Configuração */}
        <div className="flex flex-col gap-1">
          <span style={{ fontSize: '9px', letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', fontWeight: 600 }}>
            Sua Configuração
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <div style={{
              width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
              background: selectedColor.hex,
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: `0 0 6px ${selectedColor.hex}60`,
              transition: 'background 0.3s, box-shadow 0.3s',
            }} />
            <AnimatePresence mode="wait">
              <motion.span
                key={selectedColor.name}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.2, ease: EASE }}
                className="font-bold text-white"
                style={{ fontSize: '14px', letterSpacing: '0.02em' }}
              >
                {selectedColor.name}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* Centro: Preço */}
        <div className="flex flex-col gap-0.5 sm:text-right">
          <span style={{ fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', fontWeight: 600 }}>
            Preço base
          </span>
          <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#DC143C', letterSpacing: '-0.02em', lineHeight: 1 }}>
            {formattedPrice}
          </span>
        </div>

        {/* Direita: CTA WhatsApp */}
        <a
          href={getWhatsAppLink(whatsappMsg)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 transition-all duration-300"
          style={{
            background: '#DC143C', color: '#fff',
            fontSize: '9px', fontWeight: 700,
            letterSpacing: '0.24em', textTransform: 'uppercase',
            padding: '14px 20px',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#A50E2D')}
          onMouseLeave={e => (e.currentTarget.style.background = '#DC143C')}
        >
          <WhatsAppIcon />
          Quero este carro assim
        </a>
      </div>
    </div>
  )
}
