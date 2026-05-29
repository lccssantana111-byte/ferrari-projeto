'use client'

import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { MapPin, Clock, Phone, Mail, Instagram, ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import { getWhatsAppLink } from '@/lib/constants'

const EASE = [0.16, 1, 0.3, 1] as const

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
}

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

export default function LocationSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-60px' })

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const yLogo = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <section
      id="contato"
      ref={sectionRef}
      className="relative"
      style={{ background: '#111111' }}
    >
      <div className="pt-10" />

      {/* Mobile: mapa em cima, painel embaixo / Desktop: lado a lado */}
      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_480px] xl:grid-cols-[1fr_520px]">

        {/* Mapa */}
        <motion.div
          className="relative overflow-hidden order-first"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1.1, ease: EASE }}
          style={{ minHeight: 'clamp(240px, 55vw, 720px)' }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.098388483584!2d-46.6567!3d-23.5630!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c7b89e5e05%3A0x5e4b5e6e5e6e5e6e!2sAv.%20Paulista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr"
            width="100%"
            height="100%"
            className="absolute inset-0 border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Localização Ferrari"
            aria-label="Mapa da Ferrari na Av. Paulista, São Paulo"
          />
          <div className="absolute inset-0 pointer-events-none" style={{
            boxShadow: 'inset 4px 0 24px rgba(17,17,17,0.5), inset -4px 0 24px rgba(17,17,17,0.1), inset 0 0 40px rgba(17,17,17,0.2)'
          }} />

          {/* Badge coordenadas */}
          <motion.div
            className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-2"
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8, ease: EASE }}
            style={{ background: 'rgba(17,17,17,0.82)', backdropFilter: 'blur(12px)', border: '1px solid rgba(220,20,60,0.3)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse" style={{ background: '#DC143C' }} />
            <span style={{ fontSize: '9px', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>
              -23.5630, -46.6567
            </span>
          </motion.div>
        </motion.div>

        {/* Painel de contato */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="relative flex flex-col justify-between px-5 sm:px-10 xl:px-12 py-10 sm:py-14 overflow-hidden order-last"
          style={{ background: '#161616', borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          {/* Logo opaco de fundo */}
          <motion.div
            className="absolute inset-0 pointer-events-none select-none"
            aria-hidden
            style={{ y: yLogo }}
          >
            <Image
              src="/ferrari-logo-transparent.png"
              alt=""
              fill
              sizes="520px"
              className="object-contain object-center"
              style={{ opacity: 0.04, mixBlendMode: 'screen' }}
              priority={false}
            />
          </motion.div>

          <div className="relative z-10 flex flex-col h-full gap-0">

            {/* Heading */}
            <motion.div variants={itemVariants} className="mb-8 sm:mb-10">
              <div className="flex items-center gap-3 mb-4 sm:mb-5">
                <span className="h-px w-6" style={{ background: '#DC143C' }} />
                <span style={{ fontSize: '9px', letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
                  Localização
                </span>
              </div>
              <h2
                className="font-black"
                style={{ fontSize: 'clamp(1.8rem, 5vw, 3.2rem)', lineHeight: 1.0, letterSpacing: '-0.03em', color: '#fff' }}
              >
                Onde nos
                <br />
                <span style={{ color: '#DC143C', opacity: 0.7 }}>
                  Encontrar
                </span>
              </h2>
            </motion.div>

            {/* Linhas de info */}
            <div className="flex flex-col flex-1">
              {[
                {
                  icon: <MapPin size={13} strokeWidth={1.8} />,
                  label: 'Endereço',
                  content: <><span style={{ color: '#fff', fontWeight: 600 }}>Av. Paulista, 1000</span><br /><span style={{ color: 'rgba(255,255,255,0.38)' }}>Bela Vista · São Paulo — SP</span></>,
                },
                {
                  icon: <Clock size={13} strokeWidth={1.8} />,
                  label: 'Horários',
                  content: (
                    <div className="flex flex-col gap-0.5 mt-0.5">
                      {[['Seg – Sex', '09h – 19h'], ['Sábado', '09h – 16h'], ['Domingo', 'Fechado']].map(([d, h]) => (
                        <div key={d} className="flex justify-between gap-8">
                          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>{d}</span>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: h === 'Fechado' ? 'rgba(255,255,255,0.18)' : '#fff' }}>{h}</span>
                        </div>
                      ))}
                    </div>
                  ),
                },
                {
                  icon: <Phone size={13} strokeWidth={1.8} />,
                  label: 'Telefone',
                  content: (
                    <a href="tel:+551130000000"
                      style={{ color: '#fff', fontWeight: 600, fontSize: '14px', transition: 'color 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#DC143C')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#fff')}>
                      +55 (11) 3000-0000
                    </a>
                  ),
                },
                {
                  icon: <Mail size={13} strokeWidth={1.8} />,
                  label: 'E-mail',
                  content: (
                    <a href="mailto:contato@ferrarim.com.br"
                      style={{ color: '#fff', fontWeight: 500, fontSize: '13px', transition: 'color 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#DC143C')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#fff')}>
                      contato@ferrarim.com.br
                    </a>
                  ),
                },
              ].map(({ icon, label, content }, i, arr) => (
                <motion.div
                  key={label}
                  variants={itemVariants}
                  className="flex gap-4 py-4 sm:py-5"
                  style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}
                >
                  <span className="flex-shrink-0 mt-0.5" style={{ color: '#DC143C' }}>{icon}</span>
                  <div className="flex flex-col gap-1">
                    <span style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)' }}>
                      {label}
                    </span>
                    <div style={{ fontSize: '14px', lineHeight: 1.5 }}>{content}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTAs */}
            <motion.div variants={itemVariants} className="flex flex-col gap-2 sm:gap-3 mt-8 sm:mt-10">
              <a
                href={getWhatsAppLink('Olá! Gostaria de visitar a Ferrari. Poderia me fornecer mais informações?')}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 min-h-[44px] py-3 sm:py-4 transition-all duration-300"
                style={{ background: '#DC143C', color: '#fff', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.24em' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#A50E2D')}
                onMouseLeave={e => (e.currentTarget.style.background = '#DC143C')}
              >
                <WhatsAppIcon />
                Falar no WhatsApp
              </a>

              <a
                href="https://maps.google.com/?q=Av.+Paulista+1000+São+Paulo"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 min-h-[44px] py-3 sm:py-4 transition-all duration-300"
                style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.45)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.24em', background: 'transparent' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#DC143C'; e.currentTarget.style.color = '#DC143C' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)' }}
              >
                Abrir no Maps
                <ArrowUpRight size={12} strokeWidth={2} />
              </a>

              <div className="flex items-center gap-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <a href="#" aria-label="Instagram da Ferrari"
                  style={{ color: 'rgba(255,255,255,0.2)', transition: 'color 0.25s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.2)')}>
                  <Instagram size={14} strokeWidth={1.5} />
                </a>
                <div style={{ width: '1px', height: '10px', background: 'rgba(255,255,255,0.08)' }} />
                <span style={{ fontSize: '9px', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase' }}>
                  @ferrarim.oficial
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
