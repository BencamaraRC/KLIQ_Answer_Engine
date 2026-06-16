# Fact-Check Report: why-members-go-quiet-after-joining
RESULT: FAIL
STANDARD: ANSWER-002 v1.0
CLAIMS CHECKED: 3

PER CLAIM:
  - claim: "44% of community members post once and never return"
    canon id: eda-post-once
    source_type: first_party
    status: candidate
    record: query_ref MISSING, sample_n MISSING, as_of MISSING ([CONFIRM with Manish])
    freshness: cannot evaluate (no as_of)
    phrasing: no public_sentence exists to match ([PENDING])
    verdict: fail

  - claim: "68% of activity is replies, not new posts"
    canon id: eda-activity-replies
    source_type: first_party
    status: candidate
    record: query_ref MISSING, sample_n MISSING, as_of MISSING ([CONFIRM with Manish])
    freshness: cannot evaluate (no as_of)
    phrasing: no public_sentence exists to match ([PENDING])
    verdict: fail

  - claim: "content engagement in the first seven days ... a lift of 43.3 percentage points"
    canon id: week1-content-engagement
    source_type: first_party
    status: candidate
    record: query_ref MISSING, sample_n MISSING, as_of MISSING ([CONFIRM with Manish])
    freshness: cannot evaluate (no as_of)
    phrasing: percentage-point lift stated with NO baseline and NO comparison group
    verdict: fail

FAILURES:
  - eda-post-once is status: candidate. Not citable. Needs Manish to lock the
    metric definition, run the query (record query_ref, sample_n, as_of), and an
    editor to approve the public_sentence. Then flip to status: verified.
  - eda-activity-replies is status: candidate. Same remediation.
  - week1-content-engagement is status: candidate, and the answer states the
    +43.3pp lift without naming its baseline or comparison group, which ANSWER-002
    forbids for any percentage-point figure. Needs verification AND a public_sentence
    that names both groups.
  - No point-in-time as_of date is cited for any community number (the snapshot
    date is unknown until derived).

ROUTING: seed/verify canon first (all three facts are candidates; the platform
  data team must verify them per ANSWER-002 before this answer can exist). Once
  verified, loop back to the Answer Writer to cite each via its public_sentence
  with the number, n, and as-of date.
