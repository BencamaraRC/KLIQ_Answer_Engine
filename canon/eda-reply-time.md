---
id: eda-reply-time
claim: median reply time in the tightest communities
value: 70 to 120 minutes
source_type: first_party
metric_definition: >
  [DEFINE + CONFIRM with Manish] Median time from a post to its first reply, in the
  most active communities. Lock how "tightest communities" is selected (e.g. top
  decile by activity) and whether the figure is a median or a range across those
  communities.
dataset: rcwl-data.prod_dataset
query_ref:              # [CONFIRM with Manish]
sample_n:               # [CONFIRM with Manish] communities / replies
as_of:                  # [CONFIRM with Manish] EDA snapshot date
derived_by: manish
approved_by:            # [PENDING editor sign-off]
freshness_window: 6 months
public_sentence:        # [PENDING] anchor to the snapshot date
status: candidate
---

The tightest communities reply in 70 to 120 minutes. Fast reply time marks a
healthy, engaged community and is a target a coach can manage by setting response
expectations.

Community EDA numbers are point-in-time snapshots. Cite the snapshot date, never
"currently." One of the seven to verify first (ANSWER-002 Section 9).
