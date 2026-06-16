import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { RichText } from '@payloadcms/richtext-lexical/react'

import { LADDER_STAGES, LADDER_LABELS, LADDER_BLURBS, isLadderStage } from '../../../lib/ladder'
import { buildFaqPageLd } from '../../../lib/answersSchema'

// One route serves two things at /answers/<x>: if <x> is a Growth Ladder stage it
// is the stage hub, otherwise it is an answer. Next.js cannot have sibling
// [stage] and [slug] segments, so we branch here. Answer slugs must never equal a
// stage name (enforced at authoring time). See brief ANSWER-001 Appendix D.

type Params = Promise<{ slug: string }>

async function getAnswer(slug: string) {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'answers',
    limit: 1,
    depth: 1, // populate relatedQuestions
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
  })
  return docs[0] ?? null
}

async function getStageAnswers(stage: string) {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'answers',
    limit: 200,
    sort: '-updatedAt',
    where: { ladderStage: { equals: stage }, _status: { equals: 'published' } },
  })
  return docs
}

export async function generateStaticParams() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'answers',
    limit: 1000,
    where: { _status: { equals: 'published' } },
  })
  // stage hubs + every answer
  return [
    ...LADDER_STAGES.map((slug) => ({ slug })),
    ...docs.map((d) => ({ slug: d.slug as string })),
  ]
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params

  if (isLadderStage(slug)) {
    return {
      title: `${LADDER_LABELS[slug]} answers | KLIQ`,
      description: LADDER_BLURBS[slug],
      alternates: { canonical: `/answers/${slug}` },
    }
  }

  const a = await getAnswer(slug)
  if (!a) return {}
  return {
    title: a.seo?.metaTitle ?? a.title,
    description: a.seo?.metaDescription,
    alternates: { canonical: `/answers/${slug}` },
  }
}

export default async function AnswersSlugPage({ params }: { params: Params }) {
  const { slug } = await params

  // --- stage hub --------------------------------------------------------------
  if (isLadderStage(slug)) {
    const answers = await getStageAnswers(slug)
    return (
      <main>
        <nav>
          <Link href="/answers">All answers</Link>
        </nav>
        <h1>{LADDER_LABELS[slug]}</h1>
        <p>{LADDER_BLURBS[slug]}</p>
        <ul>
          {answers.map((a) => (
            <li key={a.id as string}>
              <Link href={`/answers/${a.slug}`}>{a.title}</Link>
            </li>
          ))}
        </ul>
      </main>
    )
  }

  // --- answer page ------------------------------------------------------------
  const a = await getAnswer(slug)
  if (!a) notFound()

  const faq = buildFaqPageLd(a as any)
  const related = (Array.isArray(a.relatedQuestions) ? a.relatedQuestions : []).filter(
    (r): r is { slug: string; title: string } => typeof r === 'object' && r !== null,
  )

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />

      <nav>
        <Link href="/answers">Answers</Link>
        {' / '}
        <Link href={`/answers/${a.ladderStage}`}>{LADDER_LABELS[a.ladderStage as never]}</Link>
      </nav>

      <h1>{a.title}</h1>

      {/* body is Lexical richText; the Publisher converts content/ markdown to it */}
      <RichText data={a.body as any} />

      {related.length > 0 && (
        <section aria-labelledby="related-questions">
          <h2 id="related-questions">Related questions</h2>
          <ul>
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={`/answers/${r.slug}`}>{r.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {a.cta?.heading && a.cta?.href && (
        <aside>
          <a href={a.cta.href}>{a.cta.heading}</a>
        </aside>
      )}
    </article>
  )
}
