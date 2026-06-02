import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getLeadsStats } from '@/lib/queries/admin'
import { Car, Star, Users, TrendingUp } from 'lucide-react'

async function getStats() {
  const supabase = await createClient()
  const [{ count: totalCars }, { count: featuredCars }, leads] = await Promise.all([
    supabase.from('cars').select('*', { count: 'exact', head: true }),
    supabase.from('cars').select('*', { count: 'exact', head: true }).eq('featured', true),
    getLeadsStats(),
  ])
  return {
    totalCars: totalCars ?? 0,
    featuredCars: featuredCars ?? 0,
    totalLeads: leads.total,
  }
}

export default async function AdminDashboard() {
  const { totalCars, featuredCars, totalLeads } = await getStats()

  const stats = [
    { label: 'Total de Veículos', value: totalCars, icon: Car, color: 'text-blue-400', href: '/admin/carros' },
    { label: 'Em Destaque', value: featuredCars, icon: Star, color: 'text-yellow-400', href: '/admin/carros?featured=true' },
    { label: 'Total de Leads', value: totalLeads, icon: Users, color: 'text-green-400', href: '/admin/leads' },
    { label: 'Conversões', value: totalLeads > 0 ? `${totalLeads}` : '—', icon: TrendingUp, color: 'text-ferrari-red', href: '/admin/leads' },
  ]

  return (
    <div>
      <div className="mb-8">
        <p className="text-white/25 text-[10px] uppercase tracking-[0.3em] mb-2">Painel de controle</p>
        <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-white/35 text-sm mt-1">Visão geral da concessionária</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="relative glass rounded-xl p-6 block transition-all duration-300 hover:border-white/12 hover:bg-white/[0.06] group overflow-hidden"
            >
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
              <div className="flex items-start justify-between mb-5">
                <div className={`p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] transition-colors duration-300 group-hover:border-white/10`}>
                  <Icon size={16} className={stat.color} />
                </div>
              </div>
              <p className="text-3xl font-bold text-white tabular-nums">{stat.value}</p>
              <p className="text-white/35 text-xs mt-2 uppercase tracking-wider group-hover:text-white/50 transition-colors duration-300">{stat.label}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
