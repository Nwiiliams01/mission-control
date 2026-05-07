import { NextResponse } from 'next/server'
import {
  getClients, getDeals, getInbox, getDailyLogs,
  getGoals, getHealth, getForexOverview,
  getNexoraOverview, getArtistlyOverview, getSubscriptions,
  getTrades, getJournalEntries, getMentalStateToday,
  getPrompts,
  readMd, listMdFiles
} from '@/lib/vault'

export async function GET() {
  const [clients, deals, inbox, logs, goals, health, forex, nexora, artistly, subs] = await Promise.all([
    Promise.resolve(getClients()),
    Promise.resolve(getDeals()),
    Promise.resolve(getInbox()),
    Promise.resolve(getDailyLogs()),
    Promise.resolve(getGoals()),
    Promise.resolve(getHealth()),
    Promise.resolve(getForexOverview()),
    Promise.resolve(getNexoraOverview()),
    Promise.resolve(getArtistlyOverview()),
    Promise.resolve(getSubscriptions()),
  ])

  const trades         = getTrades()
  const journalEntries = getJournalEntries()
  const mentalToday    = getMentalStateToday()
  const prompts        = getPrompts()

  // Compute trading stats
  const closedTrades = trades.filter(t => t.status === 'closed')
  const wins         = closedTrades.filter(t => t.pnl > 0)
  const losses       = closedTrades.filter(t => t.pnl < 0)
  const totalPnl     = closedTrades.reduce((s, t) => s + t.pnl, 0)
  const winRate      = closedTrades.length ? Math.round((wins.length / closedTrades.length) * 100) : 0
  const avgWin       = wins.length ? wins.reduce((s, t) => s + t.pnl, 0) / wins.length : 0
  const avgLoss      = losses.length ? losses.reduce((s, t) => s + t.pnl, 0) / losses.length : 0

  // Luxe KPIs
  const execTracker = readMd('daily/luxe-90-day-execution-tracker.md')

  return NextResponse.json({
    lastRefresh: new Date().toISOString(),

    getright: {
      clients,
      clientCount: clients.length,
    },

    luxe: {
      deals,
      dealCount:  deals.length,
      hotDeals:   deals.filter(d => (d.lead?.score ?? 0) >= 80).length,
      warmDeals:  deals.filter(d => (d.lead?.score ?? 0) >= 60 && (d.lead?.score ?? 0) < 80).length,
      execTracker: execTracker?.content ?? '',
    },

    forex: {
      overview:      forex?.content ?? '',
      data:          forex?.data ?? {},
      trades,
      journalEntries,
      mentalToday,
      stats: {
        totalPnl:    parseFloat(totalPnl.toFixed(2)),
        winRate,
        totalTrades: closedTrades.length,
        openTrades:  trades.filter(t => t.status === 'open').length,
        wins:        wins.length,
        losses:      losses.length,
        avgWin:      parseFloat(avgWin.toFixed(2)),
        avgLoss:     parseFloat(avgLoss.toFixed(2)),
      },
    },

    nexora: {
      overview: nexora?.content ?? '',
      data:     nexora?.data ?? {},
    },

    artistly: {
      overview: artistly?.content ?? '',
      data:     artistly?.data ?? {},
    },

    personal: {
      goals:         goals?.content ?? '',
      health:        health?.content ?? '',
      healthData:    health?.data ?? {},
      subscriptions: subs?.content ?? '',
    },

    daily: {
      inbox,
      inboxCount: inbox.length,
      logs,
    },

    prompts: {
      all:      prompts,
      total:    prompts.length,
      byCategory: prompts.reduce<Record<string, number>>((acc, p) => {
        acc[p.category] = (acc[p.category] ?? 0) + 1
        return acc
      }, {}),
    },
  })
}
