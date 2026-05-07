'use client'

import { useState, useMemo } from 'react'

interface Prompt {
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

interface PromptsData {
  all: Prompt[]
  total: number
  byCategory: Record<string, number>
}

interface Props {
  data: PromptsData
}

const CATEGORY_META: Record<string, { label: string; icon: string; color: string; bg: string }> = {
  'ai-agents':       { label: 'AI Agents',    icon: '🤖', color: 'text-teal',   bg: 'bg-teal/10'   },
  'app-development': { label: 'App Dev',       icon: '⚙️',  color: 'text-blue',   bg: 'bg-blue/10'   },
  'automation':      { label: 'Automation',    icon: '⚡',  color: 'text-amber',  bg: 'bg-amber/10'  },
  'content':         { label: 'Content',       icon: '📝',  color: 'text-green',  bg: 'bg-green/10'  },
  'image-gen':       { label: 'Image Gen',     icon: '🎨',  color: 'text-purple', bg: 'bg-purple/10' },
  'general':         { label: 'General',       icon: '📄',  color: 'text-text-secondary', bg: 'bg-muted/30' },
}

function getCategoryMeta(cat: string) {
  return CATEGORY_META[cat] ?? { label: cat, icon: '📄', color: 'text-text-secondary', bg: 'bg-muted/30' }
}

function CategoryBadge({ category }: { category: string }) {
  const meta = getCategoryMeta(category)
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded ${meta.bg} ${meta.color}`}>
      <span>{meta.icon}</span>
      {meta.label}
    </span>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-blue/10 text-blue hover:bg-blue/20 transition-colors"
    >
      {copied ? '✓ Copied' : '📋 Copy Prompt'}
    </button>
  )
}

function PromptCard({ prompt, onClick }: { prompt: Prompt; onClick: () => void }) {
  const meta = getCategoryMeta(prompt.category)
  const preview = prompt.promptText.slice(0, 140).trim()

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-card border border-border rounded-lg p-4 hover:border-blue/40 hover:bg-blue/5 transition-all group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-semibold text-text-primary leading-snug group-hover:text-blue transition-colors line-clamp-2">
          {prompt.title || prompt.id}
        </h3>
        <CategoryBadge category={prompt.category} />
      </div>

      {prompt.subcategory && (
        <p className="text-[10px] text-text-tertiary mb-1.5">{prompt.subcategory}</p>
      )}

      {prompt.subject && (
        <p className="text-xs text-text-secondary mb-2 line-clamp-1">{prompt.subject}</p>
      )}

      <p className="text-xs text-text-tertiary leading-relaxed line-clamp-3 mb-3">
        {preview}{preview.length >= 140 ? '…' : ''}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {prompt.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[10px] text-text-tertiary bg-muted/40 px-1.5 py-0.5 rounded">
              #{tag}
            </span>
          ))}
          {prompt.tags.length > 3 && (
            <span className="text-[10px] text-text-tertiary">+{prompt.tags.length - 3}</span>
          )}
        </div>
        {prompt.date && (
          <span className="text-[10px] text-text-tertiary">{prompt.date}</span>
        )}
      </div>
    </button>
  )
}

function PromptModal({ prompt, onClose }: { prompt: Prompt; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-6 pt-16 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-surface border border-border rounded-xl shadow-2xl flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-border">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-1">
              <CategoryBadge category={prompt.category} />
              {prompt.subcategory && (
                <span className="text-[10px] text-text-tertiary">{prompt.subcategory}</span>
              )}
            </div>
            <h2 className="text-base font-semibold text-text-primary leading-snug">
              {prompt.title || prompt.id}
            </h2>
            {prompt.subject && (
              <p className="text-xs text-text-secondary mt-0.5">{prompt.subject}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-text-tertiary hover:text-text-primary transition-colors text-lg leading-none flex-shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Why It Works */}
          {prompt.whyItWorks && (
            <div>
              <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                Why It Works
              </h4>
              <p className="text-sm text-text-secondary leading-relaxed">{prompt.whyItWorks}</p>
            </div>
          )}

          {/* Prompt Text */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Prompt
              </h4>
              <CopyButton text={prompt.promptText} />
            </div>
            <div className="bg-void border border-border rounded-lg p-4">
              <pre className="text-sm text-text-primary whitespace-pre-wrap font-mono leading-relaxed">
                {prompt.promptText}
              </pre>
            </div>
          </div>

          {/* Notes */}
          {prompt.notes && (
            <div>
              <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                Notes
              </h4>
              <div className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                {prompt.notes}
              </div>
            </div>
          )}

          {/* Tags + Date */}
          {(prompt.tags.length > 0 || prompt.date) && (
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div className="flex flex-wrap gap-1">
                {prompt.tags.map(tag => (
                  <span key={tag} className="text-[10px] text-text-tertiary bg-muted/40 px-1.5 py-0.5 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
              {prompt.date && (
                <span className="text-[10px] text-text-tertiary">{prompt.date}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function PromptLibraryView({ data }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)

  const prompts = data?.all ?? []

  // Build category list from actual data
  const categories = useMemo(() => {
    const cats = Array.from(new Set(prompts.map(p => p.category)))
    return cats.sort()
  }, [prompts])

  const filtered = useMemo(() => {
    return prompts.filter(p => {
      const matchCat = activeCategory === 'all' || p.category === activeCategory
      if (!matchCat) return false
      if (!search.trim()) return true
      const q = search.toLowerCase()
      return (
        p.title.toLowerCase().includes(q) ||
        p.subject.toLowerCase().includes(q) ||
        p.promptText.toLowerCase().includes(q) ||
        p.tags.some(t => t.includes(q))
      )
    })
  }, [prompts, activeCategory, search])

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-bold text-text-primary">Prompt Library</h1>
          <span className="text-sm text-text-tertiary">{data?.total ?? 0} prompts</span>
        </div>
        <p className="text-sm text-text-secondary">
          Saved AI prompts organized by use case. Click any card to view and copy.
        </p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search prompts, tags, or content…"
          className="flex-1 bg-card border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-blue/50 glow-blue"
        />
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            activeCategory === 'all'
              ? 'bg-blue text-white'
              : 'bg-card border border-border text-text-secondary hover:text-text-primary'
          }`}
        >
          All ({data?.total ?? 0})
        </button>
        {categories.map(cat => {
          const meta = getCategoryMeta(cat)
          const count = data?.byCategory?.[cat] ?? 0
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeCategory === cat
                  ? `${meta.bg} ${meta.color} border border-current/20`
                  : 'bg-card border border-border text-text-secondary hover:text-text-primary'
              }`}
            >
              <span>{meta.icon}</span>
              {meta.label} ({count})
            </button>
          )
        })}
      </div>

      {/* Results count */}
      {search && (
        <p className="text-xs text-text-tertiary mb-4">
          {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{search}"
        </p>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-sm text-text-secondary">No prompts found</p>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="mt-2 text-xs text-blue hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => (
            <PromptCard
              key={p.id}
              prompt={p}
              onClick={() => setSelectedPrompt(p)}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedPrompt && (
        <PromptModal
          prompt={selectedPrompt}
          onClose={() => setSelectedPrompt(null)}
        />
      )}
    </div>
  )
}
