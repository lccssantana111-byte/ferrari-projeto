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
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const filtered = useMemo(() => {
    return leads.filter(l => {
      if (search) {
        const q = search.toLowerCase()
        if (!l.name.toLowerCase().includes(q) && !l.phone.includes(q)) return false
      }
      if (origem !== 'Todos' && l.origem !== origem) return false
      if (carId && l.cars?.id !== carId) return false
      if (dateFrom && new Date(l.created_at) < new Date(dateFrom)) return false
      if (dateTo) {
        const to = new Date(dateTo)
        to.setHours(23, 59, 59, 999)
        if (new Date(l.created_at) > to) return false
      }
      return true
    })
  }, [leads, search, origem, carId, dateFrom, dateTo])

  const now7 = useMemo(() => {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - 7)
    return leads.filter(l => new Date(l.created_at) >= cutoff).length
  }, [leads])

  const visitas = leads.filter(l => l.origem === 'Visita').length
  const financiamentos = leads.filter(l => l.origem === 'Financiamento').length

  const hasFilters = search || origem !== 'Todos' || carId || dateFrom || dateTo

  function clearFilters() {
    setSearch('')
    setOrigem('Todos')
    setCarId('')
    setDateFrom('')
    setDateTo('')
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
      <div className="glass rounded-xl p-4 mb-4">
        <div className="flex flex-wrap gap-3 items-end">
          {/* Busca */}
          <div className="relative flex-1 min-w-[180px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
            <input
              type="text"
              placeholder="Nome ou telefone..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={inputClass() + ' pl-9 w-full'}
            />
          </div>

          {/* Origem */}
          <select
            value={origem}
            onChange={e => setOrigem(e.target.value as typeof origem)}
            className={inputClass() + ' min-w-[140px]'}
          >
            <option value="Todos">Todas origens</option>
            <option value="Visita">Visita</option>
            <option value="Financiamento">Financiamento</option>
          </select>

          {/* Veículo */}
          <select
            value={carId}
            onChange={e => setCarId(e.target.value)}
            className={inputClass() + ' min-w-[160px] max-w-[220px]'}
          >
            <option value="">Todos os veículos</option>
            {cars.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Data de */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              className={inputClass()}
              title="De"
            />
            <span className="text-white/25 text-xs">até</span>
            <input
              type="date"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              className={inputClass()}
              title="Até"
            />
          </div>

          {/* Limpar */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs transition-colors"
              style={{ color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}
            >
              <X size={12} />
              Limpar
            </button>
          )}
        </div>

        {filtered.length !== leads.length && (
          <p className="text-white/30 text-xs mt-3">{filtered.length} resultado(s)</p>
        )}
      </div>

      {/* Tabela */}
      {filtered.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <p className="text-white/30">Nenhum lead encontrado.</p>
        </div>
      ) : (
        <div className="glass rounded-xl overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-4 sm:px-6 py-4 text-white/40 text-xs uppercase tracking-widest font-medium">Nome</th>
                <th className="text-left px-4 py-4 text-white/40 text-xs uppercase tracking-widest font-medium">Telefone</th>
                <th className="text-left px-4 py-4 text-white/40 text-xs uppercase tracking-widest font-medium hidden sm:table-cell">Veículo</th>
                <th className="text-left px-4 py-4 text-white/40 text-xs uppercase tracking-widest font-medium">Origem</th>
                <th className="text-left px-4 py-4 text-white/40 text-xs uppercase tracking-widest font-medium hidden lg:table-cell">Detalhes</th>
                <th className="text-left px-4 py-4 text-white/40 text-xs uppercase tracking-widest font-medium hidden md:table-cell">Data</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(lead => (
                <tr key={`${lead.origem}-${lead.id}`} className="border-b border-white/5 last:border-0">
                  <td className="px-4 sm:px-6 py-4">
                    <p className="text-white text-sm font-medium">{lead.name}</p>
                    {lead.email && <p className="text-white/30 text-xs">{lead.email}</p>}
                  </td>
                  <td className="px-4 py-4 text-white/60 text-sm whitespace-nowrap">{lead.phone}</td>
                  <td className="px-4 py-4 text-white/60 text-sm hidden sm:table-cell">
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
                  <td className="px-4 py-4 text-white/30 text-xs hidden md:table-cell whitespace-nowrap">
                    {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                    <span className="block text-white/20">{new Date(lead.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
