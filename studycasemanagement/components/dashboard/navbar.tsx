'use client'

import { useTransition } from 'react'
import { type User } from '@supabase/supabase-js'
import { signOut } from '@/app/actions/auth'
import { LogOut, Bell, ChevronDown } from 'lucide-react'

interface DashboardNavbarProps {
  user: User
}

export function DashboardNavbar({ user }: DashboardNavbarProps) {
  const [isPending, startTransition] = useTransition()

  function handleSignOut() {
    startTransition(() => signOut())
  }

  const initials = user.email ? user.email.slice(0, 2).toUpperCase() : '??'

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/8 bg-white/3 backdrop-blur-sm px-6">
      {/* Left — breadcrumb placeholder */}
      <div className="text-sm text-white/30">
        <span className="text-white/60 font-medium">Dashboard</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button
          type="button"
          className="relative flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition hover:bg-white/8 hover:text-white/70"
        >
          <Bell className="h-4 w-4" />
        </button>

        {/* Divider */}
        <div className="h-5 w-px bg-white/10" />

        {/* User menu */}
        <div className="group relative">
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-white/8"
          >
            {/* Avatar */}
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-bold text-white">
              {initials}
            </div>
            <span className="max-w-[140px] truncate text-xs font-medium text-white/70">
              {user.email}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-white/30" />
          </button>

          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-1 hidden w-48 rounded-xl border border-white/10 bg-[oklch(0.15_0_0)] p-1 shadow-xl group-focus-within:block">
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isPending}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-white/60 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
