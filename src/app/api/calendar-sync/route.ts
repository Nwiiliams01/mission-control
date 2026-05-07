import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const SNAPSHOT_FILE = path.join(process.cwd(), 'data', 'google-calendar-import.json')

export async function GET() {
  if (!fs.existsSync(SNAPSHOT_FILE)) {
    return NextResponse.json({
      source: 'google-calendar-snapshot',
      syncedAt: null,
      window: null,
      events: [],
    })
  }

  try {
    const snapshot = JSON.parse(fs.readFileSync(SNAPSHOT_FILE, 'utf-8'))
    return NextResponse.json({
      source: 'google-calendar-snapshot',
      syncedAt: snapshot.syncedAt ?? null,
      window: snapshot.window ?? null,
      events: Array.isArray(snapshot.events) ? snapshot.events : [],
    })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message ?? 'Unable to read Google Calendar snapshot.' }, { status: 500 })
  }
}
