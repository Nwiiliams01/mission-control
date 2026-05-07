import { NextRequest, NextResponse } from 'next/server'
import { getKnowledgePage, writeKnowledgePage } from '@/lib/vault'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const filePath = req.nextUrl.searchParams.get('path')
  if (!filePath) return NextResponse.json({ error: 'path required' }, { status: 400 })

  const page = getKnowledgePage(filePath)
  if (!page) return NextResponse.json({ error: 'page not found' }, { status: 404 })
  return NextResponse.json(page)
}

export async function POST(req: NextRequest) {
  const { path, content } = await req.json()
  if (!path || typeof content !== 'string') {
    return NextResponse.json({ error: 'path and content required' }, { status: 400 })
  }

  try {
    const savedPath = writeKnowledgePage(path, content)
    return NextResponse.json({ ok: true, path: savedPath })
  } catch (error: any) {
    return NextResponse.json({ error: error.message ?? 'save failed' }, { status: 400 })
  }
}
