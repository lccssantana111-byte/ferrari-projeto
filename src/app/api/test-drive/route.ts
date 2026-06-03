import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { testDriveSchema } from '@/lib/validators'
import { rateLimit } from '@/lib/rateLimit'

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: 'Muitas tentativas. Tente novamente em 15 minutos.' }, { status: 429 })
  }

  const body = await request.json()
  const parsed = testDriveSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const supabase = await createClient()
  const { error } = await supabase.from('test_drive_requests').insert([parsed.data])

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true }, { status: 201 })
}
