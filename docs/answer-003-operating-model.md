# ANSWER-003: Revised Scope, founder-operated

Doc ref: ANSWER-003 v1.0 · Supersedes the build-team assumptions in ANSWER-001.

The Answer Engine is no longer infra the engineering team builds and runs. It is a
system Ben operates from a browser through Claude, grounded in a canon Ben verifies
by hand. This is the decision record. CLAUDE.md carries the operating rules.

## What changed

| Area | Was (ANSWER-001) | Now (ANSWER-003) |
| --- | --- | --- |
| Operating model | Built and run by engineering via Claude Code subagents | Run by Ben in a self-serve browser console. No setup. |
| Data owner | Manish derives stats from BigQuery | Ben owns verification. Manish out of the loop. |
| Grounding | Automated via a BigQuery-wired server | Manual for now. Ben confirms numbers in a canon editor. |
| Approval | Three human checkpoints before publish | Conditional auto-publish. Clean and verified goes live, the rest holds. |
| Infrastructure | Payload, MCP servers, Next routes | None needed to test and generate. One small wire left for live publishing. |

Net effect: Ben can run the whole loop today with zero engineering. The only thing
that still needs a developer is posting an approved answer onto the live site.

## In scope today (solo, no build)

- Generate a full answer for any coach question, end to end.
- Ground every claim in the canon, ungrounded numbers flagged automatically.
- Editorial validation: copy rules, acceptance criteria, brand voice.
- Manual canon management: add, edit, verify, export facts without touching code.
- Conditional publish verdict on every answer (auto-publish, hold, or forced).
- Export each answer as markdown or JSON.

## The manual grounding loop

1. Open the Canon panel. Every fact is listed with its status.
2. Check a number against whatever source Ben trusts.
3. Click the candidate pill to flip it to verified. Edit value, date, or wording.
4. Export the canon to keep it for next session.

As each stat is verified, answers that cite it stop holding and qualify for
auto-publish. The system becomes more automatic as the canon fills in, no code
change. The console lives at `tools/canon-console/`.

## Approval model

| Verdict | When | Outcome |
| --- | --- | --- |
| Auto-publish | No critical or important findings, no ungrounded numbers, every cited stat verified | Goes live with no human step |
| Hold for review | Cites an unverified stat, or trips a finding | A human approves before it goes live |
| Auto-publish (forced) | Always-auto override is on | Publishes regardless, and shows what it ignored |

**Guardrail:** do not run Always-auto against the public site until the canon is
verified. KLIQ has already had a false-claims exposure, so publishing unverified
precise stats is the one risk to avoid. Conditional mode prevents it by design.

## Deferred, and the one dependency

None of these block testing or generating.

- **Live publishing to joinkliq.io.** The console does not post to the site. Until
  wired, export an approved answer and paste it in. A one-time wire would let green
  answers post on their own. Recommendation: run manual now, prove content quality,
  then decide on the wire. Do not build it before the answers are good.
- **Automated BigQuery verification.** Available via the Google Cloud connector
  against `rcwl-data.prod_dataset`, deferred in favour of the manual loop.
- **Four-page production rendering** (FAQ, Tool, Guide, Directory). Design exists,
  wiring to Payload deferred.
- **MCP servers** (kliq-cms, kliq-research). Not needed for the manual console path.
  The dev stubs in `tools/` remain valid for when the infra path returns.

## What stays true from ANSWER-001 and 002

- The agent chain and the separation of jobs are unchanged.
- The verification ethos holds: a number is a candidate until checked, and the
  Fact-Checker blocks invented numbers. ANSWER-002 still governs how a number
  becomes citable.
- The brand and design system, and the four page types, are unchanged.
