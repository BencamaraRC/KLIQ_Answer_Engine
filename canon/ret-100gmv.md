---
id: ret-100gmv
claim: retention rate of coaches at the $100 cumulative GMV milestone
value: 64%
source_type: first_party
metric_definition: >
  Share of coaches who first crossed $100 cumulative GMV in the cohort window and
  were still active (paying subscriber or logged platform activity) 6 months after
  crossing. Numerator: cohort members active in the month around their six-month
  mark. Denominator: the full cohort. See query_ref.
dataset: rcwl-data.prod_dataset
query_ref: bq://saved_query/ret_100gmv_v1
sample_n: 92            # [CONFIRM with Manish] coaches in the cohort
as_of: 2026-05-19
derived_by: manish
approved_by: jufel
freshness_window: 6 months
public_sentence: >
  Across 92 KLIQ coaches who crossed $100 in cumulative GMV (as of May 2026), 64%
  were still active six months later.
status: candidate
---

The worked example in ANSWER-002 Section 6. The $100 mark is the first revenue
threshold where retention separates clearly from coaches who never monetise.

Verification still open: confirm `sample_n` (92) and reproduce the query with
Manish, then an editor approves the public_sentence. Different definition choices
(active vs paying, 6mo vs 3mo) give different numbers, which is why the definition
is locked before deriving. On reproduction and sign-off, flip `status` to
`verified`.
