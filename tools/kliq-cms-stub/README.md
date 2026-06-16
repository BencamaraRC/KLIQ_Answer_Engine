# kliq-cms dev stub

A local MCP server that stands in for the real `kliq-cms` bridge so the answer
factory can run end to end without Payload. It is **not** the production server.
The real `kliq-cms` is a separate repo: a remote HTTP MCP service that wraps
Payload's API as the draft-only factory user, audit-logged on AWS (see brief
ANSWER-001 Section 6 and Appendix C).

## What it provides

The four Appendix C tools, over the MCP stdio transport, backed by a local JSON
file at `tools/kliq-cms-stub/.data/drafts.json`:

| Tool | Purpose |
| --- | --- |
| `search_answers(query, limit)` | Dedupe and related-question lookup. Crude word-overlap similarity stands in for pgvector. |
| `get_link_map(ladderStage)` | Slug + title of answers in a Growth Ladder stage, for internal links. |
| `create_answer_draft({ ...fields })` | Create a new draft. Returns `id`, `adminUrl`, `_status: draft`. |
| `update_answer_draft(id, { ...fields })` | Update a draft by id. Stays `draft`. |

**Draft-only by construction.** There is no publish tool. The most this stub can
do, like the real factory user, is leave a draft in the queue. Publishing stays a
human action.

## How it is wired

Registered as the `kliq-cms` server in the repo-root `.mcp.json`, so Claude Code
exposes the tools as `mcp__kliq-cms__search_answers`, etc., which is exactly what
the Publisher and Answer Brief Writer agents reference.

MCP servers load at session start. After pulling this, restart the Claude Code
session (or approve the new server when prompted) so the tools become available.

## Run it directly

```bash
node tools/kliq-cms-stub/server.mjs
```

It speaks JSON-RPC 2.0 over stdio. Logs go to stderr; stdout carries only protocol
messages.

## Swapping in the real server

When the `kliq-cms` repo is ready, point `.mcp.json` at it (an HTTP/SSE MCP
endpoint authenticated as the draft-only factory user) and keep the same four tool
names. The agents need no change.
