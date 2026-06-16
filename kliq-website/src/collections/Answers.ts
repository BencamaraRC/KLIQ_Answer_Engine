import type { CollectionConfig } from 'payload'

import { revalidateAnswer } from '../hooks/revalidateAnswer'
import { LADDER_STAGES } from '../lib/ladder'

// The answers collection is the source of truth for published pages. Drafts and
// versions give the native publish workflow, and publishing is gated to editors
// by access control. That gate is checkpoint 3, enforced structurally rather than
// by a prompt. The draft-only factory user can create and edit drafts but cannot
// publish. See brief ANSWER-001 Section 8 and Appendix B.

export const Answers: CollectionConfig = {
  slug: 'answers',
  versions: { drafts: true }, // draft -> published is the checkpoint
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'ladderStage', '_status', 'updatedAt'],
    group: 'Answer Engine',
  },
  access: {
    create: ({ req }) => Boolean(req.user), // factory user can create drafts
    update: ({ req }) => Boolean(req.user),
    read: ({ req }) => {
      // published answers are public; authenticated users also see drafts
      if (req.user) return true
      return { _status: { equals: 'published' } }
    },
  },
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        // only editors may publish; the draft-only factory user cannot
        if (data?._status === 'published' && req.user?.role !== 'editor') {
          throw new Error('Only editors can publish answers')
        }
        return data
      },
    ],
    afterChange: [revalidateAnswer],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'question', type: 'text', required: true },
    { name: 'intent', type: 'text' },
    {
      name: 'ladderStage',
      type: 'select',
      required: true,
      index: true,
      options: LADDER_STAGES.map((s) => ({ label: s, value: s })),
    },
    { name: 'body', type: 'richText', required: true },
    {
      name: 'citedCanonIds',
      type: 'text',
      hasMany: true,
      admin: { description: 'The grounding trace. Each id must be a verified canon entry.' },
    },
    {
      name: 'relatedQuestions',
      type: 'relationship',
      relationTo: 'answers',
      hasMany: true,
    },
    {
      name: 'cta',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'href', type: 'text' },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'metaTitle', type: 'text' },
        { name: 'metaDescription', type: 'textarea' },
      ],
    },
  ],
}
