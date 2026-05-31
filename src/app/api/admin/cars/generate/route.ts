import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

const SPEC_LABELS: Record<string, string> = {
  engine: 'Motor',
  horsepower: 'Potência',
  torque: 'Torque',
  transmission: 'Câmbio',
  drivetrain: 'Tração',
  acceleration: '0–100 km/h',
  top_speed: 'Velocidade máxima',
  weight: 'Peso',
  fuel_economy: 'Consumo',
}

export async function POST(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { data: profile } = await supabase.from('admin_profiles').select('id').eq('id', user.id).single()
  if (!profile) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const body = await request.json()
  const { name, year, short_tagline, specs } = body as {
    name: string
    year?: number | null
    short_tagline?: string
    specs?: Record<string, string | number>
  }

  if (!name?.trim()) {
    return NextResponse.json({ error: 'Nome do veículo é obrigatório' }, { status: 400 })
  }

  const specsLines = Object.entries(specs ?? {})
    .filter(([, v]) => v !== null && v !== undefined && v !== '')
    .map(([k, v]) => `- ${SPEC_LABELS[k] ?? k}: ${v}`)
    .join('\n')

  const prompt = [
    `Você é um redator premium de uma concessionária de carros de luxo no Brasil.`,
    `Escreva uma descrição de produto para o seguinte veículo:`,
    ``,
    `Modelo: ${name}${year ? ` (${year})` : ''}`,
    short_tagline ? `Tagline: ${short_tagline}` : '',
    specsLines ? `\nEspecificações:\n${specsLines}` : '',
    ``,
    `Escreva 2 a 3 parágrafos elegantes, em português do Brasil, com tom sofisticado e apaixonado.`,
    `Sem bullet points. Destaque a experiência de dirigir, o design e a herança da marca.`,
    `Máximo 220 palavras. Retorne apenas o texto, sem títulos ou formatação extra.`,
  ].filter(Boolean).join('\n')

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const message = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 512,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content
    .filter((b) => b.type === 'text')
    .map((b) => (b as { type: 'text'; text: string }).text)
    .join('')
    .trim()

  return NextResponse.json({ description: text })
}
