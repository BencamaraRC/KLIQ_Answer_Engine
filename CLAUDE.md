# KLIQ Answer Engine, Editorial Memory

This file loads every session. It is the canon every agent reads from. If an
answer ships something wrong, do not patch the conversation. Add a rule here and
rerun. The canon compounds, the sessions get better.

## What this workspace is

The authoring tooling for the KLIQ Answer Engine: a public, indexable question
index at `joinkliq.io/answers`. Each entry answers a real coach question, and
every claim about coach outcomes is sourced from KLIQ first-party platform data.

The moat is the grounding, not the writing. A generic Q&A site is commodity. A
Q&A site that cites "coaches who cross $100 GMV retain at 64%" is a primary
source. That single rule governs everything here.

## Repo layout

- `CLAUDE.md` this file, loads every session
- `canon/` sourced data facts, one fact per markdown file
- `canon/brand/` voice, tone, ICP, tier and product definitions
- `content/` approved answer markdown, handed to the Publisher
- `.claude/agents/` the 7 agent files
- `.claude/skills/answer-factory/` the orchestrator that runs the chain

The live pages live in `kliq-website` (Next.js + Payload). The bridge to Payload
is `kliq-cms` (remote HTTP MCP). This repo only authors. It does not render and
it does not publish.

## The chain

Seven agents run in order. Three human checkpoints sit in the chain.

1. **Demand Researcher** mines real questions and candidate data (read-only)
2. **Question Definer** one canonical question + acceptance criteria `[CHECKPOINT 1]`
3. **Answer Brief Writer** structure, required data cites, links, schema plan `[CHECKPOINT 2]`
4. **Answer Writer** writes the answer in KLIQ voice, grounded (write: content only)
5. **Publisher** creates a draft answer in Payload via kliq-cms (write: drafts only)
6. **Fact-Checker** traces every claim to canon, pass/fail report (write: report only)
7. **Editorial Validator** final independent audit by severity (read-only) `[CHECKPOINT 3]`

If the Fact-Checker or Validator finds a problem it does not patch. It reports,
and the chain loops back to the right agent: Answer Writer for a copy or
grounding miss, Publisher for a draft or schema miss.

Grounding gets its own dedicated pass (Fact-Checker) separate from the holistic
Editorial Validator. A grounding check folded into the writer would be
self-graded, which the whole model exists to prevent.

## Voice and copy rules

- Write in KLIQ voice: direct, specific, useful to a coach building a business.
  Lead with the answer, then the evidence, then what to do.
- Every coach-outcome claim cites a canon fact by `id`. State the number, then
  the source in plain language. Example: "Coaches who cross $100 GMV retain at
  64%, from platform cohort analysis."
- Short sentences. Concrete nouns. No hedging.

## Do Not Do

- Do not state any coach-outcome number that is not a `verified` canon entry.
- Do not promote a number from a slide, memory, or chat to canon without a query
  and an n.
- Do not publish a number without its sample size (n) and as-of date.
- Do not use "currently" or "today" for a point-in-time stat. Use the as-of date.
- Do not state a percentage-point lift without naming the baseline and the
  comparison group.
- Do not present a third-party market stat as KLIQ data, or KLIQ data without
  aggregation.
- Do not publish a named coach's revenue, or any figure that identifies an
  individual.
- Do not change a number's definition to fit a sentence. Change the sentence.
- Do not use em dashes. Use commas or periods.
- Do not use "genuine" or "genuinely." Do not write motivational filler or
  corporate-speak.
- Do not publish an answer that duplicates an existing `/answers` page. Check
  slug and embedding similarity first.
- Do not invent citations or link to unverified sources.
- Do not let the Answer Writer touch rendering, or the Publisher edit the answer
  body.
- Do not skip a checkpoint. Approval is logged.

## Known Quirks

- Subagents load at session start. Editing an agent file on disk needs a session
  restart. Agents created or edited via `/agents` apply immediately.
- The only channel into a subagent is the prompt string. Pass the packet, brief,
  and file paths explicitly. The subagent starts with a fresh context.
- Community EDA numbers are point-in-time snapshots. Cite the snapshot date,
  never the word "currently."
- pgvector duplicate detection has false positives on tightly related questions.
  The Validator flags, a human decides.
- Use the built-in Explore agent (read-only, cheaper model) for heavy research
  reads to keep cost and context down.

## The Coach Growth Ladder (taxonomy)

Every answer maps to one stage. The stage drives the hub page and the CTA.

- **launch** getting set up, first members, first content
- **grow** activation, retention, community behaviour
- **monetise** pricing, tiers, first revenue, GMV milestones
- **scale** systematising, higher tiers, sustained GMV

## Canon and the Verification Standard

Canon is governed by the **Canon Verification Standard (ANSWER-002 v1.0)**. For
KLIQ's own numbers, you are the source. Citable does not mean finding a URL. It
means each fact is reproducible and provenance-stamped: a locked metric
definition, a query that reproduces it, a sample size, and an as-of date. A number
from a deck, a memory, or a chat is a candidate, not a fact.

Every entry is one of two types:

- **first_party** a KLIQ platform number. Verified by a locked `metric_definition`
  + `query_ref` + `sample_n` + `as_of`, derived by Manish, approved by an editor.
- **third_party** an external stat. Verified by a live `source_url` + `accessed`
  date. Never dressed up as KLIQ data.

The `public_sentence` is the only sanctioned phrasing. The Answer Writer uses it
verbatim, or paraphrases without changing the number, definition, n, or date.

A fact is citable only when `status: verified`. Until then it is a candidate and
cannot ship. A stat past its freshness window fails until re-derived. See
`canon/README.md` for the full schema and process.
