'use client'

import { useState } from 'react'
import type { View } from '@/app/page'
import { Card, SectionHeader, Badge, EmptyState } from '@/components/Card'

interface Props {
  data: any
  onNav: (v: View) => void
}

const STATUS_COLORS: Record<string, 'red' | 'amber' | 'blue' | 'muted'> = {
  hot:  'red',
  warm: 'amber',
  cold: 'blue',
  lead: 'muted',
}

const STATUS_LABEL: Record<string, string> = {
  hot:  'HOT 🔥',
  warm: 'WARM ⚡',
  cold: 'COLD ❄️',
  lead: 'NEW',
}

export default function LeadsCRMView({ data, onNav }: Props) {
  const [filter, setFilter] = useState<'all' | 'hot' | 'warm' | 'cold'>('all')

  const deals: any[] = data?.deals ?? []
  const hot  = deals.filter(d => d.tier === 'hot'  || d.status === 'hot')
  const warm = deals.filter(d => d.tier === 'warm' || d.status === 'warm')
  const cold = deals.filter(d => d.tier === 'cold' || d.status === 'cold')

  const filtered = filter === 'all' ? deals
    : deals.filter(d => (d.tier ?? d.status) === filter)

  return (
    <div className="p-6 max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary tracking-tight">Leads / CRM</h1>
          <p className="text-sm text-text-tertiary mt-1">Luxe Property Solutions · Active pipeline</p>
        </div>
        <button
          onClick={() => onNav('luxe')}
          className="text-xs text-text-tertiary hover:text-blue px-3 py-1.5 rounded-md border border-border hover:border-blue/40 transition-all"
        >
          Open Luxe View →
        </button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Leads',  value: deals.length, color: 'text-text-primary' },
          { label: 'Hot 🔥',       value: hot.length,   color: 'text-red' },
          { label: 'Warm ⚡',      value: warm.length,  color: 'text-amber' },
          { label: 'Cold ❄️',      value: cold.length,  color: 'text-blue' },
        ].map(s => (
          <div key={s.label} className="bg-panel border border-border rounded-lg p-3">
            <div className="text-[11px] text-text-tertiary uppercase tracking-wider mb-1">{s.label}</div>
            <div className={`text-2xl font-semibold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {(['all', 'hot', 'warm', 'cold'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all capitalize ${
              filter === f
                ? 'bg-blue/15 text-blue border border-blue/30'
                : 'text-text-tertiary border border-border hover:text-text-primary hover:border-border/60'
            }`}
          >
            {f === 'all' ? 'All Leads' : STATUS_LABEL[f]}
          </button>
        ))}
      </div>

      {/* Lead table */}
      <Card className="mb-6">
        <SectionHeader title="Pipeline" sub={`${filtered.length} lead${filtered.length !== 1 ? 's' : ''}`} />
        {filtered.length === 0 ? (
          <EmptyState icon="🏠" message="No leads in pipeline — run the daily scan to populate" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-[11px] text-text-tertiary uppercase tracking-wider">
                  <th className="text-left pb-2 pr-4">Address</th>
                  <th className="text-left pb-2 pr-4">City</th>
                  <th className="text-right pb-2 pr-4">ARV</th>
                  <th className="text-right pb-2 pr-4">MAO</th>
                  <th className="text-left pb-2 pr-4">Status</th>
                  <th className="text-left pb-2">Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filtered.map((d: any, i: number) => {
                  const tier   = d.tier ?? d.status ?? 'lead'
                  const color  = STATUS_COLORS[tier] ?? 'muted'
                  return (
                    <tr key={i} className="hover:bg-panel/50 transition-colors">
                      <td className="py-2.5 pr-4 text-text-primary font-medium truncate max-w-[160px]">
                        {d.address ?? d.slug ?? `Lead #${i + 1}`}
                      </td>
                      <td className="py-2.5 pr-4 text-text-secondary">{d.city ?? '—'}</td>
                      <td className="py-2.5 pr-4 text-right text-text-secondary font-mono text-xs">
                        {d.arv ? `$${Number(d.arv).toLocaleString()}` : '—'}
                      </td>
                      <td className="py-2.5 pr-4 text-right text-amber font-mono text-xs">
                        {d.mao ? `$${Number(d.mao).toLocaleString()}` : '—'}
                      </td>
                      <td className="py-2.5 pr-4">
                        <Badge label={STATUS_LABEL[tier] ?? tier.toUpperCase()} color={color} />
                      </td>
                      <td className="py-2.5 text-text-tertiary text-xs capitalize">
                        {d.stage ?? d.status ?? 'lead'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Buy box reference */}
      <Card>
        <SectionHeader title="Buy Box Reference" sub="LPS acquisition criteria" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-text-tertiary">Property type</span>
              <span className="text-text-primary">SFH · 3/2 min</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-text-tertiary">Condition</span>
              <span className="text-text-primary">Distressed</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-text-tertiary">Max price</span>
              <span className="text-text-primary">$350K USD</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-text-tertiary">Primary market</span>
              <span className="text-amber">Memphis, TN</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-text-tertiary">MAO formula</span>
              <span className="text-text-primary">(ARV − Repairs) × %</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-text-tertiary">LAO (initial offer)</span>
              <span className="text-text-primary">70% of MAO</span>
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {[
            { range: '< $120K',     pct: '70%' },
            { range: '$120–220K',   pct: '80%' },
            { range: '$220–300K',   pct: '81.5%' },
            { range: '$300–400K',   pct: '82.9%' },
          ].map(r => (
            <div key={r.range} className="bg-panel border border-border rounded-md p-2 text-center">
              <div className="text-text-tertiary">{r.range}</div>
              <div className="text-amber font-semibold mt-1">{r.pct}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
