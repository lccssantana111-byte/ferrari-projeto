import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/layout/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) redirect('/admin/login')

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  const { data: profile } = await supabase
    .from('admin_profiles')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/admin/login')

  return (
    <div className="flex min-h-screen bg-carbon">
      <AdminSidebar />
      <main className="flex-1 overflow-auto pt-14 lg:pt-0 p-5 sm:p-8 min-w-0">
        {children}
      </main>
    </div>
  )
}
