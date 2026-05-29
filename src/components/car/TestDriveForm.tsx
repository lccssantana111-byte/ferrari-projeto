'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MessageCircle, CheckCircle } from 'lucide-react'
import { testDriveSchema, type TestDriveFormData } from '@/lib/validators'
import { getWhatsAppLink } from '@/lib/constants'

interface TestDriveFormProps {
  carId?: string
  carName?: string
}

export default function TestDriveForm({ carId, carName }: TestDriveFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<TestDriveFormData>({
    resolver: zodResolver(testDriveSchema),
    defaultValues: { car_id: carId },
  })

  async function onSubmit(data: TestDriveFormData) {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/test-drive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error('Erro ao enviar')

      setSubmitted(true)

      const msg = carName
        ? `Olá! Gostaria de agendar uma visita para conhecer o ${carName}.`
        : 'Olá! Gostaria de agendar uma visita.'
      setTimeout(() => { window.open(getWhatsAppLink(msg), '_blank') }, 800)
    } catch {
      setError('Erro ao enviar solicitação. Tente novamente.')
      setLoading(false)
    }
  }

  const inputClass = 'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-ferrari-red transition-colors text-sm'

  if (submitted) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <CheckCircle size={40} className="text-green-400 mx-auto mb-4" />
        <h3 className="text-white font-semibold text-lg mb-2">Solicitação enviada!</h3>
        <p className="text-white/50 text-sm">Redirecionando para o WhatsApp...</p>
      </div>
    )
  }

  return (
    <div className="glass rounded-2xl p-6 sm:p-8">
      <h3 className="text-white font-bold text-xl mb-2">Agendar Visita</h3>
      <p className="text-white/40 text-sm mb-6">Preencha seus dados e entraremos em contato.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" {...register('car_id')} />

        <div className="space-y-1">
          <input {...register('name')} className={inputClass} placeholder="Seu nome completo" />
          {errors.name && <p className="text-ferrari-red text-xs">{errors.name.message}</p>}
        </div>

        <div className="space-y-1">
          <input {...register('phone')} className={inputClass} placeholder="WhatsApp (11) 99999-9999" type="tel" />
          {errors.phone && <p className="text-ferrari-red text-xs">{errors.phone.message}</p>}
        </div>

        <div className="space-y-1">
          <input {...register('email')} className={inputClass} placeholder="Email (opcional)" type="email" />
          {errors.email && <p className="text-ferrari-red text-xs">{errors.email.message}</p>}
        </div>

        <textarea {...register('message')} className={inputClass} rows={3} placeholder="Mensagem (opcional)" />

        {error && <p className="text-ferrari-red text-xs">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full ferrari-gradient text-white font-semibold py-4 rounded-xl tracking-widest uppercase text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <MessageCircle size={16} />
          {loading ? 'Enviando...' : 'Solicitar Visita'}
        </button>
      </form>
    </div>
  )
}
