'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Car, Users, LogOut, Menu, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { BRAND_NAME } from '@/lib/constants'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Veículos', href: '/admin/carros', icon: Car },
  { label: 'Leads', href: '/admin/leads', icon: Users },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const NavContent = () => (
    <>
      <nav className="flex-1 p-4 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                'relative flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 min-h-[44px] group',
                active
                  ? 'bg-ferrari-red/[0.08] text-ferrari-red border border-ferrari-red/15'
                  : 'text-white/40 hover:text-white hover:bg-white/[0.04] border border-transparent'
              )}
            >
              {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-ferrari-red rounded-full" />}
              <Icon size={16} className={active ? 'text-ferrari-red' : 'text-white/30 group-hover:text-white/70 transition-colors'} />
              <span className="tracking-wide">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-white/[0.06]">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white/30 hover:text-white/70 hover:bg-white/[0.04] transition-all duration-200 w-full min-h-[44px] group"
        >
          <LogOut size={16} className="group-hover:text-white/50 transition-colors" />
          <span className="tracking-wide">Sair</span>
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 h-14 bg-[#0f0f0f]/95 backdrop-blur-xl border-b border-white/[0.06]">
        <Link href="/admin" className="flex items-baseline gap-2">
          <span className="text-ferrari-red font-bold text-base tracking-[0.2em] uppercase">{BRAND_NAME}</span>
          <span className="text-white/25 text-[10px] tracking-[0.3em] uppercase font-normal">Admin</span>
        </Link>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center justify-center w-10 h-10 text-white/50 hover:text-white transition-colors duration-200"
          aria-label="Abrir menu"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={cn(
          'lg:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-[#0f0f0f] border-r border-white/[0.06] flex flex-col transition-transform duration-300',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="relative flex items-center justify-between px-6 h-14 border-b border-white/[0.06] flex-shrink-0">
          <div className="absolute top-0 left-0 right-0 h-px bg-ferrari-red/60" />
          <Link href="/admin" className="text-ferrari-red font-bold text-base tracking-[0.2em] uppercase">
            {BRAND_NAME}
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="flex items-center justify-center w-10 h-10 text-white/35 hover:text-white transition-colors duration-200"
            aria-label="Fechar menu"
          >
            <X size={18} />
          </button>
        </div>
        <NavContent />
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 min-h-screen bg-[#0f0f0f] border-r border-white/[0.06] flex-col flex-shrink-0">
        <div className="relative p-6 border-b border-white/[0.06]">
          <div className="absolute top-0 left-0 right-0 h-px bg-ferrari-red/60" />
          <Link href="/admin">
            <span className="text-ferrari-red font-bold text-lg tracking-[0.2em] uppercase block">{BRAND_NAME}</span>
          </Link>
          <p className="text-white/25 text-[10px] mt-1 tracking-[0.3em] uppercase">Admin Panel</p>
        </div>
        <NavContent />
      </aside>
    </>
  )
}
