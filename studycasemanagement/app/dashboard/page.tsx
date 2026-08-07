import { createClient } from '@/lib/supabase/server'
import { Users, FolderOpen, FileText, BarChart2, ArrowUpRight, Clock } from 'lucide-react'

const statCards = [
  { label: 'Total Clients', value: '—', icon: Users, color: 'from-violet-500 to-indigo-600', shadow: 'shadow-violet-500/20' },
  { label: 'Active Projects', value: '—', icon: FolderOpen, color: 'from-sky-500 to-blue-600', shadow: 'shadow-sky-500/20' },
  { label: 'Case Studies', value: '—', icon: FileText, color: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/20' },
  { label: 'Metrics Logged', value: '—', icon: BarChart2, color: 'from-amber-500 to-orange-500', shadow: 'shadow-amber-500/20' },
]

const quickActions = [
  { label: 'Add Client', href: '/dashboard/clients/new', description: 'Register a new client', icon: Users },
  { label: 'New Project', href: '/dashboard/projects/new', description: 'Start a project brief', icon: FolderOpen },
  { label: 'Log Metrics', href: '/dashboard/metrics/new', description: 'Record growth data', icon: BarChart2 },
  { label: 'New Case Study', href: '/dashboard/case-studies/new', description: 'Generate a portfolio link', icon: FileText },
]

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          {greeting()}, {user?.email?.split('@')[0]} 👋
        </h1>
        <p className="mt-1 text-sm text-white/40">
          Here&apos;s an overview of your workspace.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon, color, shadow }) => (
          <div
            key={label}
            className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/4 p-5 backdrop-blur-sm transition hover:border-white/15"
          >
            <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${color} shadow-lg ${shadow}`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <p className="text-3xl font-bold text-white">{value}</p>
            <p className="mt-0.5 text-xs text-white/40">{label}</p>

            {/* Subtle glow on hover */}
            <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${color} opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-10`} />
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="mb-4 text-sm font-semibold text-white/50 uppercase tracking-wider">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map(({ label, href, description, icon: Icon }) => (
            <a
              key={label}
              href={href}
              className="group flex items-start gap-4 rounded-xl border border-white/8 bg-white/3 p-4 transition hover:border-violet-500/30 hover:bg-violet-500/5"
            >
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/8 transition group-hover:border-violet-500/30 group-hover:bg-violet-500/10">
                <Icon className="h-4 w-4 text-white/50 transition group-hover:text-violet-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white/80 transition group-hover:text-white">{label}</p>
                <p className="text-xs text-white/30">{description}</p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-white/20 transition group-hover:text-violet-400" />
            </a>
          ))}
        </div>
      </div>

      {/* Recent activity placeholder */}
      <div>
        <h2 className="mb-4 text-sm font-semibold text-white/50 uppercase tracking-wider">Recent Activity</h2>
        <div className="rounded-2xl border border-white/8 bg-white/3 p-8 text-center">
          <Clock className="mx-auto h-8 w-8 text-white/15" />
          <p className="mt-3 text-sm text-white/30">No recent activity yet.</p>
          <p className="text-xs text-white/20">Start by adding your first client.</p>
        </div>
      </div>
    </div>
  )
}
