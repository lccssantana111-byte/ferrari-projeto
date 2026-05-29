'use client'

import { useEffect, useRef } from 'react'
import type Lenis from 'lenis'

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    let lenis: Lenis

    async function init() {
      const { default: Lenis } = await import('lenis')
      const gsap = (await import('gsap')).default
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
      })

      lenisRef.current = lenis

      lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add((time: number) => { lenis.raf(time * 1000) })
      gsap.ticker.lagSmoothing(0)
    }

    init()

    return () => {
      lenis?.destroy()
      lenisRef.current = null
    }
  }, [])

  return lenisRef
}
