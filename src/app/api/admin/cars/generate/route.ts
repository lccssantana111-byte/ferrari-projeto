import { NextResponse } from 'next/server'
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
    `Gere conteúdo de marketing para o seguinte veículo:`,
    ``,
    `Modelo: ${name}${year ? ` (${year})` : ''}`,
    short_tagline ? `Tagline atual: ${short_tagline}` : '',
    specsLines ? `\nEspecificações:\n${specsLines}` : '',
    ``,
    `Responda APENAS com um JSON válido, sem markdown, sem explicações, neste formato exato:`,
    `{`,
    `  "short_tagline": "frase curta de impacto, máximo 8 palavras",`,
    `  "description": "2 a 3 parágrafos elegantes em português do Brasil, tom sofisticado e apaixonado, sem bullet points, máximo 220 palavras"`,
    `}`,
  ].filter(Boolean).join('\n')

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 600,
      temperature: 0.75,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    return NextResponse.json({ error: `Groq error: ${err}` }, { status: 500 })
  }

  const json = await res.json()
  const raw = json.choices?.[0]?.message?.content?.trim() ?? ''

  let description = ''
  let generatedTagline = ''
  try {
    const parsed = JSON.parse(raw)
    description = parsed.description?.trim() ?? ''
    generatedTagline = parsed.short_tagline?.trim() ?? ''
  } catch {
    // fallback: se o modelo não retornou JSON válido, usa o texto como descrição
    description = raw
  }

  return NextResponse.json({ description, short_tagline: generatedTagline })
}
