---
id: eda-top10-posts
claim: share of community posts produced by the most active members
value: ~80% (by the top 10% of members)
source_type: first_party
metric_definition: >
  [DEFINE + CONFIRM with Manish] Share of total posts produced by the top 10% of
  members ranked by post count, across analysed communities, through the snapshot
  date. Lock the ranking basis and the population.
dataset: rcwl-data.prod_dataset
query_ref:              # [CONFIRM with Manish]
sample_n:               # [CONFIRM with Manish] members / posts analysed
as_of:                  # [CONFIRM with Manish] EDA snapshot date
derived_by: manish
approved_by:            # [PENDING editor sign-off]
freshness_window: 6 months
public_sentence:        # [PENDING] anchor to the snapshot date
status: candidate
---

The top 10% of members produce roughly 80% of posts. A classic participation
skew: most members read, a small core carries the conversation. Useful for setting
a coach's expectations about who drives a community.

Community EDA numbers are point-in-time snapshots. Cite the snapshot date, never
"currently." One of the seven to verify first (ANSWER-002 Section 9).
