# Factory dry-run: wiring demonstration

This folder is a demonstration of the answer factory chain running end to end on a
sample topic. It exists to prove the wiring and the safety gates, not to produce a
publishable answer.

**Topic:** "why do members go quiet after joining a community"

It is here, in `examples/dry-run/`, and not in the live `content/` and `reports/`
folders, on purpose. The sample answer cites canon facts that are still
`status: candidate`, so by design it must not ship. The accompanying fact-check
report shows the Fact-Checker correctly **failing** it.

## What this proves

1. The chain produces the right artifact at each step.
2. The reserved-slug guard accepts a valid slug and rejects a stage name.
3. The kliq-cms stub really creates a draft (draft-only, no publish).
4. The Fact-Checker is an independent backstop: even if candidate numbers slip
   past the two human checkpoints, it blocks the draft because the canon entries
   are not `verified`.

## Files

```
why-members-go-quiet-after-joining.md            the Answer Writer's output (DRY-RUN, do not publish)
reports/why-members-go-quiet-after-joining-factcheck.md   the Fact-Checker report: RESULT FAIL
```

The full step-by-step walkthrough (the Researcher packet, the two checkpoints, the
Publisher draft id) is in the session that created this, summarised in the repo
commit. Re-run it for real once a session is restarted (so the agents and the
`kliq-cms` server load) and once canon facts are `verified`.
