import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { carFormSchema } from '@/lib/validators'

export async function POST(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { data: profile } = await supabase.from('admin_profiles').select('id').eq('id', user.id).single()
  if (!profile) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const body = await request.json()
  const parsed = carFormSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { data, error } = await supabase.from('cars').insert([parsed.data]).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  revalidatePath('/')
  revalidatePath('/colecao')
  revalidatePath('/carros/[slug]', 'page')

  return NextResponse.json(data, { status: 201 })
}
