export type CarStatus = 'active' | 'sold' | 'reserved'

export interface CarSpec {
  engine?: string
  horsepower?: number
  torque?: string
  transmission?: string
  drivetrain?: string
  acceleration?: string
  top_speed?: string
  weight?: string
  fuel_economy?: string
  [key: string]: string | number | undefined
}

export interface ColorOption {
  name: string
  hex: string
}

export interface Car {
  id: string
  name: string
  slug: string
  description: string | null
  short_tagline: string | null
  price: number
  images: string[]
  video_url: string | null
  model_url: string | null
  specs: CarSpec
  featured: boolean
  year: number | null
  mileage: number | null
  color_options: ColorOption[]
  status: CarStatus
  created_at: string
  updated_at: string
}

export interface TestDriveRequest {
  id: string
  car_id: string | null
  name: string
  phone: string
  email: string | null
  message: string | null
  created_at: string
}

export type LeadOrigem = 'Visita' | 'Financiamento'

export interface UnifiedLead {
  id: string
  car_id: string | null
  name: string
  phone: string
  email: string | null
  created_at: string
  origem: LeadOrigem
  cars: { id: string; name: string } | null
  entrada_pct?: number
  prazo?: number
  parcela_estimada?: number
  message?: string | null
}
