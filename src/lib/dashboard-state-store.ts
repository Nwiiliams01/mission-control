import fs from 'fs'
import path from 'path'

export type DashboardBackend = 'file' | 'supabase' | 'file-fallback'

export interface DashboardStateRecord {
  backend: DashboardBackend
  persisted: boolean
  updatedAt: string | null
  state: unknown | null
  error?: string
}

const STORE_DIR = path.join(process.cwd(), 'data')
const STORE_FILE = path.join(STORE_DIR, 'nat-os-state.json')
const DEFAULT_STATE_ID = 'default'
const DEFAULT_TABLE = 'nat_os_state'

function readFileState(): DashboardStateRecord {
  if (!fs.existsSync(STORE_FILE)) {
    return {
      backend: 'file',
      persisted: false,
      updatedAt: null,
      state: null,
    }
  }

  try {
    const stored = JSON.parse(fs.readFileSync(STORE_FILE, 'utf-8'))
    return {
      backend: 'file',
      persisted: Boolean(stored?.state),
      updatedAt: stored?.updatedAt ?? null,
      state: stored?.state ?? null,
    }
  } catch (error: any) {
    return {
      backend: 'file',
      persisted: false,
      updatedAt: null,
      state: null,
      error: error?.message ?? 'Unable to read local Nat OS state.',
    }
  }
}

function writeFileState(state: unknown, backend: DashboardBackend = 'file', error?: string): DashboardStateRecord {
  if (!fs.existsSync(STORE_DIR)) fs.mkdirSync(STORE_DIR, { recursive: true })
  const updatedAt = new Date().toISOString()
  const payload = { updatedAt, state }
  fs.writeFileSync(STORE_FILE, JSON.stringify(payload, null, 2), 'utf-8')

  return {
    backend,
    persisted: true,
    updatedAt,
    state,
    ...(error ? { error } : {}),
  }
}

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '')
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
  if (!url || !key) return null

  return {
    url,
    key,
    table: process.env.SUPABASE_STATE_TABLE ?? DEFAULT_TABLE,
    stateId: process.env.NAT_OS_STATE_ID ?? DEFAULT_STATE_ID,
  }
}

function supabaseHeaders(key: string) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    Accept: 'application/json',
  }
}

async function readSupabaseState(config: NonNullable<ReturnType<typeof getSupabaseConfig>>): Promise<DashboardStateRecord> {
  const query = new URLSearchParams({
    id: `eq.${config.stateId}`,
    select: 'id,state,updated_at',
    limit: '1',
  })
  const response = await fetch(`${config.url}/rest/v1/${config.table}?${query.toString()}`, {
    headers: supabaseHeaders(config.key),
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Supabase read failed (${response.status})`)
  }

  const rows = await response.json()
  const row = Array.isArray(rows) ? rows[0] : null
  return {
    backend: 'supabase',
    persisted: Boolean(row?.state),
    updatedAt: row?.updated_at ?? null,
    state: row?.state ?? null,
  }
}

async function writeSupabaseState(config: NonNullable<ReturnType<typeof getSupabaseConfig>>, state: unknown): Promise<DashboardStateRecord> {
  const updatedAt = new Date().toISOString()
  const response = await fetch(`${config.url}/rest/v1/${config.table}?on_conflict=id`, {
    method: 'POST',
    headers: {
      ...supabaseHeaders(config.key),
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify([{ id: config.stateId, state, updated_at: updatedAt }]),
  })

  if (!response.ok) {
    throw new Error(`Supabase write failed (${response.status})`)
  }

  const rows = await response.json()
  const row = Array.isArray(rows) ? rows[0] : null
  return {
    backend: 'supabase',
    persisted: true,
    updatedAt: row?.updated_at ?? updatedAt,
    state: row?.state ?? state,
  }
}

export async function readDashboardState(): Promise<DashboardStateRecord> {
  const config = getSupabaseConfig()
  if (!config) return readFileState()

  try {
    return await readSupabaseState(config)
  } catch (error: any) {
    const fileState = readFileState()
    return {
      ...fileState,
      backend: 'file-fallback',
      error: error?.message ?? 'Supabase unavailable. Using local file state.',
    }
  }
}

export async function writeDashboardState(state: unknown): Promise<DashboardStateRecord> {
  const config = getSupabaseConfig()
  if (!config) return writeFileState(state)

  try {
    const saved = await writeSupabaseState(config, state)
    writeFileState(state)
    return saved
  } catch (error: any) {
    return writeFileState(state, 'file-fallback', error?.message ?? 'Supabase unavailable. Saved to local file.')
  }
}
