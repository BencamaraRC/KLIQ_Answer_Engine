# CTAs by Growth Ladder stage

The default call to action for an answer, tuned to the stage the question maps to.
The Answer Brief Writer picks the CTA from here; the Answer Writer drops it into
the answer frontmatter (`cta.heading`, `cta.href`). One CTA per answer.

> Status: headings are usable now; `href` targets are placeholders until the
> product surfaces are confirmed in `canon/brand/tiers-products.md`. Do not ship a
> CTA pointing at a `TBC` href.

| Stage | Default heading | href | Why |
| --- | --- | --- | --- |
| **launch** | Start your community on KLIQ | `/signup` | The reader has no community yet. Get them to create one. |
| **grow** | See what keeps members active | TBC (content library / engagement surface) | The reader has members and an activation problem. Point at the tools that drive Week 1 engagement. |
| **monetise** | Set up paid tiers on KLIQ | TBC (memberships / payments surface) | The reader is ready to charge. Point at pricing and payments. |
| **scale** | Grow with KLIQ | TBC (higher-tier / scale surface) | The reader has durable revenue. Point at the surfaces that support scale. |

## Rules

- One CTA per answer, matched to the question's stage.
- Lead the answer with value, not the CTA. The CTA closes, it does not open.
- Voice rules apply to the heading: no em dashes, no filler, concrete verb first.
- If the right href is still `TBC`, flag it as a gap at the brief stage rather than
  shipping a broken or generic link.

## How it connects

Internal links and the CTA are how an answer pulls a coach toward the platform
that produced the data. The CTA target should be the product surface most relevant
to the stage, defined in `canon/brand/tiers-products.md`.
