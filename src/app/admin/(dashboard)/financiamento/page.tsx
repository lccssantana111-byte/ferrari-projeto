import { getFinancingLeads } from '@/lib/queries/admin'
import { formatPrice } from '@/lib/utils'

interface LeadRow {
  id: string
  name: string
  phone: string
  email: string | null
  entrada_pct: number
  prazo: number
  parcela_estimada: number
  created_at: string
  cars: { name: string; slug: string } | null
}

export default async function FinanciamentoPage() {
  const leads = await getFinancingLeads()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Leads de Financiamento</h1>
        <p className="text-white/40 text-sm mt-1">{leads.length} simulação(ões)</p>
      </div>

      {leads.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <p className="text-white/30">Nenhuma simulação ainda.</p>
        </div>
      ) : (
        <div className="glass rounded-xl overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-4 sm:px-6 py-4 text-white/40 text-xs uppercase tracking-widest font-medium">Nome</th>
                <th className="text-left px-4 py-4 text-white/40 text-xs uppercase tracking-widest font-medium">Telefone</th>
                <th className="text-left px-4 py-4 text-white/40 text-xs uppercase tracking-widest font-medium hidden sm:table-cell">Veículo</th>
                <th className="text-left px-4 py-4 text-white/40 text-xs uppercase tracking-widest font-medium hidden md:table-cell">Entrada</th>
                <th className="text-left px-4 py-4 text-white/40 text-xs uppercase tracking-widest font-medium hidden md:table-cell">Prazo</th>
                <th className="text-left px-4 py-4 text-white/40 text-xs uppercase tracking-widest font-medium hidden lg:table-cell">Parcela est.</th>
                <th className="text-left px-4 py-4 text-white/40 text-xs uppercase tracking-widest font-medium hidden lg:table-cell">Data</th>
              </tr>
            </thead>
            <tbody>
              {(leads as LeadRow[]).map((lead) => (
                <tr key={lead.id} className="border-b border-white/5 last:border-0">
                  <td className="px-4 sm:px-6 py-4">
                    <p className="text-white text-sm font-medium">{lead.name}</p>
                    {lead.email && <p className="text-white/30 text-xs">{lead.email}</p>}
                  </td>
                  <td className="px-4 py-4 text-white/60 text-sm whitespace-nowrap">{lead.phone}</td>
                  <td className="px-4 py-4 text-white/60 text-sm hidden sm:table-cell">{lead.cars?.name ?? '—'}</td>
                  <td className="px-4 py-4 text-white/60 text-sm hidden md:table-cell">{lead.entrada_pct}%</td>
                  <td className="px-4 py-4 text-white/60 text-sm hidden md:table-cell">{lead.prazo}x</td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <span className="text-ferrari-red font-semibold text-sm">{formatPrice(lead.parcela_estimada)}/mês</span>
                  </td>
                  <td className="px-4 py-4 text-white/30 text-xs hidden lg:table-cell">
                    {new Date(lead.created_at).toLocaleDateString('pt-BR')}
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
