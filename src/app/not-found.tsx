import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: '#0A0A0A' }}
    >
      <div className="flex items-center gap-3 mb-10">
        <span className="h-px w-8" style={{ background: '#DC143C' }} />
        <span style={{ fontSize: '9px', letterSpacing: '0.4em', color: '#DC143C', textTransform: 'uppercase', fontWeight: 600 }}>
          Erro 404
        </span>
      </div>

      <h1
        className="font-black text-white text-center tracking-[-0.04em] mb-4"
        style={{ fontSize: 'clamp(4rem, 12vw, 8rem)', lineHeight: 0.9 }}
      >
        Página
        <br />
        <span style={{ color: '#DC143C' }}>não encontrada.</span>
      </h1>

      <p
        className="text-center mb-12 max-w-sm"
        style={{ fontSize: '15px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.7 }}
      >
        A página que você procura não existe ou foi removida.
      </p>

      <Link
        href="/"
        className="group flex items-center gap-3 text-white font-bold uppercase transition-opacity hover:opacity-80"
        style={{
          background: '#DC143C',
          fontSize: '10px',
          letterSpacing: '0.22em',
          padding: '16px 32px',
        }}
      >
        Voltar ao início
        <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-200" />
      </Link>
    </div>
  )
}
