'use client'

import { useState } from 'react'
import { Card, Stat, SectionHeader, Badge, EmptyState } from '@/components/Card'

interface Props { data: any; refresh: () => void }

// ── CRM spec sub-sections ──────────────────────────────────────────────────

const CRM_MODULES = [
  {
    id: 'contacts',
    label: 'Contacts & Pipeline',
    icon: '👤',
    summary: 'Contact records, full activity timeline, bulk CSV import, Kanban pipeline with drag-and-drop deal board.',
    stages: ['New Lead', 'Contacted', 'Proposal Sent', 'Negotiating', 'Closed Won', 'Closed Lost'],
    fields: ['first_name', 'last_name', 'email', 'phone', 'company', 'source', 'tags', 'owner_id', 'created_at', 'last_activity'],
    notes: [
      'Contact detail page with full activity timeline (calls, emails, SMS, notes, stage changes)',
      'Each deal card shows: contact name, deal value, days in stage, last touch',
      'Quick-edit from board without opening full record',
      'Pipeline value summary at top (total + per stage)',
    ],
  },
  {
    id: 'inbox',
    label: 'SMS & Email Inbox',
    icon: '💬',
    summary: 'Two-way SMS via Twilio, email via Resend, unified inbox with unread badge. Send/receive from inside CRM.',
    stages: [],
    fields: [],
    notes: [
      'SMS templates with variable merge fields ({{first_name}}, {{company}})',
      'Email: rich text editor (TipTap), open/click tracking per email',
      'Unified inbox tab — filter by channel, owner, unread',
      'Supabase Realtime for live message updates without refresh',
    ],
  },
  {
    id: 'automations',
    label: 'Automations',
    icon: '⚙️',
    summary: 'Trigger → action workflow engine. Linear step builder. Pre-built templates: New Lead Sequence, Stage Move Alert, Re-engagement.',
    stages: [],
    fields: [],
    notes: [
      'Triggers: new contact, tag added, stage changed, form submission, date delay, manual run',
      'Actions: send SMS/email, add/remove tag, move stage, assign owner, wait X days, webhook',
      'Name + enable/disable toggle + run history per automation',
      'Engine runs as Supabase Edge Function or Vercel Cron — not client-side',
    ],
  },
  {
    id: 'calendar',
    label: 'Calendar & Appointments',
    icon: '📅',
    summary: 'Booking pages with public URLs, week/day calendar view, pre-appointment reminders, post-appointment automation triggers.',
    stages: [],
    fields: [],
    notes: [
      'Multiple booking types (Discovery Call, Strategy Session) with availability windows',
      'Buffer time, duration options (15/30/45/60 min), confirmation email/SMS',
      'Public booking URL: /book/[slug] — no auth required, statically optimised',
      'Google Calendar sync via OAuth (stretch goal v2)',
    ],
  },
]

const DB_TABLES = [
  { name: 'contacts',         cols: 'id, workspace_id, first_name, last_name, email, phone, company, source, status, owner_id, tags[], created_at, updated_at' },
  { name: 'deals',            cols: 'id, workspace_id, contact_id, title, value, stage, owner_id, created_at, updated_at, closed_at' },
  { name: 'activities',       cols: 'id, contact_id, type (sms|email|call|note|stage_change|appt), body, direction, status, created_at' },
  { name: 'messages',         cols: 'id, workspace_id, contact_id, direction, body, twilio_sid, status, read, created_at' },
  { name: 'emails',           cols: 'id, workspace_id, contact_id, subject, body, from_name, status (sent|opened|clicked|replied), resend_id' },
  { name: 'templates',        cols: 'id, workspace_id, type (sms|email), name, subject, body, variables[]' },
  { name: 'automations',      cols: 'id, workspace_id, name, enabled, trigger_type, trigger_config (jsonb), steps (jsonb[]), run_count' },
  { name: 'automation_runs',  cols: 'id, automation_id, contact_id, status, current_step, started_at, completed_at' },
  { name: 'appointments',     cols: 'id, workspace_id, contact_id, booking_type_id, start_time, end_time, status, notes' },
  { name: 'booking_types',    cols: 'id, workspace_id, name, slug, duration_minutes, availability (jsonb), buffer_minutes' },
  { name: 'workspaces',       cols: 'id, name, owner_id, created_at' },
  { name: 'users',            cols: 'id, workspace_id, email, full_name, role (admin|member), avatar_url' },
]

const API_ROUTES = [
  { method: 'POST', path: '/api/contacts',               desc: 'Create contact' },
  { method: 'GET',  path: '/api/contacts',               desc: 'List with filters' },
  { method: 'POST', path: '/api/messages/sms',           desc: 'Send SMS via Twilio' },
  { method: 'POST', path: '/api/messages/email',         desc: 'Send email via Resend' },
  { method: 'POST', path: '/api/webhooks/twilio',        desc: 'Inbound SMS webhook' },
  { method: 'POST', path: '/api/webhooks/resend',        desc: 'Email event webhook' },
  { method: 'POST', path: '/api/automations/[id]/run',   desc: 'Manually trigger automation' },
  { method: 'GET',  path: '/api/book/[slug]',            desc: 'Public booking page data' },
  { method: 'POST', path: '/api/book/[slug]',            desc: 'Create appointment from booking page' },
]

const AUTOMATION_TEMPLATES = [
  { name: 'New Lead Sequence',    steps: 'Contact added → Wait 0 min → SMS "Hey {{first_name}}…" → Wait 1 day → Email follow-up' },
  { name: 'Stage Move Alert',     steps: 'Deal → "Proposal Sent" → Webhook notification → Add tag "proposal-out"' },
  { name: 'Re-engagement',        steps: 'Tag "cold-lead" added → Wait 3 days → SMS → Wait 3 days → Email' },
]

const NAV_STRUCTURE = [
  'Dashboard (overview stats)',
  'Contacts',
  'Pipeline',
  'Inbox (SMS + Email unified)',
  'Automations',
  'Calendar',
  'Templates',
  'Settings → Workspace / Team / Integrations / Billing (placeholder)',
]

function CRMSpecSection() {
  const [openModule, setOpenModule] = useState<string | null>(null)
  const [activeTab,  setActiveTab]  = useState<'overview' | 'schema' | 'api' | 'structure'>('overview')

  const tabs = [
    { id: 'overview'  as const, label: 'Overview' },
    { id: 'schema'    as const, label: 'DB Schema' },
    { id: 'api'       as const, label: 'API Routes' },
    { id: 'structure' as const, label: 'File Structure' },
  ]

  return (
    <div className="mt-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-1">
        <h2 className="text-lg font-semibold text-text-primary">Nexora CRM</h2>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-dim text-teal border border-teal/20 font-medium">Vibe Coding Spec</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-dim text-amber border border-amber/20 font-medium">Build Pending</span>
      </div>
      <p className="text-xs text-text-tertiary mb-5">
        Internal agency CRM — "baby GoHighLevel" for Nexora AI. Manages clients, leads, comms, and automations.
      </p>

      {/* Tech stack pills */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {['Next.js 14', 'Supabase', 'Tailwind CSS', 'shadcn/ui', 'Resend', 'Twilio', 'Vercel', 'TanStack Query', 'React Hook Form + Zod', 'TipTap'].map(t => (
          <span key={t} className="text-[11px] px-2 py-0.5 bg-panel border border-border rounded text-text-secondary">{t}</span>
        ))}
      </div>

      {/* Design direction callout */}
      <Card className="mb-6 border-teal/20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <div className="text-text-tertiary uppercase tracking-wider text-[10px] mb-1">Background</div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded" style={{ background: '#0D0D0D', border: '1px solid #333' }} />
              <span className="text-text-secondary font-mono">#0D0D0D</span>
            </div>
          </div>
          <div>
            <div className="text-text-tertiary uppercase tracking-wider text-[10px] mb-1">Primary Action</div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded" style={{ background: '#0066FF' }} />
              <span className="text-text-secondary font-mono">#0066FF</span>
            </div>
          </div>
          <div>
            <div className="text-text-tertiary uppercase tracking-wider text-[10px] mb-1">Tone</div>
            <span className="text-text-secondary">Clean · Minimal · Professional · Max 3 colours · No gradients</span>
          </div>
        </div>
      </Card>

      {/* Tab bar */}
      <div className="flex gap-1 mb-5 border-b border-border pb-0">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-3 py-2 text-xs font-medium transition-all border-b-2 -mb-px ${
              activeTab === t.id
                ? 'border-teal text-teal'
                : 'border-transparent text-text-tertiary hover:text-text-secondary'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === 'overview' && (
        <div className="space-y-3">
          {/* Sidebar nav */}
          <Card>
            <SectionHeader title="Navigation Structure" />
            <div className="space-y-1">
              {NAV_STRUCTURE.map(n => (
                <div key={n} className="flex items-center gap-2 text-xs text-text-secondary py-0.5">
                  <span className="text-text-tertiary">›</span>
                  <span>{n}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Core modules — expandable */}
          <SectionHeader title="Core Modules" sub="Click to expand details" />
          {CRM_MODULES.map(m => (
            <Card
              key={m.id}
              hover
              onClick={() => setOpenModule(openModule === m.id ? null : m.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <span className="text-xl">{m.icon}</span>
                  <div>
                    <div className="text-sm font-medium text-text-primary">{m.label}</div>
                    <div className="text-xs text-text-tertiary mt-0.5 leading-relaxed">{m.summary}</div>
                  </div>
                </div>
                <span className="text-text-tertiary text-xs ml-4 flex-shrink-0">
                  {openModule === m.id ? '▲' : '▼'}
                </span>
              </div>
              {openModule === m.id && (
                <div className="mt-4 pt-4 border-t border-border space-y-3">
                  {m.stages.length > 0 && (
                    <div>
                      <div className="text-[10px] text-text-tertiary uppercase tracking-wider mb-2">Pipeline Stages</div>
                      <div className="flex flex-wrap gap-1.5">
                        {m.stages.map((s, i) => (
                          <div key={s} className="flex items-center gap-1">
                            <span className="text-xs bg-panel border border-border px-2 py-0.5 rounded text-text-secondary">{s}</span>
                            {i < m.stages.length - 1 && <span className="text-text-tertiary text-[10px]">→</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {m.fields.length > 0 && (
                    <div>
                      <div className="text-[10px] text-text-tertiary uppercase tracking-wider mb-2">Key Fields</div>
                      <div className="flex flex-wrap gap-1">
                        {m.fields.map(f => (
                          <span key={f} className="text-[11px] font-mono bg-panel border border-border px-1.5 py-0.5 rounded text-teal">{f}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-[10px] text-text-tertiary uppercase tracking-wider mb-2">Notes</div>
                    <ul className="space-y-1">
                      {m.notes.map(n => (
                        <li key={n} className="text-xs text-text-secondary flex gap-2">
                          <span className="text-text-tertiary flex-shrink-0">·</span>
                          <span>{n}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </Card>
          ))}

          {/* Automation templates */}
          <SectionHeader title="Pre-Built Automation Templates" />
          <div className="space-y-2">
            {AUTOMATION_TEMPLATES.map(a => (
              <Card key={a.name}>
                <div className="text-sm font-medium text-teal mb-1">{a.name}</div>
                <div className="text-xs text-text-tertiary font-mono leading-relaxed">{a.steps}</div>
              </Card>
            ))}
          </div>

          {/* Stretch goals */}
          <Card className="border-border/40">
            <div className="text-[10px] text-text-tertiary uppercase tracking-wider mb-2">Stretch Goals (v2 — do not build yet)</div>
            <div className="flex flex-wrap gap-1.5">
              {['Google Calendar sync', 'AI reply suggestions', 'Lead scoring', 'White-label for clients', 'Mobile app (RN)', 'Zapier/Make webhooks'].map(g => (
                <span key={g} className="text-[11px] px-2 py-0.5 bg-panel border border-border/40 rounded text-text-tertiary">{g}</span>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ── DB SCHEMA TAB ── */}
      {activeTab === 'schema' && (
        <div className="space-y-2">
          <p className="text-xs text-text-tertiary mb-4">All tables use RLS (Row Level Security) scoped to <span className="font-mono text-teal">workspace_id</span>.</p>
          {DB_TABLES.map(t => (
            <Card key={t.name}>
              <div className="flex items-start gap-3">
                <span className="font-mono text-sm text-teal font-medium w-40 flex-shrink-0">{t.name}</span>
                <span className="text-xs text-text-tertiary font-mono leading-relaxed">{t.cols}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── API ROUTES TAB ── */}
      {activeTab === 'api' && (
        <div className="space-y-2">
          {API_ROUTES.map(r => (
            <Card key={r.path}>
              <div className="flex items-center gap-3">
                <span className={`text-[11px] font-mono font-semibold w-10 flex-shrink-0 ${r.method === 'POST' ? 'text-amber' : 'text-green'}`}>
                  {r.method}
                </span>
                <span className="font-mono text-xs text-teal flex-1">{r.path}</span>
                <span className="text-xs text-text-tertiary">{r.desc}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── FILE STRUCTURE TAB ── */}
      {activeTab === 'structure' && (
        <Card>
          <pre className="text-[11px] font-mono text-text-secondary leading-relaxed whitespace-pre overflow-x-auto">{`/app
  /dashboard
  /contacts
    /[id]
  /pipeline
  /inbox
  /automations
    /[id]
  /calendar
  /book
    /[slug]         ← public, no auth
  /settings
  /api
    /contacts
    /messages
    /automations
    /webhooks
    /book

/components
  /ui               ← shadcn components
  /crm              ← domain-specific
    ContactCard.tsx
    PipelineBoard.tsx
    MessageThread.tsx
    AutomationBuilder.tsx
    BookingPage.tsx

/lib
  supabase.ts
  twilio.ts
  resend.ts
  utils.ts

/types
  index.ts          ← all TypeScript interfaces`}</pre>
        </Card>
      )}

      {/* Implementation notes */}
      <Card className="mt-4 border-teal/20">
        <div className="text-[10px] text-teal uppercase tracking-wider mb-3">Implementation Order</div>
        <ol className="space-y-1.5">
          {[
            'Start with Contacts + Pipeline first — everything else depends on a contact record existing',
            'Use Supabase Realtime for inbox — new messages appear without refresh',
            'Automation engine runs as Supabase Edge Function or Vercel Cron, not client-side',
            'Keep /book/[slug] fully public and statically optimised — no auth required',
            'All forms: React Hook Form + Zod validation',
            'Server state: TanStack Query for caching',
            'SMS/email sends should be queued via Supabase DB webhooks — not fired directly from API route',
          ].map((n, i) => (
            <li key={i} className="flex gap-2 text-xs text-text-secondary">
              <span className="text-teal font-medium flex-shrink-0">{i + 1}.</span>
              <span>{n}</span>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  )
}

// ── Main export ────────────────────────────────────────────────────────────

export default function NexoraView({ data, refresh }: Props) {
  return (
    <div className="p-6 max-w-5xl mx-auto animate-fade-in">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Nexora AI</h1>
          <p className="text-xs text-text-tertiary mt-1">Helping Small Businesses Compete Like Enterprises · nexora.ai</p>
        </div>
        <Badge label="Build Phase" color="teal" />
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <Stat label="Clients" value="0"     color="text-red"  sub="target: $10K–$20K MRR" icon="🤖" />
        <Stat label="MRR"     value="$0"    color="text-red"  sub="9–12 mo horizon" />
        <Stat label="Target"  value="$10K+" color="text-teal" sub="MRR in 9–12 mo" />
      </div>

      {/* Services */}
      <SectionHeader title="Service Menu" sub="Agency + SaaS" />
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { name: 'AI Website',    range: '$1.5K – $5K',       icon: '🌐' },
          { name: 'AI Dashboard',  range: '$2K – $8K',         icon: '📊' },
          { name: 'AI Agent',      range: '$1.5K – $6K',       icon: '🤖' },
          { name: 'Automation',    range: '$800 – $3K',        icon: '⚙️' },
          { name: 'Retainer',      range: '$300 – $1.5K/mo',   icon: '🔄' },
        ].map(s => (
          <Card key={s.name}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{s.icon}</span>
              <span className="text-sm font-medium text-text-primary">{s.name}</span>
            </div>
            <div className="text-sm font-mono text-teal">{s.range}</div>
          </Card>
        ))}

        {/* SaaS tiers */}
        <Card className="border-teal/20">
          <div className="text-xs text-text-tertiary uppercase tracking-wider mb-2">SaaS Tiers</div>
          {[
            { tier: 'Core',       price: '$297/mo' },
            { tier: 'Pro',        price: '$597/mo' },
            { tier: 'Enterprise', price: '$1,497/mo' },
          ].map(t => (
            <div key={t.tier} className="flex justify-between items-center py-1 border-b border-border/50 last:border-0">
              <span className="text-xs text-text-secondary">{t.tier}</span>
              <span className="text-xs font-mono text-teal">{t.price}</span>
            </div>
          ))}
        </Card>
      </div>

      {/* Brand */}
      <SectionHeader title="Brand" sub="Forged Light design system" />
      <Card>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-text-tertiary mb-2">Colours</div>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded" style={{ background: '#1B2F5B' }} />
                <span className="text-[11px] text-text-secondary">Navy</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded" style={{ background: '#E8963A' }} />
                <span className="text-[11px] text-text-secondary">Amber</span>
              </div>
            </div>
          </div>
          <div>
            <div className="text-xs text-text-tertiary mb-2">Typography</div>
            <div className="text-[11px] text-text-secondary space-y-0.5">
              <div>Display: Bricolage Grotesque</div>
              <div>Body: Instrument Sans</div>
              <div>Code: Geist Mono</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Target verticals */}
      <div className="mt-6"><SectionHeader title="Target Verticals" sub="SMBs · 1–20 employees · $500K–$5M ARR" /></div>
      <div className="flex flex-wrap gap-2">
        {['Dental', 'Law', 'Real Estate', 'Contractors', 'Restaurants'].map(v => (
          <span key={v} className="bg-teal-dim text-teal border border-teal/20 text-xs px-2.5 py-1 rounded-full">{v}</span>
        ))}
      </div>

      <div className="mt-6 p-4 bg-panel border border-teal/20 rounded-xl">
        <div className="text-xs text-teal font-medium mb-1">Lead CTA</div>
        <div className="text-sm text-text-secondary">Free 30-minute AI Audit</div>
        <div className="text-xs text-text-tertiary mt-1">hello@nexora.ai · nexora.ai</div>
      </div>

      {/* ── CRM SPEC ── */}
      <CRMSpecSection />
    </div>
  )
}
