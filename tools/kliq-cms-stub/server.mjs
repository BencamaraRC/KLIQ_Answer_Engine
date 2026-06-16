#!/usr/bin/env node
// kliq-cms dev stub: a local MCP server that mimics the kliq-cms bridge.
//
// It exposes the four Appendix C tools (search_answers, get_link_map,
// create_answer_draft, update_answer_draft) over the MCP stdio transport, backed
// by a local JSON file. It is DRAFT-ONLY by construction: there is no publish
// tool. Swap this for the real Payload-wired server (kliq-cms repo) in Phase 2.
//
// Zero dependencies. Run: node tools/kliq-cms-stub/server.mjs
// Registered as the "kliq-cms" MCP server in .mcp.json, so Claude Code exposes
// its tools as mcp__kliq-cms__<tool>.

import { createInterface } from 'node:readline'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const HERE = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(HERE, '.data')
const DB_PATH = join(DATA_DIR, 'drafts.json')
const ADMIN_BASE = process.env.KLIQ_CMS_ADMIN_BASE || 'http://localhost:3000/admin'

// --- tiny file-backed store -------------------------------------------------
function loadDb() {
  try {
    return JSON.parse(readFileSync(DB_PATH, 'utf8'))
  } catch {
    return { drafts: [], seq: 0 }
  }
}
function saveDb(db) {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })
  writeFileSync(DB_PATH, JSON.stringify(db, null, 2))
}

const ANSWER_FIELDS = [
  'title', 'slug', 'question', 'intent', 'ladderStage', 'body',
  'citedCanonIds', 'relatedQuestions', 'cta', 'seo',
]

// Reserved Growth Ladder stage slugs. An answer with one of these would shadow a
// stage hub page at /answers/<stage>, so the CMS rejects it at the boundary, not
// just by agent prompt.
const RESERVED_SLUGS = new Set(['launch', 'grow', 'monetise', 'scale'])
function assertSlugAllowed(slug) {
  if (slug !== undefined && RESERVED_SLUGS.has(String(slug))) {
    throw new Error(
      `slug "${slug}" is a reserved Growth Ladder stage; it would shadow the stage hub at /answers/${slug}`,
    )
  }
}
function pickFields(obj) {
  const out = {}
  for (const k of ANSWER_FIELDS) if (k in obj) out[k] = obj[k]
  return out
}

// crude word-overlap similarity, stand-in for pgvector
function similarity(a, b) {
  const norm = (s) => new Set(String(s || '').toLowerCase().match(/[a-z0-9]+/g) || [])
  const sa = norm(a), sb = norm(b)
  if (!sa.size || !sb.size) return 0
  let shared = 0
  for (const w of sa) if (sb.has(w)) shared++
  return Math.round((shared / Math.sqrt(sa.size * sb.size)) * 100) / 100
}

// --- the four tools ---------------------------------------------------------
const TOOLS = {
  search_answers: {
    description:
      'Search existing answers (drafts in this stub) for dedupe and related-question links. Returns matches with a similarity score.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'question, title, or slug to match' },
        limit: { type: 'number', description: 'max results, default 5' },
      },
      required: ['query'],
    },
    handler: ({ query, limit = 5 }) => {
      const db = loadDb()
      return db.drafts
        .map((d) => ({
          id: d.id,
          title: d.title,
          slug: d.slug,
          ladderStage: d.ladderStage,
          similarity: Math.max(
            similarity(query, d.question),
            similarity(query, d.title),
            similarity(query, d.slug),
          ),
        }))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit)
    },
  },

  get_link_map: {
    description:
      'Return the slug + title of answers in a given Growth Ladder stage, for internal linking.',
    inputSchema: {
      type: 'object',
      properties: {
        ladderStage: {
          type: 'string',
          enum: ['launch', 'grow', 'monetise', 'scale'],
        },
      },
      required: ['ladderStage'],
    },
    handler: ({ ladderStage }) => {
      const db = loadDb()
      return db.drafts
        .filter((d) => d.ladderStage === ladderStage)
        .map((d) => ({ slug: d.slug, title: d.title }))
    },
  },

  create_answer_draft: {
    description:
      'Create a new answer DRAFT in the CMS. The factory user cannot publish; _status is always draft.',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        slug: { type: 'string' },
        question: { type: 'string' },
        intent: { type: 'string' },
        ladderStage: { type: 'string', enum: ['launch', 'grow', 'monetise', 'scale'] },
        body: { type: 'string', description: 'answer markdown' },
        citedCanonIds: { type: 'array', items: { type: 'string' } },
        relatedQuestions: { type: 'array', items: { type: 'string' } },
        cta: { type: 'object' },
        seo: { type: 'object' },
      },
      required: ['title', 'slug'],
    },
    handler: (args) => {
      assertSlugAllowed(args.slug)
      const db = loadDb()
      if (db.drafts.some((d) => d.slug === args.slug)) {
        throw new Error(
          `a draft with slug "${args.slug}" already exists; use update_answer_draft`,
        )
      }
      db.seq = (db.seq || 0) + 1
      const id = `ans_${String(db.seq).padStart(4, '0')}`
      const draft = { id, _status: 'draft', ...pickFields(args) }
      db.drafts.push(draft)
      saveDb(db)
      return { id, adminUrl: `${ADMIN_BASE}/collections/answers/${id}`, _status: 'draft' }
    },
  },

  update_answer_draft: {
    description:
      'Update an existing answer DRAFT by id. Cannot publish; _status stays draft.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        slug: { type: 'string' },
        question: { type: 'string' },
        intent: { type: 'string' },
        ladderStage: { type: 'string', enum: ['launch', 'grow', 'monetise', 'scale'] },
        body: { type: 'string' },
        citedCanonIds: { type: 'array', items: { type: 'string' } },
        relatedQuestions: { type: 'array', items: { type: 'string' } },
        cta: { type: 'object' },
        seo: { type: 'object' },
      },
      required: ['id'],
    },
    handler: ({ id, ...rest }) => {
      assertSlugAllowed(rest.slug)
      const db = loadDb()
      const draft = db.drafts.find((d) => d.id === id)
      if (!draft) throw new Error(`no draft with id "${id}"`)
      Object.assign(draft, pickFields(rest), { _status: 'draft' })
      saveDb(db)
      return { id, _status: 'draft' }
    },
  },
}

// --- minimal MCP / JSON-RPC 2.0 over newline-delimited stdio ----------------
const log = (...a) => process.stderr.write(`[kliq-cms-stub] ${a.join(' ')}\n`)
function send(msg) {
  process.stdout.write(JSON.stringify(msg) + '\n')
}
function reply(id, result) {
  send({ jsonrpc: '2.0', id, result })
}
function replyError(id, code, message) {
  send({ jsonrpc: '2.0', id, error: { code, message } })
}

function handle(msg) {
  const { id, method, params } = msg

  if (method === 'initialize') {
    return reply(id, {
      protocolVersion: params?.protocolVersion || '2024-11-05',
      capabilities: { tools: {} },
      serverInfo: { name: 'kliq-cms-stub', version: '0.1.0' },
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
      return reply(id, {
        content: [{ type: 'text', text: `Error: ${err.message}` }],
        isError: true,
      })
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
log('ready on stdio')
