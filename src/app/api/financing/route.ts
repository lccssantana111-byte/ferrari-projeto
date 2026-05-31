import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { financingLeadSchema } from '@/lib/validators'

export async function POST(request: Request) {
  const body = await request.json()
  const parsed = financingLeadSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const supabase = await createClient()
  const { error } = await supabase.from('financing_leads').insert([parsed.data])

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true }, { status: 201 })
}
