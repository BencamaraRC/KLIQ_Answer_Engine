# Canon Console

The founder-operated browser console for the Answer Engine (ANSWER-003). Open
`index.html` in any browser. No server, no keys, no build.

## What it does

- **Canon panel.** Every fact listed with a status pill. Click the pill to flip
  `candidate` to `verified` (the "two clicks" of the manual grounding loop). Each
  first_party fact shows whether its verification record is complete:
  metric_definition, query_ref, sample_n, as_of. Flipping an incomplete record to
  verified asks for confirmation.
- **Edit.** Change value, status, sample_n, as_of, query_ref, freshness_window,
  metric_definition, and the public_sentence inline. Add or delete facts.
- **Publish verdict.** Paste a finished answer (markdown with a `citedCanonIds`
  list) or type canon ids. The console reads only the canon, exactly like the
  Editorial Validator, and returns a verdict:
  - **auto-publish** every cited stat verified, record complete, no findings.
  - **hold for review** a cited stat is candidate, ungrounded, expired, or the copy
    rules trip (em dash, "genuine", "currently/today").
  - **auto-publish (forced)** the Always-auto toggle overrides a hold and lists
    exactly what it ignored. Guardrail: do not forced-publish unverified precise
    stats against the public site.
- **Export / Import.** Export the canon as JSON (round-trips back via Import) or as
  Markdown (the `canon/*.md` entry format). Edits persist in the browser via
  localStorage; Export to keep them for next session or to commit back to `canon/`.

## How it fits the loop

1. Run the chain (in chat) to draft an answer. It cites canon ids.
2. Paste the answer here and compute the verdict. Unverified stats show as holds.
3. Verify the numbers you trust: click the candidate pill, fill the record, Save.
4. Recompute. As stats flip to verified, the verdict moves toward auto-publish.
5. Export the canon and the answer.

## Notes

- The seed canon matches `canon/*.md` at the time this was built. The console is a
  working copy: it does not write back to the repo. Export Markdown and reconcile
  into `canon/` when you want the repo to reflect your verifications.
- Single self-contained file, vanilla JS, no dependencies. Safe to open offline.
