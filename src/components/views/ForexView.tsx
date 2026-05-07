'use client'
import { useState } from 'react'
import { Card, Stat, SectionHeader, Badge } from '@/components/Card'

interface Props { data: any; refresh: () => void }

// ── helpers ──────────────────────────────────────────────────────────────────
const fmt  = (n: number) => n >= 0 ? `+$${n.toFixed(2)}` : `-$${Math.abs(n).toFixed(2)}`
const fmtP = (n: number) => n >= 0 ? `+${n.toFixed(2)}%` : `${n.toFixed(2)}%`
const today = () => new Date().toISOString().split('T')[0]

const STRATEGIES = ['Scalping','Breakout','Trend Following','Mean Reversion','Swing Trade','Momentum','Support/Resistance','Wyckoff','Order Block','Liquidity Grab']
const EMOTIONS   = ['Confident','Calm','Anxious','Frustrated','Neutral','Excited','Fearful','Greedy']
const MARKETS    = ['Trending','Ranging','Volatile','Low Volume','High Volume','Gap Up','Gap Down']
const SESSIONS   = ['Asian','London','New York']

// ── sub-components ───────────────────────────────────────────────────────────
function TradeRow({ t, onDelete }: { t: any; onDelete: () => void }) {
  const isWin = t.pnl >= 0
  return (
    <tr className="border-b border-border hover:bg-panel/50 transition-colors text-sm">
      <td className="px-3 py-2.5 font-medium text-text-primary">{t.symbol}</td>
      <td className="px-3 py-2.5">
        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase border ${t.type === 'long' ? 'border-green/40 text-green' : 'border-red/40 text-red'}`}>{t.type}</span>
      </td>
      <td className="px-3 py-2.5">
        <span className={`px-2 py-0.5 rounded text-[10px] border ${t.status === 'open' ? 'border-amber/40 text-amber' : 'border-muted text-text-tertiary'}`}>{t.status}</span>
      </td>
      <td className="px-3 py-2.5 text-text-secondary">${t.entry?.toFixed(2)}</td>
      <td className="px-3 py-2.5 text-text-secondary">{t.exit ? `$${t.exit.toFixed(2)}` : '—'}</td>
      <td className="px-3 py-2.5 text-text-secondary">{t.qty}</td>
      <td className={`px-3 py-2.5 font-semibold ${isWin ? 'text-green' : 'text-red'}`}>
        <div>{fmt(t.pnl)}</div>
        <div className="text-[10px] font-normal">{fmtP(t.pnlPct)}</div>
      </td>
      <td className="px-3 py-2.5 text-text-tertiary text-xs">{t.strategy}</td>
      <td className="px-3 py-2.5 text-text-tertiary text-xs">{t.date}</td>
      <td className="px-3 py-2.5">
        <button onClick={onDelete} className="text-text-tertiary hover:text-red text-xs px-1.5 py-0.5 rounded hover:bg-red/10 transition-colors">✕</button>
      </td>
    </tr>
  )
}

function AddTradeModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    symbol: 'XAUUSD', type: 'long', status: 'closed',
    entry: '', exit: '', qty: '',
    date: today(), time: '', session: 'Asian', strategy: 'Scalping', notes: ''
  })
  const [saving, setSaving] = useState(false)
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const submit = async () => {
    const entry = parseFloat(form.entry), exit = parseFloat(form.exit), qty = parseFloat(form.qty)
    if (!entry || !qty) return
    const diff   = form.type === 'long' ? (exit || 0) - entry : entry - (exit || 0)
    const pnl    = parseFloat((diff * qty * (form.symbol.includes('XAU') ? 100 : 1)).toFixed(2))
    const pnlPct = exit ? parseFloat(((diff / entry) * 100).toFixed(2)) : 0
    setSaving(true)
    await fetch('/api/trades', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, entry, exit: exit || null, qty, pnl, pnlPct }),
    })
    setSaving(false)
    onSaved()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-bg border border-border rounded-xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-text-primary font-semibold text-base">Add Trade</h2>
          <button onClick={onClose} className="text-text-tertiary hover:text-text-primary text-lg">✕</button>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {[['Symbol','symbol','text'],['Date','date','date']].map(([l,k,t]) => (
              <div key={k}>
                <label className="text-text-tertiary text-xs mb-1 block">{l}</label>
                <input type={t} value={(form as any)[k]} onChange={e => set(k, e.target.value)}
                  className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text-primary text-sm outline-none focus:border-purple" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[['Entry','entry'],['Exit','exit'],['Qty','qty']].map(([l,k]) => (
              <div key={k}>
                <label className="text-text-tertiary text-xs mb-1 block">{l}</label>
                <input type="number" step="0.01" value={(form as any)[k]} onChange={e => set(k, e.target.value)}
                  className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text-primary text-sm outline-none focus:border-purple" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[['Type','type',['long','short']],['Status','status',['closed','open']],['Session','session',SESSIONS]].map(([l,k,opts]) => (
              <div key={k as string}>
                <label className="text-text-tertiary text-xs mb-1 block">{l as string}</label>
                <select value={(form as any)[k as string]} onChange={e => set(k as string, e.target.value)}
                  className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text-primary text-sm outline-none">
                  {(opts as string[]).map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div>
            <label className="text-text-tertiary text-xs mb-1 block">Strategy</label>
            <select value={form.strategy} onChange={e => set('strategy', e.target.value)}
              className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text-primary text-sm outline-none">
              {STRATEGIES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-text-tertiary text-xs mb-1 block">Notes</label>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3}
              className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text-primary text-sm outline-none resize-none focus:border-purple" />
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-border text-text-secondary text-sm hover:text-text-primary">Cancel</button>
          <button onClick={submit} disabled={saving}
            className="flex-1 py-2 rounded-lg bg-purple text-white text-sm font-medium hover:bg-purple/80 disabled:opacity-50">
            {saving ? 'Saving…' : 'Add Trade'}
          </button>
        </div>
      </div>
    </div>
  )
}

function JournalModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    date: today(),
    manualPnl: '',
    strategies: [] as string[],
    marketConditions: '',
    emotionalState: [] as string[],
    mistakes: '',
    improvements: '',
    mentalState: { sleep: 5, energy: 5, focus: 5, mood: 5, stress: 3, caffeine: 1 },
    reflection: '',
    lesson: '',
  })
  const [saving, setSaving] = useState(false)
  const toggleArr = (key: 'strategies' | 'emotionalState', val: string) =>
    setForm(p => ({ ...p, [key]: p[key].includes(val) ? p[key].filter(x => x !== val) : [...p[key], val] }))
  const setMs = (k: string, v: number) => setForm(p => ({ ...p, mentalState: { ...p.mentalState, [k]: v } }))

  const submit = async () => {
    setSaving(true)
    await fetch('/api/journal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        manualPnl: form.manualPnl ? parseFloat(form.manualPnl) : null,
        mistakes: form.mistakes ? form.mistakes.split(',').map(s => s.trim()) : [],
        improvements: form.improvements ? form.improvements.split(',').map(s => s.trim()) : [],
      }),
    })
    setSaving(false)
    onSaved()
    onClose()
  }

  const msLabels = [['sleep','🌙','Sleep'],['energy','⚡','Energy'],['focus','🎯','Focus'],['mood','😊','Mood'],['stress','❗','Stress'],['caffeine','☕','Caffeine']]

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-bg border border-border rounded-xl p-6 w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-text-primary font-semibold text-base">Journal Entry</h2>
          <button onClick={onClose} className="text-text-tertiary hover:text-text-primary text-lg">✕</button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-text-tertiary text-xs mb-1 block">Date</label>
              <input type="date" value={form.date} onChange={e => setForm(p => ({...p, date: e.target.value}))}
                className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text-primary text-sm outline-none" />
            </div>
            <div>
              <label className="text-text-tertiary text-xs mb-1 block">P&L (if no trades logged)</label>
              <input type="number" placeholder="e.g. 24.70" value={form.manualPnl} onChange={e => setForm(p => ({...p, manualPnl: e.target.value}))}
                className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text-primary text-sm outline-none" />
            </div>
          </div>

          {/* Mental State */}
          <div>
            <label className="text-text-tertiary text-xs mb-2 block">Mental State</label>
            <div className="grid grid-cols-3 gap-2">
              {msLabels.map(([key, icon, label]) => (
                <div key={key} className="bg-panel border border-border rounded-lg p-2">
                  <div className="text-xs text-text-tertiary mb-1">{icon} {label}</div>
                  <div className="flex items-center gap-1">
                    <input type="range" min={key === 'caffeine' ? 0 : 1} max="10"
                      value={(form.mentalState as any)[key]}
                      onChange={e => setMs(key, +e.target.value)}
                      className="flex-1 h-1 accent-purple" />
                    <span className="text-text-primary text-xs w-4">{(form.mentalState as any)[key]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strategies */}
          <div>
            <label className="text-text-tertiary text-xs mb-2 block">Strategies Used</label>
            <div className="flex flex-wrap gap-1.5">
              {STRATEGIES.map(s => (
                <button key={s} onClick={() => toggleArr('strategies', s)}
                  className={`px-2.5 py-1 rounded text-xs border transition-colors ${form.strategies.includes(s) ? 'border-purple bg-purple/10 text-purple' : 'border-border text-text-tertiary hover:text-text-primary'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Emotions + Market */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-text-tertiary text-xs mb-2 block">Market Conditions</label>
              <select value={form.marketConditions} onChange={e => setForm(p => ({...p, marketConditions: e.target.value}))}
                className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text-primary text-sm outline-none">
                <option value="">Select…</option>
                {MARKETS.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="text-text-tertiary text-xs mb-2 block">Emotional State</label>
              <div className="flex flex-wrap gap-1">
                {EMOTIONS.slice(0,6).map(e => (
                  <button key={e} onClick={() => toggleArr('emotionalState', e)}
                    className={`px-2 py-0.5 rounded text-[10px] border transition-colors ${form.emotionalState.includes(e) ? 'border-purple text-purple' : 'border-border text-text-tertiary'}`}>
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="text-text-tertiary text-xs mb-1 block">Daily Reflection</label>
            <textarea value={form.reflection} onChange={e => setForm(p => ({...p, reflection: e.target.value}))} rows={3}
              placeholder="What happened today? What zones were active? How did you execute?"
              className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text-primary text-sm outline-none resize-none focus:border-purple" />
          </div>
          <div>
            <label className="text-text-tertiary text-xs mb-1 block">Lesson Learned</label>
            <textarea value={form.lesson} onChange={e => setForm(p => ({...p, lesson: e.target.value}))} rows={2}
              placeholder="What's the takeaway?"
              className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text-primary text-sm outline-none resize-none focus:border-purple" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-text-tertiary text-xs mb-1 block">Mistakes (comma separated)</label>
              <input value={form.mistakes} onChange={e => setForm(p => ({...p, mistakes: e.target.value}))}
                placeholder="early_exit, overtrading"
                className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text-primary text-sm outline-none" />
            </div>
            <div>
              <label className="text-text-tertiary text-xs mb-1 block">Improvements</label>
              <input value={form.improvements} onChange={e => setForm(p => ({...p, improvements: e.target.value}))}
                placeholder="Wait for setup confirmation"
                className="w-full bg-panel border border-border rounded-lg px-3 py-2 text-text-primary text-sm outline-none" />
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-border text-text-secondary text-sm">Cancel</button>
          <button onClick={submit} disabled={saving}
            className="flex-1 py-2 rounded-lg bg-purple text-white text-sm font-medium hover:bg-purple/80 disabled:opacity-50">
            {saving ? 'Saving…' : 'Save Entry'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── main component ────────────────────────────────────────────────────────────
export default function ForexView({ data, refresh }: Props) {
  const [tab, setTab]             = useState<'overview'|'trades'|'journal'|'mental'>('overview')
  const [showAddTrade, setShowAddTrade] = useState(false)
  const [showJournal, setShowJournal]   = useState(false)
  const [tradeFilter, setTradeFilter]   = useState<'all'|'open'|'closed'>('all')

  const trades:   any[]  = data?.trades         ?? []
  const journal:  any[]  = data?.journalEntries  ?? []
  const mental:   any    = data?.mentalToday      ?? {}
  const stats:    any    = data?.stats            ?? {}

  const deleteTrade = async (file: string) => {
    await fetch('/api/trades', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ file }) })
    refresh()
  }

  const filteredTrades = trades.filter(t => tradeFilter === 'all' ? true : t.status === tradeFilter)

  // Readiness score
  const readiness = mental?.sleep && mental?.energy
    ? Math.round((mental.sleep + mental.energy + mental.focus + mental.mood - (mental.stress ?? 5)) / 5)
    : 0
  const ready = readiness >= 6

  // Cumulative P&L for sparkline
  const cumPnlData = [...trades]
    .filter(t => t.status === 'closed')
    .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce((acc: number[], t: any, i) => [...acc, parseFloat(((acc[i-1] ?? 0) + t.pnl).toFixed(2))], [])

  const tabs = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'trades',   label: `📋 Trades (${trades.length})` },
    { id: 'journal',  label: `📖 Journal (${journal.length})` },
    { id: 'mental',   label: '🧠 Mental State' },
  ] as const

  return (
    <div className="p-6 max-w-5xl mx-auto animate-fade-in">

      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Day Trading</h1>
          <p className="text-xs text-text-tertiary mt-1">Wyckoff + SMC · Asian Session · $50K Funded</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowJournal(true)} className="px-3 py-1.5 text-xs border border-border rounded-lg text-text-secondary hover:text-text-primary hover:bg-panel transition-colors">
            + Journal Entry
          </button>
          <button onClick={() => setShowAddTrade(true)} className="px-3 py-1.5 text-xs bg-purple text-white rounded-lg hover:bg-purple/80 transition-colors font-medium">
            + Add Trade
          </button>
          <Badge label={ready ? 'Ready' : 'Not Ready'} color={ready ? 'green' : 'red'} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-panel border border-border rounded-xl p-1 w-fit mb-5">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id as any)}
            className={`px-4 py-1.5 rounded-lg text-xs transition-colors ${tab === t.id ? 'bg-bg text-text-primary shadow-sm' : 'text-text-tertiary hover:text-text-primary'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ─────────────────────────────────────────────────── */}
      {tab === 'overview' && (
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat label="Total P&L"   value={fmt(stats.totalPnl ?? 0)}  color={stats.totalPnl >= 0 ? 'text-green' : 'text-red'}  icon="💰" />
            <Stat label="Win Rate"    value={`${stats.winRate ?? 0}%`}    color="text-purple"  icon="🎯" sub={`${stats.wins ?? 0}W / ${stats.losses ?? 0}L`} />
            <Stat label="Total Trades" value={String(stats.totalTrades ?? 0)} color="text-text-primary" icon="📈" sub={`${stats.openTrades ?? 0} open`} />
            <Stat label="Avg Win"     value={`$${(stats.avgWin ?? 0).toFixed(2)}`} color="text-green" icon="⚡" sub={`Avg Loss: $${Math.abs(stats.avgLoss ?? 0).toFixed(2)}`} />
          </div>

          {/* Phase progress */}
          <Card className="border-purple/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-text-tertiary uppercase tracking-wider">Funded Account Progress</div>
                <div className="text-2xl font-semibold text-purple mt-1">{fmt(stats.totalPnl ?? 0)}</div>
                <div className="text-xs text-text-tertiary mt-0.5">Phase 1 target: +$4,000</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-text-tertiary">Phase 1</div>
                <div className="text-lg font-semibold text-green mt-1">{Math.round(((stats.totalPnl ?? 0) / 4000) * 100)}%</div>
                <div className="w-36 bg-muted rounded-full h-1.5 mt-1">
                  <div className="bg-purple h-1.5 rounded-full transition-all" style={{ width: `${Math.min(100, Math.round(((stats.totalPnl ?? 0) / 4000) * 100))}%` }} />
                </div>
              </div>
            </div>
          </Card>

          {/* Recent trades */}
          {trades.length > 0 && (
            <Card>
              <SectionHeader title="Recent Trades" />
              <div className="space-y-2">
                {trades.slice(0, 3).map((t: any) => (
                  <div key={t.file} className="flex items-center gap-3 bg-panel rounded-lg px-3 py-2.5">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${t.type === 'long' ? 'border-green/40 text-green' : 'border-red/40 text-red'}`}>{t.type.toUpperCase()}</span>
                    <span className="text-sm font-medium text-text-primary flex-1">{t.symbol}</span>
                    <span className="text-xs text-text-tertiary">{t.strategy}</span>
                    <span className="text-xs text-text-tertiary">{t.date}</span>
                    <span className={`text-sm font-semibold ${t.pnl >= 0 ? 'text-green' : 'text-red'}`}>{fmt(t.pnl)}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Latest journal entry */}
          {journal.length > 0 && (
            <Card>
              <SectionHeader title={`Latest Reflection · ${journal[0].date}`} />
              {journal[0].reflection && (
                <p className="text-sm text-text-secondary leading-relaxed mb-3">{journal[0].reflection}</p>
              )}
              {journal[0].lesson && (
                <div className="bg-panel border border-border rounded-lg px-3 py-2 text-xs text-text-tertiary">
                  <span className="text-amber font-medium mr-2">Lesson:</span>{journal[0].lesson}
                </div>
              )}
            </Card>
          )}

          {/* Sessions reference */}
          <Card className="border-purple/20">
            <SectionHeader title="Trading Sessions" sub="Non-negotiable blocks" />
            <div className="space-y-2">
              {[
                { session: 'GRF Check-in', time: '8:00 – 9:00 AM MT', focus: 'Business review' },
                { session: 'Trading Window', time: '6:00 – 8:00 AM MT', focus: 'Asian session · Wyckoff scalping · non-negotiable' },
              ].map(s => (
                <div key={s.session} className="flex items-center gap-4 bg-panel rounded-lg px-4 py-3">
                  <div className="w-2 h-2 rounded-full bg-purple animate-pulse-slow" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-text-primary">{s.session}</div>
                    <div className="text-xs text-text-tertiary">{s.focus}</div>
                  </div>
                  <span className="text-xs font-mono text-purple">{s.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ── TRADES ───────────────────────────────────────────────────── */}
      {tab === 'trades' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-1 border border-border rounded-lg overflow-hidden text-xs">
              {(['all','open','closed'] as const).map(f => (
                <button key={f} onClick={() => setTradeFilter(f)}
                  className={`px-3 py-1.5 capitalize transition-colors ${tradeFilter === f ? 'bg-panel text-text-primary' : 'text-text-tertiary hover:text-text-primary'}`}>
                  {f} ({f === 'all' ? trades.length : trades.filter((t:any) => t.status === f).length})
                </button>
              ))}
            </div>
            <button onClick={() => setShowAddTrade(true)} className="px-3 py-1.5 text-xs bg-purple text-white rounded-lg hover:bg-purple/80 font-medium">
              + Add Trade
            </button>
          </div>

          {filteredTrades.length === 0 ? (
            <div className="bg-panel border border-border rounded-xl p-12 text-center">
              <p className="text-text-tertiary text-sm">No trades yet. Add your first trade to get started.</p>
            </div>
          ) : (
            <div className="bg-panel border border-border rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-text-tertiary">
                    {['Symbol','Type','Status','Entry','Exit','Qty','P&L','Strategy','Date',''].map(h => (
                      <th key={h} className="px-3 py-2.5 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredTrades.map((t: any) => (
                    <TradeRow key={t.file} t={t} onDelete={() => deleteTrade(t.file)} />
                  ))}
                </tbody>
              </table>
              <div className="px-3 py-2 text-text-tertiary text-xs border-t border-border">
                Showing {filteredTrades.length} of {trades.length} trades · Total P&L: <span className={stats.totalPnl >= 0 ? 'text-green font-medium' : 'text-red font-medium'}>{fmt(stats.totalPnl ?? 0)}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── JOURNAL ──────────────────────────────────────────────────── */}
      {tab === 'journal' && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <button onClick={() => setShowJournal(true)} className="px-3 py-1.5 text-xs bg-purple text-white rounded-lg hover:bg-purple/80 font-medium">
              + New Entry
            </button>
          </div>
          {journal.length === 0 ? (
            <div className="bg-panel border border-border rounded-xl p-12 text-center">
              <p className="text-text-tertiary text-sm">No journal entries yet. Start logging your sessions.</p>
            </div>
          ) : (
            journal.map((e: any) => (
              <Card key={e.file}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-sm font-semibold text-text-primary">{new Date(e.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</div>
                    {e.manualPnl != null && <div className={`text-xs mt-0.5 font-medium ${e.manualPnl >= 0 ? 'text-green' : 'text-red'}`}>{fmt(e.manualPnl)}</div>}
                  </div>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {(e.strategies ?? []).map((s: string) => (
                      <span key={s} className="px-2 py-0.5 bg-purple/10 border border-purple/20 rounded text-purple text-[10px]">{s}</span>
                    ))}
                    {(e.emotionalState ?? []).map((s: string) => (
                      <span key={s} className="px-2 py-0.5 bg-amber/10 border border-amber/20 rounded text-amber text-[10px]">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-3 text-xs">
                  {[['🌙', 'Sleep', e.mentalState?.sleep], ['⚡', 'Energy', e.mentalState?.energy], ['🎯', 'Focus', e.mentalState?.focus]].map(([icon, label, val]) => (
                    <div key={label as string} className="bg-bg border border-border rounded-lg px-3 py-2">
                      <span className="text-text-tertiary">{icon as string} {label as string}: </span>
                      <span className="text-text-primary font-medium">{val ?? 0}/10</span>
                    </div>
                  ))}
                </div>

                {e.reflection && (
                  <div className="mb-2">
                    <div className="text-[10px] text-text-tertiary uppercase tracking-wider mb-1">Reflection</div>
                    <p className="text-sm text-text-secondary leading-relaxed">{e.reflection}</p>
                  </div>
                )}
                {e.lesson && (
                  <div className="mt-2 bg-amber/5 border border-amber/20 rounded-lg px-3 py-2">
                    <span className="text-amber text-xs font-medium">Lesson: </span>
                    <span className="text-text-secondary text-xs">{e.lesson}</span>
                  </div>
                )}
                {(e.mistakes ?? []).length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {e.mistakes.map((m: string) => (
                      <span key={m} className="px-2 py-0.5 bg-red/10 border border-red/20 rounded text-red text-[10px]">{m}</span>
                    ))}
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      )}

      {/* ── MENTAL STATE ─────────────────────────────────────────────── */}
      {tab === 'mental' && (
        <div className="space-y-4">
          <Card className={`border-${ready ? 'green' : 'red'}/20`}>
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16">
                <svg viewBox="0 0 60 60" className="w-16 h-16 -rotate-90">
                  <circle cx="30" cy="30" r="22" fill="none" stroke="#222" strokeWidth="6" />
                  <circle cx="30" cy="30" r="22" fill="none"
                    stroke={ready ? '#22c55e' : '#ef4444'} strokeWidth="6"
                    strokeDasharray={`${2 * Math.PI * 22}`}
                    strokeDashoffset={`${2 * Math.PI * 22 * (1 - Math.max(0, readiness) / 10)}`}
                    strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-text-primary font-bold text-sm">{readiness}</div>
              </div>
              <div>
                <div className="text-text-primary font-semibold">Trading Readiness</div>
                <div className={`text-sm mt-0.5 ${ready ? 'text-green' : 'text-red'}`}>
                  {ready ? '✅ Ready to trade today' : '⚠ Not recommended to trade today'}
                </div>
                <div className="text-xs text-text-tertiary mt-1">Based on today's mental state log</div>
              </div>
            </div>
          </Card>

          <Card>
            <SectionHeader title="Today's Mental Metrics" sub={`Last logged: ${today()}`} />
            <div className="grid grid-cols-3 gap-3">
              {[['sleep','🌙','Sleep Quality'],['energy','⚡','Energy Level'],['focus','🎯','Focus'],['mood','😊','Mood'],['stress','❗','Stress Level'],['caffeine','☕','Caffeine (cups)']].map(([key, icon, label]) => (
                <div key={key} className="bg-panel border border-border rounded-xl p-3">
                  <div className="text-xs text-text-tertiary mb-2">{icon} {label}</div>
                  <div className="text-xl font-bold text-text-primary">{(mental as any)[key] ?? '—'}<span className="text-xs text-text-tertiary font-normal">/10</span></div>
                  <div className="h-1 bg-muted rounded-full mt-2">
                    <div className="h-1 bg-purple rounded-full" style={{ width: `${((mental as any)[key] ?? 0) * 10}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="bg-panel border border-border rounded-xl p-4 text-sm text-text-tertiary">
            Mental state is saved daily via journal entries. Use <span className="text-purple">+ Journal Entry</span> to log today's state.
          </div>
        </div>
      )}

      {/* Modals */}
      {showAddTrade && <AddTradeModal onClose={() => setShowAddTrade(false)} onSaved={refresh} />}
      {showJournal  && <JournalModal  onClose={() => setShowJournal(false)}  onSaved={refresh} />}
    </div>
  )
}
