// The Coach Growth Ladder. The single source of truth for the four stages, shared
// by the collection, the routes, the hubs, and the sitemap.

export const LADDER_STAGES = ['launch', 'grow', 'monetise', 'scale'] as const

export type LadderStage = (typeof LADDER_STAGES)[number]

export const LADDER_LABELS: Record<LadderStage, string> = {
  launch: 'Launch',
  grow: 'Grow',
  monetise: 'Monetise',
  scale: 'Scale',
}

export const LADDER_BLURBS: Record<LadderStage, string> = {
  launch: 'Getting set up, first members, first content.',
  grow: 'Activation, retention, and community behaviour.',
  monetise: 'Pricing, tiers, first revenue, GMV milestones.',
  scale: 'Systematising, higher tiers, sustained GMV.',
}

export function isLadderStage(value: string): value is LadderStage {
  return (LADDER_STAGES as readonly string[]).includes(value)
}
