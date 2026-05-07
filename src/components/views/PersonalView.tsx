'use client'

import { Card, Stat, SectionHeader, Badge } from '@/components/Card'

interface Props { data: any; refresh: () => void }

export default function PersonalView({ data, refresh }: Props) {
  return (
    <div className="p-6 max-w-5xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-text-primary">Personal</h1>
        <p className="text-xs text-text-tertiary mt-1">Health · Finance · Goals · Relationships</p>
      </div>

      {/* Health */}
      <SectionHeader title="Health & Training" sub="Current protocol — Feb 2026" />
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Stat label="Weight"   value="161.7 lbs" sub="73.1 kg" icon="⚖️" />
        <Stat label="Body Fat" value="16.3%"     sub="Lean: 135.3 lbs" icon="💪" />
        <Stat label="Sessions" value="5/wk"      sub="Mon Tue Thu Fri Sat" icon="🏋️" />
      </div>

      <Card className="mb-6">
        <SectionHeader title="Training Split" />
        <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
          {[
            { day: 'Monday',    focus: 'Chest — Heavy',           style: 'Training' },
            { day: 'Tuesday',   focus: 'Back — Heavy',            style: 'Training' },
            { day: 'Wednesday', focus: 'Active Mobility',         style: 'Recovery' },
            { day: 'Thursday',  focus: 'Legs — Heavy',            style: 'Training' },
            { day: 'Friday',    focus: 'Chest — Heavy',           style: 'Training' },
            { day: 'Saturday',  focus: 'Back — Heavy',            style: 'Training' },
            { day: 'Sunday',    focus: 'Active Mobility',         style: 'Recovery' },
          ].map(t => (
            <div key={t.day} className="flex items-center justify-between py-1 border-b border-border/30 last:border-0">
              <span className="text-text-tertiary w-24">{t.day}</span>
              <span className="text-text-secondary flex-1">{t.focus}</span>
              <Badge label={t.style} color={t.style === 'Recovery' ? 'teal' : 'green'} />
            </div>
          ))}
        </div>
      </Card>

      {/* Schedule */}
      <SectionHeader title="Daily Schedule" sub="Night Owl Mode — wake 11 PM" />
      <Card className="mb-6">
        <div className="space-y-1 text-xs">
          {[
            { time: '11:00 PM',     act: 'Wake · Meal 1 · Supplements (NAD + Zinc)' },
            { time: '11 PM–12 AM',  act: 'Pre-trade chart analysis' },
            { time: '12:00–2:00 AM',act: '🚫 Forex Session 1 (NON-NEGOTIABLE)' },
            { time: '2:00–3:30 AM', act: '🏋️ Gym' },
            { time: '3:30 AM',      act: 'Meal 2 + Nova walk 1' },
            { time: '4:00–4:30 AM', act: 'Prayer' },
            { time: '4:30–5:30 AM', act: 'Journal' },
            { time: '5:30–6:30 AM', act: 'Business Block 1 — check-ins, content, Luxe follow-ups' },
            { time: '6:30–9:00 AM', act: '🚫 Forex Session 2 (NON-NEGOTIABLE)' },
            { time: '9:00 AM–3 PM', act: 'Business Block 2 — wholesaling, calls, study' },
            { time: '3:00–7:00 PM', act: 'Business Block 3 — content batching, deep work' },
            { time: '7:00–11:00 PM',act: '😴 Sleep' },
          ].map(r => (
            <div key={r.time} className="flex gap-3 py-1 border-b border-border/20 last:border-0">
              <span className="text-text-tertiary font-mono w-28 flex-shrink-0">{r.time}</span>
              <span className={r.act.startsWith('🚫') ? 'text-red' : 'text-text-secondary'}>{r.act}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Goals */}
      <SectionHeader title="2026 Goals" sub="North Star: $1M+ net revenue by Jan 1, 2027" />
      <div className="space-y-2">
        {[
          { goal: '$30K/month combined revenue',     deadline: 'June 2026',     status: '🔴' },
          { goal: '$2M net revenue',                 deadline: 'February 2028', status: '🟡' },
          { goal: '3 GetRight clients @ $500/mo',   deadline: 'March 21 — MISSED', status: '🔴' },
          { goal: 'First Luxe deal closed',          deadline: 'May 21, 2026',  status: '🔴' },
          { goal: 'Forex Phase 1 +$4K',             deadline: 'Active',        status: '🟡' },
        ].map(g => (
          <div key={g.goal} className="flex items-center gap-3 bg-panel border border-border rounded-lg px-4 py-2.5">
            <span className="text-base">{g.status}</span>
            <span className="text-sm text-text-secondary flex-1">{g.goal}</span>
            <span className="text-xs text-text-tertiary">{g.deadline}</span>
          </div>
        ))}
      </div>

      {/* Personal */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Card>
          <div className="text-xs text-text-tertiary mb-2">Family</div>
          <div className="text-sm text-text-secondary space-y-1">
            <div>👩 Stefania — partner</div>
            <div>👧 Mila — Sat 11 AM – Sun 5:45 PM</div>
            <div>🐕 Nova — walks: 3:30 AM · 9 AM · 7 PM</div>
          </div>
        </Card>
        <Card>
          <div className="text-xs text-text-tertiary mb-2">Location</div>
          <div className="text-sm text-text-secondary">Calgary, Alberta, Canada</div>
          <div className="text-xs text-text-tertiary mt-1">All prices in CAD unless noted</div>
          <div className="text-xs text-text-tertiary mt-1">US investments: state always included</div>
        </Card>
      </div>
    </div>
  )
}
