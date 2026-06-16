# kliq-website artifacts (drop-in reference)

These are the live-page pieces of the KLIQ Answer Engine. They belong in the
**kliq-website** repo (Next.js App Router + Payload), not in answer-engine. They
ship here as ready-to-drop-in reference files so the website engineer (Janak,
Phase 3) can copy them in and wire them up.

Source: brief ANSWER-001 v1.1, Section 8 and Appendices B, C, D.

## Files

```
src/collections/Answers.ts        the answers collection, drafts + publish gating (Appendix B)
src/hooks/revalidateAnswer.ts     on-publish ISR revalidation + embedding upsert (Appendix C)
src/lib/ladder.ts                 the Growth Ladder stages, shared constant
src/lib/answersSchema.ts          FAQPage / Article JSON-LD builders
src/app/answers/page.tsx          /answers index, links to the four stage hubs
src/app/answers/[slug]/page.tsx   answer page + hub page (see routing note) + JSON-LD
src/app/sitemap.ts                auto sitemap: /answers, stage hubs, every answer
```

## Routing note (important)

The brief wants `/answers/<stage>` (a hub per Growth Ladder stage) and
`/answers/<slug>` (an answer) at the same path level, and the revalidate hook
touches both. Next.js App Router cannot have two sibling dynamic segments
(`[stage]` and `[slug]`) at the same level. The solution here: one
`app/answers/[slug]/page.tsx` route that branches. If the slug is one of the four
reserved ladder stages it renders the hub, otherwise it renders the answer.
Answer slugs must therefore never equal a stage name. `generateStaticParams`
emits both stage slugs and answer slugs.

## Assumptions to confirm

- Payload runs inside the Next app, so pages use the Local API (`getPayload`).
  If Payload and Next are separate hosts, the revalidate hook must call a Next
  revalidate API route instead of `revalidatePath` directly (noted in the hook).
- `body` is Lexical richText. Rendering uses `@payloadcms/richtext-lexical/react`.
  The Publisher converts the markdown in `content/` to richText on draft creation.
- `NEXT_PUBLIC_SITE_URL` is set to `https://joinkliq.io` for absolute URLs in the
  sitemap and JSON-LD.
- `upsertEmbedding` (pgvector dedupe sync) is a project function; the hook calls
  it on publish. Stubbed import here.
