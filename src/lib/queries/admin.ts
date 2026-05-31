import { createClient } from '@/lib/supabase/server'
import type { Car, UnifiedLead } from '@/types'
import type { CarFormData } from '@/lib/validators'

export async function getAllCarsAdmin(): Promise<Car[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getCarById(id: string): Promise<Car | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

export async function createCar(formData: CarFormData): Promise<Car> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('cars')
    .insert([formData])
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function updateCar(id: string, formData: Partial<CarFormData>): Promise<Car> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('cars')
    .update(formData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function deleteCar(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from('cars').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function toggleFeatured(id: string, featured: boolean): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from('cars').update({ featured }).eq('id', id)
  if (error) throw new Error(error.message)
}

export async function getTestDriveRequests() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('test_drive_requests')
    .select('*, cars(name, slug)')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getFinancingLeads() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('financing_leads')
    .select('*, cars(name, slug)')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getAllLeads(): Promise<UnifiedLead[]> {
  const supabase = await createClient()
  const [{ data: td }, { data: fl }] = await Promise.all([
    supabase.from('test_drive_requests').select('*, cars(id, name)').order('created_at', { ascending: false }),
    supabase.from('financing_leads').select('*, cars(id, name)').order('created_at', { ascending: false }),
  ])
  const visits = (td ?? []).map(r => ({ ...r, origem: 'Visita' as const }))
  const financing = (fl ?? []).map(r => ({ ...r, origem: 'Financiamento' as const }))
  return [...visits, ...financing].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}

export async function getLeadsStats() {
  const supabase = await createClient()
  const [{ count: visits }, { count: financing }] = await Promise.all([
    supabase.from('test_drive_requests').select('*', { count: 'exact', head: true }),
    supabase.from('financing_leads').select('*', { count: 'exact', head: true }),
  ])
  return {
    visits: visits ?? 0,
    financing: financing ?? 0,
    total: (visits ?? 0) + (financing ?? 0),
  }
}
