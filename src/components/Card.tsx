import { ReactNode } from 'react'
import clsx from 'clsx'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  hover?: boolean
}

export function Card({ children, className, onClick, hover }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-card border border-border rounded-xl p-4',
        hover && 'cursor-pointer hover:border-blue/40 hover:bg-card/80 transition-all',
        className
      )}
    >
      {children}
    </div>
  )
}

interface StatProps {
  label: string
  value: string | number
  sub?: string
  color?: string
  icon?: string
}

export function Stat({ label, value, sub, color, icon }: StatProps) {
  return (
    <div className="bg-panel border border-border rounded-lg p-3">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] text-text-tertiary uppercase tracking-wider mb-1">{label}</div>
          <div className={clsx('text-2xl font-semibold', color ?? 'text-text-primary')}>{value}</div>
          {sub && <div className="text-[11px] text-text-tertiary mt-0.5">{sub}</div>}
        </div>
        {icon && <span className="text-xl opacity-60">{icon}</span>}
      </div>
    </div>
  )
}

export function SectionHeader({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-base font-semibold text-text-primary">{title}</h2>
        {sub && <p className="text-xs text-text-tertiary mt-0.5">{sub}</p>}
      </div>
      {action}
    </div>
  )
}

export function Badge({ label, color }: { label: string; color: 'green' | 'amber' | 'red' | 'blue' | 'purple' | 'teal' | 'muted' }) {
  const map = {
    green:  'bg-green-dim text-green border-green/20',
    amber:  'bg-amber-dim text-amber border-amber/20',
    red:    'bg-red-dim   text-red   border-red/20',
    blue:   'bg-blue-dim  text-blue  border-blue/20',
    purple: 'bg-purple-dim text-purple border-purple/20',
    teal:   'bg-teal-dim  text-teal  border-teal/20',
    muted:  'bg-muted/30  text-text-secondary border-border',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${map[color]}`}>
      {label}
    </span>
  )
}

export function EmptyState({ icon, message }: { icon: string; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-text-tertiary">
      <span className="text-3xl mb-2">{icon}</span>
      <p className="text-sm">{message}</p>
    </div>
  )
}
