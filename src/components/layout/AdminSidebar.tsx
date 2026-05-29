'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Car, ClipboardList, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn, } from '@/lib/utils'
import { BRAND_NAME } from '@/lib/constants'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Veículos', href: '/admin/carros', icon: Car },
  { label: 'Test Drives', href: '/admin/test-drives', icon: ClipboardList },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="w-64 min-h-screen bg-graphite-dark border-r border-white/5 flex flex-col">
      <div className="p-6 border-b border-white/5">
        <Link href="/" className="text-ferrari-red font-bold text-xl tracking-widest">
          {BRAND_NAME.toUpperCase()}
        </Link>
        <p className="text-white/30 text-xs mt-1 tracking-widest uppercase">Admin</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all',
                active
                  ? 'bg-ferrari-red/10 text-ferrari-red border border-ferrari-red/20'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all w-full"
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </aside>
  )
}
