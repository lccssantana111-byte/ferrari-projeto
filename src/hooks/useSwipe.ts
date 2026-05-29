'use client'

import { useEffect, useRef } from 'react'

export function useSwipe<T extends HTMLElement>(
  onNext: () => void,
  onPrev: () => void,
  threshold = 40,
) {
  const ref = useRef<T>(null)
  const startX = useRef<number | null>(null)
  const startY = useRef<number | null>(null)
  const onNextRef = useRef(onNext)
  const onPrevRef = useRef(onPrev)

  useEffect(() => { onNextRef.current = onNext }, [onNext])
  useEffect(() => { onPrevRef.current = onPrev }, [onPrev])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    function handleStart(e: TouchEvent) {
      startX.current = e.touches[0].clientX
      startY.current = e.touches[0].clientY
    }

    function handleEnd(e: TouchEvent) {
      if (startX.current === null || startY.current === null) return
      const dx = startX.current - e.changedTouches[0].clientX
      const dy = startY.current - e.changedTouches[0].clientY
      if (Math.abs(dx) > threshold && Math.abs(dx) > Math.abs(dy)) {
        dx > 0 ? onNextRef.current() : onPrevRef.current()
      }
      startX.current = null
      startY.current = null
    }

    el.addEventListener('touchstart', handleStart, { passive: true })
    el.addEventListener('touchend', handleEnd, { passive: true })
    return () => {
      el.removeEventListener('touchstart', handleStart)
      el.removeEventListener('touchend', handleEnd)
    }
  }, [threshold])

  return ref
}
