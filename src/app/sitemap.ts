import type { MetadataRoute } from 'next'
import { getAllCarSlugs } from '@/lib/queries/cars'
import { SITE_URL } from '@/lib/constants'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let slugs: { slug: string }[] = []
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try { slugs = await getAllCarSlugs() } catch { /* no-op */ }
  }

  const carPages = slugs.map((s) => ({
    url: `${SITE_URL}/carros/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/colecao`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/financiamento`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    ...carPages,
  ]
}
