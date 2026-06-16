import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook } from 'payload'

// import { upsertEmbedding } from '../lib/embeddings' // pgvector dedupe sync

// Fires Next.js on-demand revalidation when an answer becomes (or stays)
// published, for the answer path, its stage hub, and the sitemap. With drafts
// enabled the previousDoc comparison is fiddly, so compare updatedAt rather than
// _status alone. The same hook keeps the pgvector embedding in sync so the next
// dedupe check sees the new answer. See brief ANSWER-001 Appendix C.

export const revalidateAnswer: CollectionAfterChangeHook = ({ doc, previousDoc, req }) => {
  const published = doc._status === 'published'
  const changed = doc.updatedAt !== previousDoc?.updatedAt

  if (published && changed) {
    revalidatePath(`/answers/${doc.slug}`)
    revalidatePath(`/answers/${doc.ladderStage}`) // the stage hub
    revalidatePath('/answers') // the index
    revalidatePath('/sitemap.xml')

    // Keep pgvector dedupe in sync. Run async, do not block the response.
    // void upsertEmbedding(doc).catch((err) =>
    //   req.payload.logger.error({ err }, 'answer embedding upsert failed'),
    // )
  }

  return doc
}

// If Payload and Next run on separate hosts, revalidatePath cannot reach the Next
// cache from the Payload process. In that case call a Next revalidate API route
// from this hook instead, for example:
//
//   await fetch(`${process.env.NEXT_REVALIDATE_URL}`, {
//     method: 'POST',
//     headers: { 'content-type': 'application/json', 'x-revalidate-secret': process.env.REVALIDATE_SECRET! },
//     body: JSON.stringify({ paths: [`/answers/${doc.slug}`, `/answers/${doc.ladderStage}`, '/answers', '/sitemap.xml'] }),
//   })
