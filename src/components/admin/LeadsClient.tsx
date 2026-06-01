'use client'

import { useMemo, useState } from 'react'
import { Search, Download, X } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { UnifiedLead, Car } from '@/types'

const ORIGEM_COLORS = {
  Visita: 'text-green-400 bg-green-400/10 border-green-400/20',
  Financiamento: 'text-ferrari-red bg-ferrari-red/10 border-ferrari-red/20',
}

function inputClass() {
  return 'bg-white/[0.04] border border-white/10 text-white text-sm placeholder:text-white/25 px-3 py-2 rounded-lg outline-none focus:border-white/25 transition-colors'
}

interface Props {
  leads: UnifiedLead[]
  cars: Pick<Car, 'id' | 'name'>[]
}

export default function LeadsClient({ leads, cars }: Props) {
  const [search, setSearch] = useState('')
  const [origem, setOrigem] = useState<'Todos' | 'Visita' | 'Financiamento'>('Todos')
  const [carId, setCarId] = useState('')
  const [monthFrom, setMonthFrom] = useState('')
  const [monthTo, setMonthTo] = useState('')

  const filtered = useMemo(() => {
    return leads.filter(l => {
      if (search) {
        const q = search.toLowerCase()
        if (!l.name.toLowerCase().includes(q) && !l.phone.includes(q)) return false
      }
      if (origem !== 'Todos' && l.origem !== origem) return false
      if (carId && l.cars?.id !== carId) return false
      if (monthFrom && new Date(l.created_at) < new Date(monthFrom + '-01')) return false
      if (monthTo) {
        const [y, m] = monthTo.split('-').map(Number)
        const to = new Date(y, m, 0, 23, 59, 59, 999)
        if (new Date(l.created_at) > to) return false
      }
      return true
    })
  }, [leads, search, origem, carId, monthFrom, monthTo])

  const monthOptions = useMemo(() => {
    const set = new Set(leads.map(l => l.created_at.slice(0, 7)))
    return Array.from(set).sort().reverse().map(ym => {
      const [y, m] = ym.split('-')
      const label = new Date(Number(y), Number(m) - 1).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
      return { value: ym, label }
    })
  }, [leads])

  const now7 = useMemo(() => {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - 7)
    return leads.filter(l => new Date(l.created_at) >= cutoff).length
  }, [leads])

  const visitas = leads.filter(l => l.origem === 'Visita').length
  const financiamentos = leads.filter(l => l.origem === 'Financiamento').length

  const hasFilters = search || origem !== 'Todos' || carId || monthFrom || monthTo

  function clearFilters() {
    setSearch('')
    setOrigem('Todos')
    setCarId('')
    setMonthFrom('')
    setMonthTo('')
  }

  function exportCSV() {
    const headers = ['Nome', 'Telefone', 'Email', 'Veículo', 'Origem', 'Detalhes', 'Data']
    const rows = filtered.map(l => {
      const detalhes = l.origem === 'Financiamento' && l.parcela_estimada
        ? `Entrada ${l.entrada_pct}% · ${l.prazo}x de ${formatPrice(l.parcela_estimada)}`
        : (l.message ?? '')
      return [
        l.name,
        l.phone,
        l.email ?? '',
        l.cars?.name ?? '',
        l.origem,
        detalhes,
        new Date(l.created_at).toLocaleDateString('pt-BR'),
      ].map(v => `"${String(v).replace(/"/g, '""')}"`)
    })
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white">Leads</h1>
          <p className="text-white/40 text-sm mt-1">{leads.length} lead(s) no total</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
        >
          <Download size={14} />
          Exportar CSV
        </button>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Total de leads', value: leads.length, color: 'text-white' },
          { label: 'Visitas agendadas', value: visitas, color: 'text-green-400' },
          { label: 'Simulações financ.', value: financiamentos, color: 'text-ferrari-red' },
          { label: 'Últimos 7 dias', value: now7, color: 'text-blue-400' },
        ].map(m => (
          <div key={m.label} className="glass rounded-xl p-5">
            <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
            <p className="text-white/40 text-xs mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="glass rounded-xl p-4 mb-4 overflow-hidden">
        <div className="flex flex-col gap-3">
          {/* Busca */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
            <input
              type="text"
              placeholder="Nome ou telefone..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={inputClass() + ' pl-9 w-full'}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Origem */}
            <select
              value={origem}
              onChange={e => setOrigem(e.target.value as typeof origem)}
              className={inputClass() + ' w-full'}
            >
              <option value="Todos">Todas origens</option>
              <option value="Visita">Visita</option>
              <option value="Financiamento">Financiamento</option>
            </select>

            {/* Veículo */}
            <select
              value={carId}
              onChange={e => setCarId(e.target.value)}
              className={inputClass() + ' w-full'}
            >
              <option value="">Todos os veículos</option>
              {cars.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Data */}
          <div className="grid grid-cols-2 gap-3">
            <select
              value={monthFrom}
              onChange={e => setMonthFrom(e.target.value)}
              className={inputClass() + ' w-full'}
            >
              <option value="">De (mês)</option>
              {monthOptions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <select
              value={monthTo}
              onChange={e => setMonthTo(e.target.value)}
              className={inputClass() + ' w-full'}
            >
              <option value="">Até (mês)</option>
              {monthOptions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Limpar */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs transition-colors w-fit"
              style={{ color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}
            >
              <X size={12} />
              Limpar filtros
            </button>
          )}
        </div>

        {filtered.length !== leads.length && (
          <p className="text-white/30 text-xs mt-3">{filtered.length} resultado(s)</p>
        )}
      </div>

      {/* Lista */}
      {filtered.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <p className="text-white/30">Nenhum lead encontrado.</p>
        </div>
      ) : (
        <>
          {/* Mobile: cards */}
          <div className="flex flex-col gap-3 sm:hidden">
            {filtered.map(lead => (
              <div key={`${lead.origem}-${lead.id}`} className="glass rounded-xl p-4 flex flex-col gap-3">
                {/* Topo: nome + badge */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-white font-semibold text-sm">{lead.name}</p>
                    {lead.email && <p className="text-white/35 text-xs mt-0.5">{lead.email}</p>}
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full border flex-shrink-0 ${ORIGEM_COLORS[lead.origem]}`}>
                    {lead.origem}
                  </span>
                </div>

                {/* Telefone */}
                <a
                  href={`tel:${lead.phone}`}
                  className="text-white/70 text-sm font-mono"
                >
                  {lead.phone}
                </a>

                {/* Veículo */}
                {lead.cars?.name && (
                  <div className="flex items-center gap-2">
                    <span className="text-white/25 text-xs uppercase tracking-wider">Veículo</span>
                    <span className="text-white/70 text-xs">{lead.cars.name}</span>
                  </div>
                )}

                {/* Detalhes financiamento */}
                {lead.origem === 'Financiamento' && lead.parcela_estimada && (
                  <div className="rounded-lg p-3 flex flex-col gap-1" style={{ background: 'rgba(220,20,60,0.06)', border: '1px solid rgba(220,20,60,0.15)' }}>
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Simulação</p>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-white/35 text-[10px]">Entrada</p>
                        <p className="text-white text-xs font-semibold">{lead.entrada_pct}%</p>
                      </div>
                      <div>
                        <p className="text-white/35 text-[10px]">Prazo</p>
                        <p className="text-white text-xs font-semibold">{lead.prazo}x</p>
                      </div>
                      <div>
                        <p className="text-white/35 text-[10px]">Parcela</p>
                        <p className="text-ferrari-red text-xs font-bold">{formatPrice(lead.parcela_estimada)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Mensagem visita */}
                {lead.origem === 'Visita' && lead.message && (
                  <p className="text-white/35 text-xs leading-relaxed">{lead.message}</p>
                )}

                {/* Data */}
                <p className="text-white/20 text-xs">
                  {new Date(lead.created_at).toLocaleDateString('pt-BR')} às {new Date(lead.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ))}
          </div>

          {/* Desktop: tabela */}
          <div className="hidden sm:block glass rounded-xl overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-6 py-4 text-white/40 text-xs uppercase tracking-widest font-medium">Nome</th>
                  <th className="text-left px-4 py-4 text-white/40 text-xs uppercase tracking-widest font-medium">Telefone</th>
                  <th className="text-left px-4 py-4 text-white/40 text-xs uppercase tracking-widest font-medium">Veículo</th>
                  <th className="text-left px-4 py-4 text-white/40 text-xs uppercase tracking-widest font-medium">Origem</th>
                  <th className="text-left px-4 py-4 text-white/40 text-xs uppercase tracking-widest font-medium hidden lg:table-cell">Detalhes</th>
                  <th className="text-left px-4 py-4 text-white/40 text-xs uppercase tracking-widest font-medium">Data</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(lead => (
                  <tr key={`${lead.origem}-${lead.id}`} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-white text-sm font-medium">{lead.name}</p>
                      {lead.email && <p className="text-white/30 text-xs">{lead.email}</p>}
                    </td>
                    <td className="px-4 py-4 text-white/60 text-sm whitespace-nowrap">{lead.phone}</td>
                    <td className="px-4 py-4 text-white/60 text-sm">
                      {lead.cars?.name ?? <span className="text-white/20">—</span>}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full border ${ORIGEM_COLORS[lead.origem]}`}>
                        {lead.origem}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-white/40 text-xs hidden lg:table-cell">
                      {lead.origem === 'Financiamento' && lead.parcela_estimada ? (
                        <span>Entrada {lead.entrada_pct}% · {lead.prazo}x de <span className="text-ferrari-red font-semibold">{formatPrice(lead.parcela_estimada)}</span></span>
                      ) : lead.message ? (
                        <span className="truncate max-w-[200px] block">{lead.message}</span>
                      ) : (
                        <span className="text-white/20">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-white/30 text-xs whitespace-nowrap">
                      {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                      <span className="block text-white/20">{new Date(lead.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
