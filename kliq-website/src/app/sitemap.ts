import { getPayload } from 'payload'
import config from '@payload-config'
import type { MetadataRoute } from 'next'

import { LADDER_STAGES } from '../lib/ladder'

// Auto sitemap: the /answers index, the four stage hubs, and every published
// answer. Revalidated on publish by the afterChange hook. See brief ANSWER-001
// Section 8. If the site has more routes than answers, merge this into the
// project's root sitemap rather than shipping it standalone.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://joinkliq.io'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'answers',
    limit: 5000,
    where: { _status: { equals: 'published' } },
    select: { slug: true, updatedAt: true } as never,
  })

  const now = new Date()

  return [
    { url: `${SITE_URL}/answers`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    ...LADDER_STAGES.map((stage) => ({
      url: `${SITE_URL}/answers/${stage}`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.6,
    })),
    ...docs.map((d) => ({
      url: `${SITE_URL}/answers/${d.slug}`,
      lastModified: d.updatedAt ? new Date(d.updatedAt as string) : now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ]
}
