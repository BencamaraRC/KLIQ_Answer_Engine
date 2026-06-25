---
name: answer-factory
description: >-
  Run the KLIQ Answer Engine chain end to end. Use when the operator wants to
  author a grounded answer for joinkliq.io/answers, e.g. "run the answer factory
  on <topic>" or "write an answer on why members go quiet after joining". Drives
  the 7 agents in order and ends with a publish verdict (auto-publish, hold, or
  forced). One trigger prompt starts a run.
---

# Answer Factory orchestrator

You are the operator's orchestrator. You run the agents in `.claude/agents/` in
order, passing each step's output to the next, and you end with a publish verdict.
You do not do the agents' work yourself. You delegate to each subagent and relay
its output.

This is founder-operated (ANSWER-003). The default is hands-off: the chain runs
and produces a verdict, and a human is pulled in only when the verdict is hold.
There are no three fixed checkpoints any more. The operator can still edit the
question or the brief if they want, but they are not forced pauses.

## Before you start

Read `CLAUDE.md`, especially the Operating model section. The trigger prompt names
a topic, for example: "Run the answer factory on: why do members go quiet after
joining a community." The operator may also set Always-auto (forced publish); if
they did, pass that through to the Validator.

## The only channel into a subagent is its prompt

Each subagent starts with a fresh context. Pass everything it needs explicitly in
the prompt string: the topic, the prior step's output, and the file paths to read.
The Fact-Checker and Validator in particular must be pointed at file paths only,
never at how the answer was written.

## The run (manual console path)

### Step 1, Demand Researcher (read-only)
Delegate to `demand-researcher` with the topic. Relay its research packet.

### Step 2, Question Definer
Delegate to `question-definer`, passing the packet. It returns one canonical
question, slug, ladder stage, and acceptance criteria. Show it to the operator;
they may edit it. Proceed.

### Step 3, Answer Brief Writer
Delegate to `answer-brief-writer`, passing the question and criteria. It returns
the structure, required cites, internal links, schema plan, CTA, and any grounding
gaps. Show it to the operator; they may edit it. If there are grounding gaps
(required facts still `candidate`), tell the operator they can verify those in the
canon console (`tools/canon-console/`) now or accept that the answer will hold.
Proceed.

### Step 4, Answer Writer (write: content only)
Delegate to `answer-writer`, passing the brief and the canon ids to cite. It writes
`content/<slug>.md` and returns the path, slug, and citedCanonIds.

### Step 5, Fact-Checker (write: report only)
Delegate to `fact-checker`, passing only the file paths: `content/<slug>.md` and
`canon/`. It writes `reports/<slug>-factcheck.md` and returns PASS or FAIL.

### Step 6, Editorial Validator (read-only), emits the verdict
Delegate to `editorial-validator`, passing only the file paths: `content/<slug>.md`,
`reports/<slug>-factcheck.md`, and `canon/`, plus the Always-auto flag if set. It
returns findings by severity and the publish **VERDICT**.

### Step 7, act on the verdict
- **auto-publish** the answer is green. Export it (markdown or JSON from
  `content/<slug>.md`). Until the live-publish wire exists, the operator pastes it
  onto the site. With the wire, green answers post on their own.
- **hold for review** surface why. If it holds on unverified canon, point the
  operator to the canon console to verify the stat, then re-run from Step 5
  (Fact-Checker) so the verdict can flip. If it holds on a finding, loop back to the
  Answer Writer.
- **auto-publish (forced)** only if Always-auto was set. Relay exactly what the
  Validator says it ignored. Per `CLAUDE.md`, do not forced-publish unverified
  precise stats against the public site.

The Publisher (Payload draft via kliq-cms) is deferred under ANSWER-003 and is not
part of the manual path. Run it only if the operator asks and the MCP server is
connected.

## Looping back

Do not patch anything yourself. Route it:

- copy or grounding miss in the answer  ->  back to `answer-writer`
- a cited stat is still a candidate      ->  operator verifies it in the canon
  console, then re-run from the Fact-Checker

Re-run from the routed step forward. The Fact-Checker and Validator must re-audit
the new artifacts on disk.

## When something ships wrong

Do not patch the conversation. Add a rule to `CLAUDE.md` and the canon compounds.
The operator makes that edit. Note it in your handoff so they remember.

## Hard rules

- Every coach-outcome number must trace to a `verified` canon entry. No exceptions.
- Do not forced-publish unverified precise stats against the public site. The
  conditional verdict exists to prevent exactly that.
- A forced publish must show what it ignored. Never override a hold silently.
- Never let the Answer Writer touch rendering, or the Publisher edit the body.
