import { NextRequest, NextResponse } from 'next/server'
import { writeVaultFile } from '@/lib/vault'

export async function POST(req: NextRequest) {
  const { filePath, content } = await req.json()
  if (!filePath || !content) return NextResponse.json({ error: 'missing fields' }, { status: 400 })
  // Safety: disallow traversal outside vault
  if (filePath.includes('..')) return NextResponse.json({ error: 'invalid path' }, { status: 400 })
  writeVaultFile(filePath, content)
  return NextResponse.json({ ok: true })
}
