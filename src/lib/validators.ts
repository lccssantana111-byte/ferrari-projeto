import { z } from 'zod'

export const carFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  slug: z.string().min(1, 'Slug é obrigatório').regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),
  description: z.string().optional(),
  short_tagline: z.string().optional(),
  price: z.coerce.number().min(1, 'Preço é obrigatório'),
  year: z.coerce.number().min(1900).max(new Date().getFullYear() + 1).optional().nullable(),
  status: z.enum(['active', 'sold', 'reserved']),
  featured: z.boolean(),
  video_url: z.string().url('URL inválida').optional().or(z.literal('')),
  model_url: z.string().optional(),
  images: z.array(z.string()),
  specs: z.record(z.string(), z.union([z.string(), z.number()])).optional(),
  color_options: z.array(
    z.object({
      name: z.string(),
      hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida'),
    })
  ).optional(),
})

export type CarFormData = z.infer<typeof carFormSchema>

export const testDriveSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  phone: z.string().min(10, 'Telefone inválido').max(15, 'Telefone inválido'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  message: z.string().max(500).optional(),
  car_id: z.string().uuid().optional(),
})

export type TestDriveFormData = z.infer<typeof testDriveSchema>

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

export type LoginFormData = z.infer<typeof loginSchema>
