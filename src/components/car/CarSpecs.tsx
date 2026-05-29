'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import type { CarSpec } from '@/types'

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

interface CarSpecsProps {
  specs: CarSpec
}

export default function CarSpecs({ specs }: CarSpecsProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const entries = Object.entries(specs)
    .filter(([, v]) => v !== null && v !== undefined && v !== '')
    .map(([k, v]) => ({ key: k, label: SPEC_LABELS[k] ?? k, value: String(v) }))

  if (!entries.length) return null

  return (
    <div ref={ref} className="space-y-2">
      {entries.map((entry, i) => (
        <motion.div
          key={entry.key}
          initial={{ opacity: 0, x: -10 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: i * 0.04, duration: 0.5 }}
          className="flex justify-between items-center py-3 border-b border-white/5 last:border-0"
        >
          <span className="text-white/40 text-sm">{entry.label}</span>
          <span className="text-white text-sm font-medium">{entry.value}</span>
        </motion.div>
      ))}
    </div>
  )
}
