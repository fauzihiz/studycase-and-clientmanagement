'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  BarChart2,
  ImageIcon,
  FileText,
  Settings,
  Zap,
} from 'lucide-react'

const navItems = [
  {
    section: 'Overview',
    items: [{ label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }],
  },
  {
    section: 'Management',
    items: [
      { label: 'Clients', href: '/dashboard/clients', icon: Users },
      { label: 'Projects', href: '/dashboard/projects', icon: FolderOpen },
    ],
  },
  {
    section: 'Content',
    items: [
      { label: 'Metrics', href: '/dashboard/metrics', icon: BarChart2 },
      { label: 'Assets', href: '/dashboard/assets', icon: ImageIcon },
      { label: 'Case Studies', href: '/dashboard/case-studies', icon: FileText },
    ],
  },
  {
    section: 'Account',
    items: [{ label: 'Settings', href: '/dashboard/settings', icon: Settings }],
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-white/8 bg-white/3 backdrop-blur-sm">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 border-b border-white/8 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md shadow-violet-500/30">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm font-semibold text-white">CaseStudy</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {navItems.map((group) => (
          <div key={group.section} className="mb-5">
            <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-white/25">
              {group.section}
            </p>
            <ul className="space-y-0.5">
              {group.items.map(({ label, href, icon: Icon }) => {
                const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 ${
                        isActive
                          ? 'bg-white/10 text-white'
                          : 'text-white/45 hover:bg-white/6 hover:text-white/80'
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 shrink-0 transition-colors ${
                          isActive ? 'text-violet-400' : 'text-white/30 group-hover:text-white/60'
                        }`}
                      />
                      {label}
                      {isActive && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-400" />
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/8 p-3">
        <p className="text-center text-[10px] text-white/20">Case Study Manager v0.1</p>
      </div>
    </aside>
  )
}
