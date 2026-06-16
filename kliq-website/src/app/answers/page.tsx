import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import type { Metadata } from 'next'

import { LADDER_STAGES, LADDER_LABELS, LADDER_BLURBS } from '../../lib/ladder'

// The /answers index. Links to the four Growth Ladder hubs and the most recent
// answers. Public and indexable. See brief ANSWER-001 Section 8.

export const metadata: Metadata = {
  title: 'KLIQ Answers',
  description:
    'Answers for coaches building a business, grounded in real KLIQ platform data.',
  alternates: { canonical: '/answers' },
}

async function getRecentByStage() {
  const payload = await getPayload({ config })
  const byStage = await Promise.all(
    LADDER_STAGES.map(async (stage) => {
      const { docs } = await payload.find({
        collection: 'answers',
        limit: 6,
        sort: '-updatedAt',
        where: { ladderStage: { equals: stage }, _status: { equals: 'published' } },
      })
      return { stage, docs }
    }),
  )
  return byStage
}

export default async function AnswersIndexPage() {
  const byStage = await getRecentByStage()

  return (
    <main>
      <h1>KLIQ Answers</h1>
      <p>Answers for coaches building a business, grounded in real KLIQ platform data.</p>

      {byStage.map(({ stage, docs }) => (
        <section key={stage} aria-labelledby={`stage-${stage}`}>
          <h2 id={`stage-${stage}`}>
            <Link href={`/answers/${stage}`}>{LADDER_LABELS[stage]}</Link>
          </h2>
          <p>{LADDER_BLURBS[stage]}</p>
          <ul>
            {docs.map((a) => (
              <li key={a.id as string}>
                <Link href={`/answers/${a.slug}`}>{a.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  )
}
