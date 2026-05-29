'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'

export default function Preloader() {
  const leftRef    = useRef<HTMLDivElement>(null)
  const rightRef   = useRef<HTMLDivElement>(null)
  const logoRef    = useRef<HTMLDivElement>(null)
  const wrapRef    = useRef<HTMLDivElement>(null)
  const needleRef  = useRef<SVGGElement>(null)
  const arcRef     = useRef<SVGCircleElement>(null)
  const glowRef    = useRef<SVGCircleElement>(null)
  const labelsRef  = useRef<SVGGElement>(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const left   = leftRef.current
    const right  = rightRef.current
    const logo   = logoRef.current
    const wrap   = wrapRef.current
    const needle = needleRef.current
    const arc    = arcRef.current
    const glow   = glowRef.current
    const labels = labelsRef.current
    if (!left || !right || !logo || !wrap || !needle || !arc || !glow || !labels) return

    document.body.style.overflow = 'hidden'

    // Arco do velocímetro: vai de -220deg a 40deg (260deg de arco total)
    const arcLen = arc.getTotalLength()
    gsap.set(arc,    { strokeDasharray: arcLen, strokeDashoffset: arcLen })
    gsap.set(glow,   { strokeDasharray: arcLen, strokeDashoffset: arcLen })
    gsap.set(wrap,   { opacity: 0 })
    gsap.set(logo,   { opacity: 0, y: 10, scale: 0.85 })
    gsap.set(labels, { opacity: 0 })
    // Agulha — grupo com translate no centro, rotaciona em torno de 0,0
    gsap.set(needle, { rotation: -220, transformOrigin: '0px 0px' })

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = ''
        setVisible(false)
      },
    })

    // Fade in geral
    tl.to(wrap, { opacity: 1, duration: 0.5, ease: 'power2.out' })

    // Logo aparece
    tl.to(logo, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'expo.out' }, '-=0.2')

    // Labels aparecem
    tl.to(labels, { opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.2')

    // Arco vermelho cresce
    tl.to(arc, {
      strokeDashoffset: 0,
      duration: 1.6,
      ease: 'power2.inOut',
    }, '-=0.3')

    // Glow acompanha o arco
    tl.to(glow, {
      strokeDashoffset: 0,
      duration: 1.6,
      ease: 'power2.inOut',
    }, '<')

    // Agulha sobe de -220 até +30 (redline)
    tl.to(needle, {
      rotation: 30,
      duration: 1.5,
      ease: 'power3.inOut',
      transformOrigin: '0px 0px',
    }, '<')

    tl.to(needle, {
      rotation: -10,
      duration: 0.4,
      ease: 'power2.out',
      transformOrigin: '0px 0px',
    })

    // Pausa dramática
    tl.to({}, { duration: 0.3 })

    // Cortinas abrem
    tl.to(left,  { x: '-100%', duration: 0.85, ease: 'expo.inOut' }, '+=0.05')
    tl.to(right, { x: '100%',  duration: 0.85, ease: 'expo.inOut' }, '<')

    return () => {
      tl.kill()
      document.body.style.overflow = ''
    }
  }, [])

  if (!visible) return null

  // Geometria do velocímetro
  const cx = 120
  const cy = 120
  const r  = 88
  // Arco de -220deg a +40deg = 260deg total
  const startAngle = -220
  const endAngle   = 40
  const arcPath    = describeArc(cx, cy, r, startAngle, endAngle)

  // Marcações
  const ticks = generateTicks(cx, cy, r, startAngle, endAngle)

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none" aria-hidden="true">
      <div ref={leftRef}  className="absolute inset-y-0 left-0 w-1/2 bg-carbon" />
      <div ref={rightRef} className="absolute inset-y-0 right-0 w-1/2 bg-carbon" />

      <div ref={wrapRef} className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-0" style={{ opacity: 1 }}>

          {/* SVG velocímetro */}
          <svg
            width="240"
            height="200"
            viewBox="0 0 240 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ overflow: 'visible' }}
          >
            {/* Filtros */}
            <defs>
              <filter id="redglow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="needleglow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="2" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>

            {/* Trilha de fundo do arco */}
            <path
              d={arcPath}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />

            {/* Arco vermelho — glow */}
            <circle
              ref={glowRef}
              cx={cx} cy={cy} r={r}
              stroke="rgba(220,20,60,0.25)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              style={{
                strokeDashoffset: 553,
                filter: 'url(#redglow)',
                transform: `rotate(${startAngle}deg)`,
                transformOrigin: `${cx}px ${cy}px`,
              }}
            />

            {/* Arco vermelho principal */}
            <circle
              ref={arcRef}
              cx={cx} cy={cy} r={r}
              stroke="#DC143C"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              style={{
                transform: `rotate(${startAngle}deg)`,
                transformOrigin: `${cx}px ${cy}px`,
              }}
            />

            {/* Marcações */}
            <g ref={labelsRef}>
              {ticks.map((t, i) => (
                <g key={i}>
                  <line
                    x1={t.x1} y1={t.y1}
                    x2={t.x2} y2={t.y2}
                    stroke={t.major ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.18)'}
                    strokeWidth={t.major ? 1.5 : 1}
                  />
                  {t.label !== undefined && (
                    <text
                      x={t.lx}
                      y={t.ly}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="rgba(255,255,255,0.3)"
                      fontSize="9"
                      fontFamily="var(--font-sans, system-ui)"
                      letterSpacing="0.05em"
                    >
                      {t.label}
                    </text>
                  )}
                </g>
              ))}

              {/* Zona vermelha — últimas marcações */}
              {ticks.filter(t => t.redzone).map((t, i) => (
                <line
                  key={`red-${i}`}
                  x1={t.x1} y1={t.y1}
                  x2={t.x2} y2={t.y2}
                  stroke="rgba(220,20,60,0.7)"
                  strokeWidth={1.5}
                />
              ))}

              {/* Label rpm */}
              <text
                x={cx}
                y={cy + 38}
                textAnchor="middle"
                fill="rgba(255,255,255,0.15)"
                fontSize="7"
                fontFamily="var(--font-sans, system-ui)"
                letterSpacing="0.4em"
              >
                RPM ×1000
              </text>
            </g>

            {/* Agulha — grupo centrado em cx,cy; linha aponta para cima a partir de 0,0 */}
            <g ref={needleRef} transform={`translate(${cx}, ${cy})`}>
              <line
                x1="0" y1="10"
                x2="0" y2={-(r - 12)}
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                style={{ filter: 'url(#needleglow)' }}
              />
            </g>

            {/* Centro — parafuso metálico */}
            <circle cx={cx} cy={cy} r="5" fill="#111" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
            <circle cx={cx} cy={cy} r="2" fill="rgba(255,255,255,0.25)"/>
            <circle cx={cx} cy={cy} r="1" fill="rgba(255,255,255,0.5)"/>
          </svg>

          {/* Logo abaixo */}
          <div ref={logoRef} style={{ marginTop: '-12px' }}>
            <Image
              src="/ferrari-logo-transparent.png"
              alt="Ferrari"
              width={64}
              height={64}
              className="object-contain"
              style={{ mixBlendMode: 'screen' }}
              priority
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// ── helpers ──────────────────────────────────────────────

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function describeArc(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const s   = polarToCartesian(cx, cy, r, startDeg)
  const e   = polarToCartesian(cx, cy, r, endDeg)
  const large = endDeg - startDeg > 180 ? 1 : 0
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`
}

interface Tick {
  x1: number; y1: number
  x2: number; y2: number
  lx: number; ly: number
  major: boolean
  redzone: boolean
  label?: string
}

function generateTicks(cx: number, cy: number, r: number, startDeg: number, endDeg: number): Tick[] {
  const ticks: Tick[] = []
  const totalSteps = 52 // marcações menores totais
  const range      = endDeg - startDeg
  const labels     = ['0','1','2','3','4','5','6','7','8','9']

  for (let i = 0; i <= totalSteps; i++) {
    const angle  = startDeg + (i / totalSteps) * range
    const major  = i % (totalSteps / (labels.length - 1)) === 0
    const redzone = i > totalSteps * 0.82
    const inner  = r - (major ? 10 : 5)
    const outer  = r

    const p1 = polarToCartesian(cx, cy, outer, angle)
    const p2 = polarToCartesian(cx, cy, inner, angle)
    const pl = polarToCartesian(cx, cy, r - 20, angle)

    const labelIdx = Math.round(i / (totalSteps / (labels.length - 1)))

    ticks.push({
      x1: p1.x, y1: p1.y,
      x2: p2.x, y2: p2.y,
      lx: pl.x, ly: pl.y,
      major,
      redzone,
      label: major ? labels[labelIdx] : undefined,
    })
  }
  return ticks
}
