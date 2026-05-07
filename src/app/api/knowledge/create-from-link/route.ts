import { NextRequest, NextResponse } from 'next/server'
import { createKnowledgePageFromLink } from '@/lib/vault'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const { link, sourcePath } = await req.json()
  if (!link || typeof link !== 'string') {
    return NextResponse.json({ error: 'link required' }, { status: 400 })
  }

  return NextResponse.json(createKnowledgePageFromLink(link, sourcePath))
}
