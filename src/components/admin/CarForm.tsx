'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2, Upload, Loader2, X, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { carFormSchema, type CarFormData } from '@/lib/validators'
import { generateSlug } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
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
  const [colorUploading, setColorUploading] = useState<Record<number, boolean>>({})
  const [colorUploadError, setColorUploadError] = useState<Record<number, string>>({})
  const [generatingDesc, setGeneratingDesc] = useState(false)
  const [generateError, setGenerateError] = useState<string | null>(null)
  const colorInputRefs = useRef<(HTMLInputElement | null)[]>([])

  const defaultSpecs = SPEC_KEYS.reduce((acc, key) => {
    acc[key] = (car?.specs as Record<string, string | number>)?.[key] ?? ''
    return acc
  }, {} as Record<string, string | number>)

  const { register, handleSubmit, watch, setValue, getValues, control, formState: { errors } } = useForm<CarFormData>({
    resolver: zodResolver(carFormSchema),
    defaultValues: {
      name: car?.name ?? '',
      slug: car?.slug ?? '',
      description: car?.description ?? '',
      short_tagline: car?.short_tagline ?? '',
      price: car?.price ?? 0,
      year: car?.year ?? null,
      mileage: car?.mileage ?? null,
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

  async function generateDescription() {
    setGeneratingDesc(true)
    setGenerateError(null)
    try {
      const { name, year, short_tagline, specs } = getValues()
      if (!name?.trim()) {
        setGenerateError('Preencha o nome do veículo antes de gerar.')
        return
      }
      const res = await fetch('/api/admin/cars/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, year, short_tagline, specs }),
      })
      const json = await res.json()
      if (!res.ok) {
        setGenerateError(json.error ?? 'Erro ao gerar conteúdo.')
        return
      }
      if (json.description) setValue('description', json.description)
      if (json.short_tagline) setValue('short_tagline', json.short_tagline)
    } catch {
      setGenerateError('Erro de conexão. Tente novamente.')
    } finally {
      setGeneratingDesc(false)
    }
  }

  async function handleColorImageUpload(index: number, file: File) {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
    if (!validTypes.includes(file.type)) {
      setColorUploadError((prev) => ({ ...prev, [index]: 'Tipo inválido. Use JPG, PNG ou WebP.' }))
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setColorUploadError((prev) => ({ ...prev, [index]: 'Máximo 10MB.' }))
      return
    }

    setColorUploadError((prev) => ({ ...prev, [index]: '' }))
    setColorUploading((prev) => ({ ...prev, [index]: true }))

    const supabase = createClient()
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const fileId = `color_${index}_${Date.now()}.${ext}`
    const folder = car?.id ?? 'temp'
    const path = `${folder}/${fileId}`

    const { error: uploadError } = await supabase.storage
      .from('car-images')
      .upload(path, file, { upsert: false })

    if (uploadError) {
      setColorUploadError((prev) => ({ ...prev, [index]: `Erro: ${uploadError.message}` }))
      setColorUploading((prev) => ({ ...prev, [index]: false }))
      return
    }

    const { data: urlData } = supabase.storage.from('car-images').getPublicUrl(path)
    setValue(`color_options.${index}.image`, urlData.publicUrl)
    setColorUploading((prev) => ({ ...prev, [index]: false }))
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
          <div className="flex items-center justify-between">
            <label className={labelClass}>Descrição</label>
            <button
              type="button"
              onClick={generateDescription}
              disabled={generatingDesc || !watch('name')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ border: '1px solid rgba(220,20,60,0.35)', color: '#DC143C', background: 'rgba(220,20,60,0.05)' }}
              onMouseEnter={e => { if (!generatingDesc && watch('name')) e.currentTarget.style.background = 'rgba(220,20,60,0.12)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(220,20,60,0.05)' }}
            >
              {generatingDesc
                ? <><Loader2 size={12} className="animate-spin" /> Gerando...</>
                : <><Sparkles size={12} /> Gerar com IA</>
              }
            </button>
          </div>
          <textarea {...register('description')} rows={4} className={inputClass} placeholder="Descreva o veículo..." />
          {generateError && (
            <p className="text-xs" style={{ color: '#DC143C' }}>{generateError}</p>
          )}
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
            <label className={labelClass}>KM Rodados</label>
            <input {...register('mileage')} type="number" className={inputClass} placeholder="15000" />
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
            onClick={() => addColor({ name: '', hex: '#DC143C', image: '' })}
            className="flex items-center gap-2 text-ferrari-red text-sm hover:opacity-80 transition-opacity"
          >
            <Plus size={16} /> Adicionar cor
          </button>
        </div>
        <div className="space-y-4">
          {colorFields.map((field, index) => {
            const currentImage = watch(`color_options.${index}.image`)
            return (
              <div key={field.id} className="border border-white/8 rounded-lg p-4 space-y-3">
                {/* Linha: color picker + nome + remover */}
                <div className="flex items-center gap-3">
                  <input
                    {...register(`color_options.${index}.hex`)}
                    type="color"
                    className="h-10 w-14 rounded cursor-pointer border-0 bg-transparent flex-shrink-0"
                  />
                  <input
                    {...register(`color_options.${index}.name`)}
                    className={`${inputClass} flex-1`}
                    placeholder="Rosso Corsa"
                  />
                  <button
                    type="button"
                    onClick={() => removeColor(index)}
                    className="text-white/30 hover:text-ferrari-red transition-colors flex-shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Upload de foto desta cor */}
                <div className="space-y-2">
                  <p className="text-white/40 text-xs uppercase tracking-widest">Foto nesta cor</p>

                  {currentImage ? (
                    <div className="relative w-full rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                      <Image
                        src={currentImage}
                        alt="Foto da cor"
                        fill
                        sizes="400px"
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setValue(`color_options.${index}.image`, '')}
                        className="absolute top-2 right-2 bg-carbon/80 rounded-full p-1 hover:bg-ferrari-red transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => colorInputRefs.current[index]?.click()}
                      className="border border-dashed border-white/10 rounded-lg p-5 text-center cursor-pointer hover:border-ferrari-red/40 transition-colors"
                    >
                      {colorUploading[index] ? (
                        <div className="flex items-center justify-center gap-2 text-white/40 text-sm">
                          <Loader2 size={16} className="animate-spin" />
                          Enviando...
                        </div>
                      ) : (
                        <>
                          <Upload size={18} className="mx-auto mb-2 text-white/25" />
                          <p className="text-white/35 text-xs">Clique para adicionar a foto desta cor</p>
                        </>
                      )}
                    </div>
                  )}

                  <input
                    ref={(el) => { colorInputRefs.current[index] = el }}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleColorImageUpload(index, file)
                    }}
                  />

                  {colorUploadError[index] && (
                    <p className="text-ferrari-red text-xs">{colorUploadError[index]}</p>
                  )}
                </div>
              </div>
            )
          })}
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

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          disabled={loading}
          className="ferrari-gradient text-white font-semibold px-8 py-3 rounded-lg tracking-widest uppercase text-sm hover:opacity-90 transition-opacity disabled:opacity-50 min-h-[44px]"
        >
          {loading ? 'Salvando...' : (car ? 'Salvar Alterações' : 'Criar Veículo')}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="border border-white/10 text-white/60 hover:text-white px-8 py-3 rounded-lg text-sm transition-colors min-h-[44px]"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
