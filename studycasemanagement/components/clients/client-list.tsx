'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Search,
  Users,
  Plus,
  Building2,
  Mail,
  Globe,
  ChevronRight,
  X,
} from 'lucide-react'
import type { Client, ClientStatus } from '@/lib/types/client'

const statusConfig = {
  active:   { label: 'Active',   classes: 'bg-emerald-500/15 text-emerald-400 ring-emerald-500/20' },
  inactive: { label: 'Inactive', classes: 'bg-white/8 text-white/40 ring-white/10' },
  lead:     { label: 'Lead',     classes: 'bg-amber-500/15 text-amber-400 ring-amber-500/20' },
} as const

type StatusFilter = 'all' | ClientStatus

// ─────────────────────────────────────────────────────────
// Card (same look as the original server-rendered cards)
// ─────────────────────────────────────────────────────────
function ClientCard({ client }: { client: Client }) {
  const status = statusConfig[client.status] ?? statusConfig.active
  const initials = client.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <Link
      href={`/dashboard/clients/${client.id}`}
      className="group flex flex-col gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-5 transition hover:border-violet-500/30 hover:bg-violet-500/[0.04]"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/30 to-indigo-600/30 text-sm font-bold text-violet-300 ring-1 ring-white/10">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-white/90 truncate group-hover:text-white transition">
              {client.name}
            </p>
            {client.business_name && (
              <p className="text-xs text-white/40 truncate flex items-center gap-1 mt-0.5">
                <Building2 className="h-3 w-3 shrink-0" />
                {client.business_name}
              </p>
            )}
          </div>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ring-1 ${status.classes}`}>
          {status.label}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-1.5">
        {client.email && (
          <p className="flex items-center gap-2 text-xs text-white/40 truncate">
            <Mail className="h-3.5 w-3.5 shrink-0 text-white/25" />
            {client.email}
          </p>
        )}
        {client.website && (
          <p className="flex items-center gap-2 text-xs text-white/40 truncate">
            <Globe className="h-3.5 w-3.5 shrink-0 text-white/25" />
            {client.website.replace(/^https?:\/\//, '')}
          </p>
        )}
        {client.industry && (
          <p className="text-xs text-white/30">{client.industry}</p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-white/6 pt-3">
        <p className="text-[10px] text-white/25">
          Added {new Date(client.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
        <ChevronRight className="h-4 w-4 text-white/20 transition group-hover:text-violet-400 group-hover:translate-x-0.5" />
      </div>
    </Link>
  )
}

// ─────────────────────────────────────────────────────────
// Main list with search + status filtering
// ─────────────────────────────────────────────────────────
export function ClientList({ clients }: { clients: Client[] }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const counts = {
    total: clients.length,
    active: clients.filter((c) => c.status === 'active').length,
    lead: clients.filter((c) => c.status === 'lead').length,
    inactive: clients.filter((c) => c.status === 'inactive').length,
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return clients.filter((c) => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false
      if (!q) return true
      return (
        c.name.toLowerCase().includes(q) ||
        (c.business_name ?? '').toLowerCase().includes(q) ||
        (c.email ?? '').toLowerCase().includes(q) ||
        (c.industry ?? '').toLowerCase().includes(q) ||
        (c.website ?? '').toLowerCase().includes(q) ||
        (c.phone ?? '').toLowerCase().includes(q)
      )
    })
  }, [clients, search, statusFilter])

  const pills: { value: StatusFilter; label: string; count: number; color?: string }[] = [
    { value: 'all', label: 'All', count: counts.total },
    { value: 'active', label: 'Active', count: counts.active, color: 'text-emerald-400' },
    { value: 'lead', label: 'Leads', count: counts.lead, color: 'text-amber-400' },
    { value: 'inactive', label: 'Inactive', count: counts.inactive, color: 'text-white/40' },
  ]

  const hasActiveFilters = statusFilter !== 'all' || search.trim() !== ''

  return (
    <>
      {/* Search + status pills */}
      {counts.total > 0 && (
        <div className="space-y-4">
          {/* Search box */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
            <input
              id="client-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search clients by name, email, industry…"
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-10 text-sm text-white placeholder-white/20 outline-none transition focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-white/30 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Status pills */}
          <div className="flex flex-wrap gap-2">
            {pills.map(({ value, label, count, color }) => (
              <button
                key={value}
                type="button"
                onClick={() => setStatusFilter(value)}
                aria-pressed={statusFilter === value}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  statusFilter === value
                    ? 'border-white/15 bg-white/10 text-white'
                    : `border-white/10 bg-white/[0.03] ${color ?? 'text-white/50'} hover:bg-white/8`
                }`}
              >
                {label} · {count}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No clients at all */}
      {counts.total === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] py-20 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5">
            <Users className="h-7 w-7 text-white/20" />
          </div>
          <p className="text-base font-medium text-white/50">No clients yet</p>
          <p className="mt-1 text-sm text-white/30">Add your first client to get started.</p>
          <Link
            href="/dashboard/clients/new"
            className="mt-6 flex items-center gap-2 rounded-xl bg-white/8 px-4 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/12 hover:text-white"
          >
            <Plus className="h-4 w-4" />
            Add Client
          </Link>
        </div>
      ) : // No search/filter matches
      filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] py-20 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5">
            <Search className="h-7 w-7 text-white/20" />
          </div>
          <p className="text-base font-medium text-white/50">No clients found</p>
          <p className="mt-1 text-sm text-white/30">
            {search.trim()
              ? `No results match "${search.trim()}".`
              : `No clients with a "${statusFilter}" status yet.`}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch('')
              setStatusFilter('all')
            }}
            className="mt-6 flex items-center gap-2 rounded-xl bg-white/8 px-4 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/12 hover:text-white"
          >
            <X className="h-4 w-4" />
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      )}

      {/* Result count while filtering */}
      {counts.total > 0 && hasActiveFilters && filtered.length > 0 && (
        <p className="text-xs text-white/30">
          Showing {filtered.length} of {counts.total} client{counts.total !== 1 ? 's' : ''}
        </p>
      )}
    </>
  )
}