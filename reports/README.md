# Reports, the grounding audit trail

The Fact-Checker writes one report per answer here: `reports/<slug>-factcheck.md`.
It is the only file the Fact-Checker writes. The Editorial Validator reads these
reports (read-only) as part of CHECKPOINT 3.

Reports are kept in git so the grounding history of every answer is auditable. A
PASS report is the evidence that an answer's numbers traced to verified canon at
the time it shipped.

See `.claude/agents/fact-checker.md` for the report format.
