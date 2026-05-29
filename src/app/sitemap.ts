import type { MetadataRoute } from 'next'
import { getAllCarSlugs } from '@/lib/queries/cars'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let slugs: { slug: string }[] = []
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try { slugs = await getAllCarSlugs() } catch { /* no-op */ }
  }

  const carPages = slugs.map((s) => ({
    url: `https://ferrarim.com.br/carros/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    { url: 'https://ferrarim.com.br', lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    ...carPages,
  ]
}
