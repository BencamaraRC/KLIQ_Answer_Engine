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

## How it works

Seven Claude Code subagents run as a chain, with three human checkpoints. One
trigger prompt starts a run. See [CLAUDE.md](CLAUDE.md) for the full model and
[.claude/skills/answer-factory/SKILL.md](.claude/skills/answer-factory/SKILL.md)
for the orchestration.

```
Demand Researcher
  -> Question Definer            [CHECKPOINT 1: approve the question]
  -> Answer Brief Writer         [CHECKPOINT 2: approve the brief]
  -> Answer Writer
  -> Publisher (draft only)
  -> Fact-Checker
  -> Editorial Validator         [CHECKPOINT 3: review, then publish in /admin]
```

## Quick start

1. Open this folder in Claude Code (desktop app). `CLAUDE.md` loads automatically.
2. The 7 agents live in `.claude/agents/`. Run `/agents` to review them; edits on
   disk need a session restart to load.
3. Connect the two MCP servers (`kliq-research`, `kliq-cms`) so the read-only
   agents can reach the data.
4. Trigger a run, for example:
   > Run the answer factory on: why do members go quiet after joining a community.
5. Approve at the three checkpoints. Publishing is a human action in Payload `/admin`.

## Layout

```
CLAUDE.md                         editorial memory, loads every session
canon/                            sourced data facts, one fact per file
  README.md                       canon entry schema
  brand/                          voice, tone, ICP, tiers and products
  *.md                            data facts (the moat)
content/                          approved answer markdown, handed to Publisher
.claude/agents/                   the 7 agent files
.claude/skills/answer-factory/    the orchestrator
```

## The non-negotiable

Grounding is the product. Every coach-outcome claim must trace to a sourced entry
in `canon/`. No exceptions. A stat with no canon entry cannot ship.
