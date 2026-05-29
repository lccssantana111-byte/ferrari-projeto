import { createStaticClient } from '@/lib/supabase/static'
import type { Car } from '@/types'

function getClient() {
  return createStaticClient()
}

export async function getAllCars(): Promise<Car[]> {
  const supabase = getClient()
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getFeaturedCars(): Promise<Car[]> {
  const supabase = getClient()
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('featured', true)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(6)

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getCarBySlug(slug: string): Promise<Car | null> {
  const supabase = getClient()
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) return null
  return data
}

export async function getAllCarSlugs(): Promise<{ slug: string }[]> {
  const supabase = getClient()
  const { data, error } = await supabase
    .from('cars')
    .select('slug')
    .eq('status', 'active')

  if (error) return []
  return data ?? []
}
