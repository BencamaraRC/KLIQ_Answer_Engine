# KLIQ Answer Engine

Doc ref: ANSWER-001 · v1.1

The authoring workspace for the KLIQ Answer Engine, a public, indexable question
index at `joinkliq.io/answers` where every coach-outcome claim is grounded in
KLIQ first-party platform data.

This repo is one of three:

| Repo | Role |
| --- | --- |
| **answer-engine** (this repo) | Authoring tooling. CLAUDE.md, canon, the 7 agents, the orchestrator skill. |
| **kliq-website** | Next.js + Payload. Owns the live `/answers` pages and JSON-LD. |
| **kliq-cms** | Remote HTTP MCP server. The bridge that wraps Payload as the draft-only factory user. |

A local **kliq-cms dev stub** ships in this repo at `tools/kliq-cms-stub/` so the
factory runs end to end without Payload. It is registered in `.mcp.json` as the
`kliq-cms` server and exposes the four Appendix C tools as `mcp__kliq-cms__*`.
Swap it for the real server in Phase 2.

Canon is governed by the **Canon Verification Standard (ANSWER-002 v1.0)**: KLIQ
is the source, so a fact is citable only when it has a locked definition, a query
that reproduces it, a sample size, and a date. See [canon/README.md](canon/README.md).

## How it works

Founder-operated (ANSWER-003). Ben runs the chain in the browser through Claude,
verifies the canon by hand, and every answer carries a publish verdict. No infra.
The agent chain is unchanged; the approval model is now conditional, not three
fixed checkpoints. See [CLAUDE.md](CLAUDE.md) and
[docs/answer-003-operating-model.md](docs/answer-003-operating-model.md).

```
Demand Researcher
  -> Question Definer            (operator may edit)
  -> Answer Brief Writer         (operator may edit; flags candidate facts)
  -> Answer Writer
  -> Fact-Checker
  -> Editorial Validator         emits the verdict: auto-publish | hold | forced
  -> export (markdown / JSON), then publish

Publisher (Payload draft) is deferred under ANSWER-003.
```

## Quick start

1. Open this folder in Claude Code. `CLAUDE.md` loads automatically.
2. Open `tools/canon-console/index.html` in a browser. Verify facts (flip
   candidate to verified), and get a publish verdict for any answer.
3. Trigger a run in chat, for example:
   > Run the answer factory on: why do members go quiet after joining a community.
4. The chain ends with a verdict. If it holds on an unverified stat, verify that
   stat in the console and re-run the Fact-Checker. Export the answer and publish.

The MCP servers (`kliq-cms`, `kliq-research`) and the `kliq-website` artifacts are
deferred under ANSWER-003. Their dev stubs stay in `tools/` for when that wiring
lands.

## Layout

```
CLAUDE.md                         editorial memory, loads every session
canon/                            sourced data facts, one fact per file
  README.md                       canon schema + Verification Standard (ANSWER-002)
  brand/                          voice, tone, ICP, tiers and products
  *.md                            data facts (the moat)
content/                          approved answer markdown, handed to Publisher
reports/                          Fact-Checker grounding reports, per answer
.claude/agents/                   the 7 agent files
.claude/skills/answer-factory/    the orchestrator
docs/                             scope and decision records (ANSWER-003)
tools/canon-console/              founder-operated browser console: verify canon, publish verdict, export
.mcp.json                         registers the kliq-cms + kliq-research MCP servers (deferred under ANSWER-003)
tools/kliq-cms-stub/              local dev stub for kliq-cms (deferred)
tools/kliq-research-stub/         local dev stub for kliq-research (deferred)
kliq-website/                     drop-in reference artifacts for the Next.js + Payload repo
```

## The non-negotiable

Grounding is the product. Every coach-outcome claim must trace to a sourced entry
in `canon/`. No exceptions. A stat with no canon entry cannot ship.
