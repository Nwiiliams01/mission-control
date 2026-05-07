'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertTriangle,
  Braces,
  CircleDot,
  FilePlus2,
  GitBranch,
  Link2,
  Loader2,
  Network,
  Save,
  Search,
  Sparkles,
} from 'lucide-react'
import type { VaultData } from '@/app/page'
import { Badge } from '@/components/Card'

interface Props { data: VaultData }

interface KnowledgeLink {
  raw: string
  target: string
  display: string
  resolvedPath: string | null
  exists: boolean
}

interface KnowledgePageSummary {
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

interface KnowledgeGraphNode {
  id: string
  title: string
  path: string | null
  missing?: boolean
}

interface KnowledgeGraphEdge {
  source: string
  target: string
  label: string
  missing?: boolean
}

interface KnowledgeIndex {
  pages: KnowledgePageSummary[]
  graph: {
    nodes: KnowledgeGraphNode[]
    edges: KnowledgeGraphEdge[]
  }
  brokenLinks: Array<{ from: string; target: string; raw: string }>
  orphanPages: KnowledgePageSummary[]
  lastIndexed: string
}

interface KnowledgePageResponse {
  page: KnowledgePageSummary
  content: string
  backlinks: KnowledgePageSummary[]
  outgoing: KnowledgeLink[]
  unlinkedMentions: KnowledgePageSummary[]
  graph: KnowledgeIndex['graph']
  brokenLinks: Array<{ from: string; target: string; raw: string }>
}

interface TreeNode {
  name: string
  path: string
  children: Map<string, TreeNode>
  page?: KnowledgePageSummary
}

const START_PAGES = ['_master-context.md', 'INDEX.md', 'AGENTS.md']

function titleToSlug(title: string) {
  return title
    .trim()
    .replace(/\.md$/i, '')
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'untitled-note'
}

function formatTime(value: string) {
  return new Date(value).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function buildTree(pages: KnowledgePageSummary[]) {
  const root: TreeNode = { name: 'vault', path: '', children: new Map() }
  for (const page of pages) {
    const parts = page.path.split('/')
    let cursor = root
    parts.forEach((part, index) => {
      const currentPath = parts.slice(0, index + 1).join('/')
      if (!cursor.children.has(part)) {
        cursor.children.set(part, { name: part, path: currentPath, children: new Map() })
      }
      cursor = cursor.children.get(part)!
      if (index === parts.length - 1) cursor.page = page
    })
  }
  return root
}

function wikilinkParts(raw: string) {
  const [target, alias] = raw.split('|')
  const cleanTarget = (target ?? '').split('#')[0].split('^')[0].trim()
  return {
    target: cleanTarget,
    label: alias?.trim() || cleanTarget.split('/').pop()?.replace(/\.md$/i, '') || raw,
  }
}

function InlineMarkdown({
  text,
  currentPath,
  onOpen,
  onCreateFromLink,
}: {
  text: string
  currentPath: string
  onOpen: (path: string) => void
  onCreateFromLink: (link: string, sourcePath?: string) => void
}) {
  const nodes: React.ReactNode[] = []
  const pattern = /\[\[([^\]]+)]]/g
  let last = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(text)) !== null) {
    const before = text.slice(last, match.index)
    if (before) nodes.push(before)
    const raw = match[1]
    const { label } = wikilinkParts(raw)
    nodes.push(
      <button
        key={`${raw}-${match.index}`}
        type="button"
        onClick={() => onCreateFromLink(raw, currentPath)}
        className="mx-0.5 inline-flex items-center rounded border border-blue/25 bg-blue-dim/40 px-1.5 py-0.5 text-blue hover:border-blue/60"
      >
        {label}
      </button>
    )
    last = pattern.lastIndex
  }

  const rest = text.slice(last)
  if (rest) nodes.push(rest)
  return <>{nodes}</>
}

function MarkdownPreview({
  content,
  currentPath,
  onOpen,
  onCreateFromLink,
}: {
  content: string
  currentPath: string
  onOpen: (path: string) => void
  onCreateFromLink: (link: string, sourcePath?: string) => void
}) {
  const lines = content.replace(/^---[\s\S]*?---\s*/m, '').split('\n')
  const blocks: React.ReactNode[] = []
  let listItems: string[] = []
  let codeLines: string[] = []
  let inCode = false

  const flushList = () => {
    if (!listItems.length) return
    blocks.push(
      <ul key={`ul-${blocks.length}`} className="mb-3 list-disc space-y-1 pl-5">
        {listItems.map((item, index) => (
          <li key={`${item}-${index}`}>
            <InlineMarkdown text={item} currentPath={currentPath} onOpen={onOpen} onCreateFromLink={onCreateFromLink} />
          </li>
        ))}
      </ul>
    )
    listItems = []
  }

  const flushCode = () => {
    if (!codeLines.length) return
    blocks.push(
      <pre key={`code-${blocks.length}`} className="mb-3 overflow-x-auto rounded-md border border-border bg-void p-3 text-xs text-text-secondary">
        <code>{codeLines.join('\n')}</code>
      </pre>
    )
    codeLines = []
  }

  lines.forEach((line, index) => {
    if (line.trim().startsWith('```')) {
      if (inCode) {
        flushCode()
        inCode = false
      } else {
        flushList()
        inCode = true
      }
      return
    }

    if (inCode) {
      codeLines.push(line)
      return
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/)
    if (heading) {
      flushList()
      const level = heading[1].length
      const className = level === 1
        ? 'mb-3 mt-1 text-2xl font-semibold text-text-primary'
        : level === 2
          ? 'mb-2 mt-5 text-lg font-semibold text-text-primary'
          : 'mb-2 mt-4 text-sm font-semibold uppercase tracking-wide text-text-secondary'
      blocks.push(
        <div key={`h-${index}`} className={className}>
          <InlineMarkdown text={heading[2]} currentPath={currentPath} onOpen={onOpen} onCreateFromLink={onCreateFromLink} />
        </div>
      )
      return
    }

    const list = line.match(/^\s*[-*]\s+(.+)$/)
    if (list) {
      listItems.push(list[1])
      return
    }

    if (!line.trim()) {
      flushList()
      return
    }

    flushList()
    blocks.push(
      <p key={`p-${index}`} className="mb-3 leading-7 text-text-secondary">
        <InlineMarkdown text={line} currentPath={currentPath} onOpen={onOpen} onCreateFromLink={onCreateFromLink} />
      </p>
    )
  })

  flushList()
  flushCode()

  return <div className="prose-vault max-w-none">{blocks}</div>
}

function TreeBranch({
  node,
  activePath,
  onOpen,
  level = 0,
}: {
  node: TreeNode
  activePath: string | null
  onOpen: (path: string) => void
  level?: number
}) {
  const children = Array.from(node.children.values()).sort((a, b) => {
    if (a.page && !b.page) return 1
    if (!a.page && b.page) return -1
    return a.name.localeCompare(b.name)
  })

  return (
    <>
      {children.map(child => {
        if (child.page) {
          return (
            <button
              key={child.path}
              type="button"
              onClick={() => onOpen(child.page!.path)}
              className={`flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left text-xs transition ${
                activePath === child.page.path
                  ? 'bg-blue/12 text-text-primary'
                  : 'text-text-secondary hover:bg-muted/30 hover:text-text-primary'
              }`}
              style={{ paddingLeft: `${8 + level * 12}px` }}
            >
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue/60" />
              <span className="min-w-0">
                <span className="block truncate">{child.page.title}</span>
                <span className="block truncate font-mono text-[10px] text-text-tertiary">{child.page.path}</span>
              </span>
            </button>
          )
        }

        return (
          <div key={child.path}>
            <div
              className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-tertiary"
              style={{ paddingLeft: `${8 + level * 12}px` }}
            >
              {child.name}
            </div>
            <TreeBranch node={child} activePath={activePath} onOpen={onOpen} level={level + 1} />
          </div>
        )
      })}
    </>
  )
}

function RelationGraph({
  index,
  currentPath,
  onOpen,
  onCreateFromLink,
}: {
  index: KnowledgeIndex | null
  currentPath: string | null
  onOpen: (path: string) => void
  onCreateFromLink: (link: string, sourcePath?: string) => void
}) {
  const graph = useMemo(() => {
    if (!index || !currentPath) return null
    const relatedEdges = index.graph.edges.filter(edge => edge.source === currentPath || edge.target === currentPath)
    const nodeIds = new Set([currentPath, ...relatedEdges.flatMap(edge => [edge.source, edge.target])])
    const nodes = index.graph.nodes.filter(node => nodeIds.has(node.id)).slice(0, 18)
    const visibleIds = new Set(nodes.map(node => node.id))
    const edges = relatedEdges.filter(edge => visibleIds.has(edge.source) && visibleIds.has(edge.target))
    const centre = { x: 180, y: 132 }
    const radius = 92
    const positions = new Map<string, { x: number; y: number }>()
    const outer = nodes.filter(node => node.id !== currentPath)
    positions.set(currentPath, centre)
    outer.forEach((node, index) => {
      const angle = (Math.PI * 2 * index) / Math.max(outer.length, 1) - Math.PI / 2
      positions.set(node.id, {
        x: centre.x + Math.cos(angle) * radius,
        y: centre.y + Math.sin(angle) * radius,
      })
    })
    return { nodes, edges, positions }
  }, [index, currentPath])

  if (!graph) {
    return <div className="flex h-64 items-center justify-center text-sm text-text-tertiary">Open a page to map its relations.</div>
  }

  return (
    <svg viewBox="0 0 360 264" className="h-64 w-full rounded-lg border border-border bg-void">
      {graph.edges.map(edge => {
        const source = graph.positions.get(edge.source)
        const target = graph.positions.get(edge.target)
        if (!source || !target) return null
        return (
          <line
            key={`${edge.source}-${edge.target}-${edge.label}`}
            x1={source.x}
            y1={source.y}
            x2={target.x}
            y2={target.y}
            stroke={edge.missing ? '#EF4444' : '#2A3441'}
            strokeWidth="1.5"
          />
        )
      })}
      {graph.nodes.map(node => {
        const point = graph.positions.get(node.id)
        if (!point) return null
        const active = node.id === currentPath
        return (
          <g
            key={node.id}
            role="button"
            tabIndex={0}
            onClick={() => node.path ? onOpen(node.path) : onCreateFromLink(node.title, currentPath ?? undefined)}
            className="cursor-pointer"
          >
            <circle
              cx={point.x}
              cy={point.y}
              r={active ? 18 : 13}
              fill={node.missing ? '#3D0D0D' : active ? '#1D3A6B' : '#161C26'}
              stroke={node.missing ? '#EF4444' : active ? '#60A5FA' : '#3B82F6'}
              strokeWidth={active ? 2.5 : 1.5}
            />
            <text
              x={point.x}
              y={point.y + (active ? 30 : 25)}
              textAnchor="middle"
              fill={node.missing ? '#EF4444' : '#8B95A3'}
              fontSize="9"
            >
              {node.title.length > 20 ? `${node.title.slice(0, 19)}...` : node.title}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export default function KnowledgeBaseView({ data }: Props) {
  const [index, setIndex] = useState<KnowledgeIndex | null>(null)
  const [pageData, setPageData] = useState<KnowledgePageResponse | null>(null)
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const [content, setContent] = useState('')
  const [savedContent, setSavedContent] = useState('')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'saving' | 'saved' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)
  const [linkQuery, setLinkQuery] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const dirty = content !== savedContent

  const loadIndex = useCallback(async () => {
    const res = await fetch('/api/knowledge', { cache: 'no-store' })
    if (!res.ok) throw new Error(`Knowledge index ${res.status}`)
    const nextIndex = await res.json() as KnowledgeIndex
    setIndex(nextIndex)
    return nextIndex
  }, [])

  const openPage = useCallback(async (path: string) => {
    setStatus('loading')
    setError(null)
    const res = await fetch(`/api/knowledge/page?path=${encodeURIComponent(path)}`, { cache: 'no-store' })
    if (!res.ok) {
      setStatus('error')
      setError(`Could not open ${path}`)
      return
    }
    const page = await res.json() as KnowledgePageResponse
    setSelectedPath(path)
    setPageData(page)
    setContent(page.content)
    setSavedContent(page.content)
    setStatus('idle')
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setStatus('loading')
        const nextIndex = await loadIndex()
        if (cancelled) return
        const startPath = START_PAGES.find(path => nextIndex.pages.some(page => page.path === path)) ?? nextIndex.pages[0]?.path
        if (startPath) await openPage(startPath)
        else setStatus('idle')
      } catch (err: any) {
        if (!cancelled) {
          setStatus('error')
          setError(err.message ?? 'Could not load Knowledge Base')
        }
      }
    })()
    return () => { cancelled = true }
  }, [loadIndex, openPage])

  const filteredPages = useMemo(() => {
    if (!index) return []
    const q = query.trim().toLowerCase()
    if (!q) return index.pages
    return index.pages.filter(page =>
      page.title.toLowerCase().includes(q) ||
      page.path.toLowerCase().includes(q) ||
      page.tags.some(tag => tag.toLowerCase().includes(q)) ||
      page.excerpt.toLowerCase().includes(q)
    )
  }, [index, query])

  const recentPages = useMemo(() => {
    return [...(index?.pages ?? [])]
      .sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime())
      .slice(0, 8)
  }, [index])

  const tree = useMemo(() => buildTree(filteredPages), [filteredPages])

  const linkSuggestions = useMemo(() => {
    if (linkQuery === null || !index) return []
    const q = linkQuery.toLowerCase()
    return index.pages
      .filter(page => page.title.toLowerCase().includes(q) || page.path.toLowerCase().includes(q))
      .slice(0, 7)
  }, [index, linkQuery])

  const savePage = async () => {
    if (!selectedPath) return
    setStatus('saving')
    setError(null)
    const res = await fetch('/api/knowledge/page', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: selectedPath, content }),
    })
    if (!res.ok) {
      setStatus('error')
      setError('Save failed')
      return
    }
    setSavedContent(content)
    setStatus('saved')
    await loadIndex()
    await openPage(selectedPath)
  }

  const createNote = async () => {
    const title = window.prompt('Page title')
    if (!title?.trim()) return
    const filePath = `00_inbox/${titleToSlug(title)}.md`
    const starter = `# ${title.trim()}\n\n#inbox\nstatus:: active\n\n`
    const res = await fetch('/api/knowledge/page', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: filePath, content: starter }),
    })
    if (!res.ok) {
      setError('Could not create page')
      setStatus('error')
      return
    }
    await loadIndex()
    await openPage(filePath)
  }

  const createFromLink = async (link: string, sourcePath?: string) => {
    const existing = pageData?.outgoing.find(item => item.raw === link || item.target === link)
    if (existing?.resolvedPath) {
      openPage(existing.resolvedPath)
      return
    }

    const res = await fetch('/api/knowledge/create-from-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ link, sourcePath }),
    })
    if (!res.ok) {
      setError('Could not create linked page')
      setStatus('error')
      return
    }
    const result = await res.json() as { path: string; created: boolean }
    await loadIndex()
    await openPage(result.path)
  }

  const handleEditorChange = (value: string) => {
    setContent(value)
    const textarea = textareaRef.current
    if (!textarea) return
    const beforeCursor = value.slice(0, textarea.selectionStart)
    const open = beforeCursor.lastIndexOf('[[')
    const close = beforeCursor.lastIndexOf(']]')
    if (open > close) {
      setLinkQuery(beforeCursor.slice(open + 2))
    } else {
      setLinkQuery(null)
    }
  }

  const insertSuggestion = (page: KnowledgePageSummary) => {
    const textarea = textareaRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const beforeCursor = content.slice(0, start)
    const open = beforeCursor.lastIndexOf('[[')
    if (open === -1) return
    const next = `${content.slice(0, open)}[[${page.basename}]]${content.slice(start)}`
    setContent(next)
    setLinkQuery(null)
    requestAnimationFrame(() => {
      textarea.focus()
      const position = open + page.basename.length + 4
      textarea.setSelectionRange(position, position)
    })
  }

  const currentPage = pageData?.page

  return (
    <div className="flex h-full min-h-screen bg-void text-text-primary">
      <aside className="w-72 flex-shrink-0 overflow-y-auto border-r border-border bg-surface">
        <div className="sticky top-0 z-10 border-b border-border bg-surface/95 p-4 backdrop-blur">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Knowledge Base</h1>
              <p className="text-[11px] text-text-tertiary">{index?.pages.length ?? 0} pages indexed</p>
            </div>
            <button
              type="button"
              onClick={createNote}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-panel text-text-secondary hover:border-blue/50 hover:text-blue"
              title="Create page"
            >
              <FilePlus2 size={17} />
            </button>
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-2.5 text-text-tertiary" size={15} />
            <input
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Search pages, paths, tags..."
              className="w-full rounded-md border border-border bg-void py-2 pl-9 pr-3 text-sm text-text-primary placeholder-text-tertiary outline-none focus:border-blue/50"
            />
          </div>
        </div>

        <div className="p-3">
          {query.trim() ? (
            <div className="mb-4">
              <div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
                {filteredPages.length} result{filteredPages.length === 1 ? '' : 's'}
              </div>
              <div className="space-y-1">
                {filteredPages.slice(0, 80).map(page => (
                  <button
                    key={page.path}
                    type="button"
                    onClick={() => openPage(page.path)}
                    className={`w-full rounded-md px-2 py-2 text-left text-xs ${
                      selectedPath === page.path ? 'bg-blue/12' : 'hover:bg-muted/30'
                    }`}
                  >
                    <span className="block truncate text-text-primary">{page.title}</span>
                    <span className="block truncate font-mono text-[10px] text-text-tertiary">{page.path}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">Recent</div>
                <div className="space-y-1">
                  {recentPages.map(page => (
                    <button
                      key={page.path}
                      type="button"
                      onClick={() => openPage(page.path)}
                      className="w-full rounded-md px-2 py-2 text-left text-xs hover:bg-muted/30"
                    >
                      <span className="block truncate text-text-secondary">{page.title}</span>
                      <span className="block text-[10px] text-text-tertiary">{formatTime(page.modified)}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">Vault Tree</div>
              <TreeBranch node={tree} activePath={selectedPath} onOpen={openPage} />
            </>
          )}
        </div>
      </aside>

      <main className="min-w-0 flex-1 overflow-y-auto">
        <div className="sticky top-0 z-20 border-b border-border bg-void/95 px-5 py-3 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="truncate text-xl font-semibold tracking-tight">{currentPage?.title ?? 'Knowledge Base'}</h2>
                {dirty && <Badge label="unsaved" color="amber" />}
                {status === 'saved' && !dirty && <Badge label="saved" color="green" />}
              </div>
              <div className="mt-1 truncate font-mono text-[11px] text-text-tertiary">{selectedPath ?? 'Choose a page'}</div>
            </div>
            <button
              type="button"
              onClick={savePage}
              disabled={!selectedPath || !dirty || status === 'saving'}
              className="inline-flex items-center gap-2 rounded-md border border-blue/30 bg-blue-dim px-3 py-2 text-sm text-blue transition hover:border-blue disabled:cursor-not-allowed disabled:opacity-45"
            >
              {status === 'saving' ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              Save
            </button>
          </div>
          {error && (
            <div className="mt-2 flex items-center gap-2 rounded-md border border-red/30 bg-red-dim px-3 py-2 text-xs text-red">
              <AlertTriangle size={14} />
              {error}
            </div>
          )}
        </div>

        {status === 'loading' && !pageData ? (
          <div className="flex h-96 items-center justify-center gap-2 text-sm text-text-tertiary">
            <Loader2 size={16} className="animate-spin" />
            Loading knowledge graph...
          </div>
        ) : (
          <div className="grid min-h-[calc(100vh-86px)] grid-cols-1 xl:grid-cols-2">
            <section className="relative border-r border-border">
              <div className="flex items-center justify-between border-b border-border px-4 py-2">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                  <Braces size={14} />
                  Editor
                </div>
                <div className="text-[10px] text-text-tertiary">Type [[ to link pages</div>
              </div>
              <textarea
                ref={textareaRef}
                value={content}
                onChange={event => handleEditorChange(event.target.value)}
                spellCheck
                className="h-[calc(100vh-129px)] w-full resize-none bg-void p-5 font-mono text-sm leading-7 text-text-primary outline-none placeholder-text-tertiary"
                placeholder="# New page..."
              />
              {linkQuery !== null && (
                <div className="absolute left-5 top-16 z-30 w-80 overflow-hidden rounded-lg border border-border bg-card shadow-2xl">
                  <div className="border-b border-border px-3 py-2 text-[10px] uppercase tracking-wider text-text-tertiary">
                    Link suggestions
                  </div>
                  {linkSuggestions.length ? linkSuggestions.map(page => (
                    <button
                      key={page.path}
                      type="button"
                      onClick={() => insertSuggestion(page)}
                      className="block w-full px-3 py-2 text-left text-xs hover:bg-muted/30"
                    >
                      <span className="block text-text-primary">{page.title}</span>
                      <span className="block truncate font-mono text-[10px] text-text-tertiary">{page.path}</span>
                    </button>
                  )) : (
                    <button
                      type="button"
                      onClick={() => createFromLink(linkQuery || 'untitled note', selectedPath ?? undefined)}
                      className="block w-full px-3 py-3 text-left text-xs text-blue hover:bg-muted/30"
                    >
                      Create [[{linkQuery || 'untitled note'}]]
                    </button>
                  )}
                </div>
              )}
            </section>

            <section>
              <div className="flex items-center gap-2 border-b border-border px-4 py-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                <Sparkles size={14} />
                Preview
              </div>
              <div className="h-[calc(100vh-129px)] overflow-y-auto p-6">
                <MarkdownPreview
                  content={content}
                  currentPath={selectedPath ?? ''}
                  onOpen={openPage}
                  onCreateFromLink={createFromLink}
                />
              </div>
            </section>
          </div>
        )}
      </main>

      <aside className="hidden w-80 flex-shrink-0 overflow-y-auto border-l border-border bg-surface xl:block">
        <div className="border-b border-border p-4">
          <div className="mb-3 flex items-center gap-2">
            <Network size={16} className="text-blue" />
            <h2 className="text-sm font-semibold">Relation Explorer</h2>
          </div>
          <RelationGraph index={index} currentPath={selectedPath} onOpen={openPage} onCreateFromLink={createFromLink} />
        </div>

        <div className="space-y-5 p-4">
          <section>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
              <Link2 size={13} />
              Backlinks
            </div>
            <div className="space-y-1">
              {pageData?.backlinks.length ? pageData.backlinks.map(page => (
                <button key={page.path} type="button" onClick={() => openPage(page.path)} className="w-full rounded-md px-2 py-2 text-left text-xs hover:bg-muted/30">
                  <span className="block truncate text-text-primary">{page.title}</span>
                  <span className="block truncate font-mono text-[10px] text-text-tertiary">{page.path}</span>
                </button>
              )) : <p className="text-xs text-text-tertiary">No backlinks yet.</p>}
            </div>
          </section>

          <section>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
              <GitBranch size={13} />
              Outgoing Links
            </div>
            <div className="space-y-1">
              {pageData?.outgoing.length ? pageData.outgoing.map(link => (
                <button
                  key={`${link.raw}-${link.resolvedPath ?? link.target}`}
                  type="button"
                  onClick={() => link.resolvedPath ? openPage(link.resolvedPath) : createFromLink(link.raw, selectedPath ?? undefined)}
                  className={`w-full rounded-md px-2 py-2 text-left text-xs hover:bg-muted/30 ${link.exists ? '' : 'border border-red/20 bg-red-dim/20'}`}
                >
                  <span className={link.exists ? 'block truncate text-text-primary' : 'block truncate text-red'}>{link.display}</span>
                  <span className="block truncate font-mono text-[10px] text-text-tertiary">{link.resolvedPath ?? 'missing - click to create'}</span>
                </button>
              )) : <p className="text-xs text-text-tertiary">No outgoing links.</p>}
            </div>
          </section>

          <section>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
              <CircleDot size={13} />
              Unlinked Mentions
            </div>
            <div className="space-y-1">
              {pageData?.unlinkedMentions.length ? pageData.unlinkedMentions.slice(0, 8).map(page => (
                <button key={page.path} type="button" onClick={() => openPage(page.path)} className="w-full rounded-md px-2 py-2 text-left text-xs hover:bg-muted/30">
                  <span className="block truncate text-text-primary">{page.title}</span>
                  <span className="block truncate font-mono text-[10px] text-text-tertiary">{page.path}</span>
                </button>
              )) : <p className="text-xs text-text-tertiary">No obvious unlinked mentions.</p>}
            </div>
          </section>

          <section className="rounded-lg border border-border bg-panel p-3">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary">Page Metadata</div>
            <div className="space-y-2 text-xs text-text-secondary">
              <div className="flex justify-between gap-3"><span>Modified</span><span className="text-right">{currentPage ? formatTime(currentPage.modified) : '-'}</span></div>
              <div className="flex justify-between gap-3"><span>Headings</span><span>{currentPage?.headings.length ?? 0}</span></div>
              <div className="flex justify-between gap-3"><span>Outgoing</span><span>{pageData?.outgoing.length ?? 0}</span></div>
              <div className="flex justify-between gap-3"><span>Backlinks</span><span>{pageData?.backlinks.length ?? 0}</span></div>
              <div className="flex justify-between gap-3"><span>Broken</span><span className={pageData?.brokenLinks.length ? 'text-red' : ''}>{pageData?.brokenLinks.length ?? 0}</span></div>
            </div>
            {!!currentPage?.tags.length && (
              <div className="mt-3 flex flex-wrap gap-1">
                {currentPage.tags.slice(0, 8).map(tag => <Badge key={tag} label={`#${tag}`} color="muted" />)}
              </div>
            )}
          </section>

          <section>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
              <AlertTriangle size={13} />
              Vault Health
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-md border border-border bg-panel p-2">
                <div className="text-lg font-semibold text-text-primary">{index?.brokenLinks.length ?? 0}</div>
                <div className="text-text-tertiary">broken links</div>
              </div>
              <div className="rounded-md border border-border bg-panel p-2">
                <div className="text-lg font-semibold text-text-primary">{index?.orphanPages.length ?? 0}</div>
                <div className="text-text-tertiary">orphans</div>
              </div>
            </div>
          </section>
        </div>
      </aside>
    </div>
  )
}
