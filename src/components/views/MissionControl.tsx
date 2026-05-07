'use client'

import { useEffect, useState } from 'react'
import type { VaultData, View } from '@/app/page'
import { Card, Stat, SectionHeader, Badge } from '@/components/Card'

interface Props { data: VaultData; onNav: (v: View) => void; refresh: () => void }

const BUSINESSES = [
  {
    id: 'getright' as View,
    name: 'GetRight Fitness',
    icon: '💪',
    color: 'border-green/30 hover:border-green/60',
    accentBg: 'bg-green-dim',
    accentText: 'text-green',
    target: '$10K/mo',
    phase: 'Build',
  },
  {
    id: 'luxe' as View,
    name: 'Luxe Property Solutions',
    icon: '🏠',
    color: 'border-amber/30 hover:border-amber/60',
    accentBg: 'bg-amber-dim',
    accentText: 'text-amber',
    target: '$10K cash — 1 deal',
    phase: '90-Day Attack',
  },
  {
    id: 'forex' as View,
    name: 'Day Trading',
    icon: '📈',
    color: 'border-purple/30 hover:border-purple/60',
    accentBg: 'bg-purple-dim',
    accentText: 'text-purple',
    target: '+$4K Phase 1',
    phase: 'Active',
  },
  {
    id: 'nexora' as View,
    name: 'Nexora AI',
    icon: '🤖',
    color: 'border-teal/30 hover:border-teal/60',
    accentBg: 'bg-teal-dim',
    accentText: 'text-teal',
    target: '$10K–$20K MRR',
    phase: 'Build',
  },
  {
    id: 'artistly' as View,
    name: 'Artistly Books',
    icon: '📚',
    color: 'border-red/30 hover:border-red/60',
    accentBg: 'bg-red-dim',
    accentText: 'text-red',
    target: 'Store live',
    phase: 'Launch',
  },
]

// ---------------------------------------------------------------------------
// Weather widget (Open-Meteo — no API key, Calgary coords)
// ---------------------------------------------------------------------------
const WMO_DESCRIPTIONS: Record<number, string> = {
  0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Foggy', 48: 'Icy fog',
  51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle',
  61: 'Light rain', 63: 'Rain', 65: 'Heavy rain',
  71: 'Light snow', 73: 'Snow', 75: 'Heavy snow', 77: 'Snow grains',
  80: 'Light showers', 81: 'Showers', 82: 'Heavy showers',
  85: 'Snow showers', 86: 'Heavy snow showers',
  95: 'Thunderstorm', 96: 'Thunderstorm + hail', 99: 'Thunderstorm + heavy hail',
}

const WMO_ICON: Record<number, string> = {
  0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
  45: '🌫️', 48: '🌫️',
  51: '🌦️', 53: '🌦️', 55: '🌧️',
  61: '🌧️', 63: '🌧️', 65: '🌧️',
  71: '❄️', 73: '❄️', 75: '❄️', 77: '❄️',
  80: '🌦️', 81: '🌧️', 82: '⛈️',
  85: '🌨️', 86: '🌨️',
  95: '⛈️', 96: '⛈️', 99: '⛈️',
}

interface WeatherData {
  temp: number
  feelsLike: number
  wind: number
  code: number
}

function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=51.05&longitude=-114.07&current=temperature_2m,apparent_temperature,weathercode,windspeed_10m&temperature_unit=celsius&windspeed_unit=kmh&timezone=America%2FDenver'
    )
      .then(r => r.json())
      .then(d => {
        const c = d.current
        setWeather({
          temp:      Math.round(c.temperature_2m),
          feelsLike: Math.round(c.apparent_temperature),
          wind:      Math.round(c.windspeed_10m),
          code:      c.weathercode,
        })
      })
      .catch(() => {/* silent fail */})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="bg-panel border border-border rounded-lg p-3 flex items-center gap-2">
        <span className="text-xl">🌡️</span>
        <div>
          <div className="text-[11px] text-text-tertiary uppercase tracking-wider">Calgary, AB</div>
          <div className="text-sm text-text-tertiary">Loading…</div>
        </div>
      </div>
    )
  }

  if (!weather) {
    return (
      <div className="bg-panel border border-border rounded-lg p-3">
        <div className="text-[11px] text-text-tertiary uppercase tracking-wider mb-1">Calgary, AB</div>
        <div className="text-sm text-text-tertiary">Weather unavailable</div>
      </div>
    )
  }

  const icon = WMO_ICON[weather.code] ?? '🌡️'
  const desc = WMO_DESCRIPTIONS[weather.code] ?? 'Unknown'

  return (
    <div className="bg-panel border border-border rounded-lg p-3">
      <div className="text-[11px] text-text-tertiary uppercase tracking-wider mb-1">Calgary, AB</div>
      <div className="flex items-center gap-2">
        <span className="text-2xl">{icon}</span>
        <div>
          <div className="text-2xl font-semibold text-text-primary leading-none">{weather.temp}°C</div>
          <div className="text-[11px] text-text-tertiary mt-0.5">{desc}</div>
        </div>
      </div>
      <div className="mt-2 flex gap-3 text-[11px] text-text-tertiary">
        <span>Feels {weather.feelsLike}°C</span>
        <span>Wind {weather.wind} km/h</span>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Countdown widget — days until Month 3 target (May 21, 2026)
// ---------------------------------------------------------------------------
function CountdownWidget() {
  const target    = new Date('2026-05-21T00:00:00')
  const now       = new Date()
  const msLeft    = target.getTime() - now.getTime()
  const daysLeft  = Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)))
  const totalDays = 90
  const elapsed   = totalDays - daysLeft
  const pct       = Math.min(100, Math.round((elapsed / totalDays) * 100))

  return (
    <div className="bg-panel border border-border rounded-lg p-3">
      <div className="text-[11px] text-text-tertiary uppercase tracking-wider mb-1">90-Day Countdown</div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-semibold text-amber">{daysLeft}</span>
        <span className="text-sm text-text-tertiary">days left</span>
      </div>
      <div className="text-[11px] text-text-tertiary mt-0.5">until May 21 · 3–5 clients · $3K–8K MRR</div>
      <div className="mt-2 h-1.5 bg-void rounded-full overflow-hidden border border-border/40">
        <div
          className="h-full bg-amber rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-1 text-[10px] text-text-tertiary">{pct}% elapsed · Day {elapsed} of {totalDays}</div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Today's Focus widget — #1 priority from 90-Day attack plan
// ---------------------------------------------------------------------------
function TodaysFocusWidget({ onNav }: { onNav: (v: View) => void }) {
  return (
    <div className="bg-panel border border-blue/20 rounded-lg p-3">
      <div className="text-[11px] text-blue uppercase tracking-wider mb-1.5">Today's Focus</div>
      <div className="text-sm font-medium text-text-primary leading-snug">#1 · Luxe Wholesale</div>
      <div className="text-xs text-text-tertiary mt-0.5 leading-relaxed">
        10 seller convos · 3–5 qualified leads · 2–3 offers
      </div>
      <div className="mt-2 flex gap-2">
        <button
          onClick={() => onNav('leads')}
          className="text-[11px] text-blue hover:text-blue-glow transition-colors"
        >
          Open Leads →
        </button>
        <span className="text-text-tertiary text-[11px]">·</span>
        <button
          onClick={() => onNav('luxe')}
          className="text-[11px] text-text-tertiary hover:text-text-primary transition-colors"
        >
          Luxe View →
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Quick Actions bar
// ---------------------------------------------------------------------------
const ACTIONS: { label: string; icon: string; view: View; color: string }[] = [
  { label: 'Score New Leads',  icon: '🎯', view: 'leads',       color: 'hover:border-amber/40 hover:text-amber' },
  { label: 'Skills & Tools',   icon: '🛠️', view: 'skills',      color: 'hover:border-teal/40 hover:text-teal' },
  { label: 'Income Tracker',   icon: '💰', view: 'income',      color: 'hover:border-green/40 hover:text-green' },
  { label: 'Automations',      icon: '⚙️', view: 'automations', color: 'hover:border-blue/40 hover:text-blue' },
  { label: 'Knowledge Base',   icon: '📖', view: 'knowledge',   color: 'hover:border-purple/40 hover:text-purple' },
]

function QuickActions({ onNav }: { onNav: (v: View) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {ACTIONS.map(a => (
        <button
          key={a.label}
          onClick={() => onNav(a.view)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-panel border border-border text-xs text-text-secondary transition-all ${a.color}`}
        >
          <span>{a.icon}</span>
          <span>{a.label}</span>
        </button>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function MissionControl({ data, onNav, refresh }: Props) {
  const inbox   = data.daily.inboxCount ?? 0
  const deals   = data.luxe.dealCount   ?? 0
  const clients = data.getright.clientCount ?? 0
  const logs    = data.daily.logs ?? []
  const today   = logs[0]

  return (
    <div className="p-6 max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary tracking-tight">Mission Control</h1>
          <p className="text-sm text-text-tertiary mt-1">
            {new Date().toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            {' · '}Night Owl Mode
          </p>
        </div>
        <button
          onClick={refresh}
          className="text-xs text-text-tertiary hover:text-text-primary px-3 py-1.5 rounded-md border border-border hover:border-blue/40 transition-all"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Stat label="Inbox"        value={inbox}   icon="📥" color={inbox > 0 ? 'text-red' : 'text-green'} sub={inbox > 0 ? 'needs processing' : 'clear'} />
        <Stat label="GRF Clients"  value={clients} icon="💪" color={clients > 0 ? 'text-green' : 'text-red'} sub="target: 3" />
        <Stat label="Active Deals" value={deals}   icon="🏠" color={deals > 0 ? 'text-amber' : 'text-red'} sub="Luxe pipeline" />
        <Stat label="Trading P&L"  value="+$1K"    icon="📈" color="text-purple" sub="$4K phase target" />
      </div>

      {/* ── NEW: Focus / Weather / Countdown ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <TodaysFocusWidget onNav={onNav} />
        <WeatherWidget />
        <CountdownWidget />
      </div>

      {/* ── NEW: Quick Actions ── */}
      <div className="mb-6">
        <div className="text-[11px] text-text-tertiary uppercase tracking-wider mb-2">Quick Actions</div>
        <QuickActions onNav={onNav} />
      </div>

      {/* Today's brief */}
      {today && (
        <Card className="mb-6 border-blue/20">
          <SectionHeader title={`Today — ${today.date}`} sub="From daily log" />
          <div className="text-sm text-text-secondary whitespace-pre-wrap leading-relaxed line-clamp-8">
            {today.content.slice(0, 600)}
            {today.content.length > 600 && '…'}
          </div>
          <button
            onClick={() => onNav('daily')}
            className="mt-3 text-xs text-blue hover:text-blue-glow transition-colors"
          >
            Open Daily Log →
          </button>
        </Card>
      )}

      {/* Business cards */}
      <SectionHeader title="Businesses" sub="Click any card to open" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {BUSINESSES.map(b => (
          <button
            key={b.id}
            onClick={() => onNav(b.id)}
            className={`text-left bg-card border ${b.color} rounded-xl p-4 transition-all group`}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{b.icon}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${b.accentBg} ${b.accentText} font-medium`}>
                {b.phase}
              </span>
            </div>
            <div className="text-sm font-medium text-text-primary group-hover:text-white transition-colors">{b.name}</div>
            <div className="text-xs text-text-tertiary mt-1">Target: {b.target}</div>
          </button>
        ))}
      </div>

      {/* 90-Day Attack Plan */}
      <SectionHeader title="90-Day Attack Plan" sub="Feb 21 – May 21, 2026" />
      <div className="space-y-2">
        {[
          { n: 1, biz: 'Luxe Wholesale', target: '$10K cash — 1–2 closed deals', status: '🔴', note: '0 deals in pipeline, execution live' },
          { n: 2, biz: 'Day Trading',    target: 'Phase 1: +$4K on $50K funded',  status: '🟡', note: 'Up $1K' },
          { n: 3, biz: 'GetRight',       target: '3 clients @ $500/mo',           status: '🔴', note: '0 clients — missed March 21 deadline' },
        ].map(r => (
          <div key={r.n} className="flex items-center gap-3 bg-panel border border-border rounded-lg px-4 py-2.5">
            <span className="text-xs text-text-tertiary w-4">#{r.n}</span>
            <span className="text-sm font-medium text-text-primary w-32">{r.biz}</span>
            <span className="text-xs text-text-secondary flex-1">{r.target}</span>
            <span className="text-base">{r.status}</span>
            <span className="text-[11px] text-text-tertiary hidden sm:block">{r.note}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
