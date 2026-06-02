'use client'

import { useMemo, useState } from 'react'
import { Search, Download, X } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { UnifiedLead, Car } from '@/types'

const ORIGEM_COLORS = {
  Visita: 'text-green-400 bg-green-400/[0.08] border-green-400/15',
  Financiamento: 'text-ferrari-red bg-ferrari-red/[0.08] border-ferrari-red/15',
}

function inputClass() {
  return 'bg-white/[0.03] border border-white/[0.08] text-white text-sm placeholder:text-white/20 px-3 py-2.5 rounded-lg outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all duration-200'
}

function selectClass() {
  return inputClass() + ' appearance-none cursor-pointer'
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
      if (dateFrom && new Date(l.created_at) < new Date(dateFrom + 'T00:00:00')) return false
      if (dateTo && new Date(l.created_at) > new Date(dateTo + 'T23:59:59.999')) return false
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
          <p className="text-white/25 text-[10px] uppercase tracking-[0.3em] mb-2">Gestão</p>
          <h1 className="text-2xl font-bold text-white tracking-tight">Leads</h1>
          <p className="text-white/35 text-sm mt-1">{leads.length} lead{leads.length !== 1 ? 's' : ''} no total</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium tracking-wide uppercase transition-all duration-200 bg-white/[0.04] border border-white/[0.08] text-white/50 hover:bg-white/[0.07] hover:text-white/90 hover:border-white/15"
        >
          <Download size={13} />
          Exportar CSV
        </button>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total de leads', value: leads.length, accent: 'border-white/[0.08]', valueColor: 'text-white' },
          { label: 'Visitas agendadas', value: visitas, accent: 'border-green-400/15', valueColor: 'text-green-400' },
          { label: 'Simulações financ.', value: financiamentos, accent: 'border-ferrari-red/15', valueColor: 'text-ferrari-red' },
          { label: 'Últimos 7 dias', value: now7, accent: 'border-blue-400/15', valueColor: 'text-blue-400' },
        ].map(m => (
          <div key={m.label} className={`glass rounded-xl p-5 border ${m.accent}`}>
            <p className={`text-2xl font-bold tabular-nums ${m.valueColor}`}>{m.value}</p>
            <p className="text-white/30 text-xs mt-1.5 uppercase tracking-wider">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="glass rounded-xl p-4 mb-4 border border-white/[0.06]">
        <div className="flex flex-col gap-2.5">
          {/* Busca */}
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar por nome ou telefone..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={inputClass() + ' pl-9 w-full'}
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Origem */}
            <select
              value={origem}
              onChange={e => setOrigem(e.target.value as typeof origem)}
              className={selectClass() + ' w-full'}
            >
              <option value="Todos">Todas origens</option>
              <option value="Visita">Visita</option>
              <option value="Financiamento">Financiamento</option>
            </select>

            {/* Veículo */}
            <select
              value={carId}
              onChange={e => setCarId(e.target.value)}
              className={selectClass() + ' w-full'}
            >
              <option value="">Todos os veículos</option>
              {cars.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Data */}
          <div className="grid grid-cols-2 gap-2.5">
            <input
              type="date"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              className={inputClass() + ' w-full date-input'}
              title="De"
            />
            <input
              type="date"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              className={inputClass() + ' w-full date-input'}
              title="Até"
            />
          </div>

          {/* Rodapé dos filtros */}
          <div className="flex items-center justify-between pt-0.5">
            {filtered.length !== leads.length ? (
              <p className="text-white/25 text-xs">{filtered.length} resultado{filtered.length !== 1 ? 's' : ''}</p>
            ) : <span />}
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/35 border border-white/[0.07] hover:text-white/70 hover:border-white/15 transition-all duration-200"
              >
                <X size={11} />
                Limpar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lista */}
      {filtered.length === 0 ? (
        <div className="glass rounded-xl p-16 text-center border border-white/[0.06]">
          <p className="text-white/20 text-sm">Nenhum lead encontrado.</p>
        </div>
      ) : (
        <>
          {/* Mobile: cards */}
          <div className="flex flex-col gap-2.5 sm:hidden">
            {filtered.map(lead => (
              <div key={`${lead.origem}-${lead.id}`} className="glass rounded-xl p-4 flex flex-col gap-3 border border-white/[0.06]">
                {/* Topo: nome + badge */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-white font-semibold text-sm leading-snug">{lead.name}</p>
                    {lead.email && <p className="text-white/30 text-xs mt-0.5">{lead.email}</p>}
                  </div>
                  <span className={`text-[11px] px-2.5 py-1 rounded-full border flex-shrink-0 tracking-wide ${ORIGEM_COLORS[lead.origem]}`}>
                    {lead.origem}
                  </span>
                </div>

                {/* Separador */}
                <div className="h-px bg-white/[0.05]" />

                {/* Telefone */}
                <a
                  href={`tel:${lead.phone}`}
                  className="text-white/60 text-sm font-mono hover:text-white transition-colors"
                >
                  {lead.phone}
                </a>

                {/* Veículo */}
                {lead.cars?.name && (
                  <div className="flex items-center gap-2">
                    <span className="text-white/20 text-[10px] uppercase tracking-[0.15em]">Veículo</span>
                    <span className="text-white/55 text-xs">{lead.cars.name}</span>
                  </div>
                )}

                {/* Detalhes financiamento */}
                {lead.origem === 'Financiamento' && lead.parcela_estimada && (
                  <div className="rounded-lg p-3" style={{ background: 'rgba(220,20,60,0.05)', border: '1px solid rgba(220,20,60,0.12)' }}>
                    <p className="text-white/30 text-[10px] uppercase tracking-[0.15em] mb-2.5">Simulação</p>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-white/25 text-[10px] mb-1">Entrada</p>
                        <p className="text-white text-xs font-semibold">{lead.entrada_pct}%</p>
                      </div>
                      <div>
                        <p className="text-white/25 text-[10px] mb-1">Prazo</p>
                        <p className="text-white text-xs font-semibold">{lead.prazo}x</p>
                      </div>
                      <div>
                        <p className="text-white/25 text-[10px] mb-1">Parcela</p>
                        <p className="text-ferrari-red text-xs font-bold">{formatPrice(lead.parcela_estimada)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Mensagem visita */}
                {lead.origem === 'Visita' && lead.message && (
                  <p className="text-white/30 text-xs leading-relaxed">{lead.message}</p>
                )}

                {/* Data */}
                <p className="text-white/18 text-[11px]">
                  {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                  <span className="text-white/15 ml-1.5">
                    {new Date(lead.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </p>
              </div>
            ))}
          </div>

          {/* Desktop: tabela */}
          <div className="hidden sm:block glass rounded-xl overflow-x-auto border border-white/[0.06]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left px-6 py-4 text-white/25 text-[10px] uppercase tracking-[0.2em] font-medium">Nome</th>
                  <th className="text-left px-4 py-4 text-white/25 text-[10px] uppercase tracking-[0.2em] font-medium">Telefone</th>
                  <th className="text-left px-4 py-4 text-white/25 text-[10px] uppercase tracking-[0.2em] font-medium">Veículo</th>
                  <th className="text-left px-4 py-4 text-white/25 text-[10px] uppercase tracking-[0.2em] font-medium">Origem</th>
                  <th className="text-left px-4 py-4 text-white/25 text-[10px] uppercase tracking-[0.2em] font-medium hidden lg:table-cell">Detalhes</th>
                  <th className="text-left px-4 py-4 text-white/25 text-[10px] uppercase tracking-[0.2em] font-medium">Data</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(lead => (
                  <tr key={`${lead.origem}-${lead.id}`} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors duration-150 group">
                    <td className="px-6 py-4">
                      <p className="text-white text-sm font-medium group-hover:text-white transition-colors">{lead.name}</p>
                      {lead.email && <p className="text-white/25 text-xs mt-0.5">{lead.email}</p>}
                    </td>
                    <td className="px-4 py-4">
                      <a href={`tel:${lead.phone}`} className="text-white/50 text-sm font-mono hover:text-white/80 transition-colors whitespace-nowrap">{lead.phone}</a>
                    </td>
                    <td className="px-4 py-4 text-white/45 text-sm">
                      {lead.cars?.name ?? <span className="text-white/15">—</span>}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-[11px] px-2.5 py-1 rounded-full border tracking-wide ${ORIGEM_COLORS[lead.origem]}`}>
                        {lead.origem}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-white/35 text-xs hidden lg:table-cell">
                      {lead.origem === 'Financiamento' && lead.parcela_estimada ? (
                        <span>Entrada {lead.entrada_pct}% · {lead.prazo}x de <span className="text-ferrari-red font-semibold">{formatPrice(lead.parcela_estimada)}</span></span>
                      ) : lead.message ? (
                        <span className="truncate max-w-[200px] block text-white/30">{lead.message}</span>
                      ) : (
                        <span className="text-white/15">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <p className="text-white/35 text-xs">{new Date(lead.created_at).toLocaleDateString('pt-BR')}</p>
                      <p className="text-white/18 text-[11px] mt-0.5">{new Date(lead.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
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
