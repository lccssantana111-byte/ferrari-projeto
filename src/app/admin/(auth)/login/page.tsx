'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { loginSchema, type LoginFormData } from '@/lib/validators'
import { BRAND_NAME } from '@/lib/constants'

const REMEMBER_KEY = 'admin_remembered_email'

export default function AdminLoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  useEffect(() => {
    const saved = localStorage.getItem(REMEMBER_KEY)
    if (saved) {
      setValue('email', saved)
      setRememberMe(true)
    }
  }, [setValue])

  async function onSubmit(data: LoginFormData) {
    setLoading(true)
    setError(null)

    if (rememberMe) {
      localStorage.setItem(REMEMBER_KEY, data.email)
    } else {
      localStorage.removeItem(REMEMBER_KEY)
    }

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

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
              onClick={() => setRememberMe(v => !v)}
              className={`w-4 h-4 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${
                rememberMe ? 'bg-ferrari-red border-ferrari-red' : 'bg-white/5 border-white/20'
              }`}
            >
              {rememberMe && (
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10">
                  <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span
              onClick={() => setRememberMe(v => !v)}
              className="text-white/50 text-xs uppercase tracking-widest"
            >
              Lembrar email
            </span>
          </label>

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
