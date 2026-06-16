# Content, approved answer markdown

The Answer Writer writes finished answers here, one file per answer, named by
slug: `<slug>.md`. The Publisher reads from here and creates the Payload draft via
kliq-cms. Nothing in this folder is live until a human publishes it in Payload
`/admin`.

## File format

Each answer is markdown with YAML frontmatter mirroring the Payload `answers`
collection fields, so the Publisher can map them straight onto a draft.

```yaml
---
title: Why members go quiet after joining a community
slug: why-members-go-quiet-after-joining
question: Why do members go quiet after joining a community?
intent: understand the activation cliff and what to do about it
ladderStage: grow            # launch | grow | monetise | scale
citedCanonIds:               # the grounding trace, every outcome claim
  - eda-post-once
  - week1-content-engagement
relatedQuestions:            # slugs of related answers
  - how-do-i-price-my-coaching
cta:
  heading: Start your community on KLIQ
  href: /signup
seo:
  metaTitle: Why members go quiet after joining (and how to fix it)
  metaDescription: 44% of members post once and never return. Here is what the data says and what to do in Week 1.
---

The answer body in markdown. Lead with the answer, cite the canon facts, close
with what to do.
```

## Rules

- The Answer Writer owns this folder. The Publisher reads it but does not edit
  bodies.
- Every number in the body must have a matching id in `citedCanonIds`, and every
  id must exist in `canon/`. The Fact-Checker enforces this.
- Slugs are unique and clean. Check for duplicates before writing.
