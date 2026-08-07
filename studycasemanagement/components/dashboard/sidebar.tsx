'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useSidebar } from './sidebar-context'
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  BarChart2,
  ImageIcon,
  FileText,
  Settings,
  Zap,
  X,
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

// ─────────────────────────────────────────────────────────
// Inner nav content (shared between desktop & mobile)
// ─────────────────────────────────────────────────────────
function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  const pathname = usePathname()

  return (
    <>
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-white/8 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md shadow-violet-500/30">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm font-semibold text-white tracking-tight">CaseStudy</span>
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
                const isActive =
                  pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={onNavClick}
                      className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                        isActive
                          ? 'bg-white/10 text-white'
                          : 'text-white/45 hover:bg-white/6 hover:text-white/80'
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 shrink-0 transition-colors ${
                          isActive
                            ? 'text-violet-400'
                            : 'text-white/30 group-hover:text-white/60'
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
      <div className="shrink-0 border-t border-white/8 p-3">
        <p className="text-center text-[10px] text-white/20">Case Study Manager v0.1</p>
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────
// Desktop sidebar (always visible on lg+)
// ─────────────────────────────────────────────────────────
function DesktopSidebar() {
  return (
    <aside className="hidden lg:flex h-full w-60 shrink-0 flex-col border-r border-white/8 bg-white/[0.03] backdrop-blur-sm">
      <SidebarContent />
    </aside>
  )
}

// ─────────────────────────────────────────────────────────
// Mobile drawer sidebar (slides in from left)
// ─────────────────────────────────────────────────────────
function MobileSidebar() {
  const { isOpen, close } = useSidebar()

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, close])

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={close}
        className={`lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-[oklch(0.12_0_0)] backdrop-blur-xl shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Navigation menu"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={close}
          className="absolute right-3 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition hover:bg-white/10 hover:text-white"
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </button>

        <SidebarContent onNavClick={close} />
      </aside>
    </>
  )
}

// ─────────────────────────────────────────────────────────
// Combined export
// ─────────────────────────────────────────────────────────
export function DashboardSidebar() {
  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  )
}
