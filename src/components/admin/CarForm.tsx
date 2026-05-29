'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2 } from 'lucide-react'
import { carFormSchema, type CarFormData } from '@/lib/validators'
import { generateSlug } from '@/lib/utils'
import ImageUploader from './ImageUploader'
import type { Car } from '@/types'

interface CarFormProps {
  car?: Car
}

const SPEC_KEYS = ['engine', 'horsepower', 'torque', 'transmission', 'drivetrain', 'acceleration', 'top_speed', 'weight', 'fuel_economy']
const SPEC_LABELS: Record<string, string> = {
  engine: 'Motor', horsepower: 'Potência (cv)', torque: 'Torque', transmission: 'Câmbio',
  drivetrain: 'Tração', acceleration: '0-100 km/h', top_speed: 'Vel. Máxima', weight: 'Peso', fuel_economy: 'Consumo',
}

export default function CarForm({ car }: CarFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const defaultSpecs = SPEC_KEYS.reduce((acc, key) => {
    acc[key] = (car?.specs as Record<string, string | number>)?.[key] ?? ''
    return acc
  }, {} as Record<string, string | number>)

  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm<CarFormData>({
    resolver: zodResolver(carFormSchema),
    defaultValues: {
      name: car?.name ?? '',
      slug: car?.slug ?? '',
      description: car?.description ?? '',
      short_tagline: car?.short_tagline ?? '',
      price: car?.price ?? 0,
      year: car?.year ?? null,
      status: car?.status ?? 'active',
      featured: car?.featured ?? false,
      video_url: car?.video_url ?? '',
      model_url: car?.model_url ?? '',
      images: car?.images ?? [],
      specs: defaultSpecs,
      color_options: car?.color_options ?? [],
    },
  })

  const { fields: colorFields, append: addColor, remove: removeColor } = useFieldArray({
    control,
    name: 'color_options',
  })

  const nameValue = watch('name')
  function handleNameBlur() {
    if (!car && nameValue) {
      setValue('slug', generateSlug(nameValue))
    }
  }

  async function onSubmit(data: CarFormData) {
    setLoading(true)
    setServerError(null)

    try {
      const url = car ? `/api/admin/cars/${car.id}` : '/api/admin/cars'
      const method = car ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error ?? 'Erro desconhecido')
      }

      router.push('/admin/carros')
      router.refresh()
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Erro ao salvar')
      setLoading(false)
    }
  }

  const inputClass = 'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-ferrari-red transition-colors text-sm'
  const labelClass = 'text-white/60 text-xs uppercase tracking-widest'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Info */}
      <div className="glass rounded-xl p-6 space-y-5">
        <h2 className="text-white font-semibold">Informações Básicas</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className={labelClass}>Nome *</label>
            <input {...register('name')} onBlur={handleNameBlur} className={inputClass} placeholder="Ferrari 488 GTB" />
            {errors.name && <p className="text-ferrari-red text-xs">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label className={labelClass}>Slug *</label>
            <input {...register('slug')} className={inputClass} placeholder="ferrari-488-gtb" />
            {errors.slug && <p className="text-ferrari-red text-xs">{errors.slug.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className={labelClass}>Tagline</label>
          <input {...register('short_tagline')} className={inputClass} placeholder="O futuro do desempenho" />
        </div>

        <div className="space-y-2">
          <label className={labelClass}>Descrição</label>
          <textarea {...register('description')} rows={4} className={inputClass} placeholder="Descreva o veículo..." />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="space-y-2">
            <label className={labelClass}>Preço (R$) *</label>
            <input {...register('price')} type="number" className={inputClass} placeholder="1500000" />
            {errors.price && <p className="text-ferrari-red text-xs">{errors.price.message}</p>}
          </div>

          <div className="space-y-2">
            <label className={labelClass}>Ano</label>
            <input {...register('year')} type="number" className={inputClass} placeholder="2024" />
          </div>

          <div className="space-y-2">
            <label className={labelClass}>Status</label>
            <select {...register('status')} className={inputClass}>
              <option value="active">Disponível</option>
              <option value="reserved">Reservado</option>
              <option value="sold">Vendido</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input type="checkbox" {...register('featured')} id="featured" className="w-4 h-4 accent-ferrari-red" />
          <label htmlFor="featured" className="text-white/70 text-sm cursor-pointer">Destacar na homepage</label>
        </div>
      </div>

      {/* Images */}
      <div className="glass rounded-xl p-6 space-y-4">
        <h2 className="text-white font-semibold">Fotos</h2>
        <ImageUploader
          images={watch('images')}
          onChange={(urls) => setValue('images', urls)}
          carId={car?.id}
        />
      </div>

      {/* Specs */}
      <div className="glass rounded-xl p-6 space-y-5">
        <h2 className="text-white font-semibold">Especificações</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SPEC_KEYS.map((key) => (
            <div key={key} className="space-y-2">
              <label className={labelClass}>{SPEC_LABELS[key]}</label>
              <input
                {...register(`specs.${key}`)}
                className={inputClass}
                placeholder={key === 'horsepower' ? '710' : '—'}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Color Options */}
      <div className="glass rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-semibold">Opções de Cor</h2>
          <button
            type="button"
            onClick={() => addColor({ name: '', hex: '#DC143C' })}
            className="flex items-center gap-2 text-ferrari-red text-sm hover:opacity-80 transition-opacity"
          >
            <Plus size={16} /> Adicionar
          </button>
        </div>
        <div className="space-y-3">
          {colorFields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-3">
              <input
                {...register(`color_options.${index}.hex`)}
                type="color"
                className="h-10 w-14 rounded cursor-pointer border-0 bg-transparent"
              />
              <input
                {...register(`color_options.${index}.name`)}
                className={`${inputClass} flex-1`}
                placeholder="Rosso Corsa"
              />
              <button type="button" onClick={() => removeColor(index)} className="text-white/30 hover:text-ferrari-red transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Media */}
      <div className="glass rounded-xl p-6 space-y-5">
        <h2 className="text-white font-semibold">Mídia</h2>
        <div className="space-y-2">
          <label className={labelClass}>URL do Vídeo</label>
          <input {...register('video_url')} className={inputClass} placeholder="https://youtube.com/..." />
          {errors.video_url && <p className="text-ferrari-red text-xs">{errors.video_url.message}</p>}
        </div>
      </div>

      {serverError && (
        <div className="bg-ferrari-red/10 border border-ferrari-red/30 rounded-lg px-4 py-3 text-ferrari-red text-sm">
          {serverError}
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="ferrari-gradient text-white font-semibold px-8 py-3 rounded-lg tracking-widest uppercase text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? 'Salvando...' : (car ? 'Salvar Alterações' : 'Criar Veículo')}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="border border-white/10 text-white/60 hover:text-white px-8 py-3 rounded-lg text-sm transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
