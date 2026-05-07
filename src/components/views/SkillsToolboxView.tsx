'use client'

import { Card, SectionHeader } from '@/components/Card'

const SKILL_GROUPS = [
  {
    label: 'Real Estate',
    color: 'text-amber',
    border: 'border-amber/20',
    bg: 'bg-amber-dim',
    skills: [
      { name: 'LPS Deal Underwriter',    desc: 'Run MAO/LAO math, check buy box, score a deal', icon: '🏠', cmd: 'underwrite this deal' },
      { name: 'Distressed Lead Scanner', desc: 'Daily FSBO + foreclosure scan across 4 markets',  icon: '🔍', cmd: 'run the daily lead scan' },
      { name: 'Weekly Market Analysis',  desc: 'Memphis / Indy / Columbus 100-day listings',       icon: '📊', cmd: 'run my weekly analysis' },
      { name: 'LPS Seller Follow-Up',    desc: 'HOT/WARM/COLD SMS + email sequences',              icon: '📩', cmd: 'build a follow-up sequence' },
      { name: 'LPS Brand Voice',         desc: 'Seller outreach letters, direct mail, cold scripts', icon: '✍️', cmd: 'write LPS outreach copy' },
    ],
  },
  {
    label: 'GetRight Fitness',
    color: 'text-green',
    border: 'border-green/20',
    bg: 'bg-green-dim',
    skills: [
      { name: 'GRF Brand Voice',       desc: 'Social posts, email sequences, sales copy',   icon: '💪', cmd: 'write a GRF post' },
      { name: 'GRF Content Repurpose', desc: 'One idea → caption + email + SMS in one shot', icon: '♻️', cmd: 'repurpose this GRF content' },
      { name: 'Recipe Pack Loader',    desc: 'Batch-load recipe packs into vault',           icon: '🥗', cmd: 'add recipe pack' },
    ],
  },
  {
    label: 'Nexora AI',
    color: 'text-teal',
    border: 'border-teal/20',
    bg: 'bg-teal-dim',
    skills: [
      { name: 'Vibe Coding',      desc: 'Build + ship features via plain-English convo', icon: '⚡', cmd: 'vibe code like a legend' },
      { name: 'Marketing Mode',   desc: 'Full 23-discipline marketing strategy + copy',   icon: '📣', cmd: 'build a marketing strategy' },
      { name: 'Canvas Design',    desc: 'Poster, banner, brand asset creation (.png)',    icon: '🎨', cmd: 'create a design' },
      { name: 'Diagram Generator', desc: 'Excalidraw diagrams from text descriptions',   icon: '📐', cmd: 'make a diagram' },
    ],
  },
  {
    label: 'Analytics & Data',
    color: 'text-blue',
    border: 'border-blue/20',
    bg: 'bg-blue-dim',
    skills: [
      { name: 'YouTube Analytics',     desc: 'Channel stats, video perf, competitor research', icon: '▶️', cmd: 'check YouTube channel stats' },
      { name: 'Artistly Product Builder', desc: 'KDP niche research + prompt packs for books',  icon: '📚', cmd: 'find a niche for artistly' },
    ],
  },
  {
    label: 'Documents & Files',
    color: 'text-purple',
    border: 'border-purple/20',
    bg: 'bg-purple-dim',
    skills: [
      { name: 'DOCX Creator',  desc: 'Professional Word documents with formatting',    icon: '📄', cmd: 'create a word document' },
      { name: 'PPTX Creator',  desc: 'Slide decks, pitch decks, presentations',        icon: '🖥️', cmd: 'create a presentation' },
      { name: 'XLSX Creator',  desc: 'Excel spreadsheets, budgets, financial models',   icon: '📊', cmd: 'create a spreadsheet' },
      { name: 'PDF Handler',   desc: 'Extract, merge, create, fill PDF forms',          icon: '📑', cmd: 'work with a PDF' },
    ],
  },
]

export default function SkillsToolboxView() {
  return (
    <div className="p-6 max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-text-primary tracking-tight">Skills & Toolbox</h1>
        <p className="text-sm text-text-tertiary mt-1">All available Claude skills — copy any trigger phrase and paste into chat</p>
      </div>

      {/* Skill groups */}
      <div className="space-y-6">
        {SKILL_GROUPS.map(group => (
          <div key={group.label}>
            <SectionHeader title={group.label} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {group.skills.map(skill => (
                <Card key={skill.name} className={`border ${group.border}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg ${group.bg} flex items-center justify-center text-base flex-shrink-0`}>
                      {skill.icon}
                    </div>
                    <div className="min-w-0">
                      <div className={`text-sm font-medium ${group.color}`}>{skill.name}</div>
                      <div className="text-xs text-text-tertiary mt-0.5 leading-relaxed">{skill.desc}</div>
                      <div className="mt-2 inline-flex items-center gap-1 bg-panel border border-border rounded px-2 py-0.5">
                        <span className="text-[10px] text-text-tertiary font-mono">"{skill.cmd}"</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Quick reference footer */}
      <Card className="mt-6 border-blue/20">
        <SectionHeader title="How Skills Work" sub="Trigger phrases activate specialised Claude modes" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-text-secondary">
          <div>
            <div className="text-text-primary font-medium mb-1">1. Trigger</div>
            <div className="text-xs text-text-tertiary">Say the trigger phrase or describe the task — Claude routes to the right skill automatically.</div>
          </div>
          <div>
            <div className="text-text-primary font-medium mb-1">2. Claude Loads Context</div>
            <div className="text-xs text-text-tertiary">The skill's full knowledge base, your brand rules, and business context load before any work starts.</div>
          </div>
          <div>
            <div className="text-text-primary font-medium mb-1">3. Output</div>
            <div className="text-xs text-text-tertiary">Files save to your vault, documents download directly, or content gets posted to connected platforms.</div>
          </div>
        </div>
      </Card>
    </div>
  )
}
