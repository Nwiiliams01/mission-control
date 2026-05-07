/**
 * BlitzIt Sync API
 * Receives task payloads from BlitzIt and writes them to the vault.
 * Also exposes GET to push vault tasks back to BlitzIt.
 *
 * BlitzIt should be configured to POST to: /api/blitzeit
 * with Authorization: Bearer <BLITZEIT_API_KEY>
 */
import { NextRequest, NextResponse } from 'next/server'
import { readMd, writeVaultFile } from '@/lib/vault'
import matter from 'gray-matter'

const BLITZEIT_KEY = process.env.BLITZEIT_API_KEY ?? ''

function auth(req: NextRequest) {
  const header = req.headers.get('authorization') ?? ''
  if (!BLITZEIT_KEY) return true // dev mode – no key set
  return header === `Bearer ${BLITZEIT_KEY}`
}

// BlitzIt → Vault (receive task updates)
export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = await req.json()
  const { tasks } = body as { tasks: Array<{ id: string; title: string; status: string; business: string; dueDate?: string }> }

  const now = new Date().toISOString().split('T')[0]
  const filePath = `daily/logs/${now}-blitzeit-sync.md`
  const existing = readMd(filePath)

  const lines = tasks.map(t =>
    `- [${t.status === 'done' ? 'x' : ' '}] **${t.title}** · ${t.business}${t.dueDate ? ` · due ${t.dueDate}` : ''} \`id:${t.id}\``
  )

  const content = `---
date: ${now}
type: blitzeit-sync
tags: [tasks, blitzeit]
---

# BlitzIt Task Sync — ${now}

> Auto-synced from BlitzIt. Last updated: ${new Date().toISOString()}

${lines.join('\n')}
`
  writeVaultFile(filePath, content)
  return NextResponse.json({ ok: true, synced: tasks.length })
}

// Vault → BlitzIt (push tasks to BlitzIt)
export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const now = new Date().toISOString().split('T')[0]
  const sync = readMd(`daily/logs/${now}-blitzeit-sync.md`)

  // Also read tasks from the 90-day tracker
  const tracker = readMd('daily/luxe-90-day-execution-tracker.md')

  return NextResponse.json({
    vault: 'nathaniel-os',
    date: now,
    syncFile: sync?.content ?? null,
    tracker: tracker?.content ?? null,
  })
}
