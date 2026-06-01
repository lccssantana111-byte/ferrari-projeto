'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Youtube } from 'lucide-react'
import { NAV_LINKS, getWhatsAppLink } from '@/lib/constants'

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(to bottom, #141414 0%, #0A0A0A 100%)' }}
    >
      {/* Hairline com acento vermelho central */}
      <div className="relative h-px w-full">
        <div className="absolute inset-0" style={{ background: 'rgba(255,255,255,0.06)' }} />
        <div
          className="absolute left-1/2 -translate-x-1/2 h-px"
          style={{ width: '120px', background: 'linear-gradient(90deg, transparent, #DC143C, transparent)' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-12 sm:pt-16 pb-10 sm:pb-12">

        {/* Logo centralizado */}
        <div className="flex items-center justify-center gap-6 sm:gap-8 mb-10 sm:mb-14">
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08))' }} />
          <Image
            src="/ferrari-logo-transparent.png"
            alt="Ferrari"
            width={90}
            height={90}
            className="object-contain opacity-90 hover:opacity-100 transition-opacity duration-500 sm:w-[120px] sm:h-[120px]"
            style={{ mixBlendMode: 'screen' }}
            priority
          />
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.08), transparent)' }} />
        </div>

        {/* Grid três colunas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8">

          {/* Col 1 — Brand */}
          <div className="flex flex-col items-center sm:items-start gap-5 text-center sm:text-left">
            <p
              className="text-sm"
              style={{ color: 'rgba(255,255,255,0.32)', letterSpacing: '0.02em', maxWidth: '26ch', lineHeight: '1.8' }}
            >
              Excelência em veículos de alta performance. Cada modelo selecionado com rigor, cada detalhe cultivado com paixão.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                aria-label="Instagram"
                className="flex items-center justify-center w-9 h-9"
                style={{ color: 'rgba(255,255,255,0.25)', transition: 'color 0.3s ease' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.25)')}
              >
                <InstagramIcon />
              </a>
              <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.1)' }} />
              <a
                href="#"
                aria-label="YouTube"
                className="flex items-center justify-center w-9 h-9"
                style={{ color: 'rgba(255,255,255,0.25)', transition: 'color 0.3s ease' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.25)')}
              >
                <Youtube size={17} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Separador mobile entre brand e navegação */}
          <div className="block sm:hidden h-px w-full" style={{ background: 'rgba(255,255,255,0.06)' }} />

          {/* Col 2 — Navegação */}
          <div className="flex flex-col items-start">
            <p className="mb-5 sm:mb-7" style={{ fontSize: '9px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>
              Navegação
            </p>
            <ul className="flex flex-col items-start gap-3 sm:gap-4">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm"
                    style={{ color: 'rgba(255,255,255,0.4)', transition: 'color 0.3s ease', letterSpacing: '0.03em' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
                  >
                    <span style={{ display: 'inline-block', width: '14px', height: '1px', background: '#DC143C', flexShrink: 0 }} />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Separador mobile entre navegação e contato */}
          <div className="block sm:hidden h-px w-full" style={{ background: 'rgba(255,255,255,0.06)' }} />

          {/* Col 3 — Contato */}
          <div className="flex flex-col items-start">
            <p className="mb-5 sm:mb-7" style={{ fontSize: '9px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>
              Contato
            </p>
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-sm min-h-[44px]"
              style={{ color: 'rgba(255,255,255,0.4)', transition: 'color 0.3s ease', letterSpacing: '0.03em' }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#fff'
                const icon = e.currentTarget.querySelector('.wa-icon') as HTMLElement
                if (icon) icon.style.color = '#25D366'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.4)'
                const icon = e.currentTarget.querySelector('.wa-icon') as HTMLElement
                if (icon) icon.style.color = 'rgba(255,255,255,0.4)'
              }}
            >
              <span className="wa-icon" style={{ color: 'rgba(255,255,255,0.4)', transition: 'color 0.3s ease' }}>
                <WhatsAppIcon />
              </span>
              Falar no WhatsApp
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-10 sm:mt-14 pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.06em' }}>
            © {new Date().getFullYear()} Ferrari. Todos os direitos reservados.
          </p>
          <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.1)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
            Performance &middot; Luxo &middot; Brasil
          </p>
        </div>
      </div>
    </footer>
  )
}
