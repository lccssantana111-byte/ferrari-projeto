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
    { label: 'Em Destaque', value: featuredCars, icon: Star, color: 'text-yellow-400', href: '/admin/carros' },
    { label: 'Total de Leads', value: totalLeads, icon: Users, color: 'text-green-400', href: '/admin/leads' },
    { label: 'Conversões', value: totalLeads > 0 ? `${totalLeads}` : '—', icon: TrendingUp, color: 'text-ferrari-red', href: '/admin/leads' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-white/40 text-sm mt-1">Visão geral da concessionária</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="glass rounded-xl p-6 block transition-all duration-200 hover:border-white/15 hover:bg-white/[0.07] group"
            >
              <div className="flex items-center justify-between mb-4">
                <Icon size={20} className={stat.color} />
              </div>
              <p className="text-3xl font-bold text-white group-hover:text-white transition-colors">{stat.value}</p>
              <p className="text-white/40 text-sm mt-1 group-hover:text-white/60 transition-colors">{stat.label}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
