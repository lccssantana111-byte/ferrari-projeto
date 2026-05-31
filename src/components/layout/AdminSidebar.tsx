'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Car, ClipboardList, DollarSign, LogOut, Menu, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { BRAND_NAME } from '@/lib/constants'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Veículos', href: '/admin/carros', icon: Car },
  { label: 'Test Drives', href: '/admin/test-drives', icon: ClipboardList },
  { label: 'Financiamentos', href: '/admin/financiamento', icon: DollarSign },
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
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all min-h-[44px]',
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
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all w-full min-h-[44px]"
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 h-14 bg-[#111] border-b border-white/5">
        <Link href="/admin" className="text-ferrari-red font-bold text-lg tracking-widest">
          {BRAND_NAME.toUpperCase()}
          <span className="text-white/30 text-xs ml-2 tracking-widest uppercase font-normal">Admin</span>
        </Link>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center justify-center w-11 h-11 text-white/60 hover:text-white transition-colors"
          aria-label="Abrir menu"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={cn(
          'lg:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-[#111] border-r border-white/5 flex flex-col transition-transform duration-300',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between px-6 h-14 border-b border-white/5 flex-shrink-0">
          <Link href="/admin" className="text-ferrari-red font-bold text-lg tracking-widest">
            {BRAND_NAME.toUpperCase()}
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="flex items-center justify-center w-11 h-11 text-white/40 hover:text-white transition-colors"
            aria-label="Fechar menu"
          >
            <X size={20} />
          </button>
        </div>
        <NavContent />
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 min-h-screen bg-[#111] border-r border-white/5 flex-col flex-shrink-0">
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="text-ferrari-red font-bold text-xl tracking-widest">
            {BRAND_NAME.toUpperCase()}
          </Link>
          <p className="text-white/30 text-xs mt-1 tracking-widest uppercase">Admin</p>
        </div>
        <NavContent />
      </aside>
    </>
  )
}
