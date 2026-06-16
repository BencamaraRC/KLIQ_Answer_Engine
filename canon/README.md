# Canon, the editorial memory of facts

This is the single thing that makes the index defensible. One file per fact.
Markdown with YAML frontmatter, plus a short body for context and caveats.

The Fact-Checker reads these files directly and enforces the **Canon Verification
Standard (ANSWER-002 v1.0)**. A coach-outcome stat that does not meet the standard
cannot ship.

## The principle

For KLIQ's own numbers, you are the source. Citable does not mean finding a URL.
It means each fact is reproducible and provenance-stamped, so an editor, a
journalist, an AI answer engine, or a court can trust it. A number from a deck, a
memory, or a chat is a **candidate**, not a fact. It becomes a fact only when it
has a locked definition, a query that reproduces it, a sample size, and a date.

## Two source types

Every entry is one of two types. The verification path depends on which.

| source_type | What it is | How it is verified |
| --- | --- | --- |
| **first_party** | A KLIQ platform number (retention, GMV, community behaviour) | Locked metric definition + a query that reproduces it + sample size + as-of date. You are the source. |
| **third_party** | A market or external stat | A live primary source_url + an accessed date. Never dressed up as KLIQ data. |

## Entry schema

### first_party

```yaml
---
id: ret-100gmv
claim: retention rate of coaches at the $100 cumulative GMV milestone
value: 64%
source_type: first_party
metric_definition: >
  The numerator, denominator, cohort, and window in one unambiguous sentence.
  "64% retention" is meaningless until this is pinned.
dataset: rcwl-data.prod_dataset
query_ref: bq://saved_query/ret_100gmv_v1   # saved query id or the SQL
sample_n: 92                                # a number with no n is not defensible
as_of: 2026-05-19                           # point-in-time snapshot, never "currently"
derived_by: manish                          # first-party numbers route through Manish
approved_by: jufel                          # editor sign-off (Jufel or Hannah)
freshness_window: 6 months
public_sentence: >
  The one sanctioned phrasing. The Answer Writer uses it verbatim, or paraphrases
  without changing the number, definition, n, or date.
status: candidate                           # candidate | verified
---

Context and caveats. If the number is a snapshot, give the as-of date.
```

### third_party

```yaml
---
id: mkt-creator-economy-size
claim: creator economy market size
value: $X billion (2024)
source_type: third_party
source_url: https://primary-source.example/report
source_title: <report name + publisher>
accessed: 2026-05-19
public_sentence: >
  The creator economy was worth about $X billion in 2024, per <publisher>.
status: candidate
---
```

## The process (ANSWER-002 Section 4)

1. **Intake.** Capture as a candidate. Tag `status: candidate`. Cannot be cited.
2. **Define.** Lock the metric: numerator, denominator, cohort, window, in one
   sentence. A lift or percentage-point figure also needs a stated baseline and
   comparison group.
3. **Derive.** Manish runs the query against live data and records dataset,
   query_ref, sample_n, and as_of.
4. **Reproduce.** A second run or person gets the same number. If not, it does not
   ship.
5. **Approve.** An editor (Jufel or Hannah) signs off the public_sentence and
   confirms it is aggregated and anonymized.
6. **Record.** Write the full verification record. Only now flip to
   `status: verified`. Only now can the factory cite it.
7. **Re-derive on the freshness window.** A stat past its window fails the
   Fact-Checker until refreshed.

## Citability rules the Fact-Checker enforces

- **first_party:** must have `query_ref`, `sample_n`, and an `as_of` inside the
  freshness window. Otherwise it fails.
- **third_party:** must have a live `source_url` and an `accessed` date. Never
  presented as KLIQ data.
- **public_sentence is the only sanctioned phrasing.** The Answer Writer uses it
  verbatim, or paraphrases without changing the number, definition, n, or date.
- Any number with no matching canon entry is treated as invented and blocks the
  draft.
- `status: candidate` is never citable, regardless of fields present.

## Current state of the seed entries

The seven facts named in ANSWER-002 Section 9 are present as `status: candidate`.
`ret-100gmv` carries the near-complete verification record from the worked example
(Section 6); the rest carry the record scaffold with `[CONFIRM with Manish]`
markers on definition, query_ref, sample_n, and as_of. None is citable until
Manish derives the query and an editor approves the public sentence.

Brand canon lives in `canon/brand/`. Those files define voice, ICP, and the
tier/product taxonomy. They are not numeric facts and have no verification record.
