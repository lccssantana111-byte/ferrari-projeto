'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play } from 'lucide-react'

interface CarVideoProps {
  url: string
}

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
  return match?.[1] ?? null
}

export default function CarVideo({ url }: CarVideoProps) {
  const [playing, setPlaying] = useState(false)
  const ytId = getYouTubeId(url)

  if (!ytId) {
    return (
      <video src={url} controls className="w-full rounded-xl aspect-video bg-graphite" />
    )
  }

  if (!playing) {
    return (
      <div
        className="relative aspect-video rounded-xl overflow-hidden bg-graphite cursor-pointer group"
        onClick={() => setPlaying(true)}
      >
        <Image
          src={`https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`}
          alt="Video thumbnail"
          fill
          sizes="(max-width: 768px) 100vw, 55vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-carbon/40 flex items-center justify-center group-hover:bg-carbon/20 transition-colors">
          <div className="w-16 h-16 rounded-full ferrari-gradient flex items-center justify-center">
            <Play size={24} className="text-white ml-1" fill="white" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="aspect-video rounded-xl overflow-hidden">
      <iframe
        src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  )
}
