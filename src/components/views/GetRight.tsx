'use client'

import { Card, Stat, SectionHeader, Badge, EmptyState } from '@/components/Card'

interface Props { data: any; refresh: () => void }

export default function GetRight({ data, refresh }: Props) {
  const clients = data?.clients ?? []

  return (
    <div className="p-6 max-w-5xl mx-auto animate-fade-in">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">GetRight Fitness</h1>
          <p className="text-xs text-text-tertiary mt-1">Coach Nat · Online coaching · Body recomposition</p>
        </div>
        <Badge label="Build Phase" color="amber" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Stat label="Active Clients"  value={clients.length} icon="💪" color={clients.length > 0 ? 'text-green' : 'text-red'} sub="target: 3" />
        <Stat label="Monthly Revenue" value="$0"     icon="💰" color="text-red"  sub="target: $10K/mo" />
        <Stat label="Deadline"        value="MISSED" icon="⚠️" color="text-red"  sub="March 21 — 3 clients" />
      </div>

      {/* Clients */}
      <SectionHeader
        title="Client Roster"
        sub={clients.length === 0 ? 'No active clients yet' : `${clients.length} client(s)`}
        action={
          <button className="text-xs text-blue hover:text-blue-glow transition-colors px-3 py-1.5 rounded-md border border-blue/30 hover:border-blue/60">
            + Add Client
          </button>
        }
      />

      {clients.length === 0 ? (
        <EmptyState icon="💪" message="No clients yet — activate outreach immediately." />
      ) : (
        <div className="space-y-2">
          {clients.map((c: any) => (
            <Card key={c.slug} hover className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-green-dim flex items-center justify-center text-green font-semibold text-sm">
                {c.slug[0]?.toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-text-primary">{c.slug.replace(/-/g, ' ')}</div>
                <div className="text-xs text-text-tertiary">{c.profile?.goal ?? 'No goal set'}</div>
              </div>
              <Badge label={c.status?.status ?? 'active'} color="green" />
            </Card>
          ))}
        </div>
      )}

      {/* Products */}
      <div className="mt-8"><SectionHeader title="Offers" sub="Current product line" /></div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { name: 'Reset™',         price: '$47',           desc: '4-week body reset programme', status: '🔴 Not live' },
          { name: '365™',           price: '$1K–$5K',       desc: 'Annual coaching partnership', status: '🔴 Not live' },
          { name: 'Check-in Block', price: 'included',      desc: 'Weekly client check-ins',     status: '✅ Active' },
        ].map(p => (
          <Card key={p.name}>
            <div className="text-sm font-semibold text-text-primary">{p.name}</div>
            <div className="text-xs text-text-tertiary mt-1">{p.desc}</div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm font-mono text-green">{p.price}</span>
              <span className="text-[10px] text-text-tertiary">{p.status}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Priority Actions */}
      <div className="mt-8"><SectionHeader title="Priority Actions" sub="Execute now" /></div>
      <div className="space-y-2">
        {[
          'Activate client outreach immediately — 3 clients by April 1',
          'Launch Reset™ product page',
          'Post first content piece this week',
          'Set up 365™ sales page and intake form',
        ].map((a, i) => (
          <div key={i} className="flex items-center gap-3 bg-panel border border-border rounded-lg px-4 py-2.5">
            <span className="w-5 h-5 rounded border border-border text-[10px] flex items-center justify-center text-text-tertiary">☐</span>
            <span className="text-sm text-text-secondary">{a}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
