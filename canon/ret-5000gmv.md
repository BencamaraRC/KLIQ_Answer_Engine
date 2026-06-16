---
id: ret-5000gmv
claim: retention rate of coaches at the £5,000 cumulative GMV milestone (safe zone)
value: 95%
source_type: first_party
metric_definition: >
  [DEFINE + CONFIRM with Manish] Share of coaches who first crossed £5,000
  cumulative GMV and were still active (paying subscriber or logged platform
  activity) at the measured window after crossing. Lock numerator, denominator,
  cohort, and window before deriving.
dataset: rcwl-data.prod_dataset
query_ref:              # [CONFIRM with Manish] bq saved query id
sample_n:               # [CONFIRM with Manish]
as_of:                  # [CONFIRM with Manish] snapshot date
derived_by: manish
approved_by:            # [PENDING editor sign-off: Jufel or Hannah]
freshness_window: 6 months
public_sentence:        # [PENDING] write once n and as_of are confirmed
status: candidate
---

Coaches who reach £5,000 GMV sit in a 95% retention safe zone. Useful as the point
where a coaching business becomes durable.

Currency: stated in GBP in the source. Cite as £5,000, not a converted dollar
value, unless Manish confirms a USD equivalent. One of the seven to verify first
(ANSWER-002 Section 9). Not citable until the query, n, and as_of are confirmed and
an editor approves the public sentence.
