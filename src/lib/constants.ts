export const BRAND_NAME = 'Ferrari'

export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''

export function getWhatsAppLink(message: string = 'Olá, tenho interesse em um veículo.'): string {
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`
}

export const FERRARI_RED = '#DC143C'
export const CARBON = '#0A0A0A'
export const GRAPHITE = '#2A2A2A'

export const NAV_LINKS = [
  { label: 'Coleção', href: '/#colecao' },
  { label: 'Financiamento', href: '/financiamento' },
  { label: 'Contato', href: '/#contato' },
]

export const REVALIDATE_INTERVAL = 3600
