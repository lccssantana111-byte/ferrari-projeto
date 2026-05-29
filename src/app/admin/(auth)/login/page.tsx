'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { loginSchema, type LoginFormData } from '@/lib/validators'
import { BRAND_NAME } from '@/lib/constants'

export default function AdminLoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginFormData) {
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (authError) {
      setError('Email ou senha incorretos.')
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-carbon flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <span className="text-ferrari-red text-4xl font-bold tracking-widest">{BRAND_NAME.toUpperCase()}</span>
          <p className="text-white/40 text-sm mt-2 tracking-widest uppercase">Painel Administrativo</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="glass rounded-2xl p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-white/60 text-xs uppercase tracking-widest">Email</label>
            <input
              {...register('email')}
              type="email"
              autoComplete="email"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-ferrari-red transition-colors"
              placeholder="admin@ferrarim.com"
            />
            {errors.email && <p className="text-ferrari-red text-xs">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-white/60 text-xs uppercase tracking-widest">Senha</label>
            <input
              {...register('password')}
              type="password"
              autoComplete="current-password"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-ferrari-red transition-colors"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-ferrari-red text-xs">{errors.password.message}</p>}
          </div>

          {error && (
            <div className="bg-ferrari-red/10 border border-ferrari-red/30 rounded-lg px-4 py-3 text-ferrari-red text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full ferrari-gradient text-white font-semibold py-3 rounded-lg tracking-widest uppercase text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
