'use client'

import { useState } from 'react'
import { Card, SectionHeader, Badge, EmptyState } from '@/components/Card'

interface Props { data: any; refresh: () => void }

export default function DailyView({ data, refresh }: Props) {
  const inbox   = data?.inbox  ?? []
  const logs    = data?.logs   ?? []
  const [active, setActive] = useState(logs[0]?.date ?? null)

  const current = logs.find((l: any) => l.date === active)

  return (
    <div className="p-6 max-w-5xl mx-auto animate-fade-in">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Daily Log</h1>
          <p className="text-xs text-text-tertiary mt-1">Execution journal · Inbox · Recent logs</p>
        </div>
        {inbox.length > 0 && <Badge label={`${inbox.length} inbox items`} color="red" />}
      </div>

      {/* Inbox */}
      {inbox.length > 0 && (
        <>
          <SectionHeader title="Inbox" sub="Process daily — zero friction" />
          <div className="space-y-2 mb-8">
            {inbox.map((item: any) => (
              <Card key={item.file} hover>
                <div className="text-sm font-medium text-text-primary">{item.file.replace('.md', '')}</div>
                <div className="text-xs text-text-tertiary mt-0.5 line-clamp-2">{item.content.slice(0, 120)}</div>
              </Card>
            ))}
          </div>
        </>
      )}

      <div className="grid grid-cols-3 gap-4">
        {/* Log list */}
        <div className="col-span-1">
          <SectionHeader title="Recent Logs" sub={`${logs.length} entries`} />
          <div className="space-y-1">
            {logs.length === 0 && <EmptyState icon="📅" message="No logs yet" />}
            {logs.map((l: any) => (
              <button
                key={l.date}
                onClick={() => setActive(l.date)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                  active === l.date
                    ? 'bg-blue/10 text-text-primary border border-blue/30'
                    : 'text-text-secondary hover:bg-panel hover:text-text-primary border border-transparent'
                }`}
              >
                {l.date}
              </button>
            ))}
          </div>
        </div>

        {/* Log content */}
        <div className="col-span-2">
          {current ? (
            <Card className="h-full">
              <SectionHeader title={current.date} />
              <div className="text-sm text-text-secondary whitespace-pre-wrap leading-relaxed overflow-y-auto max-h-[60vh]">
                {current.content || <span className="text-text-tertiary italic">No content</span>}
              </div>
            </Card>
          ) : (
            <EmptyState icon="📝" message="Select a log entry" />
          )}
        </div>
      </div>

      {/* Non-negotiables checklist */}
      <div className="mt-8">
      <SectionHeader title="Today's Non-Negotiables" sub="Binary — done or not done" />
      <div className="grid grid-cols-2 gap-2">
        {[
          'Wake at 11 PM — no snooze',
          'Meal 1 + supplements (NAD + Zinc)',
          'Pre-trade chart analysis',
          'Forex Session 1 (12–2 AM)',
          'Gym / Active Mobility',
          'Nova walk 1 (~3:30 AM)',
          'Prayer (3:30–4 AM)',
          'Journal (4–4:30 AM)',
          'Forex Session 2 (6:30–9 AM)',
          'Nova walk 2 (9 AM)',
          'Nova walk 3 (7 PM)',
          'Meals on plan',
          '00_inbox cleared',
        ].map((item, i) => (
          <label key={i} className="flex items-center gap-2.5 bg-panel border border-border rounded-lg px-3 py-2 cursor-pointer hover:border-blue/30 transition-all group">
            <input type="checkbox" className="accent-blue w-3.5 h-3.5" />
            <span className="text-xs text-text-secondary group-hover:text-text-primary transition-colors">{item}</span>
          </label>
        ))}
      </div>
      </div>
    </div>
  )
}
