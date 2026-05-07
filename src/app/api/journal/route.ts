import { NextRequest, NextResponse } from 'next/server'
import { writeVaultFile, getJournalEntries } from '@/lib/vault'

export async function GET() {
  const entries = getJournalEntries()
  return NextResponse.json({ entries })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const {
    date, manualPnl, strategies, marketConditions,
    emotionalState, mistakes, improvements,
    mentalState, reflection, lesson
  } = body

  if (!date) return NextResponse.json({ error: 'date required' }, { status: 400 })

  const frontmatter = [
    '---',
    `date: "${date}"`,
    manualPnl != null ? `manualPnl: ${manualPnl}` : '',
    `strategies: [${(strategies || []).map((s: string) => s).join(', ')}]`,
    `marketConditions: ${marketConditions || ''}`,
    `emotionalState: [${(emotionalState || []).join(', ')}]`,
    `mistakes: [${(mistakes || []).join(', ')}]`,
    `improvements: [${(improvements || []).join(', ')}]`,
    `mentalState:`,
    `  sleep: ${mentalState?.sleep ?? 0}`,
    `  energy: ${mentalState?.energy ?? 0}`,
    `  focus: ${mentalState?.focus ?? 0}`,
    `  mood: ${mentalState?.mood ?? 0}`,
    `  stress: ${mentalState?.stress ?? 0}`,
    `  caffeine: ${mentalState?.caffeine ?? 0}`,
    '---',
    '',
    reflection ? `## Reflection\n\n${reflection}` : '',
    '',
    lesson ? `## Lesson\n\n${lesson}` : '',
  ].filter(l => l !== undefined).join('\n')

  writeVaultFile(`forex/journal/${date}.md`, frontmatter)

  // Also write mental state snapshot
  const mentalContent = [
    '---',
    `date: "${date}"`,
    `sleep: ${mentalState?.sleep ?? 0}`,
    `energy: ${mentalState?.energy ?? 0}`,
    `focus: ${mentalState?.focus ?? 0}`,
    `mood: ${mentalState?.mood ?? 0}`,
    `stress: ${mentalState?.stress ?? 0}`,
    `caffeine: ${mentalState?.caffeine ?? 0}`,
    '---',
  ].join('\n')
  writeVaultFile(`forex/mental/${date}.md`, mentalContent)

  return NextResponse.json({ ok: true })
}
