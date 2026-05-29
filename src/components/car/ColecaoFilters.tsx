'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { SlidersHorizontal, X, ChevronDown, Search, Star } from 'lucide-react'
import CarCard from '@/components/car/CarCard'
import { formatPrice } from '@/lib/utils'
import type { Car, ColorOption } from '@/types'

interface Props {
  cars: Car[]
}

type SortKey = 'destaques' | 'menor-preco' | 'maior-preco' | 'mais-recentes' | 'mais-antigos'

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'destaques',    label: 'Destaques' },
  { key: 'menor-preco',  label: 'Menor preço' },
  { key: 'maior-preco',  label: 'Maior preço' },
  { key: 'mais-recentes', label: 'Mais recentes' },
  { key: 'mais-antigos', label: 'Mais antigos' },
]

// ── Cor helpers ──────────────────────────────────────────────────────────────
const COLOR_GROUPS: { label: string; hex: string; match: (h: string) => boolean }[] = [
  { label: 'Vermelho', hex: '#CC0000', match: h => isHue(h, 0, 20) || isHue(h, 340, 360) },
  { label: 'Laranja',  hex: '#E8621A', match: h => isHue(h, 21, 45) },
  { label: 'Amarelo',  hex: '#F5C400', match: h => isHue(h, 46, 70) },
  { label: 'Verde',    hex: '#2D5A27', match: h => isHue(h, 71, 160) },
  { label: 'Azul',     hex: '#003DA5', match: h => isHue(h, 161, 260) },
  { label: 'Roxo',     hex: '#6B21A8', match: h => isHue(h, 261, 300) },
  { label: 'Rosa',     hex: '#DB2777', match: h => isHue(h, 301, 339) },
  { label: 'Branco',   hex: '#F5F5F5', match: h => isAchromatic(h) && isLight(h) },
  { label: 'Cinza',    hex: '#6B7280', match: h => isAchromatic(h) && isMid(h) },
  { label: 'Preto',    hex: '#1A1A1A', match: h => isAchromatic(h) && isDark(h) },
]

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6
  return [h * 360, s, l]
}
function isHue(hex: string, from: number, to: number) {
  try { const [h, s] = hexToHsl(hex); return s > 0.15 && h >= from && h <= to } catch { return false }
}
function isAchromatic(hex: string) {
  try { const [, s] = hexToHsl(hex); return s <= 0.15 } catch { return false }
}
function isLight(hex: string) {
  try { const [,, l] = hexToHsl(hex); return l > 0.7 } catch { return false }
}
function isMid(hex: string) {
  try { const [,, l] = hexToHsl(hex); return l >= 0.25 && l <= 0.7 } catch { return false }
}
function isDark(hex: string) {
  try { const [,, l] = hexToHsl(hex); return l < 0.25 } catch { return false }
}
function getColorGroup(hex: string) {
  return COLOR_GROUPS.find(g => g.match(hex)) ?? null
}

function formatNum(value: number) {
  return new Intl.NumberFormat('pt-BR').format(value)
}

// Extrai marca do nome (primeira palavra ou duas se conhecida)
function extractBrand(name: string) {
  const known = ['Ferrari', 'Lamborghini', 'Porsche', 'McLaren', 'Bugatti', 'Aston Martin', 'Bentley', 'Rolls-Royce', 'Maserati', 'Pagani']
  for (const b of known) {
    if (name.toLowerCase().startsWith(b.toLowerCase())) return b
  }
  return name.split(' ')[0]
}

// Dropdown genérico reutilizável
function Dropdown({
  label, active, open, onToggle,
}: {
  label: React.ReactNode
  active: boolean
  open: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200"
      style={{
        borderColor: active ? '#DC143C' : 'rgba(255,255,255,0.1)',
        background: active ? 'rgba(220,20,60,0.1)' : 'transparent',
        color: active ? '#fff' : 'rgba(255,255,255,0.4)',
        position: 'relative',
      }}
    >
      <span style={{ fontSize: '11px', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{label}</span>
      <ChevronDown size={13} style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }} />
    </button>
  )
}

function Panel({ children, width = 200 }: { children: React.ReactNode; width?: number }) {
  return (
    <div
      className="absolute top-full left-0 mt-2 z-30 rounded-xl border"
      style={{
        background: '#141414',
        borderColor: 'rgba(255,255,255,0.08)',
        width,
        boxShadow: '0 16px 48px rgba(0,0,0,0.7)',
      }}
    >
      {children}
    </div>
  )
}

export default function ColecaoFilters({ cars }: Props) {
  const [search, setSearch] = useState('')
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [appliedMin, setAppliedMin] = useState<number | null>(null)
  const [appliedMax, setAppliedMax] = useState<number | null>(null)
  const [sort, setSort] = useState<SortKey>('destaques')

  const [brandOpen, setBrandOpen] = useState(false)
  const [colorOpen, setColorOpen] = useState(false)
  const [priceOpen, setPriceOpen] = useState(false)
  const [sortOpen,  setSortOpen]  = useState(false)

  const brandRef = useRef<HTMLDivElement>(null)
  const colorRef = useRef<HTMLDivElement>(null)
  const priceRef = useRef<HTMLDivElement>(null)
  const sortRef  = useRef<HTMLDivElement>(null)
  const minRef   = useRef<HTMLInputElement>(null)

  // Fecha ao clicar fora
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (brandRef.current && !brandRef.current.contains(e.target as Node)) setBrandOpen(false)
      if (colorRef.current && !colorRef.current.contains(e.target as Node)) setColorOpen(false)
      if (priceRef.current && !priceRef.current.contains(e.target as Node)) setPriceOpen(false)
      if (sortRef.current  && !sortRef.current.contains(e.target as Node))  setSortOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const allBrands = useMemo(() => {
    const s = new Set(cars.map(c => extractBrand(c.name)))
    return Array.from(s).sort()
  }, [cars])

  const availableColors = useMemo(() => {
    const seen = new Set<string>()
    for (const car of cars)
      for (const c of car.color_options ?? []) {
        const g = getColorGroup(c.hex)
        if (g) seen.add(g.label)
      }
    return COLOR_GROUPS.filter(g => seen.has(g.label))
  }, [cars])

  const priceRange = useMemo(() => {
    if (!cars.length) return { min: 0, max: 0 }
    const prices = cars.map(c => c.price)
    return { min: Math.min(...prices), max: Math.max(...prices) }
  }, [cars])

  const filtered = useMemo(() => {
    let result = cars.filter(car => {
      const matchSearch = !search || car.name.toLowerCase().includes(search.toLowerCase())
      const matchBrand  = !selectedBrands.length || selectedBrands.includes(extractBrand(car.name))
      const matchColor  = !selectedColors.length || (car.color_options ?? []).some(c => {
        const g = getColorGroup(c.hex); return g && selectedColors.includes(g.label)
      })
      const matchMin = appliedMin === null || car.price >= appliedMin
      const matchMax = appliedMax === null || car.price <= appliedMax
      return matchSearch && matchBrand && matchColor && matchMin && matchMax
    })

    switch (sort) {
      case 'destaques':    result = [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)); break
      case 'menor-preco':  result = [...result].sort((a, b) => a.price - b.price); break
      case 'maior-preco':  result = [...result].sort((a, b) => b.price - a.price); break
      case 'mais-recentes': result = [...result].sort((a, b) => (b.year ?? 0) - (a.year ?? 0)); break
      case 'mais-antigos':  result = [...result].sort((a, b) => (a.year ?? 0) - (b.year ?? 0)); break
    }
    return result
  }, [cars, search, selectedBrands, selectedColors, appliedMin, appliedMax, sort])

  const activeCount =
    (search ? 1 : 0) +
    selectedBrands.length +
    selectedColors.length +
    (appliedMin !== null ? 1 : 0) +
    (appliedMax !== null ? 1 : 0)

  function clearAll() {
    setSearch('')
    setSelectedBrands([])
    setSelectedColors([])
    setPriceMin(''); setPriceMax('')
    setAppliedMin(null); setAppliedMax(null)
    setSort('destaques')
    setBrandOpen(false); setColorOpen(false); setPriceOpen(false); setSortOpen(false)
  }

  function applyPrice() {
    const minD = priceMin.replace(/\D/g, '')
    const maxD = priceMax.replace(/\D/g, '')
    setAppliedMin(minD ? parseInt(minD, 10) : null)
    setAppliedMax(maxD ? parseInt(maxD, 10) : null)
    setPriceOpen(false)
  }

  function closeOthers(keep: 'brand' | 'color' | 'price' | 'sort') {
    if (keep !== 'brand') setBrandOpen(false)
    if (keep !== 'color') setColorOpen(false)
    if (keep !== 'price') setPriceOpen(false)
    if (keep !== 'sort')  setSortOpen(false)
  }

  const sortLabel = SORT_OPTIONS.find(o => o.key === sort)?.label ?? 'Ordenar'
  const priceActive = appliedMin !== null || appliedMax !== null
  const priceLabel = priceActive
    ? [appliedMin && `≥ ${formatPrice(appliedMin)}`, appliedMax && `≤ ${formatPrice(appliedMax)}`].filter(Boolean).join(' ')
    : 'Preço'

  return (
    <>
      {/* ── Barra de filtros ── */}
      <div className="mb-10 space-y-4">

        {/* Linha 1: busca */}
        <div className="relative max-w-sm">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar modelo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/10 text-white text-sm placeholder:text-white/25 pl-10 pr-10 py-3 rounded-full focus:outline-none focus:border-white/25 transition-colors"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white transition-colors">
              <X size={13} />
            </button>
          )}
        </div>

        {/* Linha 2: dropdowns + ordenação */}
        <div className="flex flex-wrap items-center gap-2">

          <div className="flex items-center gap-1.5 text-white/25 mr-1">
            <SlidersHorizontal size={13} />
            <span style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Filtros</span>
          </div>

          {/* Marca */}
          <div className="relative" ref={brandRef}>
            <Dropdown
              label={selectedBrands.length ? (selectedBrands.length === 1 ? selectedBrands[0] : `${selectedBrands.length} marcas`) : 'Marca'}
              active={selectedBrands.length > 0}
              open={brandOpen}
              onToggle={() => { closeOthers('brand'); setBrandOpen(v => !v) }}
            />
            {brandOpen && (
              <Panel width={180}>
                <p style={{ fontSize: '9px', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', padding: '10px 16px 8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  Marca
                </p>
                <div className="py-1">
                  {allBrands.map(brand => {
                    const active = selectedBrands.includes(brand)
                    return (
                      <button
                        key={brand}
                        onClick={() => setSelectedBrands(prev => active ? prev.filter(b => b !== brand) : [...prev, brand])}
                        className="w-full flex items-center justify-between px-4 py-2.5 transition-colors"
                        style={{ color: active ? '#fff' : 'rgba(255,255,255,0.5)', background: active ? 'rgba(220,20,60,0.08)' : 'transparent' }}
                        onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)' }}
                        onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                      >
                        <span style={{ fontSize: '12px' }}>{brand}</span>
                        {active && <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#DC143C' }} />}
                      </button>
                    )
                  })}
                </div>
                {selectedBrands.length > 0 && (
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '6px 12px 10px' }}>
                    <button onClick={() => setSelectedBrands([])} className="w-full text-center text-xs py-1" style={{ color: 'rgba(255,255,255,0.3)' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#fff')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}>
                      Limpar
                    </button>
                  </div>
                )}
              </Panel>
            )}
          </div>

          {/* Cor */}
          {availableColors.length > 0 && (
            <div className="relative" ref={colorRef}>
              <Dropdown
                label={selectedColors.length ? (selectedColors.length === 1 ? selectedColors[0] : `${selectedColors.length} cores`) : 'Cor'}
                active={selectedColors.length > 0}
                open={colorOpen}
                onToggle={() => { closeOthers('color'); setColorOpen(v => !v) }}
              />
              {colorOpen && (
                <Panel width={180}>
                  <p style={{ fontSize: '9px', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', padding: '10px 16px 8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    Cor
                  </p>
                  <div className="py-1">
                    {availableColors.map(group => {
                      const active = selectedColors.includes(group.label)
                      return (
                        <button
                          key={group.label}
                          onClick={() => setSelectedColors(prev => active ? prev.filter(l => l !== group.label) : [...prev, group.label])}
                          className="w-full flex items-center gap-3 px-4 py-2.5 transition-colors"
                          style={{ color: active ? '#fff' : 'rgba(255,255,255,0.5)', background: active ? 'rgba(220,20,60,0.08)' : 'transparent' }}
                          onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)' }}
                          onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                        >
                          <span className="w-4 h-4 rounded-full flex-shrink-0" style={{
                            background: group.hex,
                            boxShadow: active ? `0 0 0 2px #141414, 0 0 0 3px ${group.hex}` : '0 0 0 1px rgba(255,255,255,0.15)',
                          }} />
                          <span style={{ fontSize: '12px' }}>{group.label}</span>
                          {active && <span className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#DC143C' }} />}
                        </button>
                      )
                    })}
                  </div>
                  {selectedColors.length > 0 && (
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '6px 12px 10px' }}>
                      <button onClick={() => setSelectedColors([])} className="w-full text-center text-xs py-1" style={{ color: 'rgba(255,255,255,0.3)' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#fff')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}>
                        Limpar
                      </button>
                    </div>
                  )}
                </Panel>
              )}
            </div>
          )}

          {/* Preço */}
          <div className="relative" ref={priceRef}>
            <Dropdown
              label={priceLabel}
              active={priceActive}
              open={priceOpen}
              onToggle={() => { closeOthers('price'); setPriceOpen(v => !v); setTimeout(() => minRef.current?.focus(), 50) }}
            />
            {priceOpen && (
              <Panel width={270}>
                <div className="p-4">
                  <p style={{ fontSize: '9px', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginBottom: '14px' }}>
                    Faixa de preço
                  </p>
                  {priceRange.max > 0 && (
                    <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.18)', marginBottom: '12px' }}>
                      Estoque: {formatPrice(priceRange.min)} — {formatPrice(priceRange.max)}
                    </p>
                  )}
                  <div className="flex flex-col gap-2 mb-3">
                    {/* Mínimo */}
                    <div className="flex items-center gap-2 rounded-lg px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', flexShrink: 0, minWidth: '50px' }}>R$ mín</span>
                      <input
                        ref={minRef}
                        type="text" inputMode="numeric" placeholder="0"
                        value={priceMin}
                        onChange={e => { const r = e.target.value.replace(/\D/g, ''); setPriceMin(r ? formatNum(parseInt(r, 10)) : '') }}
                        onKeyDown={e => { if (e.key === 'Enter') applyPrice() }}
                        className="flex-1 bg-transparent outline-none text-right"
                        style={{ fontSize: '13px', color: '#fff', caretColor: '#DC143C' }}
                      />
                    </div>
                    {/* Máximo */}
                    <div className="flex items-center gap-2 rounded-lg px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', flexShrink: 0, minWidth: '50px' }}>R$ máx</span>
                      <input
                        type="text" inputMode="numeric" placeholder="sem limite"
                        value={priceMax}
                        onChange={e => { const r = e.target.value.replace(/\D/g, ''); setPriceMax(r ? formatNum(parseInt(r, 10)) : '') }}
                        onKeyDown={e => { if (e.key === 'Enter') applyPrice() }}
                        className="flex-1 bg-transparent outline-none text-right"
                        style={{ fontSize: '13px', color: '#fff', caretColor: '#DC143C' }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={applyPrice}
                      className="flex-1 py-2 rounded-lg text-xs font-semibold uppercase tracking-widest transition-all"
                      style={{ background: (priceMin || priceMax) ? '#DC143C' : 'rgba(255,255,255,0.06)', color: (priceMin || priceMax) ? '#fff' : 'rgba(255,255,255,0.2)' }}
                    >
                      Aplicar
                    </button>
                    {priceActive && (
                      <button
                        onClick={() => { setPriceMin(''); setPriceMax(''); setAppliedMin(null); setAppliedMax(null); setPriceOpen(false) }}
                        className="px-3 py-2 rounded-lg text-xs"
                        style={{ color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.04)' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#fff')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
                      >
                        Limpar
                      </button>
                    )}
                  </div>
                </div>
              </Panel>
            )}
          </div>

          {/* Separador */}
          <div className="w-px h-5 bg-white/10 mx-1" />

          {/* Ordenação */}
          <div className="relative" ref={sortRef}>
            <Dropdown
              label={sortLabel}
              active={sort !== 'destaques'}
              open={sortOpen}
              onToggle={() => { closeOthers('sort'); setSortOpen(v => !v) }}
            />
            {sortOpen && (
              <Panel width={190}>
                <p style={{ fontSize: '9px', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', padding: '10px 16px 8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  Ordenar por
                </p>
                <div className="py-1">
                  {SORT_OPTIONS.map(opt => {
                    const active = sort === opt.key
                    return (
                      <button
                        key={opt.key}
                        onClick={() => { setSort(opt.key); setSortOpen(false) }}
                        className="w-full flex items-center justify-between px-4 py-2.5 transition-colors"
                        style={{ color: active ? '#fff' : 'rgba(255,255,255,0.5)', background: active ? 'rgba(220,20,60,0.08)' : 'transparent' }}
                        onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)' }}
                        onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                      >
                        <span style={{ fontSize: '12px' }}>{opt.label}</span>
                        {active && <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#DC143C' }} />}
                      </button>
                    )
                  })}
                </div>
              </Panel>
            )}
          </div>

          {/* Limpar tudo */}
          {activeCount > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 px-3 py-2 transition-colors"
              style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.25)')}
            >
              <X size={12} />
              Limpar tudo
            </button>
          )}

          {/* Contador */}
          <span className="ml-auto" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.06em' }}>
            {filtered.length} {filtered.length === 1 ? 'veículo' : 'veículos'}
          </span>
        </div>
      </div>

      {/* ── Grid ── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((car, i) => (
            <CarCard key={car.id} car={car} index={i} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <span className="text-white/10 text-6xl font-black mb-4">—</span>
          <p className="text-white/30 text-sm">Nenhum veículo para os filtros selecionados.</p>
          <button onClick={clearAll} className="mt-6 text-ferrari-red text-xs uppercase tracking-widest hover:text-white transition-colors">
            Limpar filtros
          </button>
        </div>
      )}
    </>
  )
}
