'use client'

import { Card, SectionHeader, Badge } from '@/components/Card'

interface Automation {
  name:       string
  desc:       string
  trigger:    string
  schedule:   string
  status:     'active' | 'paused' | 'manual'
  lastRun?:   string
  business:   string
  bizColor:   'amber' | 'green' | 'teal' | 'purple' | 'red' | 'blue'
  cmd:        string
}

const AUTOMATIONS: Automation[] = [
  {
    name:     'Daily Distressed Lead Scan',
    desc:     'Scans Memphis, Indianapolis, Columbus, and Kansas City for FSBO + foreclosure leads. Deduplicates against Supabase, emails HTML digest.',
    trigger:  '"run the daily lead scan"',
    schedule: 'Daily · Autonomous',
    status:   'active',
    lastRun:  'Today',
    business: 'Luxe',
    bizColor: 'amber',
    cmd:      'run the daily lead scan',
  },
  {
    name:     'Weekly Market Analysis',
    desc:     'Searches Zillow + Realtor.com for 100+ DOM listings with distress keywords. Underwrites each using MAO formula. Ranked report + 30-day tracker.',
    trigger:  '"run my weekly analysis"',
    schedule: 'Monday AM · Autonomous',
    status:   'active',
    lastRun:  'Last Monday',
    business: 'Luxe',
    bizColor: 'amber',
    cmd:      'run my weekly analysis',
  },
  {
    name:     'Daily Session Logger',
    desc:     'Logs every work session to a daily .md file and updates the interactive HTML session dashboard automatically.',
    trigger:  '"log this session"',
    schedule: 'End of each session',
    status:   'active',
    business: 'All',
    bizColor: 'blue',
    cmd:      'log this session',
  },
  {
    name:     'Morning Briefing',
    desc:     'Pulls calendar, email, and news into a formatted daily briefing dashboard.',
    trigger:  '"morning briefing"',
    schedule: 'On demand',
    status:   'manual',
    business: 'All',
    bizColor: 'blue',
    cmd:      'morning briefing',
  },
  {
    name:     'GRF Content Repurpose',
    desc:     'Takes one GRF idea and outputs Instagram caption + email (subject + body) + SMS in brand voice. Always includes Reset or 365 CTA.',
    trigger:  '"repurpose this GRF content"',
    schedule: 'On demand',
    status:   'manual',
    business: 'GetRight',
    bizColor: 'green',
    cmd:      'repurpose this GRF content',
  },
  {
    name:     'LPS Seller Follow-Up Generator',
    desc:     'Generates HOT/WARM/COLD sequenced SMS + email campaigns. GoHighLevel-ready with step numbers, day delays, channel, and copy blocks.',
    trigger:  '"build a follow-up sequence"',
    schedule: 'On demand',
    status:   'manual',
    business: 'Luxe',
    bizColor: 'amber',
    cmd:      'build a follow-up sequence',
  },
  {
    name:     'Artistly Product Builder',
    desc:     'Researches KDP and Etsy best-sellers, analyses competition and profit potential, outputs a ready-to-use prompt pack.',
    trigger:  '"find a niche for artistly"',
    schedule: 'On demand',
    status:   'manual',
    business: 'Artistly',
    bizColor: 'red',
    cmd:      'find a niche for artistly',
  },
  {
    name:     'Nexora Vibe Coder',
    desc:     'Full build → deploy cycle. Screenshot + description → code → deploy → live link. No IDE required.',
    trigger:  '"vibe code like a legend"',
    schedule: 'On demand',
    status:   'active',
    business: 'Nexora',
    bizColor: 'teal',
    cmd:      'vibe code like a legend',
  },
]

const STATUS_MAP = {
  active: { label: 'Active',  color: 'green' as const },
  paused: { label: 'Paused',  color: 'muted' as const },
  manual: { label: 'Manual',  color: 'blue'  as const },
}

export default function AutomationsView() {
  const active = AUTOMATIONS.filter(a => a.status === 'active').length
  const manual = AUTOMATIONS.filter(a => a.status === 'manual').length

  return (
    <div className="p-6 max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-text-primary tracking-tight">Automations</h1>
        <p className="text-sm text-text-tertiary mt-1">All scheduled tasks and on-demand Claude skills</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-panel border border-border rounded-lg p-3">
          <div className="text-[11px] text-text-tertiary uppercase tracking-wider mb-1">Total</div>
          <div className="text-2xl font-semibold text-text-primary">{AUTOMATIONS.length}</div>
        </div>
        <div className="bg-panel border border-border rounded-lg p-3">
          <div className="text-[11px] text-text-tertiary uppercase tracking-wider mb-1">Auto-Run</div>
          <div className="text-2xl font-semibold text-green">{active}</div>
        </div>
        <div className="bg-panel border border-border rounded-lg p-3">
          <div className="text-[11px] text-text-tertiary uppercase tracking-wider mb-1">On Demand</div>
          <div className="text-2xl font-semibold text-blue">{manual}</div>
        </div>
      </div>

      {/* Automation list */}
      <div className="space-y-3">
        {AUTOMATIONS.map(a => {
          const st = STATUS_MAP[a.status]
          return (
            <Card key={a.name} className="hover:border-blue/30 transition-all">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-2 mb-1">
                    <span className="text-sm font-medium text-text-primary">{a.name}</span>
                    <Badge label={st.label}         color={st.color} />
                    <Badge label={a.business}       color={a.bizColor} />
                  </div>
                  <p className="text-xs text-text-tertiary leading-relaxed mb-2">{a.desc}</p>
                  <div className="flex items-center flex-wrap gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="text-text-tertiary">Schedule:</span>
                      <span className="text-text-secondary">{a.schedule}</span>
                    </div>
                    {a.lastRun && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-text-tertiary">Last run:</span>
                        <span className="text-text-secondary">{a.lastRun}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="bg-panel border border-border rounded px-2 py-1 font-mono text-[10px] text-text-tertiary max-w-[180px] text-left truncate">
                    {a.cmd}
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Footer note */}
      <Card className="mt-6 border-blue/20">
        <div className="text-sm text-text-secondary leading-relaxed">
          <span className="text-text-primary font-medium">Adding automations: </span>
          Say <span className="font-mono text-blue text-xs bg-panel border border-border rounded px-1.5 py-0.5">"create a scheduled task"</span> to set up a new recurring automation using the Schedule skill.
        </div>
      </Card>
    </div>
  )
}
