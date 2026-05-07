import { NextRequest, NextResponse } from 'next/server'
import { searchKnowledgePages } from '@/lib/vault'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q') ?? ''
  return NextResponse.json({ results: searchKnowledgePages(query) })
}
