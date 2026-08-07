'use client'

import { useState, useRef, useEffect, useTransition } from 'react'
import { usePathname } from 'next/navigation'
import { type User } from '@supabase/supabase-js'
import { signOut } from '@/app/actions/auth'
import { useSidebar } from './sidebar-context'
import {
  LogOut,
  Bell,
  ChevronDown,
  Menu,
  Sun,
  Moon,
  ChevronRight,
  LayoutDashboard,
  Users,
  FolderOpen,
  BarChart2,
  ImageIcon,
  FileText,
  Settings,
} from 'lucide-react'

// Map path segments to human-readable labels for the breadcrumb
const routeLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  clients: 'Clients',
  projects: 'Projects',
  metrics: 'Metrics',
  assets: 'Assets',
  'case-studies': 'Case Studies',
  settings: 'Settings',
  new: 'New',
}

// ─────────────────────────────────────────────────────────
// Dark mode toggle hook (persists in localStorage)
// ─────────────────────────────────────────────────────────
function useDarkMode() {
  const [dark, setDark] = useState(true) // default: dark

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = stored ? stored === 'dark' : prefersDark
    setDark(isDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  function toggle() {
    setDark((prev) => {
      const next = !prev
      document.documentElement.classList.toggle('dark', next)
      localStorage.setItem('theme', next ? 'dark' : 'light')
      return next
    })
  }

  return { dark, toggle }
}

// ─────────────────────────────────────────────────────────
// Breadcrumb
// ─────────────────────────────────────────────────────────
function Breadcrumb() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  return (
    <nav aria-label="breadcrumb" className="hidden sm:flex items-center gap-1.5 text-sm">
      {segments.map((seg, i) => {
        const isLast = i === segments.length - 1
        const label = routeLabels[seg] ?? seg
        return (
          <span key={seg} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-white/20" />}
            <span className={isLast ? 'font-medium text-white/80' : 'text-white/30'}>
              {label}
            </span>
          </span>
        )
      })}
    </nav>
  )
}

// ─────────────────────────────────────────────────────────
// User dropdown (click-based, accessible)
// ─────────────────────────────────────────────────────────
function UserMenu({ user, onSignOut, isPending }: { user: User; onSignOut: () => void; isPending: boolean }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const initials = user.email ? user.email.slice(0, 2).toUpperCase() : '??'

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    function handler(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        id="user-menu-button"
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-white/8"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-bold text-white shadow-sm shadow-violet-500/30">
          {initials}
        </div>
        <span className="hidden sm:block max-w-[140px] truncate text-xs font-medium text-white/70">
          {user.email}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-white/30 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown panel */}
      <div
        role="menu"
        aria-labelledby="user-menu-button"
        className={`absolute right-0 top-full mt-2 w-52 origin-top-right rounded-xl border border-white/10 bg-[oklch(0.15_0_0)] p-1 shadow-2xl transition-all duration-200 ${
          open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        {/* User info */}
        <div className="px-3 py-2 mb-1 border-b border-white/8">
          <p className="text-xs font-medium text-white/80 truncate">{user.email}</p>
          <p className="text-[10px] text-white/30 mt-0.5">Administrator</p>
        </div>

        <button
          role="menuitem"
          type="button"
          onClick={() => { setOpen(false); onSignOut() }}
          disabled={isPending}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-white/60 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
        >
          <LogOut className="h-3.5 w-3.5" />
          {isPending ? 'Signing out…' : 'Sign out'}
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Main Navbar
// ─────────────────────────────────────────────────────────
interface DashboardNavbarProps {
  user: User
}

export function DashboardNavbar({ user }: DashboardNavbarProps) {
  const { toggle: toggleSidebar } = useSidebar()
  const { dark, toggle: toggleDark } = useDarkMode()
  const [isPending, startTransition] = useTransition()

  function handleSignOut() {
    startTransition(() => signOut())
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/8 bg-white/[0.03] backdrop-blur-sm px-4 sm:px-6">
      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle */}
        <button
          id="mobile-menu-toggle"
          type="button"
          onClick={toggleSidebar}
          className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg text-white/50 transition hover:bg-white/8 hover:text-white"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Breadcrumb */}
        <Breadcrumb />
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Dark mode toggle */}
        <button
          id="dark-mode-toggle"
          type="button"
          onClick={toggleDark}
          aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-white/40 transition hover:bg-white/8 hover:text-white/80"
        >
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Notification bell */}
        <button
          id="notifications-button"
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-white/40 transition hover:bg-white/8 hover:text-white/80"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          {/* Unread dot — hidden for now */}
          {/* <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-violet-400" /> */}
        </button>

        {/* Divider */}
        <div className="h-5 w-px bg-white/10 mx-1" />

        {/* User menu */}
        <UserMenu user={user} onSignOut={handleSignOut} isPending={isPending} />
      </div>
    </header>
  )
}
