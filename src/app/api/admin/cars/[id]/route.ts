import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { carFormSchema } from '@/lib/validators'

async function authorize() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('admin_profiles').select('id').eq('id', user.id).single()
  if (!profile) return null
  return supabase
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await authorize()
  if (!supabase) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const body = await request.json()
  const parsed = carFormSchema.partial().safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { data, error } = await supabase
    .from('cars')
    .update(parsed.data)
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  revalidatePath('/')
  revalidatePath('/colecao')
  revalidatePath(`/carros/${data.slug}`)

  return NextResponse.json(data)
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await authorize()
  if (!supabase) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { error } = await supabase.from('cars').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  revalidatePath('/')
  revalidatePath('/colecao')
  revalidatePath('/carros/[slug]', 'page')

  return new NextResponse(null, { status: 204 })
}
