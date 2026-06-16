# kliq-research dev stub

A local, **read-only** MCP server that stands in for the `kliq-research` bridge so
the Demand Researcher has a data source without BigQuery. It is **not** the
production server. The real `kliq-research` reads Community EDA and the Aiya
research lake on BigQuery, audit-logged on AWS (brief ANSWER-001 Section 6).

## What it provides

| Tool | Purpose |
| --- | --- |
| `search_questions(topic, limit)` | Demand signals: how coaches phrase the topic + the likely Growth Ladder stage. **Dev-mock**, replaced by the Aiya research lake. |
| `list_data_candidates(topic)` | Canon entries that could ground the topic, read live from `canon/`, each with its `status`. Grounded, never invents a number. |

**Read-only by construction.** No write tools, matching the real server's access.

`list_data_candidates` reads the repo's `canon/` directory directly, so it always
reflects the real canon, including whether each fact is `verified` or still a
`candidate`. `search_questions` returns a small curated dev corpus; swap it for the
real demand source. Demand phrasings are questions, not coach-outcome numbers, so
a dev set is safe.

## How it is wired

Registered as `kliq-research` in the repo-root `.mcp.json`, so Claude Code exposes
the tools as `mcp__kliq-research__search_questions` and
`mcp__kliq-research__list_data_candidates`, which the Demand Researcher references.

MCP servers load at session start. Restart the session after pulling so the tools
become available.

## Run it directly

```bash
node tools/kliq-research-stub/server.mjs
```

JSON-RPC 2.0 over stdio. Logs go to stderr; stdout carries only protocol messages.
