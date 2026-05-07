'use client'

import { Card, Stat, SectionHeader, Badge, EmptyState } from '@/components/Card'

interface Props { data: any; refresh: () => void }

const MARKETS = [
  { city: 'Memphis, TN',      arv: '$80K–$200K',  status: 'primary',   color: 'text-amber' },
  { city: 'Indianapolis, IN', arv: '$150K–$300K',  status: 'secondary', color: 'text-text-secondary' },
  { city: 'Columbus, OH',     arv: '$100K–$220K',  status: 'secondary', color: 'text-text-secondary' },
  { city: 'Kansas City, MO',  arv: '$120K–$250K',  status: 'secondary', color: 'text-text-secondary' },
]

export default function Luxe({ data, refresh }: Props) {
  const deals    = data?.deals ?? []
  const hot      = deals.filter((d: any) => (d.lead?.score ?? 0) >= 80)
  const warm     = deals.filter((d: any) => (d.lead?.score ?? 0) >= 60 && (d.lead?.score ?? 0) < 80)
  const cold     = deals.filter((d: any) => (d.lead?.score ?? 0) < 60)

  return (
    <div className="p-6 max-w-5xl mx-auto animate-fade-in">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Luxe Property Solutions</h1>
          <p className="text-xs text-text-tertiary mt-1">Virtual wholesaling · US markets · Cash deals</p>
        </div>
        <Badge label="90-Day Attack" color="amber" />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Stat label="Pipeline"     value={deals.length} icon="🏠" color={deals.length > 0 ? 'text-amber' : 'text-red'} sub="total deals" />
        <Stat label="HOT 🔥"      value={hot.length}   color="text-red"    sub="score 80–100" />
        <Stat label="WARM ⚡"     value={warm.length}  color="text-amber"  sub="score 60–79" />
        <Stat label="Target Fee"   value="$10K–$15K"   color="text-green"  sub="per assignment" />
      </div>

      {/* Daily KPIs */}
      <Card className="mb-6 border-amber/20">
        <SectionHeader title="Daily KPI Targets" sub="Non-negotiable execution metrics" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Seller Dials',    target: '50–100/day', icon: '📞' },
            { label: 'Qualified Leads', target: '3–5/day',    icon: '✅' },
            { label: 'Offers Sent',     target: '2–3/day',    icon: '📝' },
            { label: 'Buyer Contacts',  target: '25+/day',    icon: '🤝' },
          ].map(k => (
            <div key={k.label} className="bg-panel rounded-lg p-3">
              <div className="text-lg mb-1">{k.icon}</div>
              <div className="text-[11px] text-text-tertiary">{k.label}</div>
              <div className="text-sm font-semibold text-amber mt-0.5">{k.target}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Deal Pipeline */}
      <SectionHeader
        title="Deal Pipeline"
        sub={deals.length === 0 ? 'No active deals — start dialling' : `${deals.length} deal(s)`}
        action={
          <button className="text-xs text-blue hover:text-blue-glow px-3 py-1.5 rounded-md border border-blue/30 hover:border-blue/60 transition-all">
            + Add Deal
          </button>
        }
      />

      {deals.length === 0 ? (
        <EmptyState icon="🏠" message="Pipeline empty — execution started March 19. Keep dialling." />
      ) : (
        <div className="space-y-2">
          {deals.map((d: any) => {
            const score = d.lead?.score ?? 0
            const tier  = score >= 80 ? { label: 'HOT 🔥', color: 'red' as const } :
                          score >= 60 ? { label: 'WARM ⚡', color: 'amber' as const } :
                                        { label: 'COLD ❄️', color: 'muted' as const }
            return (
              <Card key={d.slug} hover>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-text-primary">{d.slug.replace(/-/g, ' ')}</div>
                    <div className="text-xs text-text-tertiary mt-0.5">
                      {d.lead?.arv ? `ARV: $${d.lead.arv}` : 'ARV pending'} · {d.lead?.city ?? 'City TBD'}
                    </div>
                  </div>
                  <Badge label={tier.label} color={tier.color} />
                  {score > 0 && <span className="text-[11px] text-text-tertiary font-mono">{score}/100</span>}
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* MAO Formula */}
      <div className="mt-8"><SectionHeader title="MAO Formula" sub="Maximum Allowable Offer" /></div>
      <Card className="font-mono text-xs">
        <div className="space-y-1 text-text-secondary">
          <div><span className="text-text-tertiary">ARV &lt; $120K   </span><span className="text-green">× 70%</span></div>
          <div><span className="text-text-tertiary">$120K – $220K  </span><span className="text-amber">× 80%</span></div>
          <div><span className="text-text-tertiary">$220K – $300K  </span><span className="text-amber">× 81.5%</span></div>
          <div><span className="text-text-tertiary">$300K – $400K  </span><span className="text-red">× 82.9%</span></div>
          <div><span className="text-text-tertiary">&gt; $400K       </span><span className="text-red">× 84.9%</span></div>
          <div className="pt-2 border-t border-border text-text-tertiary">LAO = 70% of MAO · Formula: (ARV − Repairs) × %</div>
        </div>
      </Card>

      {/* Markets */}
      <div className="mt-8"><SectionHeader title="Target Markets" /></div>
      <div className="grid grid-cols-2 gap-3">
        {MARKETS.map(m => (
          <Card key={m.city}>
            <div className={`text-sm font-medium ${m.color}`}>{m.city}</div>
            <div className="text-xs text-text-tertiary mt-1">ARV: {m.arv}</div>
            <Badge label={m.status} color={m.status === 'primary' ? 'amber' : 'muted'} />
          </Card>
        ))}
      </div>
    </div>
  )
}
