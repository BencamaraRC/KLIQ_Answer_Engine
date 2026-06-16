# Canon, the editorial memory of facts

This is the single thing that makes the index defensible. One file per fact.
Markdown with YAML frontmatter, plus a short body for context and caveats.

The Fact-Checker reads these files directly. A coach-outcome stat with no canon
entry cannot ship. A stat past its freshness window fails.

## Entry schema

```yaml
---
id: ret-100gmv                      # stable, kebab-case, referenced by answers
claim: retention at $100 GMV milestone   # what the number measures, plain language
value: 64%                          # the figure exactly as it should be cited
source: platform cohort analysis    # where it came from, named dataset or analysis
source_url:                         # link to the primary source, dashboard, or query
last_updated: 2026-05               # YYYY-MM when the value was last confirmed
freshness_window: 6 months          # how long the value is citable before re-confirm
scope: all coaches                  # the population the number describes
status: verified                    # verified | seed-needs-verification
---

Context, definition of the cohort, and any caveats. If the number is a
point-in-time snapshot, say so and give the snapshot date. Never write
"currently."
```

## Rules

- One fact per file. The filename is `<id>.md`.
- `value` is cited verbatim. If a number is a snapshot, the body states the date.
- `status: seed-needs-verification` means the figure is provisional, taken from a
  secondary source (e.g. the engineering brief) and not yet linked to a primary
  platform query. The Fact-Checker treats these as **not citable in a published
  answer** until `source_url` is filled and `status` flips to `verified`.
- `freshness_window` is enforced. If `last_updated + freshness_window` is in the
  past, the fact fails the grounding check until re-confirmed.
- Brand canon lives in `canon/brand/`. Those files define voice, ICP, and the
  tier/product taxonomy. They are not numeric facts and have no freshness window.

## Seeding

Phase 0 seeds 30 to 50 entries (pricing, tiers, ICP, the data facts), owned by
the platform data team. The facts already present here are the ones named in the
engineering brief Section 9. They carry `status: seed-needs-verification` until
the data team attaches a primary `source_url`.
