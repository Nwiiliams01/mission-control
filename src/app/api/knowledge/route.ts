import { NextResponse } from 'next/server'
import { getKnowledgeIndex } from '@/lib/vault'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json(getKnowledgeIndex())
}
