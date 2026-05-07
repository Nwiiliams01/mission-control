'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type * as React from 'react'
import {
  Activity, BarChart3, Bot, BriefcaseBusiness, CalendarDays, Check, CheckCircle2,
  ChevronRight, CircleDollarSign, ClipboardList, Clock, FileText, Flag, FolderKanban,
  Gauge, Home as HomeIcon, Info, LayoutDashboard, Lightbulb, Link2, Megaphone, NotebookPen, Pencil,
  Phone, Plus, Radio, Search, Send, Settings2, ShieldCheck, Sparkles, Target,
  Trash2, Users, X, Zap, Database
} from 'lucide-react'

export type View =
  | 'mission' | 'getright' | 'luxe' | 'forex' | 'nexora' | 'artistly' | 'personal' | 'daily'
  | 'prompts' | 'leads' | 'skills' | 'income' | 'automations' | 'knowledge'
  | 'dashboard' | 'goals' | 'revenue' | 'projects' | 'content' | 'command' | 'warroom' | 'meetings' | 'intel' | 'timeline' | 'review' | 'workspace' | 'notes'

export interface VaultData {
  lastRefresh: string
  getright: any
  luxe: any
  forex: any
  nexora: any
  artistly: any
  personal: any
  daily: any
  prompts: any
}

type TabId = 'dashboard' | 'goals' | 'revenue' | 'projects' | 'content' | 'command' | 'warroom' | 'meetings' | 'intel' | 'timeline' | 'review' | 'workspace' | 'notes'
type Status = 'online' | 'busy' | 'offline'
type PriorityLevel = 'High' | 'Medium' | 'Low'
type ProjectStatus = 'Backlog' | 'In Progress' | 'Waiting / Blocked' | 'Done'
type BusinessCategory = 'Get Right Fitness' | 'Luxe Property Solutions' | 'Personal Brand' | 'AI Systems' | 'Personal'
type BusinessFocus = 'All' | 'Get Right' | 'Luxe' | 'Nexora' | 'Personal Brand' | 'Personal'
type ActionItemStatus = 'Pending' | 'In Progress' | 'Complete'
type WarRoomCommandStatus = 'Requested' | 'Assigned' | 'In Progress' | 'Completed' | 'Archived'
type WarRoomSaveTarget = 'Task' | 'Action Item' | 'Note' | 'Intel' | 'Decision'
type GoalStatus = 'Active' | 'Paused' | 'Complete'
type BlueprintStatus = 'Needs Script' | 'Analysed' | 'Built'
type CarouselStatus = 'Article' | 'Copy Drafted' | 'Design Prompt Ready' | 'Ready to Publish' | 'Published'
type SubscriptionStatus = 'Keep' | 'Cancel' | 'Review'
type WorkspaceTemplateType = 'Task' | 'Note' | 'Meeting' | 'Lead' | 'Content' | 'Review'

interface DashboardChecklistItem { id: string; label: string; done: boolean; detail: string }
interface Priority { id: string; title: string; category: BusinessCategory; done: boolean; due: string }
interface ActivityEvent { id: string; type: string; title: string; detail: string; time: string }
interface RevenueClient { id: string; name: string; category: string; monthlyValue: number; status: 'Active' | 'Pending' | 'Churned'; startDate: string; notes: string }
interface RevenueMonth { id: string; label: string; value: number; projected?: boolean }
interface LifeArea { id: string; title: string; focus: BusinessFocus; vision: string }
interface GoalMilestone { id: string; title: string; done: boolean }
interface OperatingGoal { id: string; title: string; lifeAreaId: string; category: BusinessCategory; description: string; metricLabel: string; current: number; target: number; unit: string; deadline: string; status: GoalStatus; linkedHabits: string[]; linkedTasks: string[]; milestones: GoalMilestone[] }
interface ProjectTask { id: string; title: string; description: string; category: BusinessCategory; priority: PriorityLevel; createdDate: string; dueDate: string; status: ProjectStatus; notes: string; blocker?: string }
interface ProjectActionItem { id: string; title: string; category: BusinessCategory; status: ActionItemStatus; createdDate: string }
interface ContentArticle { id: string; title: string; lane: BusinessFocus; sourceUrl: string; seoKeyword: string; excerpt: string; publishedAt: string }
interface CarouselDraft { id: string; articleId: string; title: string; lane: BusinessFocus; status: CarouselStatus; hook: string; slides: string[]; designPrompt: string; references: string; cta: string; updatedAt: string }
interface AgentTask { id: string; text: string; priority: PriorityLevel; time: string }
interface Agent { id: string; name: string; role: string; status: Status; model: string; description: string; capabilities: string[]; lastActive: string; activity: string[]; notes: string; tasks: AgentTask[] }
interface WarRoomCommand { id: string; request: string; agentId: string; agentName: string; category: BusinessCategory; priority: PriorityLevel; status: WarRoomCommandStatus; output: string; createdAt: string; updatedAt: string; savedTargets: WarRoomSaveTarget[]; contextSnapshot?: string }
interface YouTubeBlueprint { id: string; sourceUrl: string; title: string; status: BlueprintStatus; summary: string; keyIdeas: string[]; dashboardModules: string[]; tasks: string[]; agentCommand: string; createdAt: string }
interface VaultContextItem { id: string; title: string; lane: BusinessFocus; summary: string; detail: string; source: string; metric: string }
interface ExecutiveDecision { id: string; date: string; question: string; summary: string; agents: string[]; finalDecision: string; status: 'Decided' | 'Pending' | 'Revisit' }
interface Meeting { id: string; title: string; date: string; time: string; duration: number; attendees: string; type: 'Call' | 'Zoom' | 'In-person' | 'Internal'; category: 'Fitness' | 'Real Estate' | 'AI' | 'Personal' | 'Other'; prepNotes: string; status: 'Upcoming' | 'Completed' | 'Cancelled'; agenda: string[]; completedAgenda: string[]; notes: string; actionItems: string[]; completedActions: string[]; outcome: string; source?: 'local' | 'google'; externalEventId?: string; externalCalendarId?: string; recurringEventId?: string; googleUrl?: string; location?: string; syncedAt?: string; syncStatus?: 'synced' | 'local-only' }
interface IntelItem { id: string; title: string; summary: string; source: string; sourceLink: string; dateAdded: string; category: 'AI News' | 'Industry Trends' | 'Competitor Watch' | 'Opportunities' | 'Real Estate Intel' | 'Fitness Business Intel' | 'Content Ideas'; importance: 'Hot' | 'Notable' | 'Reference'; notes: string; why: string; actionNeeded: boolean }
interface TimelinePhase { id: string; title: string; range: string; description: string; milestones: { id: string; title: string; done: boolean }[]; current?: boolean }
interface Note { id: string; title: string; category: 'Daily Review' | 'Strategy' | 'Fitness' | 'Real Estate' | 'AI Ideas' | 'Content Ideas'; content: string; updatedAt: string }
interface DailyScoreEntry { id: string; date: string; score: number; completed: number; total: number; carriedPriorities: number }
interface CommandReview { id: string; date: string; movedRevenue: string; stalled: string; killDelegateDouble: string; priorities: string[]; createdAt: string }
interface SubscriptionItem { id: string; name: string; category: BusinessFocus; monthlyCost: number; renewalDate: string; status: SubscriptionStatus; notes: string }
interface WorkspaceTemplate { id: string; name: string; type: WorkspaceTemplateType; category: BusinessFocus; description: string; body: string }
interface DashboardSettings { monthlyRevenueGoal: number; activeNoteId: string; lastDailyResetDate: string; businessFocus: BusinessFocus }
interface NextBestAction { title: string; detail: string; source: string; urgency: string; icon: any }
interface GoogleCalendarEvent { id: string; summary?: string; display_title?: string; location?: string | null; start: string; end: string; url?: string; display_url?: string; description?: string | null; recurring_event_id?: string | null }
interface CalendarSyncStatus { status: 'idle' | 'syncing' | 'synced' | 'offline'; imported: number; syncedAt: string | null; message: string }
interface NatState {
  version: 1
  checklist: DashboardChecklistItem[]
  priorities: Priority[]
  activity: ActivityEvent[]
  revenueGoal: number
  revenueHistory: RevenueMonth[]
  clients: RevenueClient[]
  lifeAreas: LifeArea[]
  goals: OperatingGoal[]
  tasks: ProjectTask[]
  actionItems: ProjectActionItem[]
  contentArticles: ContentArticle[]
  carouselDrafts: CarouselDraft[]
  agents: Agent[]
  warRoomCommands: WarRoomCommand[]
  youtubeBlueprints: YouTubeBlueprint[]
  decisions: ExecutiveDecision[]
  meetings: Meeting[]
  intel: IntelItem[]
  timeline: TimelinePhase[]
  notes: Note[]
  dailyHistory: DailyScoreEntry[]
  commandReviews: CommandReview[]
  subscriptions: SubscriptionItem[]
  templates: WorkspaceTemplate[]
  settings: DashboardSettings
}

const STORAGE_KEY = 'nat-os:v1'
const goalDate = new Date('2027-01-01T00:00:00-07:00')
const calgaryDateIso = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'America/Edmonton',
  }).formatToParts(date)
  const get = (type: string) => parts.find(part => part.type === type)?.value ?? ''
  return `${get('year')}-${get('month')}-${get('day')}`
}
const todayIso = () => calgaryDateIso()
const money = (value: number) => new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(value)
const id = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
const dateTime = (date: Date) => new Intl.DateTimeFormat('en-CA', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Edmonton' }).format(date)
const nowTime = () => new Intl.DateTimeFormat('en-CA', { hour: 'numeric', minute: '2-digit', timeZone: 'America/Edmonton' }).format(new Date())

const tabs: { id: TabId; label: string; icon: any }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'goals', label: 'Goal OS', icon: Target },
  { id: 'revenue', label: 'Revenue', icon: BarChart3 },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'content', label: 'Content', icon: Megaphone },
  { id: 'command', label: 'Command Center', icon: Bot },
  { id: 'warroom', label: 'War Room', icon: ShieldCheck },
  { id: 'meetings', label: 'Meetings', icon: CalendarDays },
  { id: 'intel', label: 'Intel', icon: Radio },
  { id: 'timeline', label: 'Timeline', icon: Flag },
  { id: 'review', label: 'Review', icon: FileText },
  { id: 'workspace', label: 'Workspace', icon: Database },
  { id: 'notes', label: 'Notes', icon: NotebookPen },
]

const focusOptions: BusinessFocus[] = ['All', 'Get Right', 'Luxe', 'Nexora', 'Personal Brand', 'Personal']

const categoryColours: Record<string, string> = {
  'Get Right Fitness': 'cyan',
  'Luxe Property Solutions': 'violet',
  'Personal Brand': 'rose',
  'AI Systems': 'amber',
  Personal: 'emerald',
  Active: 'emerald',
  Paused: 'amber',
  Pending: 'amber',
  Requested: 'blue',
  Assigned: 'violet',
  'In Progress': 'blue',
  Completed: 'emerald',
  Archived: 'rose',
  Complete: 'emerald',
  Article: 'blue',
  'Copy Drafted': 'amber',
  'Design Prompt Ready': 'violet',
  'Ready to Publish': 'cyan',
  Published: 'emerald',
  Keep: 'emerald',
  Cancel: 'rose',
  Review: 'amber',
  Task: 'blue',
  Note: 'cyan',
  Meeting: 'violet',
  Lead: 'amber',
  Content: 'rose',
  Churned: 'rose',
  High: 'orange',
  Medium: 'amber',
  Low: 'emerald',
  Hot: 'rose',
  Notable: 'amber',
  Reference: 'blue',
  Decided: 'emerald',
  Revisit: 'amber',
}

function nexoraBuilderAgent(): Agent {
  return {
    id: 'nexorabuilder',
    name: 'Nexora Builder',
    role: 'Nexora AI Systems + Offer Build Agent',
    status: 'online',
    model: 'GPT-powered build strategist',
    description: 'Builds Nexora AI offers, dashboards, automations, client audits, website plans, SaaS workflows, and implementation briefs for small-business AI systems.',
    capabilities: ['Draft AI audit plans', 'Structure dashboard builds', 'Map automation workflows', 'Package Nexora offers', 'Create client implementation briefs'],
    lastActive: 'just now',
    activity: ['Loaded Nexora offer stack', 'Prepared AI audit workflow'],
    notes: 'Route Nexora, AI agency, automation, dashboard, website, SaaS, and client implementation work here.',
    tasks: [],
  }
}

function seedState(): NatState {
  const today = todayIso()
  return {
    version: 1,
    checklist: [
      { id: 'wake', label: 'Wake up on time', done: true, detail: '11:00 PM' },
      { id: 'training', label: 'Training completed', done: true, detail: 'Strength' },
      { id: 'cardio', label: 'Cardio / steps completed', done: false, detail: '7,200 / 10K' },
      { id: 'mobility', label: 'Mobility completed', done: true, detail: '10 min' },
      { id: 'nutrition', label: 'Nutrition followed', done: true, detail: 'On plan' },
      { id: 'clients', label: 'Client check-ins completed', done: false, detail: '0 / 5' },
      { id: 'calls', label: 'Real estate calls completed', done: false, detail: '4 / 10' },
      { id: 'followups', label: 'Lead follow-ups completed', done: true, detail: '9 / 15' },
      { id: 'content', label: 'Content posted', done: false, detail: '0 / 1' },
      { id: 'study', label: 'Study completed', done: true, detail: 'Wyckoff' },
      { id: 'shutdown', label: 'Night shutdown completed', done: false, detail: 'Pending' },
    ],
    priorities: [
      { id: 'p1', title: 'Follow up with 20 motivated sellers', category: 'Luxe Property Solutions', done: false, due: 'Today' },
      { id: 'p2', title: 'Ship Get Right offer cleanup', category: 'Get Right Fitness', done: false, due: 'Today' },
      { id: 'p3', title: 'Publish proof-of-work content', category: 'Personal Brand', done: false, due: 'Today' },
      { id: 'p4', title: 'Tighten AI lead routing workflow', category: 'AI Systems', done: false, due: 'This week' },
    ],
    activity: [
      { id: 'a1', type: 'agent', title: 'DealCloser task sent', detail: 'Seller follow-up script for Memphis lead', time: '7:20 AM' },
      { id: 'a2', type: 'project', title: 'Task moved to In Progress', detail: 'Client check-in calls', time: '8:04 AM' },
      { id: 'a3', type: 'intel', title: 'Intel item saved', detail: 'SMB AI adoption trend', time: '7:42 AM' },
      { id: 'a4', type: 'fitness', title: 'Workout completed', detail: 'Upper Body Strength', time: '6:15 AM' },
    ],
    revenueGoal: 30000,
    revenueHistory: [
      { id: 'jan', label: 'Jan', value: 0 },
      { id: 'feb', label: 'Feb', value: 1000 },
      { id: 'mar', label: 'Mar', value: 2200 },
      { id: 'apr', label: 'Apr', value: 3600 },
      { id: 'may', label: 'May', value: 5200 },
      { id: 'jun', label: 'Jun', value: 7500, projected: true },
    ],
    clients: [
      { id: 'c1', name: 'Get Right Fitness Client Base', category: 'Fitness', monthlyValue: 1500, status: 'Active', startDate: '2026-04-01', notes: 'Coaching revenue target line.' },
      { id: 'c2', name: 'Luxe Wholesale Pipeline', category: 'Real Estate', monthlyValue: 2500, status: 'Pending', startDate: '2026-04-15', notes: 'Expected assignment-fee pipeline.' },
      { id: 'c3', name: 'Nexora AI Build Retainer', category: 'AI', monthlyValue: 1200, status: 'Pending', startDate: '2026-05-01', notes: 'Automation and dashboard work.' },
    ],
    lifeAreas: [
      { id: 'wealth', title: 'Wealth & Revenue', focus: 'All', vision: 'Build durable income streams and move toward financial independence without losing operational control.' },
      { id: 'fitness', title: 'Fitness & Health', focus: 'Get Right', vision: 'Lead from proof: strong body, consistent training, clean nutrition, and client delivery that reflects the standard.' },
      { id: 'real-estate', title: 'Real Estate Execution', focus: 'Luxe', vision: 'Create consistent seller conversations, qualified leads, offers, and assignment-fee opportunities in US markets.' },
      { id: 'ai-systems', title: 'AI Systems & Leverage', focus: 'Nexora', vision: 'Build AI dashboards, agents, automations, and repeatable systems that save time and create sellable assets.' },
      { id: 'brand', title: 'Personal Brand', focus: 'Personal Brand', vision: 'Document disciplined execution, proof-of-work, business lessons, training, and lifestyle freedom with clarity.' },
      { id: 'personal', title: 'Personal Life', focus: 'Personal', vision: 'Protect family rhythm, schedule, recovery, learning, and the operating environment that makes the mission sustainable.' },
    ],
    goals: [
      {
        id: 'goal-million',
        title: '$1M+ income path',
        lifeAreaId: 'wealth',
        category: 'AI Systems',
        description: 'Track the strategic path toward $1M+ income by January 1, 2027 through Get Right, Luxe, Nexora, brand, and systems.',
        metricLabel: 'Monthly revenue pace',
        current: 5200,
        target: 30000,
        unit: 'CAD',
        deadline: '2027-01-01',
        status: 'Active',
        linkedHabits: ['Real estate calls completed', 'Content posted', 'Study completed'],
        linkedTasks: ['Follow up with 20+ sellers', 'Build lead scoring AI model'],
        milestones: [
          { id: 'gm-1', title: 'Revenue dashboard active', done: true },
          { id: 'gm-2', title: 'Consistent lead flow established', done: false },
          { id: 'gm-3', title: '$30K/month run rate achieved', done: false },
        ],
      },
      {
        id: 'goal-luxe-calls',
        title: 'Luxe daily seller volume',
        lifeAreaId: 'real-estate',
        category: 'Luxe Property Solutions',
        description: 'Build repeatable acquisition momentum through daily seller conversations and fast follow-up.',
        metricLabel: 'Seller conversations this week',
        current: 14,
        target: 50,
        unit: 'calls',
        deadline: '2026-05-10',
        status: 'Active',
        linkedHabits: ['Real estate calls completed', 'Lead follow-ups completed'],
        linkedTasks: ['Follow up with 20+ sellers', 'Luxe offer positioning'],
        milestones: [
          { id: 'gl-1', title: 'Pull daily seller list', done: true },
          { id: 'gl-2', title: 'Make 50 seller calls this week', done: false },
          { id: 'gl-3', title: 'Book 3 qualified appointments', done: false },
        ],
      },
      {
        id: 'goal-proof-content',
        title: 'Proof-of-work content rhythm',
        lifeAreaId: 'brand',
        category: 'Personal Brand',
        description: 'Turn daily execution into clean public evidence: business moves, training, calls, lessons, and systems built.',
        metricLabel: 'Posts this week',
        current: 2,
        target: 5,
        unit: 'posts',
        deadline: '2026-05-10',
        status: 'Active',
        linkedHabits: ['Content posted'],
        linkedTasks: ['Post proof-of-work content recap'],
        milestones: [
          { id: 'gc-1', title: 'Define weekly proof themes', done: true },
          { id: 'gc-2', title: 'Publish 5 posts this week', done: false },
          { id: 'gc-3', title: 'Repurpose one long note into short-form assets', done: false },
        ],
      },
    ],
    tasks: [
      { id: 't1', title: 'Build lead scoring AI model', description: 'Use behaviour and seller data to prioritise outreach.', category: 'AI Systems', priority: 'High', createdDate: today, dueDate: '2026-05-10', status: 'Backlog', notes: '' },
      { id: 't2', title: 'Follow up with 20+ sellers', description: 'Push warm Luxe leads into booked calls.', category: 'Luxe Property Solutions', priority: 'High', createdDate: today, dueDate: '2026-05-04', status: 'In Progress', notes: '' },
      { id: 't3', title: 'Client check-in calls', description: 'Weekly Get Right accountability touchpoints.', category: 'Get Right Fitness', priority: 'Medium', createdDate: today, dueDate: '2026-05-05', status: 'In Progress', notes: '' },
      { id: 't4', title: 'Luxe offer positioning', description: 'Clarify cash offer and creative finance angles.', category: 'Luxe Property Solutions', priority: 'High', createdDate: today, dueDate: '2026-05-08', status: 'Waiting / Blocked', notes: '', blocker: 'Need seller data' },
      { id: 't5', title: 'Weekly review and planning', description: 'Review results and set next week priorities.', category: 'Personal', priority: 'Low', createdDate: today, dueDate: '2026-05-03', status: 'Done', notes: '' },
    ],
    actionItems: [
      { id: 'ai-1', title: 'Pull today’s Memphis seller call list', category: 'Luxe Property Solutions', status: 'Pending', createdDate: today },
      { id: 'ai-2', title: 'Draft Get Right check-in message batch', category: 'Get Right Fitness', status: 'In Progress', createdDate: today },
      { id: 'ai-3', title: 'Post proof-of-work content recap', category: 'Personal Brand', status: 'Complete', createdDate: today },
    ],
    contentArticles: [
      { id: 'article-1', title: 'How AI dashboards help small businesses compete', lane: 'Nexora', sourceUrl: 'nexora/_overview', seoKeyword: 'AI dashboard for small business', excerpt: 'Small businesses need clear operating visibility, automation, and agent support without enterprise complexity.', publishedAt: today },
      { id: 'article-2', title: 'Why seller follow-up wins wholesale deals', lane: 'Luxe', sourceUrl: 'luxe/operations/_overview', seoKeyword: 'real estate wholesaling seller follow up', excerpt: 'Motivated sellers need speed, clarity, and repeated follow-up around motivation, condition, timeline, and price.', publishedAt: today },
      { id: 'article-3', title: 'Structure beats motivation in fitness coaching', lane: 'Get Right', sourceUrl: 'getright/business/_overview', seoKeyword: 'online fitness coaching accountability', excerpt: 'Clients win when the plan is simple, accountability is direct, and the coach removes friction from execution.', publishedAt: today },
    ],
    carouselDrafts: [
      {
        id: 'carousel-1',
        articleId: 'article-1',
        title: 'AI dashboards for small business',
        lane: 'Nexora',
        status: 'Design Prompt Ready',
        hook: 'Most small businesses do not need more apps. They need one command centre.',
        slides: ['Most SMBs are drowning in tools.', 'A dashboard gives the owner one source of truth.', 'AI agents turn insight into execution.', 'The win is speed, visibility, and follow-through.', 'Build the system once. Run it every day.'],
        designPrompt: 'Create a premium 10-slide Instagram carousel for Nat OS/Nexora. Use dark SaaS command-centre visuals, electric blue accents, clear hierarchy, sharp copy, and founder dashboard energy. Keep every slide readable on mobile.',
        references: 'Nat OS dark SaaS style, electric blue, glass panels, disciplined founder/operator tone.',
        cta: 'Book a 30-minute AI audit.',
        updatedAt: new Date().toISOString(),
      },
    ],
    agents: [
      {
        id: 'dealcloser', name: 'DealCloser', role: 'Real Estate Seller Negotiation Agent', status: 'online', model: 'GPT-powered workflow',
        description: 'Structures seller conversations, objection handling, creative finance angles, and offer copy for Luxe Property Solutions.',
        capabilities: ['Draft seller SMS', 'Draft seller emails', 'Analyse motivation', 'Suggest offer strategy', 'Handle objections', 'Generate follow-up scripts'],
        lastActive: '2 min ago', activity: ['Drafted SMS for Memphis seller', 'Handled price objection', 'Prepared follow-up cadence'], notes: 'Strongest on motivation and price gaps.', tasks: []
      },
      {
        id: 'dealgenie', name: 'Deal Genie', role: 'Repair Estimator + Deal Analysis Agent', status: 'busy', model: 'GPT-powered calculator workflow',
        description: 'Estimates repairs, wholesale spreads, margins, and property deal data.',
        capabilities: ['Repair estimation', 'Profit margin calculation', 'ARV support', 'Buy box scoring', 'Deal summary creation'],
        lastActive: '15 min ago', activity: ['Scored Memphis lead', 'Calculated spread range'], notes: 'Needs clean comp inputs.', tasks: []
      },
      {
        id: 'coachos', name: 'CoachOS', role: 'Get Right Fitness Client Success Agent', status: 'online', model: 'GPT-powered coaching assistant',
        description: 'Supports check-ins, habit tracking, coaching notes, accountability messages, and program delivery ideas.',
        capabilities: ['Draft client check-ins', 'Create accountability messages', 'Summarise progress', 'Suggest actions', 'Organise Everfit notes'],
        lastActive: '1 min ago', activity: ['Drafted client check-in prompt', 'Summarised habit trend'], notes: 'Keep voice calm and direct.', tasks: []
      },
      {
        id: 'contentforge', name: 'ContentForge', role: 'Personal Brand + Social Content Agent', status: 'online', model: 'GPT-powered content strategist',
        description: 'Turns daily execution into hooks, captions, carousels, newsletters, and proof-of-work posts.',
        capabilities: ['Generate hooks', 'Repurpose notes', 'Create captions', 'Build carousel outlines', 'Draft newsletters'],
        lastActive: '3 min ago', activity: ['Built 5 reel hooks', 'Outlined proof-of-work carousel'], notes: 'Use sharp, non-fluffy language.', tasks: []
      },
      nexoraBuilderAgent(),
      {
        id: 'strategychief', name: 'Strategy Chief', role: 'Executive Decision Support Agent', status: 'offline', model: 'GPT-powered strategy assistant',
        description: 'Reviews big decisions across business, fitness, real estate, systems, and long-term goals.',
        capabilities: ['Decision summaries', 'Pros and cons', 'Weekly reviews', 'Goal alignment', 'Risk analysis'],
        lastActive: '8 hours ago', activity: ['Reviewed 90-day priorities'], notes: 'Use for weekly command review.', tasks: []
      },
    ],
    warRoomCommands: [
      {
        id: 'wr-1',
        request: 'Create a seller follow-up sequence for warm Memphis leads that have not answered in 48 hours.',
        agentId: 'dealcloser',
        agentName: 'DealCloser',
        category: 'Luxe Property Solutions',
        priority: 'High',
        status: 'Completed',
        output: 'Use a three-touch follow-up: direct SMS, softer value text, then a clear next-step close. Keep the message calm, specific, and anchored to motivation, condition, timeline, and price.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        savedTargets: ['Action Item'],
      },
      {
        id: 'wr-2',
        request: 'Turn today’s execution into one proof-of-work post and three short hooks.',
        agentId: 'contentforge',
        agentName: 'ContentForge',
        category: 'Personal Brand',
        priority: 'Medium',
        status: 'In Progress',
        output: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        savedTargets: [],
      },
    ],
    youtubeBlueprints: [
      {
        id: 'yt-_3SEUgRCXX0',
        sourceUrl: 'https://www.youtube.com/watch?v=_3SEUgRCXX0',
        title: 'YouTube Blueprint - awaiting script',
        status: 'Needs Script',
        summary: 'Paste the scraped script or transcript to turn this video into Nat OS modules, tasks, intel, notes, and War Room commands.',
        keyIdeas: ['Transcript required for exact analysis'],
        dashboardModules: ['YouTube Blueprint Intake'],
        tasks: ['Paste scraped transcript into the War Room YouTube Blueprint Builder'],
        agentCommand: 'Strategy Chief: Analyse the pasted YouTube script and convert it into a Nat OS implementation plan.',
        createdAt: new Date().toISOString(),
      },
    ],
    decisions: [
      { id: 'd1', date: today, question: 'Where should this week’s execution focus go?', summary: 'Luxe conversations first, Get Right client acquisition second, content as proof-of-work.', agents: ['DealCloser', 'Strategy Chief'], finalDecision: 'Protect seller call volume before everything except trading.', status: 'Decided' },
      { id: 'd2', date: '2026-05-02', question: 'Should Nat OS use vault or local data?', summary: 'Hybrid wins: vault for memory, localStorage for fast cockpit interactions.', agents: ['Strategy Chief'], finalDecision: 'Build hybrid v1.', status: 'Decided' },
    ],
    meetings: [
      { id: 'm1', title: 'Seller Call - Memphis Lead', date: today, time: '09:00', duration: 30, attendees: 'Nat + Seller', type: 'Call', category: 'Real Estate', prepNotes: 'Confirm motivation, condition, timeline, and price.', status: 'Upcoming', agenda: ['Build rapport', 'Confirm property condition', 'Discuss timeline', 'Anchor offer range'], completedAgenda: ['Build rapport'], notes: '', actionItems: ['Send follow-up SMS'], completedActions: [], outcome: 'Move toward offer.' },
      { id: 'm2', title: 'Get Right Check-in Block', date: today, time: '11:30', duration: 45, attendees: 'Nat + clients', type: 'Zoom', category: 'Fitness', prepNotes: 'Review adherence, barriers, wins.', status: 'Upcoming', agenda: ['Review training', 'Review nutrition', 'Set next action'], completedAgenda: [], notes: '', actionItems: ['Update Everfit notes'], completedActions: [], outcome: '' },
      { id: 'm3', title: 'AI Systems Planning', date: '2026-05-04', time: '14:30', duration: 60, attendees: 'Nat', type: 'Internal', category: 'AI', prepNotes: 'Decide next dashboard automation.', status: 'Upcoming', agenda: ['Review bottlenecks', 'Pick one automation', 'Define output'], completedAgenda: [], notes: '', actionItems: [], completedActions: [], outcome: '' },
    ],
    intel: [
      { id: 'i1', title: 'AI agents are moving from chat to workflow execution', summary: 'Small businesses are starting to expect AI to complete operational work, not just answer questions.', source: 'Market scan', sourceLink: '', dateAdded: today, category: 'AI News', importance: 'Hot', notes: 'Useful for Nexora positioning.', why: 'This supports the AI dashboard + agent offer stack.', actionNeeded: true },
      { id: 'i2', title: 'Memphis inventory pockets remain useful for distressed outreach', summary: 'Older SFH stock and motivated-seller conditions support Luxe’s current buy box.', source: 'Local market note', sourceLink: '', dateAdded: today, category: 'Real Estate Intel', importance: 'Notable', notes: 'Track by zip.', why: 'Sharper geography improves call lists.', actionNeeded: false },
      { id: 'i3', title: 'Hybrid fitness coaching keeps selling when accountability is clear', summary: 'Clients respond to simple plans plus direct accountability, not more complexity.', source: 'Get Right review', sourceLink: '', dateAdded: '2026-05-02', category: 'Fitness Business Intel', importance: 'Reference', notes: 'Use in offer copy.', why: 'This reinforces the Get Right 365 positioning.', actionNeeded: false },
    ],
    timeline: [
      { id: 'phase1', title: 'Foundation Lock-In', range: 'Now - 90 days', description: 'Solidify daily execution, revenue tracking, lead flow, content rhythm, client delivery, and operating systems.', current: true, milestones: [
        { id: 'm1', title: 'Daily checklist consistently completed', done: true },
        { id: 'm2', title: 'Revenue dashboard active', done: true },
        { id: 'm3', title: 'Client tracking active', done: false },
        { id: 'm4', title: 'Real estate calls tracked', done: false },
        { id: 'm5', title: 'Content proof-of-work system running', done: false },
      ] },
      { id: 'phase2', title: 'Revenue Expansion', range: 'Months 4-8', description: 'Grow Get Right revenue, increase real estate pipeline, improve offers, and compound personal brand.', milestones: [
        { id: 'm6', title: 'Increase monthly recurring revenue', done: false },
        { id: 'm7', title: 'Build consistent lead flow', done: false },
        { id: 'm8', title: 'Weekly content cadence stable', done: false },
        { id: 'm9', title: 'AI agents supporting operations', done: true },
      ] },
      { id: 'phase3', title: 'Scale Systems', range: 'Months 9-14', description: 'Systemise operations, delegate repetitive work, improve dashboards, and create repeatable growth loops.', milestones: [
        { id: 'm10', title: 'SOPs created', done: false },
        { id: 'm11', title: 'Client delivery system tightened', done: false },
        { id: 'm12', title: 'Pipeline reporting automated', done: false },
      ] },
      { id: 'phase4', title: 'Million-Dollar Execution', range: 'Final stretch to Jan 1, 2027', description: 'Operate with high clarity, track every key metric, focus on highest income activities, and remove distractions.', milestones: [
        { id: 'm13', title: 'Monthly revenue target hit', done: false },
        { id: 'm14', title: 'Strong operating rhythm', done: false },
        { id: 'm15', title: 'Personal brand authority built', done: false },
        { id: 'm16', title: 'Lifestyle freedom plan active', done: false },
      ] },
    ],
    notes: [
      { id: 'n1', title: 'Strategic Focus', category: 'Strategy', updatedAt: new Date().toISOString(), content: '# Strategic Focus - May 2026\n\nBuild the system. Run the play.\n\n## Luxe Property Solutions\n- Seller conversations are the needle mover.\n- Track MCTP on every lead.\n- Push offers daily.\n\n## Get Right Fitness\n- Keep the offer simple.\n- Sell accountability and structure.\n- Use proof-of-work content.\n\n## AI Systems\n- Build tools that save time this week, not someday.' },
      { id: 'n2', title: 'Content Ideas', category: 'Content Ideas', updatedAt: '2026-05-02T12:00:00.000Z', content: 'Proof-of-work themes: discipline, calls made, training consistency, systems built, lessons learned.' },
    ],
    dailyHistory: [
      { id: 'hist-1', date: '2026-05-02', score: 82, completed: 9, total: 11, carriedPriorities: 2 },
      { id: 'hist-2', date: '2026-05-01', score: 73, completed: 8, total: 11, carriedPriorities: 3 },
      { id: 'hist-3', date: '2026-04-30', score: 91, completed: 10, total: 11, carriedPriorities: 1 },
    ],
    commandReviews: [
      {
        id: 'review-seed',
        date: '2026-05-03',
        movedRevenue: 'Seller conversations created the most direct revenue movement. Get Right offer cleanup also tightened the path to paid coaching.',
        stalled: 'Content output and lead follow-up consistency were uneven when the day got crowded.',
        killDelegateDouble: 'Kill low-value tool hopping. Delegate repetitive AI formatting. Double down on Luxe calls and proof-of-work content.',
        priorities: [
          'Make 50 seller calls across the week',
          'Book 3 qualified seller appointments',
          'Publish 5 proof-of-work posts',
          'Finish Get Right offer page cleanup',
          'Build one lead routing automation',
        ],
        createdAt: new Date().toISOString(),
      },
    ],
    subscriptions: [
      { id: 'sub-notion', name: 'Notion', category: 'Personal', monthlyCost: 18, renewalDate: '2026-05-13', status: 'Cancel', notes: 'Cancel after Nat OS replaces databases, templates, and knowledge capture.' },
      { id: 'sub-vercel', name: 'Vercel', category: 'Nexora', monthlyCost: 28, renewalDate: '2026-06-01', status: 'Keep', notes: 'Hosting layer for Nat OS and client-facing AI builds.' },
      { id: 'sub-artistly', name: 'Artistly.ai', category: 'Personal', monthlyCost: 0, renewalDate: '2026-12-31', status: 'Keep', notes: 'Owned tool with commercial licence for kids book studio assets.' },
      { id: 'sub-skool', name: 'Skool Wholesaling Group', category: 'Luxe', monthlyCost: 135, renewalDate: '2026-05-20', status: 'Review', notes: 'Keep only if seller-call scripts, market intel, and execution support are being used weekly.' },
    ],
    templates: [
      { id: 'tpl-daily-review', name: 'Daily Review', type: 'Review', category: 'Personal', description: 'End-of-day execution recap with wins, misses, and tomorrow’s move.', body: '# Daily Review\n\n## Wins\n- \n\n## Misses\n- \n\n## Revenue moved\n- \n\n## Tomorrow’s next best action\n- ' },
      { id: 'tpl-seller-lead', name: 'Luxe Seller Lead', type: 'Lead', category: 'Luxe', description: 'MCTP capture for a motivated seller lead.', body: 'Motivation:\nCondition:\nTimeline:\nPrice:\nProperty address:\nNext follow-up:' },
      { id: 'tpl-client-checkin', name: 'Get Right Client Check-in', type: 'Note', category: 'Get Right', description: 'Fitness client adherence, blockers, and next action.', body: 'Training:\nNutrition:\nSteps/cardio:\nWins:\nBlockers:\nCoach note:\nNext action:' },
      { id: 'tpl-content-brief', name: 'Proof-of-Work Content Brief', type: 'Content', category: 'Personal Brand', description: 'Turn execution into a post, carousel, or short script.', body: 'Hook:\nProof:\nLesson:\nCTA:\nRepurpose ideas:' },
      { id: 'tpl-nexora-audit', name: 'Nexora AI Audit', type: 'Task', category: 'Nexora', description: 'Client audit structure for AI website, dashboard, agent, and automation opportunities.', body: 'Business:\nCurrent workflow:\nBottleneck:\nAutomation opportunity:\nDashboard opportunity:\nNext build:' },
    ],
    settings: { monthlyRevenueGoal: 30000, activeNoteId: 'n1', lastDailyResetDate: today, businessFocus: 'All' },
  }
}

function checklistScore(checklist: DashboardChecklistItem[]) {
  const completed = checklist.filter(item => item.done).length
  const total = checklist.length || 1
  return { completed, total, score: Math.round((completed / total) * 100) }
}

function projectDashboardMetrics(tasks: ProjectTask[], date = todayIso()) {
  const dueTasks = tasks.filter(task => task.dueDate <= date)
  const dueDone = dueTasks.filter(task => task.status === 'Done').length
  const dueOpen = dueTasks.filter(task => task.status !== 'Done').length
  const activeProjects = tasks.filter(task => task.status === 'In Progress' || task.status === 'Waiting / Blocked')
  const blocked = tasks.filter(task => task.status === 'Waiting / Blocked').length
  return {
    dueTasks,
    dueDone,
    dueOpen,
    dueTotal: dueTasks.length,
    activeProjects,
    activeCount: activeProjects.length,
    blocked,
  }
}

function revenueImpactForCategory(category: BusinessCategory) {
  const impact: Record<BusinessCategory, number> = {
    'Luxe Property Solutions': 2500,
    'AI Systems': 1500,
    'Get Right Fitness': 750,
    'Personal Brand': 500,
    Personal: 250,
  }
  return impact[category]
}

function completedHighPriorityRevenueImpact(tasks: ProjectTask[], revenueGoal: number) {
  const highPriorityTasks = tasks.filter(task => task.priority === 'High')
  const completed = highPriorityTasks.filter(task => task.status === 'Done')
  const open = highPriorityTasks.filter(task => task.status !== 'Done')
  const completedImpact = completed.reduce((sum, task) => sum + revenueImpactForCategory(task.category), 0)
  const openImpact = open.reduce((sum, task) => sum + revenueImpactForCategory(task.category), 0)
  const byCategory = completed.reduce<Record<string, number>>((acc, task) => {
    acc[task.category] = (acc[task.category] ?? 0) + revenueImpactForCategory(task.category)
    return acc
  }, {})

  return {
    completed,
    open,
    completedImpact,
    openImpact,
    goalShare: Math.min(100, Math.round((completedImpact / Math.max(revenueGoal, 1)) * 100)),
    byCategory: Object.entries(byCategory).sort((a, b) => b[1] - a[1]),
  }
}

function focusLabel(focus: BusinessFocus) {
  return focus === 'All' ? 'All lanes' : focus
}

function matchesTaskFocus(task: ProjectTask, focus: BusinessFocus) {
  if (focus === 'All') return true
  if (focus === 'Get Right') return task.category === 'Get Right Fitness'
  if (focus === 'Luxe') return task.category === 'Luxe Property Solutions'
  if (focus === 'Nexora') return task.category === 'AI Systems'
  return task.category === focus
}

function matchesActionItemFocus(item: ProjectActionItem, focus: BusinessFocus) {
  if (focus === 'All') return true
  if (focus === 'Get Right') return item.category === 'Get Right Fitness'
  if (focus === 'Luxe') return item.category === 'Luxe Property Solutions'
  if (focus === 'Nexora') return item.category === 'AI Systems'
  return item.category === focus
}

function matchesPriorityFocus(priority: Priority, focus: BusinessFocus) {
  if (focus === 'All') return true
  if (focus === 'Get Right') return priority.category === 'Get Right Fitness'
  if (focus === 'Luxe') return priority.category === 'Luxe Property Solutions'
  if (focus === 'Nexora') return priority.category === 'AI Systems'
  return priority.category === focus
}

function matchesMeetingFocus(meeting: Meeting, focus: BusinessFocus) {
  if (focus === 'All') return true
  if (focus === 'Get Right') return meeting.category === 'Fitness'
  if (focus === 'Luxe') return meeting.category === 'Real Estate'
  if (focus === 'Nexora') return meeting.category === 'AI'
  if (focus === 'Personal Brand') return meeting.category === 'Other'
  if (focus === 'Personal') return meeting.category === 'Personal'
  return false
}

function matchesIntelFocus(item: IntelItem, focus: BusinessFocus) {
  if (focus === 'All') return true
  if (focus === 'Get Right') return item.category === 'Fitness Business Intel'
  if (focus === 'Luxe') return item.category === 'Real Estate Intel'
  if (focus === 'Nexora') return ['AI News', 'Industry Trends', 'Competitor Watch', 'Opportunities'].includes(item.category)
  if (focus === 'Personal Brand') return item.category === 'Content Ideas'
  return item.category === 'Content Ideas'
}

function matchesNoteFocus(note: Note, focus: BusinessFocus) {
  if (focus === 'All') return true
  if (focus === 'Get Right') return note.category === 'Fitness'
  if (focus === 'Luxe') return note.category === 'Real Estate'
  if (focus === 'Nexora') return note.category === 'AI Ideas' || note.category === 'Strategy'
  if (focus === 'Personal Brand') return note.category === 'Content Ideas'
  return note.category === 'Daily Review' || note.category === 'Strategy'
}

function executionScore(checklist: DashboardChecklistItem[], tasks: ProjectTask[]) {
  const checklistDone = checklist.filter(item => item.done).length
  const checklistTotal = checklist.length
  const projects = projectDashboardMetrics(tasks)
  const total = checklistTotal + projects.dueTotal
  const completed = checklistDone + projects.dueDone
  return {
    completed,
    total: total || 1,
    checklistDone,
    checklistTotal,
    taskDone: projects.dueDone,
    taskTotal: projects.dueTotal,
    score: Math.round((completed / (total || 1)) * 100),
  }
}

function goalProgress(goal: OperatingGoal) {
  return Math.min(100, Math.round((goal.current / Math.max(goal.target, 1)) * 100))
}

function matchesGoalFocus(goal: OperatingGoal, areas: LifeArea[], focus: BusinessFocus) {
  if (focus === 'All') return true
  const area = areas.find(item => item.id === goal.lifeAreaId)
  if (area?.focus === focus) return true
  if (focus === 'Get Right') return goal.category === 'Get Right Fitness'
  if (focus === 'Luxe') return goal.category === 'Luxe Property Solutions'
  if (focus === 'Nexora') return goal.category === 'AI Systems'
  return goal.category === focus
}

function normaliseState(state: NatState): NatState {
  const today = todayIso()
  const seeded = seedState()
  const agents = state.agents?.some(agent => agent.id === 'nexorabuilder')
    ? state.agents
    : [...(state.agents ?? []), nexoraBuilderAgent()]
  const meetings = (state.meetings ?? seeded.meetings).map(meeting => ({
    ...meeting,
    source: meeting.source ?? 'local',
    syncStatus: meeting.syncStatus ?? (meeting.source === 'google' ? 'synced' : 'local-only'),
  }))
  return {
    ...state,
    agents,
    lifeAreas: state.lifeAreas ?? seeded.lifeAreas,
    goals: state.goals ?? seeded.goals,
    actionItems: state.actionItems ?? [],
    contentArticles: state.contentArticles ?? seeded.contentArticles,
    carouselDrafts: state.carouselDrafts ?? seeded.carouselDrafts,
    warRoomCommands: state.warRoomCommands ?? [],
    youtubeBlueprints: state.youtubeBlueprints ?? [],
    meetings,
    dailyHistory: state.dailyHistory ?? [],
    commandReviews: state.commandReviews ?? [],
    subscriptions: state.subscriptions ?? seeded.subscriptions,
    templates: state.templates ?? seeded.templates,
    settings: {
      monthlyRevenueGoal: state.settings?.monthlyRevenueGoal ?? state.revenueGoal ?? 30000,
      activeNoteId: state.settings?.activeNoteId ?? state.notes?.[0]?.id ?? 'n1',
      lastDailyResetDate: state.settings?.lastDailyResetDate ?? today,
      businessFocus: focusOptions.includes(state.settings?.businessFocus) ? state.settings.businessFocus : 'All',
    },
  }
}

function applyDailyReset(state: NatState): NatState {
  const today = todayIso()
  const normalised = normaliseState(state)
  const lastReset = normalised.settings.lastDailyResetDate
  if (lastReset === today) return normalised

  const { completed, total, score } = executionScore(normalised.checklist, normalised.tasks)
  const carried = normalised.priorities.filter(priority => !priority.done)
  const historyEntry: DailyScoreEntry = {
    id: `history-${lastReset}`,
    date: lastReset,
    score,
    completed,
    total,
    carriedPriorities: carried.length,
  }
  const history = [
    historyEntry,
    ...normalised.dailyHistory.filter(entry => entry.date !== lastReset),
  ].slice(0, 14)

  return addActivity({
    ...normalised,
    checklist: normalised.checklist.map(item => ({ ...item, done: false })),
    priorities: carried.map(priority => ({ ...priority, done: false, due: 'Today' })),
    dailyHistory: history,
    settings: { ...normalised.settings, lastDailyResetDate: today },
  }, 'Daily reset completed', `${score}% archived from ${lastReset}. ${carried.length} priorities carried forward.`, 'daily-reset')
}

function loadState(): NatState {
  if (typeof window === 'undefined') return seedState()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return applyDailyReset(seedState())
    const parsed = JSON.parse(raw)
    if (parsed?.version !== 1) return applyDailyReset(seedState())
    return applyDailyReset(parsed)
  } catch {
    return applyDailyReset(seedState())
  }
}

function addActivity(state: NatState, title: string, detail: string, type = 'system'): NatState {
  return {
    ...state,
    activity: [{ id: id('activity'), type, title, detail, time: nowTime() }, ...state.activity].slice(0, 40),
  }
}

function inferCalendarCategory(event: GoogleCalendarEvent): Meeting['category'] {
  const text = `${event.summary ?? ''} ${event.display_title ?? ''} ${event.description ?? ''} ${event.location ?? ''}`.toLowerCase()
  if (/(seller|wholesale|wholesail|mao|lead|buyer|property|skool|closer|comp|underwriting|deal)/.test(text)) return 'Real Estate'
  if (/(get right|check-in|fitness|training|nutrition|coach|client)/.test(text)) return 'Fitness'
  if (/(ai|nexora|automation|agent|dashboard|system)/.test(text)) return 'AI'
  if (/(personal|family|mila|stefania|nova)/.test(text)) return 'Personal'
  return 'Other'
}

function inferCalendarType(event: GoogleCalendarEvent): Meeting['type'] {
  const location = (event.location ?? '').toLowerCase()
  const title = `${event.summary ?? ''} ${event.display_title ?? ''}`.toLowerCase()
  if (location.includes('zoom') || location.includes('meet.google') || location.includes('skool.com/live') || location.includes('youtube.com')) return 'Zoom'
  if (title.includes('call')) return 'Call'
  return 'Internal'
}

function calendarDatePart(date: Date) {
  return calgaryDateIso(date)
}

function calendarTimePart(date: Date) {
  return new Intl.DateTimeFormat('en-CA', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'America/Edmonton',
  }).format(date)
}

function normaliseCalendarEvent(event: GoogleCalendarEvent, existing?: Meeting, syncedAt = new Date().toISOString()): Meeting {
  const start = new Date(event.start)
  const end = new Date(event.end)
  const duration = Math.max(15, Math.round((end.getTime() - start.getTime()) / 60000))
  const title = (event.display_title || event.summary || 'Untitled calendar event').trim()
  return {
    id: existing?.id ?? `google-${event.id}`,
    title,
    date: calendarDatePart(start),
    time: calendarTimePart(start),
    duration,
    attendees: existing?.attendees && existing.attendees !== 'Google Calendar' ? existing.attendees : 'Google Calendar',
    type: existing?.type && existing.source !== 'google' ? existing.type : inferCalendarType(event),
    category: existing?.category && existing.source !== 'google' ? existing.category : inferCalendarCategory(event),
    prepNotes: existing?.prepNotes?.trim() || (event.description ?? '').trim(),
    status: end.getTime() < Date.now() ? 'Completed' : 'Upcoming',
    agenda: existing?.agenda ?? [],
    completedAgenda: existing?.completedAgenda ?? [],
    notes: existing?.notes ?? '',
    actionItems: existing?.actionItems ?? [],
    completedActions: existing?.completedActions ?? [],
    outcome: existing?.outcome ?? '',
    source: 'google',
    externalEventId: event.id,
    externalCalendarId: 'primary',
    recurringEventId: event.recurring_event_id ?? undefined,
    googleUrl: event.display_url ?? event.url,
    location: event.location ?? undefined,
    syncedAt,
    syncStatus: 'synced',
  }
}

function mergeGoogleCalendarMeetings(state: NatState, events: GoogleCalendarEvent[], syncedAt: string) {
  const byExternalId = new Map<string, Meeting>()
  state.meetings.forEach(meeting => {
    if (meeting.externalEventId) byExternalId.set(meeting.externalEventId, meeting)
  })

  const imported = events.map(event => normaliseCalendarEvent(event, byExternalId.get(event.id), syncedAt))
  const importedIds = new Set(imported.map(meeting => meeting.externalEventId))
  const localAndOutOfWindow = state.meetings.filter(meeting => meeting.source !== 'google' || !meeting.externalEventId || !importedIds.has(meeting.externalEventId))
  const meetings = [...localAndOutOfWindow, ...imported].sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`))
  const nextState = { ...state, meetings }
  const changed = JSON.stringify(state.meetings) !== JSON.stringify(meetings)

  return {
    state: changed ? addActivity(nextState, 'Google Calendar imported', `${imported.length} events synced into Meetings.`, 'calendar') : nextState,
    imported: imported.length,
    changed,
  }
}

function parseProgress(detail: string) {
  const match = detail.match(/(\d+)\s*\/\s*(\d+)/)
  if (!match) return null
  return { done: Number(match[1]), target: Number(match[2]) }
}

function executionStreak(history: DailyScoreEntry[], todayScore: number) {
  let streak = todayScore >= 70 ? 1 : 0
  for (const entry of history) {
    if (entry.score < 70) break
    streak += 1
  }
  return streak
}

function getNextBestAction(state: NatState, clock: Date | null): NextBestAction {
  const now = clock ?? new Date()
  const today = calgaryDateIso(now)
  const upcomingMeeting = state.meetings
    .filter(m => m.status === 'Upcoming' && m.date === today)
    .map(m => ({ meeting: m, startsAt: new Date(`${m.date}T${m.time}:00`) }))
    .filter(({ startsAt }) => startsAt.getTime() >= now.getTime() - 15 * 60 * 1000)
    .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime())[0]

  if (upcomingMeeting) {
    const { meeting, startsAt } = upcomingMeeting
    const minutes = Math.round((startsAt.getTime() - now.getTime()) / 60000)
    if (minutes <= 120) {
      return {
        title: `Prep for ${meeting.time} ${meeting.title}`,
        detail: meeting.prepNotes || `Review agenda, action items, and outcome before the ${meeting.category.toLowerCase()} meeting.`,
        source: 'Meetings',
        urgency: minutes <= 0 ? 'Now' : `${minutes} min`,
        icon: CalendarDays,
      }
    }
  }

  const calls = state.checklist.find(item => item.id === 'calls' || item.label.toLowerCase().includes('real estate calls'))
  const callProgress = calls ? parseProgress(calls.detail) : null
  if (calls && !calls.done && callProgress && callProgress.done < callProgress.target) {
    const remaining = callProgress.target - callProgress.done
    return {
      title: `Make ${remaining} more seller calls`,
      detail: `Luxe is priority #1. Current call pace is ${callProgress.done}/${callProgress.target}. Push the pipeline before lower-leverage work.`,
      source: 'Checklist',
      urgency: 'Today',
      icon: Phone,
    }
  }

  const duePriority = state.priorities.find(p => !p.done && p.due.toLowerCase() === 'today')
  if (duePriority) {
    return {
      title: duePriority.title,
      detail: `Top priority in ${duePriority.category}. Clear this before adding new work.`,
      source: 'Priorities',
      urgency: duePriority.due,
      icon: Target,
    }
  }

  const blocked = state.tasks.find(t => t.status === 'Waiting / Blocked' && t.priority === 'High')
  if (blocked) {
    return {
      title: `Unblock: ${blocked.title}`,
      detail: blocked.blocker ? `Blocker: ${blocked.blocker}` : 'High-priority work is waiting. Decide the next unblock step.',
      source: 'Projects',
      urgency: 'Blocked',
      icon: ShieldCheck,
    }
  }

  const content = state.checklist.find(item => item.id === 'content' || item.label.toLowerCase().includes('content posted'))
  if (content && !content.done) {
    return {
      title: 'Post proof-of-work content',
      detail: 'Turn today’s execution into one sharp public signal. Keep it clean, useful, and direct.',
      source: 'Checklist',
      urgency: 'Today',
      icon: Megaphone,
    }
  }

  const inProgress = state.tasks.find(t => t.status === 'In Progress')
  if (inProgress) {
    return {
      title: `Advance: ${inProgress.title}`,
      detail: `Next active project in ${inProgress.category}. Move it one concrete step forward.`,
      source: 'Projects',
      urgency: inProgress.dueDate,
      icon: FolderKanban,
    }
  }

  return {
    title: 'Run the daily review',
    detail: 'Checklist is clean enough. Review wins, misses, and tomorrow’s highest-leverage move.',
    source: 'Dashboard',
    urgency: 'Shutdown',
    icon: ClipboardList,
  }
}

function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <section className={`glass-panel rounded-2xl border border-white/[0.06] bg-white/[0.035] shadow-[0_24px_80px_rgba(0,0,0,0.35)] ${className}`}>{children}</section>
}

function MetricCard({ icon: Icon, label, value, sub, trend, accent = 'blue' }: { icon: any; label: string; value: string | number; sub: string; trend?: string; accent?: string }) {
  return (
    <GlassCard className="relative overflow-hidden p-5 transition duration-300 hover:-translate-y-1 hover:border-blue-500/40">
      <div className="absolute inset-x-0 top-0 h-[3px] bg-blue-600 shadow-[0_0_28px_rgba(0,10,255,0.9)]" />
      <div className="flex items-start gap-4">
        <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border bg-${accent}-500/10 text-${accent}-300 border-${accent}-400/20`}>
          <Icon size={22} />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-steel">{label}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-white">{value}</p>
          <p className="mt-1 text-xs text-steel">{sub}</p>
          {trend && <p className="mt-3 text-xs font-medium text-emerald-300">+ {trend}</p>}
        </div>
      </div>
    </GlassCard>
  )
}

function ProgressRing({ value, label, size = 168 }: { value: number; label?: string; size?: number }) {
  const stroke = 12
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,.08)" strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="url(#ring)" strokeWidth={stroke} fill="none" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
        <defs>
          <linearGradient id="ring" x1="0" x2="1">
            <stop stopColor="#67E8F9" />
            <stop offset="0.45" stopColor="#000AFF" />
            <stop offset="1" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <div className="text-4xl font-semibold text-white">{value}%</div>
        {label && <div className="mt-1 text-sm text-blue-300">{label}</div>}
      </div>
    </div>
  )
}

function Badge({ label }: { label: string }) {
  const c = categoryColours[label] ?? 'blue'
  const map: Record<string, string> = {
    cyan: 'border-cyan-300/20 bg-cyan-400/10 text-cyan-200',
    violet: 'border-violet-300/20 bg-violet-400/10 text-violet-200',
    rose: 'border-rose-300/20 bg-rose-400/10 text-rose-200',
    amber: 'border-amber-300/20 bg-amber-400/10 text-amber-200',
    orange: 'border-orange-300/20 bg-orange-400/10 text-orange-200',
    emerald: 'border-emerald-300/20 bg-emerald-400/10 text-emerald-200',
    blue: 'border-blue-300/20 bg-blue-500/10 text-blue-200',
  }
  return <span className={`inline-flex items-center rounded-md border px-2 py-1 text-[11px] font-medium ${map[c]}`}>{label}</span>
}

function IconButton({ children, onClick, label, className = '' }: { children: React.ReactNode; onClick?: () => void; label: string; className?: string }) {
  return <button aria-label={label} title={label} onClick={onClick} className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.035] text-steel transition hover:border-blue-500/50 hover:text-white ${className}`}>{children}</button>
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-md">
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0A0C12] p-5 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <IconButton label="Close" onClick={onClose}><X size={18} /></IconButton>
        </div>
        {children}
      </div>
    </div>
  )
}

function SlidePanel({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm">
      <aside className="ml-auto h-full w-full max-w-xl animate-slide-in overflow-y-auto border-l border-white/10 bg-[#080A10] p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <IconButton label="Close" onClick={onClose}><X size={18} /></IconButton>
        </div>
        {children}
      </aside>
    </div>
  )
}

function EmptyState({ icon: Icon, message }: { icon: any; message: string }) {
  return <div className="grid place-items-center rounded-xl border border-white/[0.06] bg-white/[0.02] py-10 text-center text-steel"><Icon className="mb-2" /><p>{message}</p></div>
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-sm text-steel"><span className="mb-1.5 block">{label}</span>{children}</label>
}

const inputClass = 'w-full rounded-xl border border-white/10 bg-black/25 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-steel/60 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20'

type BackendSyncState = {
  status: 'syncing' | 'online' | 'offline'
  updatedAt: string | null
  message: string
  mode?: string
}

async function saveStateToBackend(state: NatState) {
  const response = await fetch('/api/state', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ state }),
  })
  if (!response.ok) throw new Error(`State API ${response.status}`)
  return response.json()
}

function BackendStatus({ backend }: { backend: BackendSyncState }) {
  const colour = backend.status === 'online' ? 'bg-emerald-400' : backend.status === 'offline' ? 'bg-rose-400' : 'bg-amber-300'
  const modeLabel = backend.mode ? backend.mode.replace('-', ' ') : 'detecting'
  return (
    <GlassCard className="mb-5 flex flex-wrap items-center justify-between gap-3 p-3 text-sm">
      <div className="flex items-center gap-3">
        <span className={`h-2.5 w-2.5 rounded-full ${colour}`} />
        <span className="text-white">{backend.message}</span>
        <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 text-xs uppercase tracking-wide text-steel">{modeLabel}</span>
        <span className="text-steel">Interactive state syncs through `/api/state` with localStorage fallback.</span>
      </div>
      <span className="text-xs text-steel">{backend.updatedAt ? `Last sync: ${new Date(backend.updatedAt).toLocaleString('en-CA')}` : 'Waiting for first sync'}</span>
    </GlassCard>
  )
}

export default function Home() {
  const [view, setView] = useState<TabId>('dashboard')
  const [data, setData] = useState<VaultData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [state, setState] = useState<NatState>(() => seedState())
  const [ready, setReady] = useState(false)
  const [backend, setBackend] = useState<BackendSyncState>({ status: 'syncing', updatedAt: null, message: 'Connecting to backend...' })
  const [calendarSync, setCalendarSync] = useState<CalendarSyncStatus>({ status: 'idle', imported: 0, syncedAt: null, message: 'Google Calendar import waiting' })
  const [clock, setClock] = useState<Date | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/vault', { cache: 'no-store' })
      if (!res.ok) throw new Error(`API ${res.status}`)
      setData(await res.json())
      setError(null)
    } catch (e: any) {
      setError(e.message)
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const fallback = loadState()
    setState(fallback)

    async function loadBackendState() {
      try {
        const response = await fetch('/api/state', { cache: 'no-store' })
        if (!response.ok) throw new Error(`State API ${response.status}`)
        const payload = await response.json()
        if (cancelled) return
        if (payload?.state?.version === 1) {
          setState(applyDailyReset(payload.state))
          setBackend({ status: 'online', updatedAt: payload.updatedAt, message: `Backend connected (${payload.backend ?? 'file'})`, mode: payload.backend })
        } else {
          const saved = await saveStateToBackend(fallback)
          setBackend({ status: 'online', updatedAt: saved?.updatedAt ?? new Date().toISOString(), message: `Backend initialised (${saved?.backend ?? 'file'})`, mode: saved?.backend })
        }
      } catch (error: any) {
        if (!cancelled) setBackend({ status: 'offline', updatedAt: null, message: error?.message ?? 'Backend unavailable' })
      } finally {
        if (!cancelled) setReady(true)
      }
    }

    loadBackendState()
    refresh()
    return () => { cancelled = true }
  }, [refresh])

  useEffect(() => {
    if (!ready) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    const timeout = window.setTimeout(() => {
      saveStateToBackend(state)
        .then((saved) => setBackend(current => ({ ...current, status: 'online', updatedAt: saved?.updatedAt ?? new Date().toISOString(), message: `Backend synced (${saved?.backend ?? current.mode ?? 'file'})`, mode: saved?.backend ?? current.mode })))
        .catch((error: any) => setBackend({ status: 'offline', updatedAt: null, message: error?.message ?? 'Backend sync failed' }))
    }, 450)
    return () => window.clearTimeout(timeout)
  }, [ready, state])

  useEffect(() => {
    if (!ready) return
    let cancelled = false
    async function syncCalendarSnapshot() {
      setCalendarSync(current => ({ ...current, status: 'syncing', message: 'Importing Google Calendar...' }))
      try {
        const response = await fetch('/api/calendar-sync', { cache: 'no-store' })
        if (!response.ok) throw new Error(`Calendar sync API ${response.status}`)
        const payload = await response.json()
        if (cancelled) return
        const events: GoogleCalendarEvent[] = Array.isArray(payload?.events) ? payload.events : []
        const syncedAt = payload?.syncedAt ?? new Date().toISOString()
        setState(current => mergeGoogleCalendarMeetings(current, events, syncedAt).state)
        setCalendarSync({ status: 'synced', imported: events.length, syncedAt, message: events.length ? 'Google Calendar imported' : 'No calendar snapshot available' })
      } catch (error: any) {
        if (!cancelled) setCalendarSync({ status: 'offline', imported: 0, syncedAt: null, message: error?.message ?? 'Google Calendar import unavailable' })
      }
    }

    syncCalendarSnapshot()
    return () => { cancelled = true }
  }, [ready])

  useEffect(() => {
    setClock(new Date())
    const id = setInterval(() => setClock(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const update = (fn: (current: NatState) => NatState) => setState(current => fn(current))
  const currentTime = clock
    ? new Intl.DateTimeFormat('en-CA', { dateStyle: 'medium', timeStyle: 'medium', timeZone: 'America/Edmonton' }).format(clock)
    : 'Syncing Calgary time...'

  return (
    <div className="min-h-screen bg-[#050508] text-white">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_15%_0%,rgba(0,10,255,.20),transparent_26%),radial-gradient(circle_at_85%_10%,rgba(103,232,249,.08),transparent_22%),linear-gradient(180deg,rgba(255,255,255,.03),transparent_35%)]" />
      <Header view={view} setView={setView} searchRef={searchRef} state={state} setState={setState} clockText={currentTime} />
      <main className="relative mx-auto max-w-[1600px] px-4 pb-10 pt-28 sm:px-6 lg:px-10">
        {loading && <GlassCard className="p-5 text-steel">Loading vault context...</GlassCard>}
        {!loading && error && <GlassCard className="mb-5 p-4 text-sm text-amber-100">Vault sync is temporarily offline. Nat OS is running from local dashboard data and will reconnect automatically when the local API restarts.</GlassCard>}
        <BackendStatus backend={backend} />
        {view === 'dashboard' && <DashboardTab state={state} update={update} data={data} clock={clock} focus={state.settings.businessFocus} />}
        {view === 'goals' && <GoalOSTab state={state} update={update} focus={state.settings.businessFocus} />}
        {view === 'revenue' && <RevenueTab state={state} update={update} />}
        {view === 'projects' && <ProjectsTab state={state} update={update} focus={state.settings.businessFocus} />}
        {view === 'content' && <ContentEngineTab state={state} update={update} focus={state.settings.businessFocus} />}
        {view === 'command' && <CommandTab state={state} update={update} />}
        {view === 'warroom' && <WarRoomTab state={state} update={update} focus={state.settings.businessFocus} data={data} />}
        {view === 'meetings' && <MeetingsTab state={state} update={update} focus={state.settings.businessFocus} calendarSync={calendarSync} />}
        {view === 'intel' && <IntelTab state={state} update={update} focus={state.settings.businessFocus} />}
        {view === 'timeline' && <TimelineTab state={state} update={update} />}
        {view === 'review' && <CommandReviewTab state={state} update={update} />}
        {view === 'workspace' && <WorkspaceTab state={state} update={update} focus={state.settings.businessFocus} setView={setView} />}
        {view === 'notes' && <NotesTab state={state} update={update} focus={state.settings.businessFocus} />}
      </main>
    </div>
  )
}

function Header({ view, setView, searchRef, state, setState, clockText }: { view: TabId; setView: (v: TabId) => void; searchRef: React.RefObject<HTMLInputElement | null>; state: NatState; setState: React.Dispatch<React.SetStateAction<NatState>>; clockText: string }) {
  const [query, setQuery] = useState('')
  const results = useMemo(() => buildSearchResults(query, state), [query, state])
  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-white/[0.06] bg-[#050508]/80 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-[1600px] items-center gap-4 px-4 py-4 sm:px-6 lg:px-10">
        <div className="flex min-w-[220px] items-center gap-4">
          <div className="border-l border-white/25 pl-4">
            <div className="text-2xl font-semibold tracking-tight">Nat OS™</div>
            <div className="text-sm text-steel">Mission Control</div>
          </div>
          <div className="hidden rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-xs text-blue-200 md:flex md:items-center md:gap-2">
            <Zap size={14} /> Execution Mode
          </div>
        </div>
        <nav className="min-w-0 flex-1 overflow-x-auto">
          <div className="mx-auto flex w-max rounded-xl border border-white/10 bg-white/[0.025] p-1">
            {tabs.map(tab => {
              const Icon = tab.icon
              const active = view === tab.id
              return (
                <button key={tab.id} onClick={() => setView(tab.id)} className={`relative flex min-w-[82px] flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs transition ${active ? 'bg-blue-600/15 text-white shadow-[0_0_28px_rgba(0,10,255,.35)]' : 'text-steel hover:text-white'}`}>
                  <Icon size={18} />
                  <span>{tab.label}</span>
                  {active && <span className="absolute inset-x-2 -bottom-1 h-[2px] rounded-full bg-blue-500" />}
                </button>
              )
            })}
          </div>
        </nav>
        <div className="w-[150px] shrink-0 sm:w-[170px]">
          <select
            value={state.settings.businessFocus}
            onChange={e => setState(s => ({ ...s, settings: { ...s.settings, businessFocus: e.target.value as BusinessFocus } }))}
            className="w-full rounded-xl border border-white/10 bg-black/25 px-3 py-2.5 text-sm text-white outline-none transition focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20"
            aria-label="Business focus"
          >
            {focusOptions.map(option => <option key={option}>{option}</option>)}
          </select>
        </div>
        <div className="relative hidden min-w-[260px] xl:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-steel" />
          <input ref={searchRef} value={query} onChange={e => setQuery(e.target.value)} placeholder="Search anything..." className={`${inputClass} pl-9`} />
          {query && (
            <div className="absolute right-0 top-12 max-h-[420px] w-[440px] overflow-y-auto rounded-2xl border border-white/10 bg-[#080A10] p-3 shadow-2xl">
              {results.length ? results.map(r => (
                <button key={`${r.type}-${r.id}`} onClick={() => { setView(r.tab); setQuery('') }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-white/[0.05]">
                  <Badge label={r.type} />
                  <div>
                    <div className="text-sm text-white">{r.title}</div>
                    <div className="text-xs text-steel">{r.detail}</div>
                  </div>
                </button>
              )) : <EmptyState icon={Search} message="No matches found." />}
            </div>
          )}
        </div>
        <div className="hidden items-center gap-2 text-sm text-white lg:flex"><span className="h-3 w-3 animate-pulse rounded-full bg-blue-600 shadow-[0_0_16px_rgba(0,10,255,.9)]" /> Online</div>
        <div className="hidden rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2 text-right text-xs text-steel lg:block">{clockText}</div>
      </div>
    </header>
  )
}

function buildSearchResults(query: string, state: NatState) {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const rows: { id: string; type: string; title: string; detail: string; tab: TabId }[] = []
  state.goals.forEach(item => rows.push({ id: item.id, type: 'Goal', title: item.title, detail: item.description, tab: 'goals' }))
  state.tasks.forEach(item => rows.push({ id: item.id, type: 'Task', title: item.title, detail: item.category, tab: 'projects' }))
  state.actionItems.forEach(item => rows.push({ id: item.id, type: 'Action', title: item.title, detail: item.status, tab: 'projects' }))
  state.clients.forEach(item => rows.push({ id: item.id, type: 'Client', title: item.name, detail: `${item.status} ${money(item.monthlyValue)}`, tab: 'revenue' }))
  state.meetings.forEach(item => rows.push({ id: item.id, type: 'Meeting', title: item.title, detail: `${item.date} ${item.time}`, tab: 'meetings' }))
  state.notes.forEach(item => rows.push({ id: item.id, type: 'Note', title: item.title, detail: item.category, tab: 'notes' }))
  state.intel.forEach(item => rows.push({ id: item.id, type: 'Intel', title: item.title, detail: item.category, tab: 'intel' }))
  state.agents.forEach(item => rows.push({ id: item.id, type: 'Agent', title: item.name, detail: item.role, tab: 'command' }))
  state.warRoomCommands.forEach(item => rows.push({ id: item.id, type: 'War Room', title: item.request, detail: `${item.agentName} · ${item.status}`, tab: 'warroom' }))
  state.decisions.forEach(item => rows.push({ id: item.id, type: 'Decision', title: item.question, detail: item.status, tab: 'command' }))
  state.commandReviews.forEach(item => rows.push({ id: item.id, type: 'Review', title: `Command Review - ${item.date}`, detail: item.priorities.join(', '), tab: 'review' }))
  state.subscriptions.forEach(item => rows.push({ id: item.id, type: 'Subscription', title: item.name, detail: `${item.status} · ${money(item.monthlyCost)}/mo`, tab: 'workspace' }))
  state.templates.forEach(item => rows.push({ id: item.id, type: 'Template', title: item.name, detail: `${item.type} · ${item.category}`, tab: 'workspace' }))
  ;[
    ['Get Right Fitness', 'Vault business layer', 'dashboard'],
    ['Luxe Property Solutions', 'Vault deal pipeline', 'dashboard'],
    ['Forex Trading', 'Vault trading overview', 'dashboard'],
    ['Nexora AI', 'Vault AI agency context', 'dashboard'],
  ].forEach(([title, detail, tab], index) => rows.push({ id: `vault-${index}`, type: 'Vault', title, detail, tab: tab as TabId }))
  return rows.filter(r => `${r.title} ${r.detail} ${r.type}`.toLowerCase().includes(q)).slice(0, 12)
}

function DashboardTab({ state, update, data, clock, focus }: { state: NatState; update: (fn: (s: NatState) => NatState) => void; data: VaultData | null; clock: Date | null; focus: BusinessFocus }) {
  const focusedTasks = state.tasks.filter(task => matchesTaskFocus(task, focus))
  const focusedPriorities = state.priorities.filter(priority => matchesPriorityFocus(priority, focus))
  const execution = executionScore(state.checklist, focusedTasks)
  const projectMetrics = projectDashboardMetrics(focusedTasks)
  const revenueImpact = completedHighPriorityRevenueImpact(focusedTasks, state.revenueGoal)
  const { completed: done, score } = execution
  const status = score < 40 ? 'Off Track' : score < 70 ? 'Building Momentum' : score < 90 ? 'Locked In' : 'Elite Execution'
  const days = clock ? Math.max(0, Math.ceil((goalDate.getTime() - clock.getTime()) / 86400000)) : '...'
  const mrr = state.clients.filter(c => c.status === 'Active').reduce((sum, c) => sum + c.monthlyValue, 0)
  const leadCount = data?.luxe?.dealCount ?? state.tasks.filter(t => t.category === 'Luxe Property Solutions').length
  const clientCount = data?.getright?.clientCount || state.clients.filter(c => c.status === 'Active').length
  const greetingHour = clock ? Number(new Intl.DateTimeFormat('en-CA', { hour: 'numeric', hour12: false, timeZone: 'America/Edmonton' }).format(clock)) : 9
  const greeting = greetingHour < 12 ? 'Good morning' : greetingHour < 17 ? 'Good afternoon' : 'Good evening'
  const nextAction = getNextBestAction(state, clock)
  return (
    <div className="animate-fade-in-up space-y-5">
      <GlassCard className="flex flex-col justify-between gap-4 p-6 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{greeting}, Coach Nat</h1>
          <p className="mt-2 text-sm text-steel"><span className="mr-2 rounded bg-blue-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">LIVE</span>{clock ? dateTime(clock) : 'Syncing Calgary time...'}</p>
        </div>
        <div className="text-left md:text-right">
          <Badge label={focusLabel(focus)} />
          <p className="mt-2 max-w-sm text-sm text-steel">Discipline today. Freedom tomorrow. Build the system. Run the play.</p>
        </div>
      </GlassCard>
      <NextBestActionStrip action={nextAction} />
      <DailyResetHistory state={state} score={score} />
      <RevenueImpactWidget impact={revenueImpact} focus={focus} />

      <div className="grid gap-5 xl:grid-cols-[460px_1fr]">
        <GlassCard className="p-6">
          <div className="mb-5 flex items-center gap-2 text-lg font-semibold"><Gauge size={20} /> Daily Execution Score <Info size={15} className="text-steel" /></div>
          <div className="grid gap-5 sm:grid-cols-[190px_1fr] sm:items-center">
            <ProgressRing value={score} label={status} />
            <div>
              <p className="text-lg text-white">{status}</p>
              <p className="mt-2 text-sm leading-6 text-steel">{done} of {execution.total} execution markers complete: {execution.checklistDone}/{execution.checklistTotal} discipline and {execution.taskDone}/{execution.taskTotal} due project tasks.</p>
              <p className="mt-4 text-sm font-medium text-emerald-300">+ {score}% checklist + project execution</p>
            </div>
          </div>
        </GlassCard>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard icon={CircleDollarSign} label="Revenue Progress" value={money(mrr)} sub={`of ${money(state.revenueGoal)} goal`} trend="MRR tracked" />
          <MetricCard icon={BriefcaseBusiness} label="Active Projects" value={projectMetrics.activeCount} sub={`${projectMetrics.blocked} blocked · ${focusLabel(focus)}`} trend="from Projects board" accent="violet" />
          <MetricCard icon={ClipboardList} label="Tasks Today" value={`${projectMetrics.dueOpen} / ${projectMetrics.dueTotal}`} sub={`${projectMetrics.dueDone} due tasks completed`} trend="from due dates" accent="cyan" />
          <MetricCard icon={Flag} label="Days to Jan 1, 2027" value={days} sub="goal countdown" accent="amber" />
          <MetricCard icon={Users} label="Active Clients" value={clientCount} sub="vault + local revenue rows" trend="tracked" accent="cyan" />
          <MetricCard icon={HomeIcon} label="Real Estate Leads" value={leadCount} sub={`${data?.luxe?.hotDeals ?? 0} hot deals`} trend="lead flow" accent="rose" />
          <MetricCard icon={Phone} label="Calls Completed" value="4 / 10" sub="daily Luxe target" trend="keep dialling" accent="emerald" />
          <MetricCard icon={Megaphone} label="Content Posted" value="0 / 1" sub="proof-of-work target" accent="blue" />
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <Checklist state={state} update={update} />
        <Priorities state={state} update={update} priorities={focusedPriorities} focus={focus} />
        <ActivityFeed activity={state.activity} />
      </div>
      <QuickCapture update={update} />
    </div>
  )
}

function Checklist({ state, update }: { state: NatState; update: (fn: (s: NatState) => NatState) => void }) {
  const [label, setLabel] = useState('')
  return (
    <GlassCard className="p-5">
      <div className="mb-4 flex items-center justify-between"><h2 className="flex items-center gap-2 text-lg font-semibold"><CalendarDays size={19} /> Daily Discipline Checklist</h2><Badge label={`${state.checklist.filter(i => i.done).length} / ${state.checklist.length}`} /></div>
      <div className="space-y-2">
        {state.checklist.map(item => (
          <label key={item.id} className="flex items-center gap-3 rounded-lg border border-white/[0.04] bg-black/10 px-3 py-2 text-sm">
            <input type="checkbox" checked={item.done} onChange={() => update(s => addActivity({ ...s, checklist: s.checklist.map(i => i.id === item.id ? { ...i, done: !i.done } : i) }, item.done ? 'Habit reopened' : 'Habit completed', item.label, 'habit'))} className="h-4 w-4 accent-blue-600" />
            <span className="flex-1">{item.label}</span>
            <span className="text-xs text-steel">{item.detail}</span>
          </label>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <input value={label} onChange={e => setLabel(e.target.value)} placeholder="Add custom habit" className={inputClass} />
        <IconButton label="Add habit" onClick={() => { if (!label.trim()) return; update(s => addActivity({ ...s, checklist: [...s.checklist, { id: id('habit'), label, done: false, detail: 'Custom' }] }, 'Habit added', label, 'habit')); setLabel('') }}><Plus size={18} /></IconButton>
      </div>
    </GlassCard>
  )
}

function Priorities({ state, update, priorities = state.priorities, focus = 'All' }: { state: NatState; update: (fn: (s: NatState) => NatState) => void; priorities?: Priority[]; focus?: BusinessFocus }) {
  const [title, setTitle] = useState('')
  return (
    <GlassCard className="p-5">
      <div className="mb-4 flex items-center justify-between"><h2 className="flex items-center gap-2 text-lg font-semibold"><Target size={19} /> Top Priorities</h2><Badge label={focus === 'All' ? String(state.priorities.length) : focusLabel(focus)} /></div>
      <div className="space-y-2">
        {priorities.length ? priorities.map(p => (
          <label key={p.id} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-3 text-sm">
            <input type="checkbox" checked={p.done} onChange={() => update(s => addActivity({ ...s, priorities: s.priorities.map(item => item.id === p.id ? { ...item, done: !item.done } : item) }, p.done ? 'Priority reopened' : 'Priority completed', p.title, 'priority'))} className="h-4 w-4 accent-blue-600" />
            <span className={`flex-1 ${p.done ? 'text-steel line-through' : ''}`}>{p.title}</span>
            <Badge label={p.due} />
          </label>
        )) : <EmptyState icon={Target} message={`No priorities in ${focusLabel(focus)}.`} />}
      </div>
      <div className="mt-4 flex gap-2">
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Add priority" className={inputClass} />
        <IconButton label="Add priority" onClick={() => { if (!title.trim()) return; update(s => addActivity({ ...s, priorities: [...s.priorities, { id: id('priority'), title, category: 'Personal', done: false, due: 'Today' }] }, 'Priority added', title, 'priority')); setTitle('') }}><Plus size={18} /></IconButton>
      </div>
    </GlassCard>
  )
}

function ActivityFeed({ activity }: { activity: ActivityEvent[] }) {
  return (
    <GlassCard className="p-5">
      <div className="mb-4 flex items-center justify-between"><h2 className="flex items-center gap-2 text-lg font-semibold"><Activity size={19} /> Activity Feed</h2><Badge label="All" /></div>
      <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
        {activity.map(a => (
          <div key={a.id} className="flex gap-3 border-b border-white/[0.05] py-3">
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
            <div className="min-w-0 flex-1"><p className="text-sm text-white">{a.title}</p><p className="truncate text-xs text-steel">{a.detail}</p></div>
            <span className="text-xs text-steel">{a.time}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}

function NextBestActionStrip({ action }: { action: NextBestAction }) {
  const Icon = action.icon
  return (
    <GlassCard className="overflow-hidden border-blue-500/35 bg-blue-600/[0.08]">
      <div className="grid gap-4 p-5 lg:grid-cols-[220px_1fr_auto] lg:items-center">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-xl border border-blue-300/30 bg-blue-500/15 text-blue-100 shadow-[0_0_24px_rgba(0,10,255,.28)]">
            <Icon size={23} />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-200">Next Best Action</p>
            <p className="mt-1 text-xs text-steel">One move. Execute now.</p>
          </div>
        </div>
        <div className="min-w-0">
          <h2 className="text-xl font-semibold tracking-tight text-white">{action.title}</h2>
          <p className="mt-1 text-sm leading-6 text-steel">{action.detail}</p>
        </div>
        <div className="flex flex-wrap gap-2 lg:justify-end">
          <Badge label={action.source} />
          <Badge label={action.urgency} />
        </div>
      </div>
    </GlassCard>
  )
}

function DailyResetHistory({ state, score }: { state: NatState; score: number }) {
  const streak = executionStreak(state.dailyHistory, score)
  const carried = state.priorities.filter(priority => !priority.done && priority.due === 'Today').length
  const recent = state.dailyHistory.slice(0, 5)
  return (
    <GlassCard className="p-4">
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr_2fr] lg:items-center">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-steel">Daily Reset</p>
          <p className="mt-1 text-sm text-white">Last reset: {state.settings.lastDailyResetDate}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
            <p className="text-xs text-steel">Execution streak</p>
            <p className="mt-1 text-2xl font-semibold text-white">{streak}</p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
            <p className="text-xs text-steel">Carried today</p>
            <p className="mt-1 text-2xl font-semibold text-white">{carried}</p>
          </div>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-medium text-steel">Recent execution scores</p>
            <p className="text-xs text-steel">70+ keeps streak alive</p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {recent.length ? recent.map(entry => (
              <div key={entry.id} className="min-w-[96px] rounded-xl border border-white/[0.06] bg-black/20 p-3">
                <p className="text-[11px] text-steel">{entry.date.slice(5)}</p>
                <p className={`mt-1 text-xl font-semibold ${entry.score >= 70 ? 'text-emerald-300' : 'text-amber-200'}`}>{entry.score}%</p>
                <p className="text-[11px] text-steel">{entry.completed}/{entry.total} done</p>
              </div>
            )) : (
              <div className="rounded-xl border border-white/[0.06] bg-black/20 px-4 py-3 text-sm text-steel">
                First archive will appear after tomorrow’s reset.
              </div>
            )}
          </div>
        </div>
      </div>
    </GlassCard>
  )
}

function RevenueImpactWidget({ impact, focus }: { impact: ReturnType<typeof completedHighPriorityRevenueImpact>; focus: BusinessFocus }) {
  const completionRate = Math.round((impact.completed.length / Math.max(1, impact.completed.length + impact.open.length)) * 100)
  const nextOpenTask = impact.open[0]
  return (
    <GlassCard className="overflow-hidden border-emerald-400/20 bg-emerald-500/[0.045]">
      <div className="grid gap-5 p-5 xl:grid-cols-[1.1fr_1fr_1.2fr] xl:items-center">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-emerald-300/25 bg-emerald-400/10 text-emerald-200 shadow-[0_0_24px_rgba(16,185,129,.18)]">
            <CircleDollarSign size={24} />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-200">Revenue Impact</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white">{money(impact.completedImpact)}</h2>
            <p className="mt-1 text-sm leading-6 text-steel">
              Estimated impact from completed high-priority tasks in {focusLabel(focus)}.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-white/[0.06] bg-black/20 p-3">
            <p className="text-xs text-steel">Completed</p>
            <p className="mt-1 text-2xl font-semibold text-white">{impact.completed.length}</p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-black/20 p-3">
            <p className="text-xs text-steel">Open</p>
            <p className="mt-1 text-2xl font-semibold text-white">{impact.open.length}</p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-black/20 p-3">
            <p className="text-xs text-steel">Goal share</p>
            <p className="mt-1 text-2xl font-semibold text-white">{impact.goalShare}%</p>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-xs text-steel">
            <span>High-priority revenue task completion</span>
            <span>{completionRate}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,.65)]" style={{ width: `${completionRate}%` }} />
          </div>
          <div className="mt-4 grid gap-2 text-sm text-steel sm:grid-cols-2">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-steel">Unlocked by lane</p>
              <p className="mt-2 text-white">{impact.byCategory.length ? impact.byCategory.map(([category, value]) => `${category}: ${money(value)}`).join(' · ') : 'No high-priority completions yet.'}</p>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-steel">Still on the table</p>
              <p className="mt-2 text-white">{nextOpenTask ? `${money(impact.openImpact)} estimated. Next: ${nextOpenTask.title}.` : 'All visible high-priority revenue tasks are complete.'}</p>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  )
}

function QuickCapture({ update }: { update: (fn: (s: NatState) => NatState) => void }) {
  const [kind, setKind] = useState<'task' | 'idea' | 'lead' | 'meeting note' | 'content idea' | 'AI agent task'>('task')
  const [text, setText] = useState('')
  function add() {
    if (!text.trim()) return
    update(s => {
      let next = s
      if (kind === 'task') next = { ...next, tasks: [...next.tasks, { id: id('task'), title: text, description: 'Quick capture', category: 'Personal', priority: 'Medium', createdDate: todayIso(), dueDate: todayIso(), status: 'Backlog', notes: '' }] }
      if (kind === 'content idea') next = { ...next, intel: [...next.intel, { id: id('intel'), title: text, summary: 'Quick captured content idea.', source: 'Quick Capture', sourceLink: '', dateAdded: todayIso(), category: 'Content Ideas', importance: 'Notable', notes: '', why: 'Potential proof-of-work post.', actionNeeded: true }] }
      return addActivity(next, 'Quick capture added', `${kind}: ${text}`, 'capture')
    })
    setText('')
  }
  return (
    <GlassCard className="grid gap-4 p-5 lg:grid-cols-[220px_1fr_1fr] lg:items-center">
      <div><h2 className="flex items-center gap-2 text-lg font-semibold"><Zap size={20} /> Quick Capture</h2><p className="mt-1 text-sm text-steel">Capture it. Action it. Win.</p></div>
      <div className="flex flex-wrap gap-2">
        {(['task', 'idea', 'lead', 'meeting note', 'content idea', 'AI agent task'] as const).map(k => <button key={k} onClick={() => setKind(k)} className={`rounded-xl border px-4 py-2 text-sm capitalize transition ${kind === k ? 'border-blue-500 bg-blue-600/20 text-white' : 'border-white/10 bg-white/[0.025] text-steel hover:text-white'}`}>{k}</button>)}
      </div>
      <div className="flex gap-2"><input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} placeholder="What needs to get done?" className={inputClass} /><button onClick={add} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-[0_0_24px_rgba(0,10,255,.45)]"><Send size={16} /> Add</button></div>
    </GlassCard>
  )
}

function GoalOSTab({ state, update, focus }: { state: NatState; update: (fn: (s: NatState) => NatState) => void; focus: BusinessFocus }) {
  const [adding, setAdding] = useState(false)
  const areas = state.lifeAreas.filter(area => focus === 'All' || area.focus === focus || area.focus === 'All')
  const goals = state.goals.filter(goal => matchesGoalFocus(goal, state.lifeAreas, focus))
  const activeGoals = goals.filter(goal => goal.status === 'Active')
  const avgProgress = goals.length ? Math.round(goals.reduce((sum, goal) => sum + goalProgress(goal), 0) / goals.length) : 0
  const linkedTaskCount = goals.reduce((sum, goal) => sum + goal.linkedTasks.length, 0)
  return (
    <div className="animate-fade-in-up space-y-5">
      <PageHero icon={Target} title="Goal OS" sub={`${focusLabel(focus)} focus. Life areas, vision, measurable goals, habits, tasks, and progress.`} quote="Turn intent into operating evidence." />
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard icon={Target} label="Active Goals" value={activeGoals.length} sub="in focus" />
        <MetricCard icon={Gauge} label="Avg. Progress" value={`${avgProgress}%`} sub="across visible goals" accent="emerald" />
        <MetricCard icon={ClipboardList} label="Linked Tasks" value={linkedTaskCount} sub="connected execution" accent="cyan" />
        <MetricCard icon={CheckCircle2} label="Milestones Done" value={goals.flatMap(goal => goal.milestones).filter(milestone => milestone.done).length} sub="goal proof" accent="violet" />
      </div>

      <GlassCard className="p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Life Areas & Vision</h2>
            <p className="mt-1 text-sm text-steel">Griply-style hierarchy, rebuilt locally inside Nat OS.</p>
          </div>
          <Badge label={focusLabel(focus)} />
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {areas.map(area => (
            <article key={area.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="font-semibold text-white">{area.title}</h3>
                <Badge label={area.focus} />
              </div>
              <p className="text-sm leading-6 text-steel">{area.vision}</p>
            </article>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Goals & Progress</h2>
            <p className="mt-1 text-sm text-steel">Each goal connects the bigger vision to measurable progress, habits, tasks, and milestones.</p>
          </div>
          <button onClick={() => setAdding(true)} className="btn-primary"><Plus size={16} /> Add Goal</button>
        </div>
        <div className="grid gap-4 xl:grid-cols-3">
          {goals.length ? goals.map(goal => <GoalCard key={goal.id} goal={goal} areas={state.lifeAreas} checklist={state.checklist} tasks={state.tasks} update={update} />) : <div className="xl:col-span-3"><EmptyState icon={Target} message={`No goals in ${focusLabel(focus)} yet.`} /></div>}
        </div>
      </GlassCard>
      {adding && <GoalModal state={state} onClose={() => setAdding(false)} update={update} focus={focus} />}
    </div>
  )
}

function GoalCard({ goal, areas, checklist, tasks, update }: { goal: OperatingGoal; areas: LifeArea[]; checklist: DashboardChecklistItem[]; tasks: ProjectTask[]; update: (fn: (s: NatState) => NatState) => void }) {
  const progress = goalProgress(goal)
  const area = areas.find(item => item.id === goal.lifeAreaId)
  const linkedHabits = checklist.filter(item => goal.linkedHabits.includes(item.label))
  const linkedTasks = tasks.filter(item => goal.linkedTasks.includes(item.title))
  function updateGoal(patch: Partial<OperatingGoal>) {
    update(state => ({ ...state, goals: state.goals.map(item => item.id === goal.id ? { ...item, ...patch } : item) }))
  }
  return (
    <article className="rounded-2xl border border-white/[0.06] bg-black/20 p-5 transition hover:border-blue-500/40">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{goal.title}</h3>
          <p className="mt-1 text-xs text-steel">{area?.title ?? 'Goal Area'} · {goal.deadline}</p>
        </div>
        <Badge label={goal.status} />
      </div>
      <p className="min-h-[72px] text-sm leading-6 text-steel">{goal.description}</p>
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-steel">{goal.metricLabel}</span>
          <span className="font-semibold text-white">{goal.current} / {goal.target} {goal.unit}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-blue-600 shadow-[0_0_18px_rgba(0,10,255,.65)]" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-3 grid grid-cols-[1fr_auto_auto] gap-2">
          <input type="number" value={goal.current} onChange={event => updateGoal({ current: Number(event.target.value) || 0 })} className={inputClass} />
          <button onClick={() => updateGoal({ current: Math.max(0, goal.current - 1) })} className="rounded-xl border border-white/10 px-3 text-sm text-steel hover:text-white">-1</button>
          <button onClick={() => updateGoal({ current: Math.min(goal.target, goal.current + 1) })} className="rounded-xl border border-blue-500/40 bg-blue-600/10 px-3 text-sm text-blue-200">+1</button>
        </div>
      </div>
      <div className="mt-5 grid gap-3 text-sm">
        <Panel title="Linked Habits">
          {linkedHabits.length ? linkedHabits.map(habit => <p key={habit.id} className="mb-2 flex items-center justify-between text-sm text-steel"><span>{habit.label}</span>{habit.done ? <Check size={15} className="text-emerald-300" /> : <Clock size={15} />}</p>) : <p className="text-sm text-steel">No habits linked.</p>}
        </Panel>
        <Panel title="Linked Tasks">
          {linkedTasks.length ? linkedTasks.map(task => <p key={task.id} className="mb-2 flex items-center justify-between gap-3 text-sm text-steel"><span className="line-clamp-1">{task.title}</span><Badge label={task.status} /></p>) : <p className="text-sm text-steel">No tasks linked.</p>}
        </Panel>
        <Panel title="Milestones">
          {goal.milestones.map(milestone => (
            <label key={milestone.id} className="mb-2 flex gap-2 text-sm text-steel">
              <input type="checkbox" checked={milestone.done} onChange={() => updateGoal({ milestones: goal.milestones.map(item => item.id === milestone.id ? { ...item, done: !item.done } : item) })} className="accent-blue-600" />
              {milestone.title}
            </label>
          ))}
        </Panel>
      </div>
    </article>
  )
}

function GoalModal({ state, onClose, update, focus }: { state: NatState; onClose: () => void; update: (fn: (s: NatState) => NatState) => void; focus: BusinessFocus }) {
  const defaultArea = state.lifeAreas.find(area => focus === 'All' || area.focus === focus)?.id ?? state.lifeAreas[0]?.id ?? 'wealth'
  const [form, setForm] = useState<OperatingGoal>({ id: id('goal'), title: '', lifeAreaId: defaultArea, category: categoryForFocus(focus), description: '', metricLabel: 'Progress', current: 0, target: 10, unit: 'units', deadline: todayIso(), status: 'Active', linkedHabits: [], linkedTasks: [], milestones: [] })
  function save() {
    if (!form.title.trim()) return
    update(state => addActivity({ ...state, goals: [form, ...state.goals] }, 'Goal added', form.title, 'goal'))
    onClose()
  }
  return (
    <Modal title="Add Goal" onClose={onClose}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title"><input className={inputClass} value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} /></Field>
        <Field label="Life area"><select className={inputClass} value={form.lifeAreaId} onChange={event => setForm({ ...form, lifeAreaId: event.target.value })}>{state.lifeAreas.map(area => <option key={area.id} value={area.id}>{area.title}</option>)}</select></Field>
        <Field label="Category"><select className={inputClass} value={form.category} onChange={event => setForm({ ...form, category: event.target.value as BusinessCategory })}>{['Get Right Fitness', 'Luxe Property Solutions', 'Personal Brand', 'AI Systems', 'Personal'].map(item => <option key={item}>{item}</option>)}</select></Field>
        <Field label="Deadline"><input type="date" className={inputClass} value={form.deadline} onChange={event => setForm({ ...form, deadline: event.target.value })} /></Field>
        <Field label="Metric label"><input className={inputClass} value={form.metricLabel} onChange={event => setForm({ ...form, metricLabel: event.target.value })} /></Field>
        <Field label="Unit"><input className={inputClass} value={form.unit} onChange={event => setForm({ ...form, unit: event.target.value })} /></Field>
        <Field label="Current"><input type="number" className={inputClass} value={form.current} onChange={event => setForm({ ...form, current: Number(event.target.value) || 0 })} /></Field>
        <Field label="Target"><input type="number" className={inputClass} value={form.target} onChange={event => setForm({ ...form, target: Number(event.target.value) || 0 })} /></Field>
        <div className="sm:col-span-2"><Field label="Description"><textarea className={`${inputClass} min-h-24`} value={form.description} onChange={event => setForm({ ...form, description: event.target.value })} /></Field></div>
      </div>
      <button onClick={save} className="btn-primary mt-5"><Check size={16} /> Save Goal</button>
    </Modal>
  )
}

function RevenueTab({ state, update }: { state: NatState; update: (fn: (s: NatState) => NatState) => void }) {
  const [editing, setEditing] = useState<RevenueClient | null>(null)
  const [adding, setAdding] = useState(false)
  const active = state.clients.filter(c => c.status === 'Active')
  const pending = state.clients.filter(c => c.status === 'Pending').reduce((s, c) => s + c.monthlyValue, 0)
  const churned = state.clients.filter(c => c.status === 'Churned').reduce((s, c) => s + c.monthlyValue, 0)
  const mrr = active.reduce((s, c) => s + c.monthlyValue, 0)
  const pct = Math.min(100, Math.round((mrr / state.revenueGoal) * 100))
  const avg = active.length ? Math.round(mrr / active.length) : 0
  return (
    <div className="animate-fade-in-up space-y-5">
      <PageHero icon={BarChart3} title="Revenue Engine" sub="Track MRR, client growth, and predictable revenue." quote="More value. More impact. More revenue. Keep building." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard icon={Target} label="Monthly Revenue Goal" value={money(state.revenueGoal)} sub="MRR target" />
        <MetricCard icon={CircleDollarSign} label="Current MRR" value={money(mrr)} sub="active clients" trend="tracked" />
        <MetricCard icon={Users} label="Active Clients" value={active.length} sub="paying rows" />
        <MetricCard icon={BriefcaseBusiness} label="Pending Revenue" value={money(pending)} sub="proposals and onboarding" accent="cyan" />
        <MetricCard icon={BarChart3} label="Annual Projection" value={money(mrr * 12)} sub="current run rate" accent="amber" />
      </div>
      <div className="grid gap-5 xl:grid-cols-[1fr_1.25fr_.9fr]">
        <GlassCard className="p-6">
          <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold">Monthly Revenue Goal</h2><input type="number" value={state.revenueGoal} onChange={e => update(s => ({ ...s, revenueGoal: Number(e.target.value) || 0, settings: { ...s.settings, monthlyRevenueGoal: Number(e.target.value) || 0 } }))} className={`${inputClass} max-w-[150px]`} /></div>
          <ProgressRing value={pct} label={`${money(state.revenueGoal - mrr)} to go`} size={220} />
        </GlassCard>
        <GlassCard className="p-6">
          <h2 className="mb-6 text-lg font-semibold">Revenue Overview</h2>
          <div className="flex h-72 items-end gap-4 border-b border-white/10 pb-3">
            {state.revenueHistory.map(m => {
              const height = Math.max(12, (m.value / Math.max(state.revenueGoal, 1)) * 100)
              return (
                <div key={m.id} className="flex flex-1 flex-col items-center gap-2">
                  <input type="number" value={m.value} onChange={e => update(s => ({ ...s, revenueHistory: s.revenueHistory.map(item => item.id === m.id ? { ...item, value: Number(e.target.value) || 0 } : item) }))} className="w-full rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-center text-xs text-white" />
                  <div className={`w-full rounded-t-lg ${m.projected ? 'border border-dashed border-blue-400 bg-blue-500/10' : 'bg-gradient-to-t from-blue-950 to-blue-500'}`} style={{ height: `${height}%` }} />
                  <span className="text-xs text-steel">{m.label}</span>
                </div>
              )
            })}
          </div>
        </GlassCard>
        <GlassCard className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Revenue Projections</h2>
          <Projection label="Current MRR" value={money(mrr)} />
          <Projection label="Projected annual revenue" value={money(mrr * 12)} />
          <Projection label="Additional MRR needed" value={money(Math.max(0, state.revenueGoal - mrr))} />
          <Projection label="Avg. monthly value per client" value={money(avg)} />
          <Projection label="Additional clients needed" value={avg ? Math.ceil(Math.max(0, state.revenueGoal - mrr) / avg) : 0} />
          <Projection label="Churned revenue lost" value={money(churned)} />
        </GlassCard>
      </div>
      <GlassCard className="p-5">
        <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold">Active Clients</h2><button onClick={() => setAdding(true)} className="btn-primary"><Plus size={16} /> Add Client</button></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-steel"><tr><th className="py-3">Client name</th><th>Category</th><th>Monthly value</th><th>Status</th><th>Start date</th><th></th></tr></thead>
            <tbody>
              {state.clients.map(c => <tr key={c.id} className="border-t border-white/[0.06]"><td className="py-3 text-white">{c.name}<div className="text-xs text-steel">{c.notes}</div></td><td>{c.category}</td><td>{money(c.monthlyValue)}</td><td><Badge label={c.status} /></td><td>{c.startDate}</td><td className="text-right"><IconButton label="Edit client" onClick={() => setEditing(c)}><Pencil size={16} /></IconButton><IconButton label="Remove client" onClick={() => update(s => addActivity({ ...s, clients: s.clients.filter(item => item.id !== c.id) }, 'Client removed', c.name, 'revenue'))} className="ml-2"><Trash2 size={16} /></IconButton></td></tr>)}
            </tbody>
          </table>
        </div>
      </GlassCard>
      {(adding || editing) && <ClientModal client={editing} onClose={() => { setAdding(false); setEditing(null) }} update={update} />}
    </div>
  )
}

function Projection({ label, value }: { label: string; value: string | number }) {
  return <div className="mb-3 flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.025] p-4"><span className="text-sm text-steel">{label}</span><span className="text-lg font-semibold text-white">{value}</span></div>
}

function ClientModal({ client, onClose, update }: { client: RevenueClient | null; onClose: () => void; update: (fn: (s: NatState) => NatState) => void }) {
  const [form, setForm] = useState<RevenueClient>(client ?? { id: id('client'), name: '', category: 'Fitness', monthlyValue: 0, status: 'Active', startDate: todayIso(), notes: '' })
  function save() {
    if (!form.name.trim()) return
    update(s => addActivity({ ...s, clients: client ? s.clients.map(c => c.id === form.id ? form : c) : [...s.clients, form] }, client ? 'Client updated' : 'Client added', form.name, 'revenue'))
    onClose()
  }
  return <Modal title={client ? 'Edit Client' : 'Add Client'} onClose={onClose}><div className="grid gap-4 sm:grid-cols-2"><Field label="Name"><input className={inputClass} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></Field><Field label="Monthly value"><input type="number" className={inputClass} value={form.monthlyValue} onChange={e => setForm({ ...form, monthlyValue: Number(e.target.value) || 0 })} /></Field><Field label="Status"><select className={inputClass} value={form.status} onChange={e => setForm({ ...form, status: e.target.value as RevenueClient['status'] })}><option>Active</option><option>Pending</option><option>Churned</option></select></Field><Field label="Start date"><input type="date" className={inputClass} value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} /></Field><Field label="Category"><input className={inputClass} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} /></Field><Field label="Notes"><input className={inputClass} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></Field></div><button onClick={save} className="btn-primary mt-5"><Check size={16} /> Save</button></Modal>
}

function ProjectsTab({ state, update, focus }: { state: NatState; update: (fn: (s: NatState) => NatState) => void; focus: BusinessFocus }) {
  const [editing, setEditing] = useState<ProjectTask | null>(null)
  const [addStatus, setAddStatus] = useState<ProjectStatus | null>(null)
  const statuses: ProjectStatus[] = ['Backlog', 'In Progress', 'Waiting / Blocked', 'Done']
  const tasks = state.tasks.filter(task => matchesTaskFocus(task, focus))
  const actionItems = state.actionItems.filter(item => matchesActionItemFocus(item, focus))
  return (
    <div className="animate-fade-in-up space-y-5">
      <PageHero icon={FolderKanban} title="Execution Board" sub={`${focusLabel(focus)} focus. Move the mission forward. One task at a time.`} quote={`${tasks.length} visible tasks. ${tasks.filter(t => t.status === 'Done').length} completed.`} />
      <div className="grid gap-4 md:grid-cols-4">{statuses.map(st => <MetricCard key={st} icon={st === 'Done' ? CheckCircle2 : st === 'Waiting / Blocked' ? ShieldCheck : FolderKanban} label={st} value={tasks.filter(t => t.status === st).length} sub="tasks" />)}</div>
      <div className="grid gap-4 xl:grid-cols-4">
        {statuses.map(st => (
          <GlassCard key={st} className={`p-4 ${st === 'Waiting / Blocked' ? 'border-rose-400/30' : st === 'Done' ? 'border-emerald-400/30' : ''}`}>
            <div className="mb-4 flex items-center justify-between"><h2 className="font-semibold">{st}</h2><Badge label={String(tasks.filter(t => t.status === st).length)} /></div>
            <div className="space-y-3">
              {tasks.filter(t => t.status === st).map(t => (
                <article key={t.id} className="rounded-xl border border-white/[0.06] bg-black/20 p-4 transition hover:border-blue-500/40">
                  <h3 className="text-base font-semibold">{t.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-steel">{t.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2"><Badge label={t.category} /><Badge label={t.priority} /></div>
                  <div className="mt-4 flex items-center justify-between text-xs text-steel"><span>{t.dueDate}</span><button onClick={() => setEditing(t)} className="text-blue-300">Edit</button></div>
                </article>
              ))}
              <button onClick={() => setAddStatus(st)} className="w-full rounded-xl border border-blue-500/40 bg-blue-600/10 px-4 py-3 text-sm text-blue-200"><Plus className="inline" size={16} /> Add Task</button>
            </div>
          </GlassCard>
        ))}
      </div>
      <ProjectActionTracker actionItems={actionItems} focus={focus} update={update} />
      <div className="grid gap-5 xl:grid-cols-2">
        <GlassCard className="p-5"><h2 className="mb-4 text-lg font-semibold">Workload Overview</h2><div className="grid gap-3">{statuses.map(st => <div key={st}><div className="mb-1 flex justify-between text-sm"><span>{st}</span><span className="text-steel">{tasks.filter(t => t.status === st).length}</span></div><div className="h-2 rounded-full bg-white/10"><div className="h-2 rounded-full bg-blue-600" style={{ width: `${(tasks.filter(t => t.status === st).length / Math.max(1, tasks.length)) * 100}%` }} /></div></div>)}</div></GlassCard>
        <ActivityFeed activity={state.activity.filter(a => ['project', 'priority'].includes(a.type)).concat(state.activity).slice(0, 6)} />
      </div>
      {(editing || addStatus) && <TaskModal task={editing} status={addStatus} onClose={() => { setEditing(null); setAddStatus(null) }} update={update} />}
    </div>
  )
}

function categoryForFocus(focus: BusinessFocus): BusinessCategory {
  if (focus === 'Get Right') return 'Get Right Fitness'
  if (focus === 'Luxe') return 'Luxe Property Solutions'
  if (focus === 'Nexora') return 'AI Systems'
  if (focus === 'Personal Brand') return 'Personal Brand'
  return 'Personal'
}

function ProjectActionTracker({ actionItems, focus, update }: { actionItems: ProjectActionItem[]; focus: BusinessFocus; update: (fn: (s: NatState) => NatState) => void }) {
  const categories: BusinessCategory[] = ['Get Right Fitness', 'Luxe Property Solutions', 'Personal Brand', 'AI Systems', 'Personal']
  const statuses: ActionItemStatus[] = ['Pending', 'In Progress', 'Complete']
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<BusinessCategory>(() => categoryForFocus(focus))
  const [status, setStatus] = useState<ActionItemStatus>('Pending')
  const counts = statuses.map(itemStatus => ({ status: itemStatus, count: actionItems.filter(item => item.status === itemStatus).length }))

  function addItem() {
    const cleanTitle = title.trim()
    if (!cleanTitle) return
    const nextItem: ProjectActionItem = {
      id: id('action'),
      title: cleanTitle,
      category,
      status,
      createdDate: todayIso(),
    }
    update(state => addActivity({ ...state, actionItems: [...state.actionItems, nextItem] }, 'Action item added', cleanTitle, 'action-item'))
    setTitle('')
    setStatus('Pending')
  }

  function updateStatus(actionItem: ProjectActionItem, nextStatus: ActionItemStatus) {
    update(state => addActivity({
      ...state,
      actionItems: state.actionItems.map(item => item.id === actionItem.id ? { ...item, status: nextStatus } : item),
    }, 'Action item updated', `${actionItem.title} -> ${nextStatus}`, 'action-item'))
  }

  function removeItem(actionItem: ProjectActionItem) {
    update(state => addActivity({
      ...state,
      actionItems: state.actionItems.filter(item => item.id !== actionItem.id),
    }, 'Action item deleted', actionItem.title, 'action-item'))
  }

  return (
    <GlassCard className="p-5">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold"><ClipboardList size={19} /> Action Items</h2>
          <p className="mt-1 text-sm text-steel">Track quick project moves without turning every detail into a full Kanban card.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge label={focusLabel(focus)} />
          {counts.map(item => <Badge key={item.status} label={`${item.status}: ${item.count}`} />)}
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_190px_190px_auto]">
        <input value={title} onChange={event => setTitle(event.target.value)} onKeyDown={event => event.key === 'Enter' && addItem()} placeholder="Add action item" className={inputClass} />
        <select value={category} onChange={event => setCategory(event.target.value as BusinessCategory)} className={inputClass}>
          {categories.map(item => <option key={item}>{item}</option>)}
        </select>
        <select value={status} onChange={event => setStatus(event.target.value as ActionItemStatus)} className={inputClass}>
          {statuses.map(item => <option key={item}>{item}</option>)}
        </select>
        <button onClick={addItem} className="btn-primary justify-center"><Plus size={16} /> Add</button>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        {actionItems.length ? actionItems.map(actionItem => (
          <article key={actionItem.id} className="rounded-xl border border-white/[0.06] bg-black/20 p-4 transition hover:border-blue-500/40 hover:bg-white/[0.03]">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className={`text-sm font-semibold ${actionItem.status === 'Complete' ? 'text-steel line-through' : 'text-white'}`}>{actionItem.title}</h3>
                <p className="mt-2 text-xs text-steel">Created {actionItem.createdDate}</p>
              </div>
              <IconButton label="Delete action item" onClick={() => removeItem(actionItem)}><Trash2 size={15} /></IconButton>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge label={actionItem.category} />
              <Badge label={actionItem.status} />
            </div>
            <select value={actionItem.status} onChange={event => updateStatus(actionItem, event.target.value as ActionItemStatus)} className={`${inputClass} mt-4`}>
              {statuses.map(item => <option key={item}>{item}</option>)}
            </select>
          </article>
        )) : (
          <div className="lg:col-span-3">
            <EmptyState icon={ClipboardList} message={`No action items in ${focusLabel(focus)} yet.`} />
          </div>
        )}
      </div>
    </GlassCard>
  )
}

function TaskModal({ task, status, onClose, update }: { task: ProjectTask | null; status: ProjectStatus | null; onClose: () => void; update: (fn: (s: NatState) => NatState) => void }) {
  const [form, setForm] = useState<ProjectTask>(task ?? { id: id('task'), title: '', description: '', category: 'AI Systems', priority: 'Medium', createdDate: todayIso(), dueDate: todayIso(), status: status ?? 'Backlog', notes: '' })
  function save() { if (!form.title.trim()) return; update(s => addActivity({ ...s, tasks: task ? s.tasks.map(t => t.id === form.id ? form : t) : [...s.tasks, form] }, task ? 'Task updated' : 'Task added', form.title, 'project')); onClose() }
  function remove() { update(s => addActivity({ ...s, tasks: s.tasks.filter(t => t.id !== form.id) }, 'Task deleted', form.title, 'project')); onClose() }
  return <Modal title={task ? 'Edit Task' : 'Add Task'} onClose={onClose}><div className="grid gap-4 sm:grid-cols-2"><Field label="Title"><input className={inputClass} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></Field><Field label="Due date"><input type="date" className={inputClass} value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} /></Field><Field label="Category"><select className={inputClass} value={form.category} onChange={e => setForm({ ...form, category: e.target.value as BusinessCategory })}>{['Get Right Fitness', 'Luxe Property Solutions', 'Personal Brand', 'AI Systems', 'Personal'].map(x => <option key={x}>{x}</option>)}</select></Field><Field label="Priority"><select className={inputClass} value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value as PriorityLevel })}><option>High</option><option>Medium</option><option>Low</option></select></Field><Field label="Status"><select className={inputClass} value={form.status} onChange={e => setForm({ ...form, status: e.target.value as ProjectStatus })}><option>Backlog</option><option>In Progress</option><option>Waiting / Blocked</option><option>Done</option></select></Field><Field label="Notes"><input className={inputClass} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></Field><div className="sm:col-span-2"><Field label="Description"><textarea className={`${inputClass} min-h-24`} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></Field></div></div><div className="mt-5 flex gap-2"><button onClick={save} className="btn-primary"><Check size={16} /> Save</button>{task && <button onClick={remove} className="btn-danger"><Trash2 size={16} /> Delete</button>}</div></Modal>
}

function laneToBusinessCategory(lane: BusinessFocus): BusinessCategory {
  if (lane === 'Get Right') return 'Get Right Fitness'
  if (lane === 'Luxe') return 'Luxe Property Solutions'
  if (lane === 'Personal Brand') return 'Personal Brand'
  if (lane === 'Personal') return 'Personal'
  return 'AI Systems'
}

function carouselForArticle(article: ContentArticle): CarouselDraft {
  const hook = article.lane === 'Luxe'
    ? 'Most sellers do not need a perfect pitch. They need a clear next step.'
    : article.lane === 'Get Right'
      ? 'Motivation fades. Structure keeps winning.'
      : article.lane === 'Personal Brand'
        ? 'Proof-of-work content is the new resume.'
        : 'Your business does not need more tabs. It needs one command centre.'
  const slides = [
    hook,
    `The problem: ${article.excerpt}`,
    `Search intent: ${article.seoKeyword || 'answer the question your client is already asking'}.`,
    'Turn the article into one clear idea per slide.',
    'Keep the copy sharp, specific, and useful.',
    'Use one visual system so the brand compounds.',
    'Let AI accelerate the draft, but keep a human in the loop.',
    'Publish the carousel to send attention back to the original article.',
    'Track which topics create saves, replies, and calls.',
    article.lane === 'Nexora' ? 'CTA: Book a 30-minute AI audit.' : 'CTA: DM me the word SYSTEM.',
  ]
  return {
    id: id('carousel'),
    articleId: article.id,
    title: article.title,
    lane: article.lane,
    status: 'Copy Drafted',
    hook,
    slides,
    designPrompt: `Create a premium 10-slide Instagram carousel from this article: "${article.title}". Use Nat OS dark SaaS visual language: #050508 background, glass cards, electric blue accents, strong hierarchy, clean Inter-style typography, and mobile-readable slide copy. Make it look on-brand, high-converting, and designed to send traffic back to the source article. Slide copy:\n${slides.map((slide, index) => `${index + 1}. ${slide}`).join('\n')}`,
    references: 'Use selected high-performing carousel references that match the amount of copy. Keep a consistent repeatable brand style.',
    cta: article.lane === 'Nexora' ? 'Book a 30-minute AI audit.' : 'Read the full breakdown and take the next best action.',
    updatedAt: new Date().toISOString(),
  }
}

function ContentEngineTab({ state, update, focus }: { state: NatState; update: (fn: (s: NatState) => NatState) => void; focus: BusinessFocus }) {
  const visibleArticles = state.contentArticles.filter(article => focus === 'All' || article.lane === focus)
  const visibleDrafts = state.carouselDrafts.filter(draft => focus === 'All' || draft.lane === focus)
  const [articleForm, setArticleForm] = useState<ContentArticle>({ id: id('article'), title: '', lane: focus === 'All' ? 'Nexora' : focus, sourceUrl: '', seoKeyword: '', excerpt: '', publishedAt: todayIso() })
  const [selectedDraftId, setSelectedDraftId] = useState(visibleDrafts[0]?.id ?? '')
  const selectedDraft = state.carouselDrafts.find(draft => draft.id === selectedDraftId) ?? visibleDrafts[0]

  useEffect(() => {
    if (selectedDraft && !visibleDrafts.some(draft => draft.id === selectedDraft.id)) setSelectedDraftId(visibleDrafts[0]?.id ?? '')
  }, [focus, selectedDraft, visibleDrafts])

  function addArticle() {
    if (!articleForm.title.trim()) return
    update(current => addActivity({ ...current, contentArticles: [{ ...articleForm, id: id('article') }, ...current.contentArticles] }, 'Content article added', articleForm.title, 'content'))
    setArticleForm({ id: id('article'), title: '', lane: focus === 'All' ? 'Nexora' : focus, sourceUrl: '', seoKeyword: '', excerpt: '', publishedAt: todayIso() })
  }

  function generateDraft(article: ContentArticle) {
    const draft = carouselForArticle(article)
    update(current => addActivity({
      ...current,
      carouselDrafts: [draft, ...current.carouselDrafts.filter(item => item.articleId !== article.id)],
      tasks: [{ id: id('task'), title: `Design carousel: ${article.title}`, description: draft.designPrompt, category: laneToBusinessCategory(article.lane), priority: 'Medium', createdDate: todayIso(), dueDate: todayIso(), status: 'Backlog', notes: 'Created from Content Engine' }, ...current.tasks],
    }, 'Carousel copy drafted', article.title, 'content'))
    setSelectedDraftId(draft.id)
  }

  function updateDraft(draftId: string, patch: Partial<CarouselDraft>) {
    update(current => ({ ...current, carouselDrafts: current.carouselDrafts.map(draft => draft.id === draftId ? { ...draft, ...patch, updatedAt: new Date().toISOString() } : draft) }))
  }

  return (
    <div className="animate-fade-in-up space-y-5">
      <PageHero icon={Megaphone} title="Content Engine" sub={`${focusLabel(focus)} focus. Article-to-carousel pipeline with human review.`} quote="Digital home. Socials engine. Traffic back to owned content." />
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard icon={FileText} label="Published Articles" value={visibleArticles.length} sub="CMS source items" />
        <MetricCard icon={NotebookPen} label="Carousel Drafts" value={visibleDrafts.length} sub="copy and prompt assets" accent="amber" />
        <MetricCard icon={Sparkles} label="Design Ready" value={visibleDrafts.filter(draft => draft.status === 'Design Prompt Ready' || draft.status === 'Ready to Publish').length} sub="GPT Image prompt ready" accent="violet" />
        <MetricCard icon={CheckCircle2} label="Published" value={visibleDrafts.filter(draft => draft.status === 'Published').length} sub="carousels shipped" accent="emerald" />
      </div>

      <GlassCard className="p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Digital Home Articles</h2>
            <p className="mt-1 text-sm text-steel">Add daily published content, then generate carousel copy from the article.</p>
          </div>
          <Badge label="Human in the loop" />
        </div>
        <div className="grid gap-3 lg:grid-cols-[1fr_160px_180px_1fr_auto]">
          <input value={articleForm.title} onChange={event => setArticleForm({ ...articleForm, title: event.target.value })} placeholder="Article title" className={inputClass} />
          <select value={articleForm.lane} onChange={event => setArticleForm({ ...articleForm, lane: event.target.value as BusinessFocus })} className={inputClass}>{focusOptions.filter(item => item !== 'All').map(item => <option key={item}>{item}</option>)}</select>
          <input value={articleForm.seoKeyword} onChange={event => setArticleForm({ ...articleForm, seoKeyword: event.target.value })} placeholder="SEO keyword" className={inputClass} />
          <input value={articleForm.sourceUrl} onChange={event => setArticleForm({ ...articleForm, sourceUrl: event.target.value })} placeholder="Source URL or vault path" className={inputClass} />
          <button onClick={addArticle} className="btn-primary justify-center"><Plus size={16} /> Add</button>
        </div>
        <textarea value={articleForm.excerpt} onChange={event => setArticleForm({ ...articleForm, excerpt: event.target.value })} placeholder="Article excerpt or core idea..." className={`${inputClass} mt-3 min-h-20`} />
      </GlassCard>

      <div className="grid gap-5 xl:grid-cols-[440px_1fr]">
        <GlassCard className="p-5">
          <h2 className="mb-4 text-lg font-semibold">Socials Queue</h2>
          <div className="space-y-3">
            {visibleArticles.map(article => (
              <article key={article.id} className="rounded-2xl border border-white/[0.06] bg-black/20 p-4">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-white">{article.title}</h3>
                  <Badge label={article.lane} />
                </div>
                <p className="text-xs text-steel">{article.seoKeyword || 'No keyword'} · {article.publishedAt}</p>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-steel">{article.excerpt}</p>
                <button onClick={() => generateDraft(article)} className="btn-primary mt-4 w-full justify-center"><Sparkles size={16} /> Generate Carousel</button>
              </article>
            ))}
          </div>
        </GlassCard>

        {selectedDraft ? (
          <GlassCard className="p-5">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">{selectedDraft.title}</h2>
                <p className="mt-1 text-sm text-steel">Article-to-carousel draft with editable copy and one-prompt design output.</p>
              </div>
              <select value={selectedDraft.status} onChange={event => updateDraft(selectedDraft.id, { status: event.target.value as CarouselStatus })} className={`${inputClass} max-w-56`}>
                {(['Article', 'Copy Drafted', 'Design Prompt Ready', 'Ready to Publish', 'Published'] as CarouselStatus[]).map(status => <option key={status}>{status}</option>)}
              </select>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <Panel title="Carousel Copy">
                <Field label="Hook"><input value={selectedDraft.hook} onChange={event => updateDraft(selectedDraft.id, { hook: event.target.value })} className={inputClass} /></Field>
                <div className="mt-4 space-y-2">{selectedDraft.slides.map((slide, index) => <textarea key={index} value={slide} onChange={event => updateDraft(selectedDraft.id, { slides: selectedDraft.slides.map((item, itemIndex) => itemIndex === index ? event.target.value : item) })} className={inputClass} />)}</div>
              </Panel>
              <Panel title="GPT Image Prompt">
                <textarea value={selectedDraft.designPrompt} onChange={event => updateDraft(selectedDraft.id, { designPrompt: event.target.value })} className={`${inputClass} min-h-64`} />
                <Field label="Style references"><input value={selectedDraft.references} onChange={event => updateDraft(selectedDraft.id, { references: event.target.value })} className={`${inputClass} mt-4`} /></Field>
                <Field label="CTA"><input value={selectedDraft.cta} onChange={event => updateDraft(selectedDraft.id, { cta: event.target.value })} className={`${inputClass} mt-4`} /></Field>
              </Panel>
            </div>
          </GlassCard>
        ) : <EmptyState icon={Megaphone} message="Generate a carousel draft from an article." />}
      </div>
    </div>
  )
}

function CommandTab({ state, update }: { state: NatState; update: (fn: (s: NatState) => NatState) => void }) {
  const [selectedId, setSelectedId] = useState(state.agents[0]?.id ?? '')
  const selected = state.agents.find(agent => agent.id === selectedId) ?? state.agents[0]
  const [decisionOpen, setDecisionOpen] = useState(false)
  useEffect(() => {
    if (selected && !state.agents.some(agent => agent.id === selected.id)) setSelectedId(state.agents[0]?.id ?? '')
  }, [selected, state.agents])
  return (
    <div className="animate-fade-in-up space-y-5">
      <PageHero icon={Bot} title="AI Workforce" sub="Your intelligent agents. Working 24/7 to move the mission forward." quote={`${state.agents.length} total agents. ${state.agents.filter(a => a.status === 'online').length} online.`} />
      <div className="grid gap-5 xl:grid-cols-[1fr_.9fr]">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {state.agents.map(agent => <AgentCard key={agent.id} agent={agent} active={selected?.id === agent.id} onClick={() => setSelectedId(agent.id)} />)}
        </div>
        {selected && <AgentDetail agent={selected} update={update} />}
      </div>
      <GlassCard className="p-5">
        <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold">Executive Decisions</h2><button onClick={() => setDecisionOpen(true)} className="btn-primary"><Plus size={16} /> Add Decision</button></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[820px] text-sm"><thead className="text-left text-xs uppercase text-steel"><tr><th className="py-3">Date</th><th>Question asked</th><th>Summary</th><th>Agents</th><th>Status</th><th></th></tr></thead><tbody>{state.decisions.map(d => <tr key={d.id} className="border-t border-white/[0.06]"><td className="py-3">{d.date}</td><td>{d.question}</td><td className="max-w-sm text-steel">{d.summary}</td><td>{d.agents.join(', ')}</td><td><Badge label={d.status} /></td><td><IconButton label="Delete decision" onClick={() => update(s => ({ ...s, decisions: s.decisions.filter(x => x.id !== d.id) }))}><Trash2 size={16} /></IconButton></td></tr>)}</tbody></table></div>
      </GlassCard>
      {decisionOpen && <DecisionModal onClose={() => setDecisionOpen(false)} update={update} agents={state.agents} />}
    </div>
  )
}

function AgentCard({ agent, active, onClick }: { agent: Agent; active: boolean; onClick: () => void }) {
  return <button onClick={onClick} className={`rounded-2xl border bg-white/[0.035] p-5 text-left transition hover:-translate-y-1 ${active ? 'border-blue-500 shadow-[0_0_32px_rgba(0,10,255,.35)]' : 'border-white/[0.06]'}`}><div className="mb-4 flex items-start justify-between"><div className="grid h-12 w-12 place-items-center rounded-xl border border-blue-400/20 bg-blue-600/10 text-blue-200"><Bot /></div>{active && <CheckCircle2 className="text-blue-300" />}</div><h3 className="text-lg font-semibold">{agent.name}</h3><p className="mt-1 text-sm text-steel">{agent.role}</p><p className="mt-2 flex items-center gap-2 text-xs capitalize"><span className={`h-2 w-2 rounded-full ${agent.status === 'online' ? 'bg-emerald-400' : agent.status === 'busy' ? 'bg-amber-400' : 'bg-steel'}`} /> {agent.status}</p><p className="mt-4 line-clamp-3 text-sm text-steel">{agent.description}</p></button>
}

function AgentDetail({ agent, update }: { agent: Agent; update: (fn: (s: NatState) => NatState) => void }) {
  const [task, setTask] = useState('')
  const [priority, setPriority] = useState<PriorityLevel>('Medium')
  function send() {
    if (!task.trim()) return
    update(s => addActivity({ ...s, agents: s.agents.map(a => a.id === agent.id ? { ...a, tasks: [{ id: id('agent-task'), text: task, priority, time: nowTime() }, ...a.tasks], activity: [`Task sent: ${task}`, ...a.activity], lastActive: 'just now' } : a) }, `${agent.name} task sent`, task, 'agent'))
    setTask('')
  }
  return <GlassCard className="p-6"><div className="mb-5 flex items-start gap-4"><div className="grid h-14 w-14 place-items-center rounded-xl border border-blue-400/20 bg-blue-600/10 text-blue-200"><Bot /></div><div><h2 className="text-2xl font-semibold">{agent.name}</h2><p className="text-sm text-steel">{agent.role}</p><p className="mt-2 text-xs text-steel">Model: {agent.model} · Last active: {agent.lastActive}</p></div></div><p className="leading-7 text-steel">{agent.description}</p><div className="mt-6 grid gap-5 md:grid-cols-2"><div><h3 className="mb-3 font-semibold">Capabilities</h3><div className="space-y-2">{agent.capabilities.map(c => <p key={c} className="flex gap-2 text-sm text-steel"><Check size={16} className="text-emerald-300" /> {c}</p>)}</div></div><div><h3 className="mb-3 font-semibold">Recent Activity</h3><div className="space-y-2">{agent.activity.slice(0, 5).map((a, i) => <p key={i} className="text-sm text-steel">· {a}</p>)}</div></div></div><div className="mt-6 rounded-2xl border border-blue-500/30 bg-blue-600/10 p-4"><h3 className="mb-3 flex items-center gap-2 font-semibold"><Zap size={18} /> Send Task</h3><textarea value={task} onChange={e => setTask(e.target.value)} placeholder={`What should ${agent.name} do?`} className={`${inputClass} min-h-24`} /><div className="mt-3 flex gap-2"><select className={inputClass} value={priority} onChange={e => setPriority(e.target.value as PriorityLevel)}><option>High</option><option>Medium</option><option>Low</option></select><button onClick={send} className="btn-primary shrink-0"><Send size={16} /> Send Task</button></div></div></GlassCard>
}

function routeWarRoomRequest(request: string, agents: Agent[], preferredAgentId: string) {
  const fallback = agents.find(agent => agent.id === 'strategychief') ?? agents[0]
  if (preferredAgentId !== 'auto') {
    const agent = agents.find(item => item.id === preferredAgentId) ?? fallback
    return { agent, reason: 'Manual override selected from the agent council.', confidence: 100, rule: 'Manual route' }
  }
  const q = request.toLowerCase()
  const prefixed = agents.find(agent => q.startsWith(`${agent.name.toLowerCase()}:`) || q.startsWith(`${agent.id.toLowerCase()}:`))
  if (prefixed) return { agent: prefixed, reason: `Agent prefix matched ${prefixed.name}.`, confidence: 98, rule: 'Agent prefix' }
  if (/(nexora|ai agency|ai audit|automation|dashboard|website|saas|small business|client implementation|workflow build|crm|landing page|funnel|retainer)/.test(q)) return { agent: agents.find(agent => agent.id === 'nexorabuilder') ?? fallback, reason: 'Nexora or AI systems build language detected.', confidence: 92, rule: 'Nexora build keywords' }
  if (/(repair|arv|mao|lao|spread|comps|estimate|deal analysis)/.test(q)) return { agent: agents.find(agent => agent.id === 'dealgenie') ?? fallback, reason: 'Deal analysis, repair, ARV, MAO, or spread language detected.', confidence: 90, rule: 'Deal analysis keywords' }
  if (/(seller|lead|offer|property|wholesale|luxe|mctp|buyer|memphis|indianapolis|columbus|kansas city)/.test(q)) return { agent: agents.find(agent => agent.id === 'dealcloser') ?? fallback, reason: 'Seller, lead, offer, market, or MCTP language detected.', confidence: 88, rule: 'Luxe acquisition keywords' }
  if (/(client|check-in|nutrition|training|workout|get right|fitness|everfit|coach)/.test(q)) return { agent: agents.find(agent => agent.id === 'coachos') ?? fallback, reason: 'Get Right client success or coaching language detected.', confidence: 87, rule: 'Fitness coaching keywords' }
  if (/(content|post|hook|script|caption|newsletter|carousel|youtube|brand)/.test(q)) return { agent: agents.find(agent => agent.id === 'contentforge') ?? fallback, reason: 'Content, brand, script, hook, or publishing language detected.', confidence: 86, rule: 'Content engine keywords' }
  return { agent: fallback, reason: 'No specialist rule matched, so Strategy Chief handles the request.', confidence: request.trim() ? 68 : 0, rule: 'Strategic fallback' }
}

function agentForWarRoomRequest(request: string, agents: Agent[], preferredAgentId: string) {
  return routeWarRoomRequest(request, agents, preferredAgentId).agent
}

function warRoomOutputFor(command: WarRoomCommand) {
  const context = command.contextSnapshot ? ` Context used: ${compactMarkdown(command.contextSnapshot, 360)}` : ''
  if (command.agentId === 'dealcloser') return `Recommended play for ${command.category}: qualify motivation, condition, timeline, and price first. Then send a short seller-facing follow-up with one clear ask, one value point, and one next step. Request: ${command.request}${context}`
  if (command.agentId === 'dealgenie') return `Deal analysis direction: organise ARV, repair range, MAO, LAO, spread, buyer fit, and risk notes before deciding next action. Request: ${command.request}${context}`
  if (command.agentId === 'coachos') return `CoachOS output: keep the coaching voice calm and direct. Turn this into one accountability message, one next action, and one note for future check-ins. Request: ${command.request}${context}`
  if (command.agentId === 'contentforge') return `ContentForge output: build one proof-of-work post, three hooks, and one short CTA. Keep it sharp, specific, and tied to execution. Request: ${command.request}${context}`
  if (command.agentId === 'nexorabuilder') return `Nexora Builder output: define the small-business problem, map the AI workflow, package the offer, list implementation steps, and identify the fastest demo or dashboard proof point. Request: ${command.request}${context}`
  return `Strategy Chief output: define the decision, name the constraint, choose the next best action, and decide what gets killed, delegated, or doubled down. Request: ${command.request}${context}`
}

function noteCategoryForBusiness(category: BusinessCategory): Note['category'] {
  if (category === 'Get Right Fitness') return 'Fitness'
  if (category === 'Luxe Property Solutions') return 'Real Estate'
  if (category === 'AI Systems') return 'AI Ideas'
  if (category === 'Personal Brand') return 'Content Ideas'
  return 'Strategy'
}

function intelCategoryForBusiness(category: BusinessCategory): IntelItem['category'] {
  if (category === 'Get Right Fitness') return 'Fitness Business Intel'
  if (category === 'Luxe Property Solutions') return 'Real Estate Intel'
  if (category === 'Personal Brand') return 'Content Ideas'
  return 'Opportunities'
}

function compactMarkdown(raw = '', max = 280) {
  const clean = raw
    .replace(/^---[\s\S]*?---\s*/m, '')
    .replace(/[#>*_`~\-[\]()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return clean.length > max ? `${clean.slice(0, max).trim()}...` : clean
}

function sentenceChunks(raw: string) {
  return raw
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map(item => item.trim())
    .filter(item => item.length > 35)
}

function analyseYouTubeScript(sourceUrl: string, script: string): YouTubeBlueprint {
  const clean = script.trim()
  const sentences = sentenceChunks(clean)
  const lower = clean.toLowerCase()
  const titleMatch = clean.match(/(?:title|video|topic)\s*[:\-]\s*(.+)/i)
  let videoId = 'Script'
  try {
    videoId = sourceUrl ? new URL(sourceUrl).searchParams.get('v') ?? 'Script' : 'Script'
  } catch {
    videoId = 'Script'
  }
  const keyIdeas = sentences
    .filter(sentence => /(system|dashboard|agent|workflow|automation|memory|task|command|calendar|meeting|sync|router|notification|telegram|voice|backend|database)/i.test(sentence))
    .slice(0, 6)
  const modules = [
    lower.includes('agent') || lower.includes('assistant') ? 'Agent command workflow' : '',
    lower.includes('router') || lower.includes('delegate') ? 'Request router' : '',
    lower.includes('memory') || lower.includes('context') ? 'Shared memory/context layer' : '',
    lower.includes('task') || lower.includes('project') ? 'Task execution pipeline' : '',
    lower.includes('calendar') || lower.includes('meeting') ? 'Calendar/meeting integration' : '',
    lower.includes('telegram') || lower.includes('mobile') ? 'Remote command channel' : '',
    lower.includes('voice') || lower.includes('call') ? 'Voice/meeting room mode' : '',
    lower.includes('notification') || lower.includes('alert') ? 'Completion notifications' : '',
  ].filter(Boolean)
  const fallbackModules = ['Dashboard workflow module', 'War Room command', 'Implementation tasks', 'Reference note']
  const dashboardModules = Array.from(new Set(modules.length ? modules : fallbackModules)).slice(0, 6)
  const title = titleMatch?.[1]?.slice(0, 90) || `YouTube Blueprint - ${videoId}`
  const summary = compactMarkdown(sentences.slice(0, 4).join(' '), 520) || 'Script captured for Nat OS build analysis.'
  const tasks = dashboardModules.map(module => `Build ${module.toLowerCase()} from YouTube blueprint`)
  return {
    id: id('yt-blueprint'),
    sourceUrl,
    title,
    status: 'Analysed',
    summary,
    keyIdeas: (keyIdeas.length ? keyIdeas : sentences.slice(0, 5)).map(item => compactMarkdown(item, 180)),
    dashboardModules,
    tasks,
    agentCommand: `Strategy Chief: Turn "${title}" into a Nat OS build plan. Focus on ${dashboardModules.join(', ')}.`,
    createdAt: new Date().toISOString(),
  }
}

function visibleVaultContextItems(items: VaultContextItem[], focus: BusinessFocus) {
  return items.filter(item => focus === 'All' || item.lane === focus || item.lane === 'All')
}

function buildVaultContextItems(data: VaultData | null, state: NatState): VaultContextItem[] {
  const latestLog = data?.daily?.logs?.[0]
  const recentNotes = state.notes.slice(0, 3)
  return [
    {
      id: 'getright',
      title: 'Get Right Fitness',
      lane: 'Get Right',
      metric: `${data?.getright?.clientCount ?? 0} vault clients`,
      source: 'getright/clients + getright/business',
      summary: 'Online coaching context, client delivery, accountability, training, nutrition, and Get Right offer execution.',
      detail: compactMarkdown(data?.getright?.clients?.map((client: any) => client.name || client.slug || client.path).filter(Boolean).join(', ') || 'Use Coach Nat voice: calm authority, structure over motivation.'),
    },
    {
      id: 'luxe',
      title: 'Luxe Property Solutions',
      lane: 'Luxe',
      metric: `${data?.luxe?.dealCount ?? 0} deals · ${data?.luxe?.hotDeals ?? 0} hot`,
      source: 'luxe/deal-pipeline + daily Luxe tracker',
      summary: 'Wholesale real estate context: Memphis-first seller conversations, MCTP, offers, follow-ups, buyers, and deal analysis.',
      detail: compactMarkdown(data?.luxe?.execTracker || 'Primary workflow: 10+ seller conversations, 3-5 qualified leads, 2-3 offers, and MCTP qualification.'),
    },
    {
      id: 'nexora',
      title: 'Nexora AI',
      lane: 'Nexora',
      metric: 'AI agency + SaaS',
      source: 'nexora/_overview + memory/context/nexora-ai',
      summary: 'AI agency context for dashboards, automations, agents, audits, client workflows, websites, SaaS packaging, and implementation briefs.',
      detail: compactMarkdown(data?.nexora?.overview || 'Helping small businesses compete like enterprises with AI websites, dashboards, agents, automations, and retainers.'),
    },
    {
      id: 'personal-goals',
      title: 'Personal Goals',
      lane: 'Personal',
      metric: 'goal layer',
      source: 'personal/goals',
      summary: 'Personal operating context: physical excellence, financial independence, schedule constraints, family rhythm, and long-game targets.',
      detail: compactMarkdown(data?.personal?.goals || 'Build toward financial independence while protecting training, trading blocks, family time, and execution rhythm.'),
    },
    {
      id: 'daily-logs',
      title: 'Daily Logs',
      lane: 'All',
      metric: `${data?.daily?.logs?.length ?? 0} logs`,
      source: 'daily/logs + 00_inbox',
      summary: 'Recent operating trail from daily logs and inbox captures. Useful for briefings, reviews, next actions, and proof-of-work extraction.',
      detail: compactMarkdown(latestLog?.content || latestLog?.title || latestLog?.path || `${data?.daily?.inboxCount ?? 0} inbox items waiting for processing.`),
    },
    {
      id: 'notes',
      title: 'Nat OS Notes',
      lane: 'All',
      metric: `${state.notes.length} local notes`,
      source: 'Nat OS local notes',
      summary: 'Local dashboard notes, strategy captures, content ideas, and private planning written inside Nat OS.',
      detail: compactMarkdown(recentNotes.map(note => `${note.title}: ${note.content}`).join(' ')),
    },
  ]
}

function contextSnapshotFromItems(items: VaultContextItem[], selectedIds: string[]) {
  const selected = items.filter(item => selectedIds.includes(item.id))
  return selected.map(item => `${item.title} (${item.source}): ${item.summary} ${item.detail}`).join('\n\n')
}

function WarRoomTab({ state, update, focus, data }: { state: NatState; update: (fn: (s: NatState) => NatState) => void; focus: BusinessFocus; data: VaultData | null }) {
  const [request, setRequest] = useState('')
  const [preferredAgentId, setPreferredAgentId] = useState('auto')
  const [priority, setPriority] = useState<PriorityLevel>('High')
  const [category, setCategory] = useState<BusinessCategory>(() => categoryForFocus(focus))
  const [selectedId, setSelectedId] = useState(state.warRoomCommands[0]?.id ?? '')
  const [selectedContextIds, setSelectedContextIds] = useState<string[]>(['getright', 'luxe', 'nexora', 'personal-goals', 'daily-logs', 'notes'])
  const [youtubeUrl, setYoutubeUrl] = useState('https://www.youtube.com/watch?v=_3SEUgRCXX0')
  const [youtubeScript, setYoutubeScript] = useState('')
  const categories: BusinessCategory[] = ['Get Right Fitness', 'Luxe Property Solutions', 'Personal Brand', 'AI Systems', 'Personal']
  const statuses: WarRoomCommandStatus[] = ['Requested', 'Assigned', 'In Progress', 'Completed', 'Archived']
  const contextItems = useMemo(() => buildVaultContextItems(data, state), [data, state])
  const visibleContext = visibleVaultContextItems(contextItems, focus)
  const contextSnapshot = contextSnapshotFromItems(contextItems, selectedContextIds)
  const routePreview = useMemo(() => routeWarRoomRequest(request, state.agents, preferredAgentId), [request, state.agents, preferredAgentId])
  const selected = state.warRoomCommands.find(command => command.id === selectedId) ?? state.warRoomCommands[0]
  const visibleCommands = state.warRoomCommands.filter(command => matchesActionItemFocus({ id: command.id, title: command.request, category: command.category, status: 'Pending', createdDate: command.createdAt }, focus))

  function delegate() {
    const clean = request.trim()
    if (!clean) return
    const agent = agentForWarRoomRequest(clean, state.agents, preferredAgentId)
    const now = new Date().toISOString()
    const command: WarRoomCommand = {
      id: id('war-room'),
      request: clean,
      agentId: agent?.id ?? 'strategychief',
      agentName: agent?.name ?? 'Strategy Chief',
      category,
      priority,
      status: 'Assigned',
      output: '',
      createdAt: now,
      updatedAt: now,
      savedTargets: [],
      contextSnapshot,
    }
    update(current => addActivity({
      ...current,
      warRoomCommands: [command, ...current.warRoomCommands],
      agents: current.agents.map(agentItem => agentItem.id === command.agentId ? {
        ...agentItem,
        status: 'busy',
        lastActive: 'just now',
        activity: [`War Room assigned: ${clean}`, ...agentItem.activity],
        tasks: [{ id: id('agent-task'), text: clean, priority, time: nowTime() }, ...agentItem.tasks],
      } : agentItem),
    }, 'War Room command assigned', `${command.agentName}: ${clean}`, 'war-room'))
    setSelectedId(command.id)
    setRequest('')
  }

  function updateCommand(commandId: string, patch: Partial<WarRoomCommand>) {
    update(current => ({
      ...current,
      warRoomCommands: current.warRoomCommands.map(command => command.id === commandId ? { ...command, ...patch, updatedAt: new Date().toISOString() } : command),
    }))
  }

  function complete(command: WarRoomCommand) {
    const output = command.output.trim() || warRoomOutputFor(command)
    update(current => addActivity({
      ...current,
      warRoomCommands: current.warRoomCommands.map(item => item.id === command.id ? { ...item, status: 'Completed', output, updatedAt: new Date().toISOString() } : item),
      agents: current.agents.map(agent => agent.id === command.agentId ? { ...agent, status: 'online', lastActive: 'just now', activity: [`Completed War Room output: ${command.request}`, ...agent.activity] } : agent),
    }, 'War Room output completed', command.request, 'war-room'))
  }

  function saveTarget(command: WarRoomCommand, target: WarRoomSaveTarget) {
    const output = command.output.trim() || warRoomOutputFor(command)
    update(current => {
      let next: NatState = {
        ...current,
        warRoomCommands: current.warRoomCommands.map(item => item.id === command.id ? { ...item, output, savedTargets: item.savedTargets.includes(target) ? item.savedTargets : [...item.savedTargets, target], updatedAt: new Date().toISOString() } : item),
      }
      if (target === 'Task') next = { ...next, tasks: [{ id: id('task'), title: command.request, description: output, category: command.category, priority: command.priority, createdDate: todayIso(), dueDate: todayIso(), status: 'Backlog', notes: `Created from War Room by ${command.agentName}` }, ...next.tasks] }
      if (target === 'Action Item') next = { ...next, actionItems: [{ id: id('action'), title: command.request, category: command.category, status: 'Pending', createdDate: todayIso() }, ...next.actionItems] }
      if (target === 'Note') next = { ...next, notes: [{ id: id('note'), title: `War Room - ${command.agentName}`, category: noteCategoryForBusiness(command.category), content: `# ${command.request}\n\n${output}`, updatedAt: new Date().toISOString() }, ...next.notes] }
      if (target === 'Intel') next = { ...next, intel: [{ id: id('intel'), title: command.request, summary: output, source: 'War Room', sourceLink: '', dateAdded: todayIso(), category: intelCategoryForBusiness(command.category), importance: command.priority === 'High' ? 'Hot' : 'Notable', notes: `Routed through ${command.agentName}.`, why: 'This came from an agent-council command and may affect execution.', actionNeeded: true }, ...next.intel] }
      if (target === 'Decision') next = { ...next, decisions: [{ id: id('decision'), date: todayIso(), question: command.request, summary: output, agents: [command.agentName], finalDecision: 'Review in Command Review.', status: 'Pending' }, ...next.decisions] }
      return addActivity(next, `War Room saved to ${target}`, command.request, 'war-room')
    })
  }

  function toggleContext(id: string) {
    setSelectedContextIds(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id])
  }

  function buildYouTubeBlueprint() {
    if (!youtubeScript.trim()) return
    const blueprint = analyseYouTubeScript(youtubeUrl, youtubeScript)
    const now = new Date().toISOString()
    const command: WarRoomCommand = {
      id: id('war-room'),
      request: blueprint.agentCommand,
      agentId: 'strategychief',
      agentName: 'Strategy Chief',
      category: 'AI Systems',
      priority: 'High',
      status: 'Assigned',
      output: `Summary:\n${blueprint.summary}\n\nKey ideas:\n${blueprint.keyIdeas.map(item => `- ${item}`).join('\n')}\n\nDashboard modules:\n${blueprint.dashboardModules.map(item => `- ${item}`).join('\n')}`,
      createdAt: now,
      updatedAt: now,
      savedTargets: ['Note', 'Task', 'Intel'],
      contextSnapshot,
    }
    update(current => addActivity({
      ...current,
      youtubeBlueprints: [blueprint, ...(current.youtubeBlueprints ?? [])],
      warRoomCommands: [command, ...current.warRoomCommands],
      tasks: [
        ...blueprint.tasks.map(title => ({ id: id('task'), title, description: blueprint.summary, category: 'AI Systems' as BusinessCategory, priority: 'High' as PriorityLevel, createdDate: todayIso(), dueDate: todayIso(), status: 'Backlog' as ProjectStatus, notes: `Created from ${blueprint.sourceUrl}` })),
        ...current.tasks,
      ],
      notes: [{ id: id('note'), title: blueprint.title, category: 'AI Ideas', content: `# ${blueprint.title}\n\nSource: ${blueprint.sourceUrl}\n\n## Summary\n${blueprint.summary}\n\n## Key Ideas\n${blueprint.keyIdeas.map(item => `- ${item}`).join('\n')}\n\n## Dashboard Modules\n${blueprint.dashboardModules.map(item => `- ${item}`).join('\n')}`, updatedAt: now }, ...current.notes],
      intel: [{ id: id('intel'), title: blueprint.title, summary: blueprint.summary, source: 'YouTube Blueprint', sourceLink: blueprint.sourceUrl, dateAdded: todayIso(), category: 'AI News', importance: 'Hot', notes: 'Converted from pasted YouTube script.', why: 'This may identify reusable workflow patterns for Nat OS.', actionNeeded: true }, ...current.intel],
    }, 'YouTube blueprint analysed', blueprint.title, 'youtube'))
    setSelectedId(command.id)
    setYoutubeScript('')
  }

  return (
    <div className="animate-fade-in-up space-y-5">
      <PageHero icon={ShieldCheck} title="War Room" sub={`${focusLabel(focus)} focus. Agent council, task routing, and save-back workflow.`} quote="Ask once. Route cleanly. Turn output into execution." />
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard icon={ClipboardList} label="Commands" value={state.warRoomCommands.length} sub="delegated requests" />
        <MetricCard icon={Bot} label="Active Agents" value={state.agents.filter(agent => agent.status !== 'offline').length} sub="available council members" accent="cyan" />
        <MetricCard icon={CheckCircle2} label="Completed Outputs" value={state.warRoomCommands.filter(command => command.status === 'Completed').length} sub="ready to save" accent="emerald" />
        <MetricCard icon={ShieldCheck} label="Security Mode" value="Local" sub="dashboard-only v1" accent="amber" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_440px]">
        <GlassCard className="p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold"><Send size={19} /> Main Command Console</h2>
              <p className="mt-1 text-sm text-steel">Submit one clear request. Nat OS routes it to the best agent and tracks the output.</p>
            </div>
            <Badge label="Council Chat" />
          </div>
          <textarea value={request} onChange={event => setRequest(event.target.value)} placeholder="Example: ContentForge: turn today’s seller calls and training into a proof-of-work post." className={`${inputClass} min-h-36`} />
          <div className="mt-4 grid gap-3 md:grid-cols-[1fr_170px_190px_160px]">
            <select value={preferredAgentId} onChange={event => setPreferredAgentId(event.target.value)} className={inputClass}>
              <option value="auto">Auto-route</option>
              {state.agents.map(agent => <option key={agent.id} value={agent.id}>{agent.name}</option>)}
            </select>
            <select value={priority} onChange={event => setPriority(event.target.value as PriorityLevel)} className={inputClass}><option>High</option><option>Medium</option><option>Low</option></select>
            <select value={category} onChange={event => setCategory(event.target.value as BusinessCategory)} className={inputClass}>{categories.map(item => <option key={item}>{item}</option>)}</select>
            <button onClick={delegate} className="btn-primary justify-center"><Send size={16} /> Delegate</button>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-lg font-semibold"><Settings2 size={19} /> War Room Router</h2>
            <Badge label="Plugin" />
          </div>
          <div className="rounded-2xl border border-blue-500/30 bg-blue-600/10 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-200">Recommended Agent</p>
            <div className="mt-3 flex items-start gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-blue-300/20 bg-blue-500/15 text-blue-100">
                <Bot size={21} />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-white">{routePreview.agent?.name ?? 'Strategy Chief'}</h3>
                <p className="mt-1 text-sm leading-6 text-steel">{routePreview.reason}</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/[0.06] bg-black/20 p-3">
                <p className="text-xs text-steel">Confidence</p>
                <p className="mt-1 text-2xl font-semibold text-white">{routePreview.confidence}%</p>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-black/20 p-3">
                <p className="text-xs text-steel">Rule</p>
                <p className="mt-1 text-sm font-semibold text-white">{routePreview.rule}</p>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-3 text-sm text-steel">
            <p><span className="text-white">Agent prefix:</span> start with DealCloser:, CoachOS:, ContentForge:, Strategy Chief:, or Nexora Builder: to force assignment.</p>
            <p><span className="text-white">Specialist routing:</span> Luxe, Get Right, content, deal analysis, Nexora builds, or strategy fallback.</p>
            <p><span className="text-white">Save-back:</span> completed output can become tasks, action items, notes, intel, or decisions.</p>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-5">
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold"><FileText size={19} /> YouTube Blueprint Builder</h2>
            <p className="mt-1 text-sm text-steel">Paste a scraped script or transcript and convert it into Nat OS modules, project tasks, intel, notes, and a War Room command.</p>
          </div>
          <Badge label={`${state.youtubeBlueprints?.length ?? 0} blueprints`} />
        </div>
        <div className="grid gap-4 xl:grid-cols-[1fr_420px]">
          <div className="space-y-3">
            <input value={youtubeUrl} onChange={event => setYoutubeUrl(event.target.value)} placeholder="YouTube URL" className={inputClass} />
            <textarea value={youtubeScript} onChange={event => setYoutubeScript(event.target.value)} placeholder="Paste the scraped YouTube script or transcript here..." className={`${inputClass} min-h-44`} />
            <button onClick={buildYouTubeBlueprint} className="btn-primary"><Sparkles size={16} /> Analyse & Build Into Nat OS</button>
          </div>
          <div className="space-y-3">
            {(state.youtubeBlueprints ?? []).slice(0, 3).map(blueprint => (
              <article key={blueprint.id} className="rounded-2xl border border-white/[0.06] bg-black/20 p-4">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h3 className="line-clamp-2 font-semibold text-white">{blueprint.title}</h3>
                  <Badge label={blueprint.status} />
                </div>
                <p className="line-clamp-3 text-sm leading-6 text-steel">{blueprint.summary}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {blueprint.dashboardModules.slice(0, 3).map(module => <Badge key={module} label={module} />)}
                </div>
              </article>
            ))}
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-5">
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold"><NotebookPen size={19} /> Vault Context Plugin</h2>
            <p className="mt-1 text-sm text-steel">Attach real operating context from the vault and local notes before routing a War Room command.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge label={data ? 'Vault online' : 'Local fallback'} />
            <Badge label={`${selectedContextIds.length} attached`} />
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {visibleContext.map(item => {
            const active = selectedContextIds.includes(item.id)
            return (
              <button key={item.id} onClick={() => toggleContext(item.id)} className={`rounded-2xl border p-4 text-left transition hover:border-blue-500/50 ${active ? 'border-blue-500 bg-blue-600/10 shadow-[0_0_24px_rgba(0,10,255,.18)]' : 'border-white/[0.06] bg-white/[0.025]'}`}>
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    <p className="mt-1 text-xs text-steel">{item.source}</p>
                  </div>
                  {active ? <CheckCircle2 size={18} className="text-blue-200" /> : <Plus size={18} className="text-steel" />}
                </div>
                <div className="mb-3 flex flex-wrap gap-2">
                  <Badge label={item.lane} />
                  <Badge label={item.metric} />
                </div>
                <p className="text-sm leading-6 text-steel">{item.summary}</p>
                <p className="mt-3 line-clamp-2 text-xs leading-5 text-steel/80">{item.detail || 'No detail available yet.'}</p>
              </button>
            )
          })}
        </div>

        <div className="mt-5 rounded-2xl border border-white/[0.06] bg-black/20 p-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">Context Snapshot</p>
            <p className="text-xs text-steel">{contextSnapshot.length} characters</p>
          </div>
          <p className="line-clamp-3 text-sm leading-6 text-steel">{contextSnapshot || 'Select context blocks to brief the router before delegation.'}</p>
        </div>
      </GlassCard>

      <div className="grid gap-5 xl:grid-cols-[480px_1fr]">
        <GlassCard className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Delegation Queue</h2>
            <Badge label={focusLabel(focus)} />
          </div>
          <div className="space-y-3">
            {visibleCommands.length ? visibleCommands.map(command => (
              <button key={command.id} onClick={() => setSelectedId(command.id)} className={`w-full rounded-xl border p-4 text-left transition ${selected?.id === command.id ? 'border-blue-500 bg-blue-600/10' : 'border-white/[0.06] bg-white/[0.025] hover:border-blue-500/40'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-sm font-semibold text-white">{command.request}</p>
                    <p className="mt-2 text-xs text-steel">{command.agentName} · {command.category}</p>
                  </div>
                  <Badge label={command.status} />
                </div>
              </button>
            )) : <EmptyState icon={ShieldCheck} message={`No War Room commands in ${focusLabel(focus)}.`} />}
          </div>
        </GlassCard>

        {selected ? (
          <GlassCard className="p-5">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">{selected.agentName}</h2>
                <p className="mt-1 text-sm leading-6 text-steel">{selected.request}</p>
              </div>
              <div className="flex flex-wrap gap-2"><Badge label={selected.priority} /><Badge label={selected.category} /></div>
            </div>
            {selected.contextSnapshot && (
              <div className="mb-5 rounded-2xl border border-white/[0.06] bg-black/20 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-steel">Attached Vault Context</p>
                <p className="line-clamp-3 text-sm leading-6 text-steel">{selected.contextSnapshot}</p>
              </div>
            )}
            <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
              <div className="space-y-3">
                <Field label="Status">
                  <select value={selected.status} onChange={event => updateCommand(selected.id, { status: event.target.value as WarRoomCommandStatus })} className={inputClass}>{statuses.map(status => <option key={status}>{status}</option>)}</select>
                </Field>
                <button onClick={() => complete(selected)} className="btn-primary w-full justify-center"><CheckCircle2 size={16} /> Complete Output</button>
                <button onClick={() => updateCommand(selected.id, { status: 'Archived' })} className="w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-sm text-steel transition hover:text-white">Archive</button>
              </div>
              <div>
                <Field label="Agent Output">
                  <textarea value={selected.output} onChange={event => updateCommand(selected.id, { output: event.target.value })} placeholder="Complete the command to generate a structured draft, or write your own output here." className={`${inputClass} min-h-48`} />
                </Field>
              </div>
            </div>
            <div className="mt-5 border-t border-white/[0.06] pt-5">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-steel">Save Output To</h3>
              <div className="flex flex-wrap gap-2">
                {(['Task', 'Action Item', 'Note', 'Intel', 'Decision'] as WarRoomSaveTarget[]).map(target => (
                  <button key={target} onClick={() => saveTarget(selected, target)} className={`rounded-xl border px-4 py-2 text-sm transition ${selected.savedTargets.includes(target) ? 'border-emerald-300/30 bg-emerald-400/10 text-emerald-200' : 'border-blue-500/30 bg-blue-600/10 text-blue-200 hover:border-blue-400'}`}>
                    {selected.savedTargets.includes(target) ? <Check size={14} className="mr-1 inline" /> : <Plus size={14} className="mr-1 inline" />}
                    {target}
                  </button>
                ))}
              </div>
            </div>
          </GlassCard>
        ) : <EmptyState icon={ShieldCheck} message="Select or delegate a War Room command." />}
      </div>
    </div>
  )
}

function DecisionModal({ onClose, update, agents }: { onClose: () => void; update: (fn: (s: NatState) => NatState) => void; agents: Agent[] }) {
  const [form, setForm] = useState<ExecutiveDecision>({ id: id('decision'), date: todayIso(), question: '', summary: '', agents: [agents[0]?.name].filter(Boolean), finalDecision: '', status: 'Pending' })
  function save() { if (!form.question.trim()) return; update(s => addActivity({ ...s, decisions: [form, ...s.decisions] }, 'Decision logged', form.question, 'decision')); onClose() }
  return <Modal title="Add Executive Decision" onClose={onClose}><div className="grid gap-4"><Field label="Question asked"><input className={inputClass} value={form.question} onChange={e => setForm({ ...form, question: e.target.value })} /></Field><Field label="Decision summary"><textarea className={inputClass} value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} /></Field><Field label="Final decision"><input className={inputClass} value={form.finalDecision} onChange={e => setForm({ ...form, finalDecision: e.target.value })} /></Field><Field label="Status"><select className={inputClass} value={form.status} onChange={e => setForm({ ...form, status: e.target.value as ExecutiveDecision['status'] })}><option>Decided</option><option>Pending</option><option>Revisit</option></select></Field></div><button onClick={save} className="btn-primary mt-5"><Check size={16} /> Save</button></Modal>
}

function MeetingsTab({ state, update, focus, calendarSync }: { state: NatState; update: (fn: (s: NatState) => NatState) => void; focus: BusinessFocus; calendarSync: CalendarSyncStatus }) {
  const meetings = state.meetings.filter(meeting => matchesMeetingFocus(meeting, focus))
  const [selectedId, setSelectedId] = useState(meetings[0]?.id ?? '')
  const selected = meetings.find(meeting => meeting.id === selectedId) ?? meetings[0] ?? null
  const [open, setOpen] = useState(false)
  const today = todayIso()
  useEffect(() => {
    if (selected && !meetings.some(meeting => meeting.id === selected.id)) setSelectedId(meetings[0]?.id ?? '')
    if (!selected && meetings[0]) setSelectedId(meetings[0].id)
  }, [focus, meetings, selected])
  const todayMeetings = meetings.filter(m => m.date === today && m.status === 'Upcoming')
  const upcoming = meetings.filter(m => m.status === 'Upcoming')
  const archived = meetings.filter(m => m.status !== 'Upcoming' || m.date < today)
  const googleCount = state.meetings.filter(meeting => meeting.source === 'google').length
  return (
    <div className="animate-fade-in-up space-y-5">
      <PageHero icon={CalendarDays} title="Meetings & Calls" sub={`${focusLabel(focus)} focus. Plan. Prepare. Execute. Follow through.`} quote="Clear follow-ups create results." />
      <GlassCard className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm">
        <div className="flex flex-wrap items-center gap-3">
          <span className={`h-2.5 w-2.5 rounded-full ${calendarSync.status === 'synced' ? 'bg-emerald-400' : calendarSync.status === 'offline' ? 'bg-rose-400' : 'bg-amber-300'}`} />
          <span className="font-medium text-white">{calendarSync.message}</span>
          <Badge label={`${calendarSync.imported || googleCount} Google events`} />
          <span className="text-steel">Import-only. Google Calendar stays the source of truth.</span>
        </div>
        <span className="text-xs text-steel">{calendarSync.syncedAt ? `Last import: ${new Date(calendarSync.syncedAt).toLocaleString('en-CA')}` : 'Waiting for calendar snapshot'}</span>
      </GlassCard>
      <GlassCard className="p-5"><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold">Today’s Meetings</h2><button onClick={() => setOpen(true)} className="btn-primary"><Plus size={16} /> Add Meeting</button></div><div className="grid gap-4 lg:grid-cols-3">{todayMeetings.map(m => <MeetingCard key={m.id} meeting={m} onClick={() => setSelectedId(m.id)} />)}</div></GlassCard>
      <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
        <GlassCard className="p-5"><h2 className="mb-4 text-lg font-semibold">Upcoming Meetings</h2><div className="space-y-2">{upcoming.map(m => <button key={m.id} onClick={() => setSelectedId(m.id)} className={`flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left ${selected?.id === m.id ? 'border-blue-500 bg-blue-600/10' : 'border-white/[0.06] bg-white/[0.02]'}`}><div><div className="flex flex-wrap items-center gap-2"><p className="text-sm font-medium">{m.title}</p>{m.source === 'google' && <Badge label="Google" />}</div><p className="text-xs text-steel">{m.date} · {m.time}</p></div><ChevronRight size={16} /></button>)}</div></GlassCard>
        {selected ? <MeetingDetail meeting={selected} update={update} /> : <EmptyState icon={CalendarDays} message="Select a meeting." />}
      </div>
      <GlassCard className="p-5"><h2 className="mb-4 text-lg font-semibold">Past Meetings Archive</h2>{archived.length ? archived.map(m => <div key={m.id} className="border-t border-white/[0.06] py-3 text-sm text-steel">{m.title} · {m.date} · {m.outcome || 'No outcome logged'}</div>) : <p className="text-sm text-steel">No archived meetings yet.</p>}</GlassCard>
      {open && <MeetingModal onClose={() => setOpen(false)} update={update} />}
    </div>
  )
}

function MeetingCard({ meeting, onClick }: { meeting: Meeting; onClick: () => void }) {
  const start = new Date(`${meeting.date}T${meeting.time}:00`)
  const minutes = Math.max(0, Math.round((start.getTime() - Date.now()) / 60000))
  return <button onClick={onClick} className="rounded-2xl border border-blue-500/40 bg-blue-600/10 p-5 text-left shadow-[0_0_28px_rgba(0,10,255,.25)]"><div className="mb-3 flex flex-wrap items-center gap-3"><Badge label={meeting.time} /><span className="text-sm text-steel">{meeting.duration}m</span><Badge label={meeting.type} />{meeting.source === 'google' && <Badge label="Google" />}</div><h3 className="text-lg font-semibold">{meeting.title}</h3><p className="mt-1 text-sm text-steel">{meeting.attendees}</p>{meeting.location && <p className="mt-2 line-clamp-1 text-xs text-blue-200">{meeting.location}</p>}<p className="mt-4 text-sm font-medium text-emerald-300">Starts in {minutes} min</p></button>
}

function MeetingDetail({ meeting, update }: { meeting: Meeting; update: (fn: (s: NatState) => NatState) => void }) {
  const [notes, setNotes] = useState(meeting.notes)
  useEffect(() => setNotes(meeting.notes), [meeting.id, meeting.notes])
  const saveNotes = () => update(s => addActivity({ ...s, meetings: s.meetings.map(m => m.id === meeting.id ? { ...m, notes } : m) }, 'Meeting notes updated', meeting.title, 'meeting'))
  return <GlassCard className="p-5"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><div className="flex flex-wrap items-center gap-2"><h2 className="text-xl font-semibold">{meeting.title}</h2>{meeting.source === 'google' && <Badge label="Google" />}</div><p className="text-sm text-steel">{meeting.date} · {meeting.time} · {meeting.type}</p>{meeting.location && <p className="mt-1 text-xs text-blue-200">{meeting.location}</p>}{meeting.googleUrl && <a href={meeting.googleUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex text-xs font-medium text-blue-300 hover:text-blue-100">Open in Google Calendar</a>}</div><Badge label={meeting.status} /></div><div className="grid gap-4 lg:grid-cols-2"><Panel title="Agenda">{meeting.agenda.length ? meeting.agenda.map(a => <label key={a} className="mb-2 flex gap-2 text-sm text-steel"><input type="checkbox" checked={meeting.completedAgenda.includes(a)} onChange={() => update(s => ({ ...s, meetings: s.meetings.map(m => m.id === meeting.id ? { ...m, completedAgenda: m.completedAgenda.includes(a) ? m.completedAgenda.filter(x => x !== a) : [...m.completedAgenda, a] } : m) }))} className="accent-blue-600" /> {a}</label>) : <p className="text-sm text-steel">No agenda yet. Add your prep notes locally.</p>}</Panel><Panel title="Prep Notes"><p className="whitespace-pre-line text-sm leading-6 text-steel">{meeting.prepNotes || 'No prep notes imported.'}</p></Panel><Panel title="My Notes"><textarea value={notes} onChange={e => setNotes(e.target.value)} onBlur={saveNotes} className={`${inputClass} min-h-28`} /></Panel><Panel title="Action Items">{meeting.actionItems.length ? meeting.actionItems.map(a => <label key={a} className="mb-2 flex gap-2 text-sm text-steel"><input type="checkbox" checked={meeting.completedActions.includes(a)} onChange={() => update(s => ({ ...s, meetings: s.meetings.map(m => m.id === meeting.id ? { ...m, completedActions: m.completedActions.includes(a) ? m.completedActions.filter(x => x !== a) : [...m.completedActions, a] } : m) }))} className="accent-blue-600" /> {a}</label>) : <p className="text-sm text-steel">No action items yet.</p>}</Panel></div></GlassCard>
}

function MeetingModal({ onClose, update }: { onClose: () => void; update: (fn: (s: NatState) => NatState) => void }) {
  const [form, setForm] = useState<Meeting>({ id: id('meeting'), title: '', date: todayIso(), time: '09:00', duration: 30, attendees: '', type: 'Call', category: 'Other', prepNotes: '', status: 'Upcoming', agenda: [], completedAgenda: [], notes: '', actionItems: [], completedActions: [], outcome: '', source: 'local', syncStatus: 'local-only' })
  function save() { if (!form.title.trim()) return; update(s => addActivity({ ...s, meetings: [...s.meetings, form] }, 'Meeting added', form.title, 'meeting')); onClose() }
  return <Modal title="Add Meeting" onClose={onClose}><div className="grid gap-4 sm:grid-cols-2"><Field label="Title"><input className={inputClass} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></Field><Field label="Attendees"><input className={inputClass} value={form.attendees} onChange={e => setForm({ ...form, attendees: e.target.value })} /></Field><Field label="Date"><input type="date" className={inputClass} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></Field><Field label="Time"><input type="time" className={inputClass} value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} /></Field><Field label="Type"><select className={inputClass} value={form.type} onChange={e => setForm({ ...form, type: e.target.value as Meeting['type'] })}><option>Call</option><option>Zoom</option><option>In-person</option><option>Internal</option></select></Field><Field label="Category"><select className={inputClass} value={form.category} onChange={e => setForm({ ...form, category: e.target.value as Meeting['category'] })}><option>Fitness</option><option>Real Estate</option><option>AI</option><option>Personal</option><option>Other</option></select></Field><div className="sm:col-span-2"><Field label="Prep notes"><textarea className={inputClass} value={form.prepNotes} onChange={e => setForm({ ...form, prepNotes: e.target.value })} /></Field></div></div><button onClick={save} className="btn-primary mt-5"><Check size={16} /> Save</button></Modal>
}

function IntelTab({ state, update, focus }: { state: NatState; update: (fn: (s: NatState) => NatState) => void; focus: BusinessFocus }) {
  const [category, setCategory] = useState('All')
  const [importance, setImportance] = useState('All')
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const focusedIntel = state.intel.filter(item => matchesIntelFocus(item, focus))
  const filtered = focusedIntel.filter(i => (category === 'All' || i.category === category) && (importance === 'All' || i.importance === importance) && `${i.title} ${i.summary}`.toLowerCase().includes(query.toLowerCase()))
  const brief = [...focusedIntel].sort((a, b) => ({ Hot: 3, Notable: 2, Reference: 1 }[b.importance] - { Hot: 3, Notable: 2, Reference: 1 }[a.importance])).slice(0, 4)
  const cats = ['All', 'AI News', 'Industry Trends', 'Competitor Watch', 'Opportunities', 'Real Estate Intel', 'Fitness Business Intel', 'Content Ideas']
  return <div className="animate-fade-in-up space-y-5"><GlassCard className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between"><div><h1 className="flex items-center gap-2 text-2xl font-semibold"><Radio /> Daily Brief</h1><p className="mt-1 text-sm text-steel">{focusLabel(focus)} focus. Top intel, insights, and signals to help you move first.</p></div><div className="flex flex-wrap gap-2"><select className={inputClass} value={category} onChange={e => setCategory(e.target.value)}>{cats.map(c => <option key={c}>{c}</option>)}</select><select className={inputClass} value={importance} onChange={e => setImportance(e.target.value)}><option>All</option><option>Hot</option><option>Notable</option><option>Reference</option></select><input className={inputClass} value={query} onChange={e => setQuery(e.target.value)} placeholder="Search intel" /><button onClick={() => setOpen(true)} className="btn-primary"><Plus size={16} /> Add Intel</button></div></GlassCard><GlassCard className="p-5"><h2 className="mb-4 text-lg font-semibold">Top Intel</h2><div className="grid gap-4 lg:grid-cols-4">{brief.length ? brief.map((i, index) => <IntelCard key={i.id} item={i} index={index + 1} />) : <EmptyState icon={Radio} message={`No top intel in ${focusLabel(focus)}.`} />}</div></GlassCard><div className="grid gap-4 lg:grid-cols-3">{filtered.map(i => <IntelCard key={i.id} item={i} onDelete={() => update(s => ({ ...s, intel: s.intel.filter(x => x.id !== i.id) }))} />)}</div><QuickCapture update={update} />{open && <IntelModal onClose={() => setOpen(false)} update={update} />}</div>
}

function IntelCard({ item, index, onDelete }: { item: IntelItem; index?: number; onDelete?: () => void }) {
  return <GlassCard className="p-4"><div className="mb-3 flex items-center justify-between"><span className="text-sm text-steel">{index ? `#${index}` : item.category}</span><Badge label={item.importance} /></div><h3 className="text-lg font-semibold">{item.title}</h3><p className="mt-3 text-sm leading-6 text-steel">{item.summary}</p><p className="mt-3 text-xs text-blue-300">Why this matters: {item.why}</p><div className="mt-4 flex items-center justify-between text-xs text-steel"><span>{item.dateAdded}</span>{onDelete && <IconButton label="Delete intel" onClick={onDelete}><Trash2 size={16} /></IconButton>}</div></GlassCard>
}

function IntelModal({ onClose, update }: { onClose: () => void; update: (fn: (s: NatState) => NatState) => void }) {
  const [form, setForm] = useState<IntelItem>({ id: id('intel'), title: '', summary: '', source: '', sourceLink: '', dateAdded: todayIso(), category: 'AI News', importance: 'Notable', notes: '', why: '', actionNeeded: false })
  function save() { if (!form.title.trim()) return; update(s => addActivity({ ...s, intel: [form, ...s.intel] }, 'Intel item saved', form.title, 'intel')); onClose() }
  return <Modal title="Add Intel" onClose={onClose}><div className="grid gap-4"><Field label="Title"><input className={inputClass} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></Field><Field label="Summary"><textarea className={inputClass} value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} /></Field><Field label="Why this matters"><input className={inputClass} value={form.why} onChange={e => setForm({ ...form, why: e.target.value })} /></Field><Field label="Category"><select className={inputClass} value={form.category} onChange={e => setForm({ ...form, category: e.target.value as IntelItem['category'] })}><option>AI News</option><option>Industry Trends</option><option>Competitor Watch</option><option>Opportunities</option><option>Real Estate Intel</option><option>Fitness Business Intel</option><option>Content Ideas</option></select></Field><Field label="Importance"><select className={inputClass} value={form.importance} onChange={e => setForm({ ...form, importance: e.target.value as IntelItem['importance'] })}><option>Hot</option><option>Notable</option><option>Reference</option></select></Field></div><button onClick={save} className="btn-primary mt-5"><Check size={16} /> Save</button></Modal>
}

function TimelineTab({ state, update }: { state: NatState; update: (fn: (s: NatState) => NatState) => void }) {
  const total = state.timeline.flatMap(p => p.milestones)
  const pct = Math.round((total.filter(m => m.done).length / total.length) * 100)
  const days = Math.max(0, Math.ceil((goalDate.getTime() - Date.now()) / 86400000))
  return <div className="animate-fade-in-up space-y-5"><PageHero icon={Flag} title="Roadmap to Jan 1, 2027" sub="Strategic timeline to $1M+ annualised revenue." quote="The best way to predict the future is to build it." /><div className="grid gap-5 xl:grid-cols-[1fr_360px]"><div className="space-y-5">{state.timeline.map((phase, index) => { const phasePct = Math.round((phase.milestones.filter(m => m.done).length / phase.milestones.length) * 100); return <GlassCard key={phase.id} className={`p-6 ${phase.current ? 'border-blue-500 shadow-[0_0_32px_rgba(0,10,255,.25)]' : ''}`}><div className="grid gap-5 lg:grid-cols-[1fr_180px_1fr] lg:items-center"><div><p className="text-sm font-semibold text-blue-300">PHASE {String(index + 1).padStart(2, '0')}</p><h2 className="mt-2 text-2xl font-semibold">{phase.title}</h2><p className="mt-1 text-steel">{phase.range}</p><p className="mt-4 leading-7 text-steel">{phase.description}</p></div><ProgressRing value={phasePct} label="Complete" size={150} /><div>{phase.milestones.map(m => <label key={m.id} className="mb-2 flex gap-3 text-sm text-steel"><input type="checkbox" checked={m.done} onChange={() => update(s => ({ ...s, timeline: s.timeline.map(p => p.id === phase.id ? { ...p, milestones: p.milestones.map(item => item.id === m.id ? { ...item, done: !item.done } : item) } : p) }))} className="accent-blue-600" /> {m.title}</label>)}</div></div></GlassCard> })}</div><div className="space-y-5"><GlassCard className="p-6"><h2 className="mb-5 text-lg font-semibold">Roadmap Progress</h2><ProgressRing value={pct} label="Overall" size={220} /></GlassCard><GlassCard className="p-6"><h2 className="mb-4 text-lg font-semibold">Goal Countdown</h2><p className="text-5xl font-semibold">{days}</p><p className="mt-2 text-steel">Days to Jan 1, 2027</p></GlassCard></div></div></div>
}

function splitPriorityLines(value: string) {
  return value
    .split('\n')
    .map(line => line.replace(/^[-*\d.)\s]+/, '').trim())
    .filter(Boolean)
    .slice(0, 5)
}

function CommandReviewTab({ state, update }: { state: NatState; update: (fn: (s: NatState) => NatState) => void }) {
  const latest = state.commandReviews[0]
  const [date, setDate] = useState(todayIso())
  const [movedRevenue, setMovedRevenue] = useState(latest?.movedRevenue ?? '')
  const [stalled, setStalled] = useState(latest?.stalled ?? '')
  const [killDelegateDouble, setKillDelegateDouble] = useState(latest?.killDelegateDouble ?? '')
  const [priorityText, setPriorityText] = useState((latest?.priorities ?? ['', '', '', '', '']).join('\n'))
  const topPriorities = splitPriorityLines(priorityText)

  function saveReview(commitPriorities = false) {
    const review: CommandReview = {
      id: id('review'),
      date,
      movedRevenue,
      stalled,
      killDelegateDouble,
      priorities: topPriorities,
      createdAt: new Date().toISOString(),
    }

    update(s => {
      const nextPriorities = commitPriorities
        ? topPriorities.map((title, index): Priority => ({
            id: id('priority'),
            title,
            category: index === 0 ? 'Luxe Property Solutions' : index === 1 ? 'Get Right Fitness' : index === 2 ? 'Personal Brand' : index === 3 ? 'AI Systems' : 'Personal',
            done: false,
            due: 'Next week',
          }))
        : s.priorities

      return addActivity({
        ...s,
        commandReviews: [review, ...s.commandReviews].slice(0, 12),
        priorities: nextPriorities,
      }, commitPriorities ? 'Command review committed' : 'Command review saved', commitPriorities ? 'Top 5 next-week priorities pushed into execution.' : `Weekly review saved for ${date}.`, 'review')
    })
  }

  function loadReview(review: CommandReview) {
    setDate(review.date)
    setMovedRevenue(review.movedRevenue)
    setStalled(review.stalled)
    setKillDelegateDouble(review.killDelegateDouble)
    setPriorityText(review.priorities.join('\n'))
  }

  return (
    <div className="animate-fade-in-up space-y-5">
      <PageHero icon={FileText} title="Command Review" sub="Weekly decision screen for revenue, bottlenecks, leverage, and next-week execution." quote="Review the week. Choose the next play. Move clean." />
      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <GlassCard className="p-5">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Weekly Review</h2>
              <p className="mt-1 text-sm text-steel">Answer the four questions. Keep it honest and operational.</p>
            </div>
            <Field label="Review date">
              <input type="date" className={inputClass} value={date} onChange={e => setDate(e.target.value)} />
            </Field>
          </div>

          <div className="grid gap-4">
            <Field label="What moved revenue?">
              <textarea className={`${inputClass} min-h-32`} value={movedRevenue} onChange={e => setMovedRevenue(e.target.value)} placeholder="Calls booked, offers sent, client conversions, content that created demand..." />
            </Field>
            <Field label="What stalled?">
              <textarea className={`${inputClass} min-h-32`} value={stalled} onChange={e => setStalled(e.target.value)} placeholder="Bottlenecks, missed targets, unclear ownership, low-leverage work..." />
            </Field>
            <Field label="What gets killed, delegated, or doubled down?">
              <textarea className={`${inputClass} min-h-32`} value={killDelegateDouble} onChange={e => setKillDelegateDouble(e.target.value)} placeholder="Kill distractions. Delegate repeatable work. Double down on the highest income activities." />
            </Field>
            <Field label="Top 5 next-week priorities">
              <textarea className={`${inputClass} min-h-40`} value={priorityText} onChange={e => setPriorityText(e.target.value)} placeholder={'1. Make 50 seller calls\n2. Book 3 seller appointments\n3. Publish 5 proof-of-work posts\n4. Finish Get Right offer cleanup\n5. Build one lead automation'} />
            </Field>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button onClick={() => saveReview(false)} className="btn-primary"><Check size={16} /> Save Review</button>
            <button onClick={() => saveReview(true)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-500/40 bg-blue-600/10 px-4 py-2.5 text-sm font-semibold text-blue-100 transition hover:border-blue-400 hover:bg-blue-600/20">
              <Target size={16} /> Commit Top 5
            </button>
          </div>
        </GlassCard>

        <div className="space-y-5">
          <GlassCard className="p-5">
            <h2 className="mb-4 text-lg font-semibold">Next Week’s Top 5</h2>
            <div className="space-y-2">
              {topPriorities.length ? topPriorities.map((priority, index) => (
                <div key={`${priority}-${index}`} className="flex gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-blue-600/20 text-sm font-semibold text-blue-100">{index + 1}</span>
                  <p className="text-sm leading-6 text-white">{priority}</p>
                </div>
              )) : <EmptyState icon={Target} message="Add up to five next-week priorities." />}
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <h2 className="mb-4 text-lg font-semibold">Saved Reviews</h2>
            <div className="space-y-3">
              {state.commandReviews.length ? state.commandReviews.map(review => (
                <button key={review.id} onClick={() => loadReview(review)} className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-left transition hover:border-blue-500/40">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="font-semibold text-white">{review.date}</span>
                    <Badge label={`${review.priorities.length} priorities`} />
                  </div>
                  <p className="line-clamp-2 text-sm text-steel">{review.movedRevenue || 'No revenue movement logged yet.'}</p>
                </button>
              )) : <EmptyState icon={FileText} message="No command reviews saved yet." />}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}

type WorkspaceDatabase = 'Tasks' | 'Clients' | 'Meetings' | 'Notes' | 'Intel' | 'Subscriptions'

function focusToTaskCategory(focus: BusinessFocus): BusinessCategory {
  if (focus === 'Get Right') return 'Get Right Fitness'
  if (focus === 'Luxe') return 'Luxe Property Solutions'
  if (focus === 'Nexora') return 'AI Systems'
  if (focus === 'Personal Brand') return 'Personal Brand'
  return 'Personal'
}

function templateNoteCategory(template: WorkspaceTemplate): Note['category'] {
  if (template.category === 'Get Right') return 'Fitness'
  if (template.category === 'Luxe') return 'Real Estate'
  if (template.category === 'Nexora') return 'AI Ideas'
  if (template.category === 'Personal Brand') return 'Content Ideas'
  if (template.type === 'Review') return 'Daily Review'
  return 'Strategy'
}

function WorkspaceTab({ state, update, focus, setView }: { state: NatState; update: (fn: (s: NatState) => NatState) => void; focus: BusinessFocus; setView: (view: TabId) => void }) {
  const [database, setDatabase] = useState<WorkspaceDatabase>('Tasks')
  const [query, setQuery] = useState('')
  const [captureType, setCaptureType] = useState<WorkspaceTemplateType>('Task')
  const [capture, setCapture] = useState('')
  const [showSubscription, setShowSubscription] = useState(false)
  const scopedTasks = state.tasks.filter(task => matchesTaskFocus(task, focus))
  const scopedMeetings = state.meetings.filter(meeting => matchesMeetingFocus(meeting, focus))
  const scopedNotes = state.notes.filter(note => matchesNoteFocus(note, focus))
  const scopedIntel = state.intel.filter(item => matchesIntelFocus(item, focus))
  const scopedSubscriptions = state.subscriptions.filter(item => focus === 'All' || item.category === focus)
  const monthlySpend = scopedSubscriptions.reduce((sum, item) => sum + item.monthlyCost, 0)
  const cancelSavings = scopedSubscriptions.filter(item => item.status === 'Cancel').reduce((sum, item) => sum + item.monthlyCost, 0)
  const upcomingRenewals = [...scopedSubscriptions].sort((a, b) => a.renewalDate.localeCompare(b.renewalDate)).slice(0, 3)
  const relationCards = [
    { title: 'Tasks linked to today', value: scopedTasks.filter(task => task.dueDate <= todayIso() && task.status !== 'Done').length, detail: 'Open due items', icon: ClipboardList },
    { title: 'Meetings with actions', value: scopedMeetings.filter(meeting => meeting.actionItems.length > meeting.completedActions.length).length, detail: 'Need follow-up', icon: CalendarDays },
    { title: 'Notes in this lane', value: scopedNotes.length, detail: 'Private context records', icon: NotebookPen },
    { title: 'Intel with action', value: scopedIntel.filter(item => item.actionNeeded).length, detail: 'Signals to process', icon: Radio },
  ]

  function textMatch(...parts: string[]) {
    const q = query.trim().toLowerCase()
    if (!q) return true
    return parts.join(' ').toLowerCase().includes(q)
  }

  function addCapture() {
    const title = capture.trim()
    if (!title) return
    update(s => {
      if (captureType === 'Task' || captureType === 'Lead') {
        const task: ProjectTask = {
          id: id('task'),
          title,
          description: captureType === 'Lead' ? 'New lead captured from Workspace inbox.' : 'Captured from Workspace inbox.',
          category: captureType === 'Lead' ? 'Luxe Property Solutions' : focusToTaskCategory(focus),
          priority: captureType === 'Lead' ? 'High' : 'Medium',
          createdDate: todayIso(),
          dueDate: todayIso(),
          status: 'Backlog',
          notes: '',
        }
        return addActivity({ ...s, tasks: [task, ...s.tasks] }, `${captureType} captured`, title, 'workspace')
      }
      if (captureType === 'Meeting') {
        const meeting: Meeting = {
          id: id('meeting'),
          title,
          date: todayIso(),
          time: '12:00',
          duration: 30,
          attendees: 'Nat',
          type: 'Internal',
          category: focus === 'Get Right' ? 'Fitness' : focus === 'Luxe' ? 'Real Estate' : focus === 'Nexora' ? 'AI' : focus === 'Personal' ? 'Personal' : 'Other',
          prepNotes: 'Captured from Workspace inbox.',
          status: 'Upcoming',
          agenda: [],
          completedAgenda: [],
          notes: '',
          actionItems: [],
          completedActions: [],
          outcome: '',
          source: 'local',
          syncStatus: 'local-only',
        }
        return addActivity({ ...s, meetings: [meeting, ...s.meetings] }, 'Meeting captured', title, 'workspace')
      }
      if (captureType === 'Content') {
        const article: ContentArticle = {
          id: id('article'),
          title,
          lane: focus === 'All' ? 'Personal Brand' : focus,
          sourceUrl: 'workspace-capture',
          seoKeyword: '',
          excerpt: 'Captured as a content idea from Workspace.',
          publishedAt: todayIso(),
        }
        return addActivity({ ...s, contentArticles: [article, ...s.contentArticles] }, 'Content idea captured', title, 'workspace')
      }
      const note: Note = {
        id: id('note'),
        title,
        category: captureType === 'Review' ? 'Daily Review' : 'Strategy',
        content: captureType === 'Review' ? '# Review\n\n## What moved\n\n## What stalled\n\n## Next action\n' : '',
        updatedAt: new Date().toISOString(),
      }
      return addActivity({ ...s, notes: [note, ...s.notes], settings: { ...s.settings, activeNoteId: note.id } }, 'Note captured', title, 'workspace')
    })
    setCapture('')
  }

  function useTemplate(template: WorkspaceTemplate) {
    update(s => {
      if (template.type === 'Task' || template.type === 'Lead' || template.type === 'Content') {
        const task: ProjectTask = {
          id: id('task'),
          title: template.name,
          description: template.description,
          category: template.type === 'Lead' ? 'Luxe Property Solutions' : focusToTaskCategory(template.category),
          priority: template.type === 'Lead' ? 'High' : 'Medium',
          createdDate: todayIso(),
          dueDate: todayIso(),
          status: 'Backlog',
          notes: template.body,
        }
        return addActivity({ ...s, tasks: [task, ...s.tasks] }, 'Template launched', `${template.name} added to Projects.`, 'template')
      }
      if (template.type === 'Meeting') {
        const meeting: Meeting = {
          id: id('meeting'),
          title: template.name,
          date: todayIso(),
          time: '12:00',
          duration: 30,
          attendees: 'Nat',
          type: 'Internal',
          category: template.category === 'Get Right' ? 'Fitness' : template.category === 'Luxe' ? 'Real Estate' : template.category === 'Nexora' ? 'AI' : template.category === 'Personal' ? 'Personal' : 'Other',
          prepNotes: template.body,
          status: 'Upcoming',
          agenda: [],
          completedAgenda: [],
          notes: '',
          actionItems: [],
          completedActions: [],
          outcome: '',
          source: 'local',
          syncStatus: 'local-only',
        }
        return addActivity({ ...s, meetings: [meeting, ...s.meetings] }, 'Template launched', `${template.name} added to Meetings.`, 'template')
      }
      const note: Note = {
        id: id('note'),
        title: template.name,
        category: templateNoteCategory(template),
        content: template.body,
        updatedAt: new Date().toISOString(),
      }
      return addActivity({ ...s, notes: [note, ...s.notes], settings: { ...s.settings, activeNoteId: note.id } }, 'Template launched', `${template.name} added to Notes.`, 'template')
    })
  }

  return (
    <div className="animate-fade-in-up space-y-5">
      <PageHero icon={Database} title="Workspace" sub={`${focusLabel(focus)} Notion replacement layer: databases, templates, relations, capture, and subscriptions.`} quote="One source of truth. No subscription tax." />

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard icon={Database} label="Database Records" value={scopedTasks.length + state.clients.length + scopedMeetings.length + scopedNotes.length + scopedIntel.length} sub="Tasks, clients, meetings, notes, and intel" />
        <MetricCard icon={Link2} label="Relations" value={relationCards.reduce((sum, card) => sum + card.value, 0)} sub="Items connected to action" />
        <MetricCard icon={CircleDollarSign} label="Monthly Tools" value={money(monthlySpend)} sub={`${money(cancelSavings)} marked to cancel`} />
        <MetricCard icon={Zap} label="Templates" value={state.templates.length} sub="Reusable operating plays" />
      </div>

      <GlassCard className="p-5">
        <div className="grid gap-3 lg:grid-cols-[170px_1fr_160px_auto]">
          <select value={captureType} onChange={e => setCaptureType(e.target.value as WorkspaceTemplateType)} className={inputClass}>
            <option>Task</option>
            <option>Note</option>
            <option>Meeting</option>
            <option>Lead</option>
            <option>Content</option>
            <option>Review</option>
          </select>
          <input value={capture} onChange={e => setCapture(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addCapture() }} className={inputClass} placeholder="Capture anything: task, lead, meeting, note, content idea, or review..." />
          <button onClick={() => setShowSubscription(true)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-steel transition hover:border-blue-500/50 hover:text-white"><Plus size={16} /> Subscription</button>
          <button onClick={addCapture} className="btn-primary"><Plus size={16} /> Capture</button>
        </div>
      </GlassCard>

      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <GlassCard className="p-5">
          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {(['Tasks', 'Clients', 'Meetings', 'Notes', 'Intel', 'Subscriptions'] as WorkspaceDatabase[]).map(item => (
                <button key={item} onClick={() => setDatabase(item)} className={`rounded-xl border px-3 py-2 text-sm transition ${database === item ? 'border-blue-500 bg-blue-600/15 text-white' : 'border-white/10 bg-white/[0.025] text-steel hover:text-white'}`}>{item}</button>
              ))}
            </div>
            <div className="relative min-w-[260px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-steel" />
              <input value={query} onChange={e => setQuery(e.target.value)} className={`${inputClass} pl-9`} placeholder={`Search ${database.toLowerCase()}...`} />
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/[0.06]">
            {database === 'Tasks' && <WorkspaceTable headers={['Task', 'Lane', 'Status', 'Priority', 'Due']}>{scopedTasks.filter(item => textMatch(item.title, item.category, item.status)).map(item => <tr key={item.id}><td>{item.title}<p className="mt-1 text-xs text-steel">{item.description}</p></td><td><Badge label={item.category} /></td><td><Badge label={item.status} /></td><td><Badge label={item.priority} /></td><td>{item.dueDate}</td></tr>)}</WorkspaceTable>}
            {database === 'Clients' && <WorkspaceTable headers={['Client / Revenue Row', 'Category', 'Status', 'Monthly Value', 'Start']}>{state.clients.filter(item => textMatch(item.name, item.category, item.status)).map(item => <tr key={item.id}><td>{item.name}<p className="mt-1 text-xs text-steel">{item.notes}</p></td><td>{item.category}</td><td><Badge label={item.status} /></td><td>{money(item.monthlyValue)}</td><td>{item.startDate}</td></tr>)}</WorkspaceTable>}
            {database === 'Meetings' && <WorkspaceTable headers={['Meeting', 'Category', 'Status', 'Date', 'Actions']}>{scopedMeetings.filter(item => textMatch(item.title, item.category, item.status)).map(item => <tr key={item.id}><td>{item.title}<p className="mt-1 text-xs text-steel">{item.source === 'google' ? 'Google Calendar' : item.attendees}</p></td><td>{item.category}</td><td><Badge label={item.status} /></td><td>{item.date} {item.time}</td><td>{item.completedActions.length}/{item.actionItems.length}</td></tr>)}</WorkspaceTable>}
            {database === 'Notes' && <WorkspaceTable headers={['Note', 'Category', 'Updated', 'Words', 'Open']}>{scopedNotes.filter(item => textMatch(item.title, item.category, item.content)).map(item => <tr key={item.id}><td>{item.title}<p className="mt-1 line-clamp-1 text-xs text-steel">{item.content}</p></td><td><Badge label={item.category} /></td><td>{new Date(item.updatedAt).toLocaleDateString('en-CA')}</td><td>{item.content.split(/\s+/).filter(Boolean).length}</td><td><button onClick={() => { update(s => ({ ...s, settings: { ...s.settings, activeNoteId: item.id } })); setView('notes') }} className="text-blue-300">Open</button></td></tr>)}</WorkspaceTable>}
            {database === 'Intel' && <WorkspaceTable headers={['Intel', 'Category', 'Importance', 'Date', 'Action']}>{scopedIntel.filter(item => textMatch(item.title, item.category, item.importance)).map(item => <tr key={item.id}><td>{item.title}<p className="mt-1 line-clamp-1 text-xs text-steel">{item.summary}</p></td><td>{item.category}</td><td><Badge label={item.importance} /></td><td>{item.dateAdded}</td><td>{item.actionNeeded ? 'Needed' : 'Reference'}</td></tr>)}</WorkspaceTable>}
            {database === 'Subscriptions' && <WorkspaceTable headers={['Tool', 'Lane', 'Status', 'Monthly', 'Renewal']}>{scopedSubscriptions.filter(item => textMatch(item.name, item.category, item.status, item.notes)).map(item => <tr key={item.id}><td>{item.name}<p className="mt-1 text-xs text-steel">{item.notes}</p></td><td><Badge label={item.category} /></td><td><Badge label={item.status} /></td><td>{money(item.monthlyCost)}</td><td>{item.renewalDate}</td></tr>)}</WorkspaceTable>}
          </div>
        </GlassCard>

        <div className="space-y-5">
          <GlassCard className="p-5">
            <h2 className="mb-4 text-lg font-semibold">Relations</h2>
            <div className="grid gap-3">
              {relationCards.map(card => {
                const Icon = card.icon
                return <div key={card.title} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600/15 text-blue-200"><Icon size={18} /></div><div className="min-w-0 flex-1"><div className="text-sm font-semibold text-white">{card.title}</div><div className="text-xs text-steel">{card.detail}</div></div><div className="text-xl font-semibold text-white">{card.value}</div></div>
              })}
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Templates</h2>
              <Badge label={`${state.templates.length} plays`} />
            </div>
            <div className="space-y-3">
              {state.templates.filter(template => focus === 'All' || template.category === focus).map(template => (
                <button key={template.id} onClick={() => useTemplate(template)} className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-left transition hover:border-blue-500/40">
                  <div className="mb-2 flex items-center justify-between gap-3"><h3 className="font-semibold text-white">{template.name}</h3><Badge label={template.type} /></div>
                  <p className="text-sm leading-6 text-steel">{template.description}</p>
                </button>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <h2 className="mb-4 text-lg font-semibold">Renewal Watch</h2>
            <div className="space-y-3">
              {upcomingRenewals.map(item => <div key={item.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3"><div className="flex items-center justify-between"><span className="font-semibold">{item.name}</span><Badge label={item.status} /></div><div className="mt-2 flex items-center justify-between text-sm text-steel"><span>{item.renewalDate}</span><span>{money(item.monthlyCost)}/mo</span></div></div>)}
            </div>
          </GlassCard>
        </div>
      </div>

      {showSubscription && <SubscriptionModal onClose={() => setShowSubscription(false)} update={update} focus={focus} />}
    </div>
  )
}

function WorkspaceTable({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <table className="w-full min-w-[760px] text-left text-sm">
      <thead className="border-b border-white/[0.06] bg-white/[0.025] text-xs uppercase tracking-wide text-steel">
        <tr>{headers.map(header => <th key={header} className="px-4 py-3 font-medium">{header}</th>)}</tr>
      </thead>
      <tbody className="divide-y divide-white/[0.06] text-white [&_td]:px-4 [&_td]:py-3">{children}</tbody>
    </table>
  )
}

function SubscriptionModal({ onClose, update, focus }: { onClose: () => void; update: (fn: (s: NatState) => NatState) => void; focus: BusinessFocus }) {
  const [form, setForm] = useState<SubscriptionItem>({ id: id('sub'), name: '', category: focus === 'All' ? 'Personal' : focus, monthlyCost: 0, renewalDate: todayIso(), status: 'Review', notes: '' })
  function save() {
    if (!form.name.trim()) return
    update(s => addActivity({ ...s, subscriptions: [form, ...s.subscriptions] }, 'Subscription added', `${form.name} added to Workspace.`, 'subscription'))
    onClose()
  }
  return (
    <Modal title="Add Subscription" onClose={onClose}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Tool / Subscription"><input className={inputClass} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></Field>
        <Field label="Lane"><select className={inputClass} value={form.category} onChange={e => setForm({ ...form, category: e.target.value as BusinessFocus })}>{focusOptions.filter(option => option !== 'All').map(option => <option key={option}>{option}</option>)}</select></Field>
        <Field label="Monthly cost (CAD)"><input type="number" className={inputClass} value={form.monthlyCost} onChange={e => setForm({ ...form, monthlyCost: Number(e.target.value) })} /></Field>
        <Field label="Renewal date"><input type="date" className={inputClass} value={form.renewalDate} onChange={e => setForm({ ...form, renewalDate: e.target.value })} /></Field>
        <Field label="Status"><select className={inputClass} value={form.status} onChange={e => setForm({ ...form, status: e.target.value as SubscriptionStatus })}><option>Keep</option><option>Cancel</option><option>Review</option></select></Field>
        <Field label="Notes"><input className={inputClass} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></Field>
      </div>
      <button onClick={save} className="btn-primary mt-5"><Check size={16} /> Save Subscription</button>
    </Modal>
  )
}

function NotesTab({ state, update, focus }: { state: NatState; update: (fn: (s: NatState) => NatState) => void; focus: BusinessFocus }) {
  const notes = state.notes.filter(note => matchesNoteFocus(note, focus))
  const active = notes.find(n => n.id === state.settings.activeNoteId) ?? notes[0] ?? state.notes[0]
  const [content, setContent] = useState(active?.content ?? '')
  useEffect(() => setContent(active?.content ?? ''), [active?.id, active?.content])
  function save(value: string) { setContent(value); if (!active) return; update(s => ({ ...s, notes: s.notes.map(n => n.id === active.id ? { ...n, content: value, updatedAt: new Date().toISOString() } : n) })) }
  function addNote() { const note: Note = { id: id('note'), title: 'New Note', category: 'Strategy', content: '', updatedAt: new Date().toISOString() }; update(s => addActivity({ ...s, notes: [note, ...s.notes], settings: { ...s.settings, activeNoteId: note.id } }, 'Note created', note.title, 'note')) }
  function quickTemplate(title: string) {
    const bodies: Record<string, { category: Note['category']; content: string }> = {
      'Daily Review Template': { category: 'Daily Review', content: '# Daily Review\n\n## Wins\n- \n\n## Misses\n- \n\n## Revenue moved\n- \n\n## Tomorrow\n- ' },
      'Project Plan Template': { category: 'Strategy', content: '# Project Plan\n\n## Outcome\n\n## Next actions\n- \n\n## Blockers\n\n## Owner\nNat' },
      'Content Idea Template': { category: 'Content Ideas', content: '# Content Idea\n\n## Hook\n\n## Proof\n\n## Lesson\n\n## CTA\n' },
      'Goal Setting Template': { category: 'Strategy', content: '# Goal\n\n## Target\n\n## Deadline\n\n## Lead measures\n- \n\n## First action\n' },
    }
    const template = bodies[title]
    const note: Note = { id: id('note'), title: title.replace(' Template', ''), category: template.category, content: template.content, updatedAt: new Date().toISOString() }
    update(s => addActivity({ ...s, notes: [note, ...s.notes], settings: { ...s.settings, activeNoteId: note.id } }, 'Note template created', note.title, 'note'))
  }
  return <div className="animate-fade-in-up space-y-5"><PageHero icon={NotebookPen} title="Private Notes" sub={`${focusLabel(focus)} focus. Your private space to capture ideas, plans, and strategy.`} quote="All changes saved locally." /><div className="grid gap-5 xl:grid-cols-[1fr_390px]"><GlassCard className="p-5"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-semibold">{active?.title}</h2><div className="flex flex-wrap gap-2">{['Daily Review', 'Strategy', 'Fitness', 'Real Estate', 'AI Ideas', 'Content Ideas'].map(c => <Badge key={c} label={c} />)}</div></div><textarea value={content} onChange={e => save(e.target.value)} className="min-h-[620px] w-full resize-none rounded-2xl border border-white/10 bg-black/30 p-5 font-mono text-sm leading-7 text-white outline-none focus:border-blue-500/60" /><div className="mt-3 flex items-center justify-between text-xs text-steel"><span><Check size={14} className="inline text-emerald-300" /> All changes saved</span><span>{content.length} characters</span></div></GlassCard><div className="space-y-5"><GlassCard className="p-5"><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold">Recent Notes</h2><button onClick={addNote} className="btn-primary"><Plus size={16} /> New Note</button></div><div className="space-y-3">{notes.length ? notes.map(n => <button key={n.id} onClick={() => update(s => ({ ...s, settings: { ...s.settings, activeNoteId: n.id } }))} className={`w-full rounded-xl border p-4 text-left ${active?.id === n.id ? 'border-blue-500 bg-blue-600/10' : 'border-white/[0.06] bg-white/[0.02]'}`}><div className="flex justify-between"><h3 className="font-semibold">{n.title}</h3><Badge label={n.category} /></div><p className="mt-2 line-clamp-2 text-sm text-steel">{n.content}</p></button>) : <EmptyState icon={NotebookPen} message={`No notes in ${focusLabel(focus)}.`} />}</div></GlassCard><GlassCard className="p-5"><h2 className="mb-4 text-lg font-semibold">Quick Note Templates</h2>{['Daily Review Template', 'Project Plan Template', 'Content Idea Template', 'Goal Setting Template'].map(t => <button key={t} onClick={() => quickTemplate(t)} className="mb-2 flex w-full items-center justify-between rounded-xl border border-white/[0.06] px-4 py-3 text-sm text-steel hover:text-white">{t}<ChevronRight size={16} /></button>)}</GlassCard></div></div></div>
}

function PageHero({ icon: Icon, title, sub, quote }: { icon: any; title: string; sub: string; quote: string }) {
  return <GlassCard className="flex flex-col justify-between gap-4 p-6 md:flex-row md:items-center"><div className="flex items-center gap-4"><div className="grid h-14 w-14 place-items-center rounded-2xl border border-blue-400/20 bg-blue-600/10 text-blue-200"><Icon size={28} /></div><div><h1 className="text-3xl font-semibold tracking-tight">{title}</h1><p className="mt-1 text-sm text-steel">{sub}</p></div></div><p className="max-w-sm text-sm leading-6 text-steel">{quote}</p></GlassCard>
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4"><h3 className="mb-3 font-semibold">{title}</h3>{children}</div>
}
