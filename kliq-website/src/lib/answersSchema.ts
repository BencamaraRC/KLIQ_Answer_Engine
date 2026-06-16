// JSON-LD builders for answer pages. FAQPage or Article on every page so search
// and AI answer engines can parse and cite KLIQ as a primary source. See brief
// ANSWER-001 Section 8 (SEO and AEO requirements).

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://joinkliq.io'

type AnswerLike = {
  title: string
  slug: string
  question: string
  body?: unknown // Lexical richText
  updatedAt?: string
  createdAt?: string
  seo?: { metaTitle?: string; metaDescription?: string }
}

// Walk a Lexical richText value and collect its text. Used to give the JSON-LD a
// real answer body, not just the meta description. Falls back gracefully.
export function lexicalToPlainText(body: unknown): string {
  const parts: string[] = []
  const visit = (node: any) => {
    if (!node || typeof node !== 'object') return
    if (typeof node.text === 'string') parts.push(node.text)
    const children = node.children ?? node.root?.children
    if (Array.isArray(children)) children.forEach(visit)
  }
  visit(body)
  return parts.join(' ').replace(/\s+/g, ' ').trim()
}

export function answerUrl(slug: string): string {
  return `${SITE_URL}/answers/${slug}`
}

// FAQPage: the question + its answer. The Appendix D default. Best for a single
// Q&A page that should be eligible for FAQ rich results and AEO citation.
export function buildFaqPageLd(a: AnswerLike): Record<string, unknown> {
  const answerText =
    lexicalToPlainText(a.body) || a.seo?.metaDescription || a.title
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: a.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: answerText,
          url: answerUrl(a.slug),
        },
      },
    ],
  }
}

// Article: use when the answer reads more like a guide than a single Q&A. KLIQ is
// the author and publisher, which is what earns E-E-A-T and AEO trust.
export function buildArticleLd(a: AnswerLike): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.seo?.metaTitle || a.title,
    description: a.seo?.metaDescription,
    mainEntityOfPage: { '@type': 'WebPage', '@id': answerUrl(a.slug) },
    url: answerUrl(a.slug),
    author: { '@type': 'Organization', name: 'KLIQ', url: SITE_URL },
    publisher: { '@type': 'Organization', name: 'KLIQ', url: SITE_URL },
    datePublished: a.createdAt,
    dateModified: a.updatedAt,
  }
}
