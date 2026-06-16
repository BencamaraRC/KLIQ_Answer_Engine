#!/usr/bin/env node
// kliq-research dev stub: a local, READ-ONLY MCP server that stands in for the
// kliq-research bridge (Community EDA + the Aiya research lake on BigQuery). It
// feeds the Demand Researcher: question demand and data candidates.
//
// It has NO write tools, matching the real server's read-only access.
//
// Two tools:
//   search_questions(topic, limit)  -> mock demand signals (real phrasings + stage)
//   list_data_candidates(topic)     -> canon entries that could ground the topic,
//                                       read live from canon/ so it never invents
//                                       a number
//
// search_questions returns DEV-MOCK demand. The real server draws this from the
// Aiya research lake. list_data_candidates is grounded: it reflects whatever is in
// canon/, including each entry's status, so the researcher sees what is citable.
//
// Zero dependencies. Run: node tools/kliq-research-stub/server.mjs
// Registered as "kliq-research" in .mcp.json -> tools as mcp__kliq-research__<tool>.

import { createInterface } from 'node:readline'
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const HERE = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = join(HERE, '..', '..')
const CANON_DIR = join(REPO_ROOT, 'canon')

// --- canon reader (read-only) ----------------------------------------------
// Minimal frontmatter scan. Good enough to surface candidates; the Fact-Checker
// is the component that parses canon rigorously.
function readField(src, key) {
  const m = src.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))
  return m ? m[1].trim() : ''
}
function loadCanon() {
  let files = []
  try {
    files = readdirSync(CANON_DIR).filter((f) => f.endsWith('.md') && f !== 'README.md')
  } catch {
    return []
  }
  return files.map((f) => {
    const src = readFileSync(join(CANON_DIR, f), 'utf8')
    const fmEnd = src.indexOf('\n---', 3)
    const fm = fmEnd > 0 ? src.slice(0, fmEnd) : src
    const body = fmEnd > 0 ? src.slice(fmEnd + 4) : ''
    return {
      file: f,
      id: readField(fm, 'id') || f.replace(/\.md$/, ''),
      claim: readField(fm, 'claim'),
      value: readField(fm, 'value'),
      source_type: readField(fm, 'source_type'),
      status: readField(fm, 'status') || 'unknown',
      haystack: `${fm}\n${body}`.toLowerCase(),
    }
  })
}

function words(s) {
  return (String(s || '').toLowerCase().match(/[a-z0-9]+/g) || []).filter((w) => w.length > 2)
}

// --- DEV-MOCK demand corpus -------------------------------------------------
// Stand-in for the Aiya research lake. Keyword-tagged so a topic surfaces relevant
// phrasings. Replace with the real demand source. These are questions, not
// coach-outcome numbers, so a curated dev set is safe.
const DEMAND = [
  {
    tags: ['quiet', 'silent', 'inactive', 'ghost', 'lurk', 'engage', 'member'],
    ladderStage: 'grow',
    phrasings: [
      'why do members go quiet after joining',
      'members join then never post',
      'how do I get lurkers to participate',
      'my community is a ghost town, what do I do',
    ],
  },
  {
    tags: ['price', 'pricing', 'charge', 'cost', 'tier', 'much'],
    ladderStage: 'monetise',
    phrasings: [
      'how much should I charge for my coaching',
      'how do I price a membership',
      'should I raise my prices',
      'what is a good price for a community',
    ],
  },
  {
    tags: ['launch', 'start', 'first', 'begin', 'setup', 'new'],
    ladderStage: 'launch',
    phrasings: [
      'how do I launch my coaching community',
      'getting my first members',
      'what should I post in week one',
      'how to start a paid community',
    ],
  },
  {
    tags: ['retain', 'retention', 'churn', 'cancel', 'leave', 'stay'],
    ladderStage: 'grow',
    phrasings: [
      'how do I stop members from cancelling',
      'why do members churn',
      'how to improve retention',
      'keeping members past the first month',
    ],
  },
  {
    tags: ['scale', 'grow', 'systemise', 'systematise', 'team', 'bigger'],
    ladderStage: 'scale',
    phrasings: [
      'how do I scale my coaching business',
      'systematising my community',
      'growing past a few hundred members',
    ],
  },
]

// --- tools ------------------------------------------------------------------
const TOOLS = {
  search_questions: {
    description:
      'DEV-MOCK demand signals for a topic: how coaches actually ask it, plus the likely Growth Ladder stage. Stands in for the Aiya research lake. Read-only.',
    inputSchema: {
      type: 'object',
      properties: {
        topic: { type: 'string', description: 'the rough topic or question' },
        limit: { type: 'number', description: 'max phrasings, default 6' },
      },
      required: ['topic'],
    },
    handler: ({ topic, limit = 6 }) => {
      const tw = new Set(words(topic))
      const scored = DEMAND.map((d) => ({
        d,
        score: d.tags.reduce((n, t) => n + (tw.has(t) ? 1 : 0), 0),
      }))
        .filter((s) => s.score > 0)
        .sort((a, b) => b.score - a.score)
      const chosen = scored.length ? scored : [{ d: DEMAND[0], score: 0 }]
      const phrasings = []
      const stages = new Set()
      for (const { d } of chosen) {
        stages.add(d.ladderStage)
        for (const p of d.phrasings) if (phrasings.length < limit) phrasings.push(p)
      }
      return {
        topic,
        phrasings,
        likelyStages: [...stages],
        note: 'DEV-MOCK demand. Replace with the Aiya research lake.',
      }
    },
  },

  list_data_candidates: {
    description:
      'Canon entries that could ground an answer on the topic, read live from canon/. Includes each entry status so the researcher sees what is citable vs candidate. Read-only.',
    inputSchema: {
      type: 'object',
      properties: {
        topic: { type: 'string', description: 'the topic or question' },
      },
      required: ['topic'],
    },
    handler: ({ topic }) => {
      const tw = words(topic)
      const canon = loadCanon()
      const matches = canon
        .map((c) => ({
          id: c.id,
          claim: c.claim,
          value: c.value,
          source_type: c.source_type,
          status: c.status,
          score: tw.reduce((n, w) => n + (c.haystack.includes(w) ? 1 : 0), 0),
        }))
        .filter((c) => c.score > 0)
        .sort((a, b) => b.score - a.score)
      return {
        topic,
        candidates: matches,
        note:
          matches.length === 0
            ? 'No canon entry matches. This topic has a data gap; seed and verify canon first.'
            : 'Only status: verified entries are citable in a published answer.',
      }
    },
  },
}

// --- minimal MCP / JSON-RPC 2.0 over newline-delimited stdio ----------------
const log = (...a) => process.stderr.write(`[kliq-research-stub] ${a.join(' ')}\n`)
const send = (msg) => process.stdout.write(JSON.stringify(msg) + '\n')
const reply = (id, result) => send({ jsonrpc: '2.0', id, result })
const replyError = (id, code, message) => send({ jsonrpc: '2.0', id, error: { code, message } })

function handle(msg) {
  const { id, method, params } = msg
  if (method === 'initialize') {
    return reply(id, {
      protocolVersion: params?.protocolVersion || '2024-11-05',
      capabilities: { tools: {} },
      serverInfo: { name: 'kliq-research-stub', version: '0.1.0' },
    })
  }
  if (method === 'notifications/initialized' || method === 'initialized') return
  if (method === 'ping') return reply(id, {})
  if (method === 'tools/list') {
    return reply(id, {
      tools: Object.entries(TOOLS).map(([name, t]) => ({
        name,
        description: t.description,
        inputSchema: t.inputSchema,
      })),
    })
  }
  if (method === 'tools/call') {
    const tool = TOOLS[params?.name]
    if (!tool) return replyError(id, -32602, `unknown tool: ${params?.name}`)
    try {
      const result = tool.handler(params.arguments || {})
      return reply(id, {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        structuredContent: { result },
      })
    } catch (err) {
      return reply(id, { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true })
    }
  }
  if (id !== undefined) replyError(id, -32601, `method not found: ${method}`)
}

const rl = createInterface({ input: process.stdin })
rl.on('line', (line) => {
  const trimmed = line.trim()
  if (!trimmed) return
  let msg
  try {
    msg = JSON.parse(trimmed)
  } catch {
    return log('skipping non-JSON line')
  }
  try {
    handle(msg)
  } catch (err) {
    log('handler error:', err.message)
    if (msg?.id !== undefined) replyError(msg.id, -32603, err.message)
  }
})
log('ready on stdio (read-only)')
