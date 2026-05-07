'use client'

import type { VaultData, View } from '@/app/page'
import { Card, SectionHeader, Badge } from '@/components/Card'

interface Props {
  data: VaultData
  onNav: (v: View) => void
}

const STREAMS = [
  {
    id:       'luxe' as View,
    name:     'Luxe Property Solutions',
    icon:     '🏠',
    color:    'text-amber',
    border:   'border-amber/30',
    bg:       'bg-amber-dim',
    phase:    '90-Day Attack',
    target:   '$10K CAD',
    sub:      'Close 1–2 deals',
    monthly:  10_000,
    current:  0,
    status:   'red' as const,
    model:    'Virtual wholesaling — Memphis TN, Indy IN, Columbus OH, KC MO',
  },
  {
    id:       'forex' as View,
    name:     'Day Trading',
    icon:     '📈',
    color:    'text-purple',
    border:   'border-purple/30',
    bg:       'bg-purple-dim',
    phase:    'Active',
    target:   '$5K/mo',
    sub:      'Phase 1: +$4K',
    monthly:  5_000,
    current:  1_000,
    status:   'yellow' as const,
    model:    'Wyckoff scalping · Asian session · $50K funded account',
  },
  {
    id:       'getright' as View,
    name:     'GetRight Fitness',
    icon:     '💪',
    color:    'text-green',
    border:   'border-green/30',
    bg:       'bg-green-dim',
    phase:    'Build',
    target:   '$10K/mo',
    sub:      '3 clients @ $500/mo',
    monthly:  10_000,
    current:  0,
    status:   'red' as const,
    model:    'Online coaching — training, nutrition, body recomp',
  },
  {
    id:       'nexora' as View,
    name:     'Nexora AI',
    icon:     '🤖',
    color:    'text-teal',
    border:   'border-teal/30',
    bg:       'bg-teal-dim',
    phase:    'Build',
    target:   '$10–20K MRR',
    sub:      '9–12 month runway',
    monthly:  15_000,
    current:  0,
    status:   'red' as const,
    model:    'AI agency + SaaS · SMBs 1–20 employees · $500K–$5M ARR',
  },
  {
    id:       'artistly' as View,
    name:     'Artistly Books',
    icon:     '📚',
    color:    'text-red',
    border:   'border-red/30',
    bg:       'bg-red-dim',
    phase:    'Launch',
    target:   'Store live',
    sub:      'KDP + Etsy + Hostinger',
    monthly:  2_000,
    current:  0,
    status:   'red' as const,
    model:    "AI kids' books, coloring books, activity books — POD",
  },
]

const STATUS_MAP = {
  green:  { badge: 'green'  as const, label: 'On Track' },
  yellow: { badge: 'amber'  as const, label: 'In Progress' },
  red:    { badge: 'red'    as const, label: 'Not Started' },
}

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  return (
    <div className="mt-2">
      <div className="flex justify-between text-[10px] text-text-tertiary mb-1">
        <span>${value.toLocaleString()} CAD</span>
        <span>{pct}% of ${max.toLocaleString()}</span>
      </div>
      <div className="h-1.5 bg-panel rounded-full overflow-hidden border border-border/40">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export default function IncomeStreamsView({ data, onNav }: Props) {
  const totalTarget  = STREAMS.reduce((s, r) => s + r.monthly, 0)
  const totalCurrent = STREAMS.reduce((s, r) => s + r.current, 0)

  return (
    <div className="p-6 max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-text-primary tracking-tight">Income Streams</h1>
        <p className="text-sm text-text-tertiary mt-1">5 active build streams · Target: $30K/mo combined within 4 months</p>
      </div>

      {/* Combined tracker */}
      <Card className="mb-6 border-blue/20">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-[11px] text-text-tertiary uppercase tracking-wider mb-1">Combined Monthly Revenue</div>
            <div className="text-3xl font-semibold text-text-primary">
              ${totalCurrent.toLocaleString()} <span className="text-lg text-text-tertiary">CAD</span>
            </div>
            <div className="text-xs text-text-tertiary mt-1">Target: ${totalTarget.toLocaleString()}/mo · {Math.round((totalCurrent / totalTarget) * 100)}% of goal</div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-text-tertiary uppercase tracking-wider mb-1">Annual Goal</div>
            <div className="text-xl font-semibold text-amber">$2M CAD</div>
            <div className="text-xs text-text-tertiary mt-1">by May 2028</div>
          </div>
        </div>
        <ProgressBar value={totalCurrent} max={totalTarget} color="bg-blue" />
      </Card>

      {/* Stream cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {STREAMS.map(s => {
          const st = STATUS_MAP[s.status]
          return (
            <button
              key={s.id}
              onClick={() => onNav(s.id)}
              className={`text-left bg-card border ${s.border} rounded-xl p-4 hover:opacity-90 transition-all group`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center text-base`}>
                    {s.icon}
                  </div>
                  <div>
                    <div className={`text-sm font-medium ${s.color}`}>{s.name}</div>
                    <div className="text-[10px] text-text-tertiary">{s.phase}</div>
                  </div>
                </div>
                <Badge label={st.label} color={st.badge} />
              </div>
              <div className="text-xs text-text-secondary leading-relaxed mb-3">{s.model}</div>
              <div className="flex items-baseline gap-2">
                <span className={`text-lg font-semibold ${s.color}`}>{s.target}</span>
                <span className="text-xs text-text-tertiary">{s.sub}</span>
              </div>
              <ProgressBar value={s.current} max={s.monthly} color={`bg-${s.color.replace('text-', '')}`} />
            </button>
          )
        })}
      </div>

      {/* KPI targets */}
      <Card>
        <SectionHeader title="Daily KPI Targets" sub="Luxe Property Solutions" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          {[
            { label: 'Seller Convos', target: '10+' },
            { label: 'Qualified Leads', target: '3–5' },
            { label: 'Offers Made', target: '2–3' },
            { label: 'Buyer Contacts', target: '25+' },
          ].map(k => (
            <div key={k.label} className="bg-panel border border-border rounded-lg p-3">
              <div className="text-[11px] text-text-tertiary uppercase tracking-wider mb-1">{k.label}</div>
              <div className="text-xl font-semibold text-amber">{k.target}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
