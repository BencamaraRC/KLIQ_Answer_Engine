---
id: week1-content-engagement
claim: retention lift from member content engagement in Week 1
value: +43.3pp
source_type: first_party
metric_definition: >
  [DEFINE + CONFIRM with Manish] A percentage-point lift, so it needs an explicit
  baseline and comparison group. Difference in retention between coaches whose
  members engaged with content in the first 7 days (treatment) and coaches whose
  members did not (comparison). State both retention rates and the window, not just
  the +43.3pp difference.
dataset: rcwl-data.prod_dataset
query_ref:              # [CONFIRM with Manish]
sample_n:               # [CONFIRM with Manish] both groups
as_of:                  # [CONFIRM with Manish] snapshot date
derived_by: manish
approved_by:            # [PENDING editor sign-off]
freshness_window: 6 months
public_sentence:        # [PENDING] must name baseline and comparison group
status: candidate
---

Week 1 content engagement is the strongest single retention signal observed, a
lift of 43.3 percentage points. Cite as a percentage-point lift (+43.3pp), not a
percentage.

This is the signal the whole Answer Engine ties back to: the same answers seed the
in-app content library, yet few coaches publish in Week 1 (see
`week1-publish-rate`). Per ANSWER-002 Do Not Do, do not state this lift without
naming the baseline and the comparison group. Not citable until the query, both
sample sizes, and as_of are confirmed and an editor signs off.
