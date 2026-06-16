---
id: eda-post-once
claim: share of community members who post once and never return
value: 44%
source_type: first_party
metric_definition: >
  [DEFINE + CONFIRM with Manish] Share of members who made exactly one post and had
  no subsequent post or logged activity through the snapshot date. Lock what counts
  as "activity" and the observation window.
dataset: rcwl-data.prod_dataset
query_ref:              # [CONFIRM with Manish]
sample_n:               # [CONFIRM with Manish] members analysed
as_of:                  # [CONFIRM with Manish] EDA snapshot date
derived_by: manish
approved_by:            # [PENDING editor sign-off]
freshness_window: 6 months
public_sentence:        # [PENDING] anchor to the snapshot date, never "currently"
status: candidate
---

44% of community members post once and never return. The central fact behind the
"members go quiet after joining" question, and it frames the activation problem.

Community EDA numbers are point-in-time snapshots. Cite the snapshot date, never
"currently." One of the seven to verify first (ANSWER-002 Section 9).
