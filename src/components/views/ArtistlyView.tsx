'use client'

import { Card, Stat, SectionHeader, Badge } from '@/components/Card'

interface Props { data: any; refresh: () => void }

export default function ArtistlyView({ data, refresh }: Props) {
  return (
    <div className="p-6 max-w-5xl mx-auto animate-fade-in">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Artistly Kids' Book Studio</h1>
          <p className="text-xs text-text-tertiary mt-1">AI-generated books · Amazon KDP · Etsy · Hostinger storefront</p>
        </div>
        <Badge label="Launch Phase" color="red" />
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <Stat label="Books Live"    value="0"          color="text-red"  sub="KDP / Etsy" icon="📚" />
        <Stat label="Status"        value="Building"   color="text-amber" />
        <Stat label="Tool"          value="Artistly"   color="text-text-secondary" sub="one-time licence" />
      </div>

      <SectionHeader title="Product Line" sub="Price ranges in CAD" />
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { type: 'Personalised Storybook', price: '$37–$62', channel: 'Etsy + Storefront' },
          { type: 'Colouring Book',         price: '$25–$38', channel: 'KDP + Etsy' },
          { type: 'Activity Book',          price: '$31–$44', channel: 'KDP + Etsy' },
          { type: 'KDP Publishing Service', price: '$125–$255', channel: 'Storefront' },
        ].map(p => (
          <Card key={p.type}>
            <div className="text-sm font-medium text-text-primary">{p.type}</div>
            <div className="text-xs font-mono text-red mt-1">{p.price} CAD</div>
            <div className="text-[11px] text-text-tertiary mt-1">{p.channel}</div>
          </Card>
        ))}
      </div>

      <SectionHeader title="Sales Channels" />
      <div className="space-y-2">
        {[
          { channel: 'Amazon KDP',          desc: 'Print-on-demand distribution',     status: 'Setup pending' },
          { channel: 'Etsy',                desc: 'Digital downloads + print',         status: 'Setup pending' },
          { channel: 'Hostinger Storefront',desc: 'Branded direct sales',             status: 'Setting up Mar 2026' },
        ].map(c => (
          <div key={c.channel} className="flex items-center gap-4 bg-panel border border-border rounded-lg px-4 py-3">
            <div className="flex-1">
              <div className="text-sm font-medium text-text-primary">{c.channel}</div>
              <div className="text-xs text-text-tertiary">{c.desc}</div>
            </div>
            <Badge label={c.status} color="amber" />
          </div>
        ))}
      </div>

      <Card className="mt-6 border-red/20">
        <div className="text-xs text-text-tertiary uppercase tracking-wider mb-2">Next Steps</div>
        <div className="space-y-2">
          {[
            'Complete Hostinger storefront setup (March 2026)',
            'Publish first KDP colouring book',
            'List first Etsy digital download',
            'Build prompt library in artistly/prompt-library.md',
          ].map((a, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-text-secondary">
              <span className="text-text-tertiary">→</span>{a}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
