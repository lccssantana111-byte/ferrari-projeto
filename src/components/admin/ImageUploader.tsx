'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface ImageUploaderProps {
  images: string[]
  onChange: (images: string[]) => void
  carId?: string
}

export default function ImageUploader({ images, onChange, carId }: ImageUploaderProps) {
  const [uploading, setUploading] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(files: FileList) {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
    const maxSize = 10 * 1024 * 1024

    const valid = Array.from(files).filter((f) => {
      if (!validTypes.includes(f.type)) {
        setError(`${f.name}: tipo inválido`)
        return false
      }
      if (f.size > maxSize) {
        setError(`${f.name}: máximo 10MB`)
        return false
      }
      return true
    })

    if (!valid.length) return

    setError(null)
    const supabase = createClient()

    const newUrls: string[] = []
    for (const file of valid) {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
      const fileId = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
      const folder = carId ?? 'temp'
      const path = `${folder}/${fileId}`

      setUploading((prev) => [...prev, fileId])

      const { error: uploadError } = await supabase.storage
        .from('car-images')
        .upload(path, file, { upsert: false })

      if (uploadError) {
        setError(`Erro ao fazer upload: ${uploadError.message}`)
        setUploading((prev) => prev.filter((id) => id !== fileId))
        continue
      }

      const { data } = supabase.storage.from('car-images').getPublicUrl(path)
      newUrls.push(data.publicUrl)
      setUploading((prev) => prev.filter((id) => id !== fileId))
    }

    onChange([...images, ...newUrls])
  }

  function removeImage(url: string) {
    onChange(images.filter((img) => img !== url))
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files)
  }

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer hover:border-ferrari-red/40 transition-colors"
      >
        <Upload size={24} className="mx-auto mb-3 text-white/30" />
        <p className="text-white/50 text-sm">Arraste imagens ou clique para selecionar</p>
        <p className="text-white/25 text-xs mt-1">JPG, PNG, WebP — máx. 10MB por arquivo</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {error && (
        <p className="text-ferrari-red text-xs">{error}</p>
      )}

      {uploading.length > 0 && (
        <div className="flex items-center gap-2 text-white/50 text-sm">
          <Loader2 size={16} className="animate-spin" />
          Enviando {uploading.length} arquivo(s)...
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((url, i) => (
            <div key={url} className="relative aspect-square rounded-lg overflow-hidden group">
              <Image
                src={url}
                alt={`Imagem ${i + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute top-1 right-1 bg-carbon/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-ferrari-red"
              >
                <X size={12} />
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 bg-ferrari-red text-white text-xs px-2 py-0.5 rounded">
                  Capa
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
