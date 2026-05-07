import { NextRequest, NextResponse } from 'next/server'
import { writeVaultFile, getTrades } from '@/lib/vault'
import matter from 'gray-matter'

export async function GET() {
  const trades = getTrades()
  return NextResponse.json({ trades })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const {
    id, symbol, type, status, entry, exit, qty,
    pnl, pnlPct, date, time, session, strategy,
    mistakes, tags, notes
  } = body

  if (!symbol || !entry || !qty || !date) {
    return NextResponse.json({ error: 'missing required fields' }, { status: 400 })
  }

  const tradeId = id || String(Date.now()).slice(-4)
  const fileName = `${date}_${symbol}_${type.toUpperCase()}_${tradeId}.md`

  const frontmatter = {
    id: tradeId,
    symbol,
    type,
    status: status || 'closed',
    entry,
    exit: exit || null,
    qty,
    pnl: pnl || 0,
    pnlPct: pnlPct || 0,
    date,
    time: time || '',
    session: session || 'Asian',
    strategy: strategy || '',
    mistakes: mistakes || [],
    tags: tags || [],
  }

  const fileContent = matter.stringify(notes || '', frontmatter)
  writeVaultFile(`forex/trades/${fileName}`, fileContent)

  return NextResponse.json({ ok: true, file: fileName })
}

export async function DELETE(req: NextRequest) {
  const { file } = await req.json()
  if (!file || file.includes('..')) {
    return NextResponse.json({ error: 'invalid file' }, { status: 400 })
  }
  const { vaultPath } = await import('@/lib/vault')
  const fs = await import('fs')
  const fullPath = vaultPath(`forex/trades/${file}`)
  if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath)
  return NextResponse.json({ ok: true })
}
