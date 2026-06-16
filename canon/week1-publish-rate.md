---
id: week1-publish-rate
claim: share of new coaches who publish content in their first week
value: fewer than 5%
source_type: first_party
metric_definition: >
  [DEFINE + CONFIRM with Manish] Share of new coaches who publish at least one
  piece of content within 7 days of joining. Lock what counts as "publish" and the
  joining cohort window.
dataset: rcwl-data.prod_dataset
query_ref:              # [CONFIRM with Manish]
sample_n:               # [CONFIRM with Manish] new coaches in cohort
as_of:                  # [CONFIRM with Manish] snapshot date
derived_by: manish
approved_by:            # [PENDING editor sign-off]
freshness_window: 6 months
public_sentence:        # [PENDING] anchor to the snapshot date, never "currently"
status: candidate
---

Fewer than 5% of coaches publish content in their first week. This is the gap the
Answer Engine addresses: Week 1 content engagement is the strongest retention
signal (see `week1-content-engagement`), yet almost no coaches act on it.

Not in the ANSWER-002 priority seven, but a real candidate. The brief stated this
with the word "currently," which ANSWER-002 forbids for a point-in-time stat;
anchor it to the as_of date instead. Not citable until verified.
