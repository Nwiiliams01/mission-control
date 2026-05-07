'use client'

import type { View, VaultData } from '@/app/page'

const NAV_MAIN: { id: View; label: string; icon: string }[] = [
  { id: 'mission',  label: 'Mission Control', icon: '⚡' },
  { id: 'getright', label: 'GetRight Fitness', icon: '💪' },
  { id: 'luxe',     label: 'Luxe Property',   icon: '🏠' },
  { id: 'forex',    label: 'Day Trading',      icon: '📈' },
  { id: 'nexora',   label: 'Nexora AI',        icon: '🤖' },
  { id: 'artistly', label: 'Artistly Books',   icon: '📚' },
  { id: 'personal', label: 'Personal',         icon: '🎯' },
  { id: 'daily',    label: 'Daily Log',        icon: '📅' },
  { id: 'prompts',  label: 'Prompt Library',   icon: '💬' },
]

const NAV_TOOLS: { id: View; label: string; icon: string }[] = [
  { id: 'leads',       label: 'Leads / CRM',    icon: '🎯' },
  { id: 'skills',      label: 'Skills & Toolbox', icon: '🛠️' },
  { id: 'income',      label: 'Income Streams',  icon: '💰' },
  { id: 'automations', label: 'Automations',     icon: '⚙️' },
  { id: 'knowledge',   label: 'Knowledge Base',  icon: '📖' },
]

interface Props {
  active: View
  onSelect: (v: View) => void
  data: VaultData | null
}

export default function Sidebar({ active, onSelect, data }: Props) {
  const inbox       = data?.daily?.inboxCount ?? 0
  const promptCount = data?.prompts?.total ?? 0

  return (
    <aside className="w-56 flex-shrink-0 bg-surface border-r border-border flex flex-col">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-blue flex items-center justify-center text-xs font-bold text-white">N</div>
          <div>
            <div className="text-sm font-semibold text-text-primary">Nathaniel OS</div>
            <div className="text-[10px] text-text-tertiary">Mission Control</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 overflow-y-auto">
        <div className="space-y-0.5 mb-4">
          {NAV_MAIN.map(n => (
            <button
              key={n.id}
              onClick={() => onSelect(n.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-all ${
                active === n.id
                  ? 'bg-blue/10 text-text-primary'
                  : 'text-text-secondary hover:bg-muted/30 hover:text-text-primary'
              }`}
            >
              <span className="text-base leading-none">{n.icon}</span>
              <span className="flex-1 text-left">{n.label}</span>
              {n.id === 'daily' && inbox > 0 && (
                <span className="bg-red text-white text-[10px] px-1.5 py-0.5 rounded-full">{inbox}</span>
              )}
              {n.id === 'prompts' && promptCount > 0 && (
                <span className="text-[10px] text-text-tertiary">{promptCount}</span>
              )}
            </button>
          ))}
        </div>

        {/* Tools section */}
        <div className="border-t border-border pt-3">
          <div className="px-3 mb-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-text-tertiary">Tools</span>
          </div>
          <div className="space-y-0.5">
            {NAV_TOOLS.map(n => (
              <button
                key={n.id}
                onClick={() => onSelect(n.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-all ${
                  active === n.id
                    ? 'bg-blue/10 text-text-primary'
                    : 'text-text-secondary hover:bg-muted/30 hover:text-text-primary'
                }`}
              >
                <span className="text-base leading-none">{n.icon}</span>
                <span className="flex-1 text-left">{n.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-border">
        <div className="text-[10px] text-text-tertiary">
          {data?.lastRefresh
            ? `Synced ${new Date(data.lastRefresh).toLocaleTimeString()}`
            : 'Connecting…'}
        </div>
        <div className="text-[10px] text-text-tertiary mt-0.5">vault: nathaniel-os</div>
      </div>
    </aside>
  )
}
