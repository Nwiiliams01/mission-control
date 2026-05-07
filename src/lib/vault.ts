import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const VAULT = process.env.VAULT_PATH || path.join(process.cwd(), '..', 'mnt', 'nathaniel-os')

export function vaultPath(...parts: string[]) {
  return path.join(VAULT, ...parts)
}

export function readMd(filePath: string): { data: Record<string, any>; content: string } | null {
  const full = vaultPath(filePath)
  if (!fs.existsSync(full)) return null
  const raw = fs.readFileSync(full, 'utf-8')
  try {
    return matter(raw)
  } catch {
    return { data: {}, content: raw }
  }
}

export function listDir(dir: string): string[] {
  const full = vaultPath(dir)
  if (!fs.existsSync(full)) return []
  return fs.readdirSync(full)
}

export function listDirs(dir: string): string[] {
  const full = vaultPath(dir)
  if (!fs.existsSync(full)) return []
  return fs.readdirSync(full).filter(f =>
    fs.statSync(path.join(full, f)).isDirectory() && !f.startsWith('_')
  )
}

export function listMdFiles(dir: string): string[] {
  const full = vaultPath(dir)
  if (!fs.existsSync(full)) return []
  return fs.readdirSync(full).filter(f => f.endsWith('.md') && !f.startsWith('_'))
}

export function writeVaultFile(filePath: string, content: string) {
  const full = vaultPath(filePath)
  const dir = path.dirname(full)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(full, content, 'utf-8')
}

// --- Knowledge Base ---

const KNOWLEDGE_IGNORE_DIRS = new Set([
  '.git',
  '.next',
  '.obsidian',
  '.trash',
  'node_modules',
  'api',
  'public',
  'dist',
  'build',
  'coverage',
  '.cache',
])

const KNOWLEDGE_IGNORE_ROOTS = new Set([
  'nathaniel-dashboard',
  'nexora-brand-voice-workspace',
  'buildin-ai-formulas-workspace',
  'outputs',
])

export interface KnowledgeLink {
  raw: string
  target: string
  display: string
  resolvedPath: string | null
  exists: boolean
}

export interface KnowledgePageSummary {
  path: string
  title: string
  basename: string
  directory: string
  headings: string[]
  tags: string[]
  status: string
  excerpt: string
  modified: string
  size: number
  links: KnowledgeLink[]
}

export interface KnowledgeGraphNode {
  id: string
  title: string
  path: string | null
  missing?: boolean
}

export interface KnowledgeGraphEdge {
  source: string
  target: string
  label: string
  missing?: boolean
}

export interface KnowledgeIndex {
  pages: KnowledgePageSummary[]
  graph: {
    nodes: KnowledgeGraphNode[]
    edges: KnowledgeGraphEdge[]
  }
  brokenLinks: Array<{ from: string; target: string; raw: string }>
  orphanPages: KnowledgePageSummary[]
  lastIndexed: string
}

function normaliseVaultRelPath(filePath: string) {
  return filePath.replace(/\\/g, '/').replace(/^\/+/, '')
}

function isSafeVaultRelPath(filePath: string) {
  const normalised = normaliseVaultRelPath(filePath)
  return normalised && !normalised.split('/').includes('..') && !path.isAbsolute(normalised)
}

function stripMarkdown(raw: string) {
  return raw
    .replace(/^---[\s\S]*?---\s*/m, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|([^\]]+))?]]/g, '$2$1')
    .replace(/[#>*_`~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function parseMatterSafe(raw: string): { data: Record<string, any>; content: string } {
  try {
    return matter(raw)
  } catch {
    return { data: {}, content: raw.replace(/^---[\s\S]*?---\s*/m, '') }
  }
}

function titleFromPath(filePath: string) {
  return path.basename(filePath, '.md').replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function slugifyNoteTitle(title: string) {
  return title
    .trim()
    .replace(/\.md$/i, '')
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'untitled-note'
}

function cleanLinkTarget(raw: string) {
  const withoutAlias = raw.split('|')[0]?.trim() ?? ''
  return withoutAlias.split('#')[0]?.split('^')[0]?.trim() ?? ''
}

function displayFromLink(raw: string) {
  const [target, alias] = raw.split('|')
  if (alias?.trim()) return alias.trim()
  const cleaned = cleanLinkTarget(target ?? raw)
  return path.basename(cleaned || raw, '.md').replace(/[-_]/g, ' ')
}

function extractTags(raw: string, frontmatterTags: unknown): string[] {
  const tags = new Set<string>()
  if (Array.isArray(frontmatterTags)) {
    frontmatterTags.forEach(tag => tags.add(String(tag).replace(/^#/, '')))
  } else if (typeof frontmatterTags === 'string') {
    frontmatterTags.split(/[,\s]+/).filter(Boolean).forEach(tag => tags.add(tag.replace(/^#/, '')))
  }
  raw.match(/(^|\s)#([A-Za-z][\w/-]*)/g)?.forEach(tag => {
    tags.add(tag.trim().replace(/^#/, ''))
  })
  return Array.from(tags).sort()
}

function extractWikilinkRaws(raw: string) {
  const results: string[] = []
  const pattern = /\[\[([^\]]+)]]/g
  let match: RegExpExecArray | null
  while ((match = pattern.exec(raw)) !== null) {
    if (match[1]?.trim()) results.push(match[1].trim())
  }
  return results
}

function listKnowledgeMarkdownFiles(dir = '', depth = 0): string[] {
  if (depth > 12) return []
  const fullDir = vaultPath(dir)
  if (!fs.existsSync(fullDir)) return []

  const results: string[] = []
  for (const item of fs.readdirSync(fullDir)) {
    const fullItem = path.join(fullDir, item)
    const relItem = normaliseVaultRelPath(dir ? `${dir}/${item}` : item)
    const stat = fs.statSync(fullItem)
    if (stat.isDirectory()) {
      const root = relItem.split('/')[0]
      if (KNOWLEDGE_IGNORE_DIRS.has(item) || KNOWLEDGE_IGNORE_ROOTS.has(root)) continue
      results.push(...listKnowledgeMarkdownFiles(relItem, depth + 1))
    } else if (stat.isFile() && item.endsWith('.md')) {
      results.push(relItem)
    }
  }
  return results
}

function buildResolutionMaps(files: string[]) {
  const exact = new Map<string, string>()
  const basename = new Map<string, string[]>()
  const title = new Map<string, string[]>()

  for (const file of files) {
    const lowerPath = file.toLowerCase()
    const base = path.basename(file, '.md').toLowerCase()
    const prettyTitle = titleFromPath(file).toLowerCase()
    exact.set(lowerPath, file)
    exact.set(lowerPath.replace(/\.md$/, ''), file)
    basename.set(base, [...(basename.get(base) ?? []), file])
    title.set(prettyTitle, [...(title.get(prettyTitle) ?? []), file])
  }

  return { exact, basename, title }
}

function resolveKnowledgeLink(target: string, maps: ReturnType<typeof buildResolutionMaps>) {
  const cleaned = cleanLinkTarget(target)
  if (!cleaned) return null
  const normalised = normaliseVaultRelPath(cleaned).replace(/^\/+/, '')
  const withExt = normalised.endsWith('.md') ? normalised : `${normalised}.md`
  const lower = normalised.toLowerCase()
  const lowerWithExt = withExt.toLowerCase()
  const base = path.basename(normalised, '.md').toLowerCase()
  const pretty = normalised.replace(/[-_]/g, ' ').toLowerCase()

  return (
    maps.exact.get(lowerWithExt) ??
    maps.exact.get(lower) ??
    maps.basename.get(base)?.[0] ??
    maps.title.get(pretty)?.[0] ??
    null
  )
}

function parseKnowledgePage(filePath: string, maps: ReturnType<typeof buildResolutionMaps>): KnowledgePageSummary | null {
  const fullPath = vaultPath(filePath)
  if (!fs.existsSync(fullPath)) return null
  const raw = fs.readFileSync(fullPath, 'utf-8')
  const parsed = parseMatterSafe(raw)
  const h1 = parsed.content.match(/^#\s+(.+)$/m)?.[1]?.trim()
  const headings = Array.from(parsed.content.matchAll(/^#{1,6}\s+(.+)$/gm)).map(match => match[1].trim())
  const stat = fs.statSync(fullPath)
  const links = extractWikilinkRaws(parsed.content).map(rawLink => {
    const target = cleanLinkTarget(rawLink)
    const resolvedPath = resolveKnowledgeLink(target, maps)
    return {
      raw: rawLink,
      target,
      display: displayFromLink(rawLink),
      resolvedPath,
      exists: Boolean(resolvedPath),
    }
  })

  return {
    path: filePath,
    title: String(parsed.data.title ?? h1 ?? titleFromPath(filePath)),
    basename: path.basename(filePath, '.md'),
    directory: path.dirname(filePath) === '.' ? '' : path.dirname(filePath),
    headings,
    tags: extractTags(raw, parsed.data.tags),
    status: String(parsed.data.status ?? raw.match(/^status::\s*(.+)$/m)?.[1]?.trim() ?? ''),
    excerpt: stripMarkdown(parsed.content).slice(0, 220),
    modified: stat.mtime.toISOString(),
    size: stat.size,
    links,
  }
}

export function getKnowledgeIndex(): KnowledgeIndex {
  const files = listKnowledgeMarkdownFiles().sort((a, b) => a.localeCompare(b))
  const maps = buildResolutionMaps(files)
  const pages = files
    .map(file => parseKnowledgePage(file, maps))
    .filter(Boolean) as KnowledgePageSummary[]
  const pageByPath = new Map(pages.map(page => [page.path, page]))
  const incoming = new Map<string, number>()
  const nodes = new Map<string, KnowledgeGraphNode>()
  const edges: KnowledgeGraphEdge[] = []
  const brokenLinks: KnowledgeIndex['brokenLinks'] = []

  for (const page of pages) {
    nodes.set(page.path, { id: page.path, title: page.title, path: page.path })
    for (const link of page.links) {
      const targetId = link.resolvedPath ?? `missing:${link.target}`
      if (link.resolvedPath) {
        incoming.set(link.resolvedPath, (incoming.get(link.resolvedPath) ?? 0) + 1)
        const targetPage = pageByPath.get(link.resolvedPath)
        nodes.set(link.resolvedPath, {
          id: link.resolvedPath,
          title: targetPage?.title ?? titleFromPath(link.resolvedPath),
          path: link.resolvedPath,
        })
      } else {
        brokenLinks.push({ from: page.path, target: link.target, raw: link.raw })
        nodes.set(targetId, { id: targetId, title: link.display, path: null, missing: true })
      }
      edges.push({ source: page.path, target: targetId, label: link.display, missing: !link.resolvedPath })
    }
  }

  const orphanPages = pages.filter(page => (incoming.get(page.path) ?? 0) === 0 && page.links.length === 0)

  return {
    pages,
    graph: { nodes: Array.from(nodes.values()), edges },
    brokenLinks,
    orphanPages,
    lastIndexed: new Date().toISOString(),
  }
}

export function getKnowledgePage(filePath: string) {
  const safePath = normaliseVaultRelPath(filePath)
  if (!isSafeVaultRelPath(safePath) || !safePath.endsWith('.md')) return null
  const fullPath = vaultPath(safePath)
  if (!fs.existsSync(fullPath)) return null

  const raw = fs.readFileSync(fullPath, 'utf-8')
  const index = getKnowledgeIndex()
  const page = index.pages.find(item => item.path === safePath)
  const backlinks = index.pages.filter(item => item.links.some(link => link.resolvedPath === safePath))
  const pageTerms = new Set([
    page?.title.toLowerCase(),
    page?.basename.toLowerCase(),
    page?.basename.replace(/[-_]/g, ' ').toLowerCase(),
  ].filter(Boolean) as string[])

  const unlinkedMentions = index.pages.filter(candidate => {
    if (candidate.path === safePath || candidate.links.some(link => link.resolvedPath === safePath)) return false
    const candidateContent = readMd(candidate.path)?.content.toLowerCase() ?? ''
    return Array.from(pageTerms).some(term => term.length > 3 && candidateContent.includes(term) && !candidateContent.includes(`[[${term}`))
  })

  return {
    page,
    content: raw,
    backlinks,
    outgoing: page?.links ?? [],
    unlinkedMentions,
    graph: index.graph,
    brokenLinks: index.brokenLinks.filter(link => link.from === safePath),
  }
}

export function searchKnowledgePages(query: string) {
  const q = query.trim().toLowerCase()
  const index = getKnowledgeIndex()
  if (!q) return index.pages.slice(0, 30)
  return index.pages
    .map(page => {
      const content = readMd(page.path)?.content.toLowerCase() ?? ''
      const haystack = [
        page.title,
        page.path,
        page.tags.join(' '),
        page.excerpt,
      ].join(' ').toLowerCase()
      const score =
        (page.title.toLowerCase().includes(q) ? 8 : 0) +
        (page.basename.toLowerCase().includes(q) ? 6 : 0) +
        (page.path.toLowerCase().includes(q) ? 4 : 0) +
        (page.tags.some(tag => tag.toLowerCase().includes(q)) ? 3 : 0) +
        (haystack.includes(q) ? 2 : 0) +
        (content.includes(q) ? 1 : 0)
      return { page, score }
    })
    .filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score || a.page.path.localeCompare(b.page.path))
    .slice(0, 50)
    .map(result => result.page)
}

export function createKnowledgePageFromLink(rawLink: string, sourcePath?: string) {
  const target = cleanLinkTarget(rawLink)
  const maps = buildResolutionMaps(listKnowledgeMarkdownFiles())
  const existing = resolveKnowledgeLink(target, maps)
  if (existing) return { path: existing, created: false }

  const folder = sourcePath && isSafeVaultRelPath(sourcePath)
    ? path.dirname(normaliseVaultRelPath(sourcePath))
    : '00_inbox'
  const safeFolder = folder === '.' || folder === '' ? '00_inbox' : folder
  const filePath = normaliseVaultRelPath(`${safeFolder}/${slugifyNoteTitle(target)}.md`)
  const title = displayFromLink(rawLink).replace(/\b\w/g, c => c.toUpperCase())
  const content = `# ${title}\n\n#inbox\nstatus:: active\n\n`
  writeVaultFile(filePath, content)
  return { path: filePath, created: true }
}

export function writeKnowledgePage(filePath: string, content: string) {
  const safePath = normaliseVaultRelPath(filePath)
  if (!isSafeVaultRelPath(safePath) || !safePath.endsWith('.md')) {
    throw new Error('Invalid Markdown path')
  }
  writeVaultFile(safePath, content)
  return safePath
}

// --- Structured data readers ---

export function getClients() {
  const dirs = listDirs('getright/clients')
  return dirs.map(slug => {
    const profile = readMd(`getright/clients/${slug}/_profile.md`)
    const status  = readMd(`getright/clients/${slug}/_status.md`)
    return { slug, profile: profile?.data ?? {}, status: status?.data ?? {}, content: profile?.content ?? '' }
  })
}

export function getDeals() {
  const dirs = listDirs('luxe/deal-pipeline')
  return dirs.map(slug => {
    const lead     = readMd(`luxe/deal-pipeline/${slug}/_lead.md`)
    const analysis = readMd(`luxe/deal-pipeline/${slug}/_analysis.md`)
    return { slug, lead: lead?.data ?? {}, leadContent: lead?.content ?? '', analysis: analysis?.data ?? {} }
  })
}

export function getInbox() {
  const files = listMdFiles('00_inbox')
  return files.map(f => {
    const parsed = readMd(`00_inbox/${f}`)
    return { file: f, data: parsed?.data ?? {}, content: parsed?.content ?? '' }
  })
}

export function getDailyLogs() {
  const files = listMdFiles('daily/logs')
  return files
    .filter(f => /^\d{4}-\d{2}-\d{2}\.md$/.test(f))
    .sort()
    .reverse()
    .slice(0, 14)
    .map(f => {
      const parsed = readMd(`daily/logs/${f}`)
      return { date: f.replace('.md', ''), data: parsed?.data ?? {}, content: parsed?.content ?? '' }
    })
}

export function getMasterContext() {
  return readMd('_master-context.md')
}

export function getGoals() {
  return readMd('personal/goals/_annual-goals.md')
}

export function getHealth() {
  return readMd('personal/health/_current-protocol.md')
}

export function getForexOverview() {
  return readMd('forex/_overview.md')
}

export function getNexoraOverview() {
  return readMd('nexora/_overview.md')
}

export function getArtistlyOverview() {
  return readMd('artistly/_overview.md')
}

export function getSubscriptions() {
  return readMd('personal/admin/_subscriptions.md')
}

// --- Trading Journal ---

export interface Trade {
  id: string
  file: string
  symbol: string
  type: 'long' | 'short'
  status: 'open' | 'closed'
  entry: number
  exit: number | null
  qty: number
  pnl: number
  pnlPct: number
  date: string
  time: string
  session: string
  strategy: string
  mistakes: string[]
  tags: string[]
  notes: string
}

export function getTrades(): Trade[] {
  const files = listMdFiles('forex/trades')
  return files
    .map(f => {
      const parsed = readMd(`forex/trades/${f}`)
      if (!parsed) return null
      return {
        file: f,
        id: parsed.data.id ?? f,
        symbol: parsed.data.symbol ?? '',
        type: parsed.data.type ?? 'long',
        status: parsed.data.status ?? 'closed',
        entry: parsed.data.entry ?? 0,
        exit: parsed.data.exit ?? null,
        qty: parsed.data.qty ?? 0,
        pnl: parsed.data.pnl ?? 0,
        pnlPct: parsed.data.pnlPct ?? 0,
        date: parsed.data.date ?? '',
        time: parsed.data.time ?? '',
        session: parsed.data.session ?? '',
        strategy: parsed.data.strategy ?? '',
        mistakes: parsed.data.mistakes ?? [],
        tags: parsed.data.tags ?? [],
        notes: parsed.content?.trim() ?? '',
      } as Trade
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b!.date).getTime() - new Date(a!.date).getTime()) as Trade[]
}

export interface JournalEntry {
  file: string
  date: string
  manualPnl: number | null
  strategies: string[]
  marketConditions: string
  emotionalState: string[]
  mistakes: string[]
  improvements: string[]
  mentalState: {
    sleep: number
    energy: number
    focus: number
    mood: number
    stress: number
    caffeine: number
  }
  reflection: string
  lesson: string
}

export function getJournalEntries(): JournalEntry[] {
  const files = listMdFiles('forex/journal')
  return files
    .filter(f => /^\d{4}-\d{2}-\d{2}\.md$/.test(f))
    .map(f => {
      const parsed = readMd(`forex/journal/${f}`)
      if (!parsed) return null
      const reflection = parsed.content.match(/## Reflection\s+([\s\S]*?)(?=## |$)/)?.[1]?.trim() ?? ''
      const lesson     = parsed.content.match(/## Lesson\s+([\s\S]*?)(?=## |$)/)?.[1]?.trim() ?? ''
      return {
        file: f,
        date: f.replace('.md', ''),
        manualPnl: parsed.data.manualPnl ?? null,
        strategies: parsed.data.strategies ?? [],
        marketConditions: parsed.data.marketConditions ?? '',
        emotionalState: parsed.data.emotionalState ?? [],
        mistakes: parsed.data.mistakes ?? [],
        improvements: parsed.data.improvements ?? [],
        mentalState: parsed.data.mentalState ?? { sleep: 0, energy: 0, focus: 0, mood: 0, stress: 0, caffeine: 0 },
        reflection,
        lesson,
      } as JournalEntry
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b!.date).getTime() - new Date(a!.date).getTime()) as JournalEntry[]
}

export function getMentalStateToday(): Record<string, number> {
  const today = new Date().toISOString().split('T')[0]
  const parsed = readMd(`forex/mental/${today}.md`)
  return parsed?.data ?? { sleep: 1, energy: 1, focus: 1, mood: 1, stress: 1, caffeine: 0 }
}

// --- Prompt Library ---

export interface Prompt {
  id: string
  file: string
  category: string
  subcategory: string
  title: string
  subject: string
  promptText: string
  notes: string
  whyItWorks: string
  tags: string[]
  date: string
  status: string
}

function listMdFilesRecursive(vaultRelDir: string): string[] {
  const fullDir = vaultPath(vaultRelDir)
  if (!fs.existsSync(fullDir)) return []
  const results: string[] = []
  for (const item of fs.readdirSync(fullDir)) {
    const fullItem = path.join(fullDir, item)
    const relItem  = `${vaultRelDir}/${item}`
    if (fs.statSync(fullItem).isDirectory()) {
      results.push(...listMdFilesRecursive(relItem))
    } else if (item.endsWith('.md') && !item.startsWith('_')) {
      results.push(relItem)
    }
  }
  return results
}

function extractSection(raw: string, sectionName: string): string {
  const pattern = new RegExp(
    `## ${sectionName}[^\\n]*\\n+([\\s\\S]*?)(?=\\n## |\\n---\\s*\\n|$)`
  )
  return raw.match(pattern)?.[1]?.trim() ?? ''
}

export function getPrompts(): Prompt[] {
  const files = listMdFilesRecursive('prompts')

  return files
    .filter(f => !f.includes('_index'))
    .map(relPath => {
      const fullPath = vaultPath(relPath)
      if (!fs.existsSync(fullPath)) return null
      const raw = fs.readFileSync(fullPath, 'utf-8')

      // Determine category from path segments
      // relPath = "prompts/<category>/<optional-subfolder>/<file>.md"
      const segments = relPath.split('/')
      let category    = segments[1] ?? 'general'
      let subcategory = ''

      if (category === 'NanoBanana2.prompts') {
        category    = 'image-gen'
        subcategory = segments[2]?.replace(/^\d+-/, '') ?? ''
        // e.g. "01-people-portraits" → "people-portraits"
        subcategory = subcategory.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      } else if (segments.length === 4) {
        // prompts/<category>/<subcategory>/<file>.md
        subcategory = segments[2]
      }

      // Title: first # heading
      const h1 = raw.match(/^# (.+)/m)?.[1]?.trim() ?? ''

      // Inline metadata
      const date   = raw.match(/^date::\s*(.+)/m)?.[1]?.trim() ?? ''
      const status = raw.match(/^status::\s*(.+)/m)?.[1]?.trim() ?? 'active'
      const tagsRaw = raw.match(/^tags::\s*(.+)/m)?.[1]?.trim() ?? ''
      const tags = tagsRaw.match(/#([\w-]+)/g)
        ?.map(t => t.replace('#', ''))
        .filter(t => t !== 'prompt') ?? []

      // Sections
      const boldTitle   = extractSection(raw, 'Title').replace(/\*\*/g, '').split('\n')[0].trim()
      const subject     = extractSection(raw, 'Subject').split('\n')[0].trim()
      const whyItWorks  = extractSection(raw, 'Why It Works')
      const notes       = extractSection(raw, 'Notes')

      // Prompt text — also handle 📋 prefix
      let promptText = extractSection(raw, 'Prompt')
      promptText = promptText.replace(/^📋\s*/m, '').trim()

      return {
        id:          path.basename(relPath, '.md'),
        file:        relPath,
        category,
        subcategory,
        title:       boldTitle || h1,
        subject,
        promptText,
        notes,
        whyItWorks,
        tags,
        date,
        status,
      } as Prompt
    })
    .filter(Boolean)
    .sort((a, b) => {
      // NanoBanana2 prompts have no date — sort by file name instead
      if (!a!.date && !b!.date) return a!.id.localeCompare(b!.id)
      if (!a!.date) return 1
      if (!b!.date) return -1
      return new Date(b!.date).getTime() - new Date(a!.date).getTime()
    }) as Prompt[]
}
