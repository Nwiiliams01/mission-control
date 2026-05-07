import { NextResponse } from 'next/server'
import { readDashboardState, writeDashboardState } from '@/lib/dashboard-state-store'

export const dynamic = 'force-dynamic'

export async function GET() {
  const stored = await readDashboardState()
  return NextResponse.json(stored)
}

export async function PUT(request: Request) {
  const body = await request.json()
  if (!body?.state || body.state.version !== 1) {
    return NextResponse.json({ error: 'Invalid Nat OS state payload.' }, { status: 400 })
  }
  const saved = await writeDashboardState(body.state)
  return NextResponse.json({
    backend: saved.backend,
    persisted: saved.persisted,
    updatedAt: saved.updatedAt,
    fallbackError: saved.error ?? null,
  })
}
