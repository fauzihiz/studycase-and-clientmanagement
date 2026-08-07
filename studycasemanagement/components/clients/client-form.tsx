'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClientAction, updateClientAction } from '@/app/actions/clients'
import type { Client } from '@/lib/types/client'
import {
  User,
  Building2,
  Mail,
  Phone,
  Globe,
  FileText,
  Briefcase,
  Loader2,
  Save,
  X,
} from 'lucide-react'
import { useState } from 'react'

const industries = [
  'Technology', 'E-Commerce', 'Healthcare', 'Finance',
  'Education', 'Real Estate', 'Food & Beverage', 'Fashion',
  'Marketing & Advertising', 'Consulting', 'Manufacturing', 'Other',
]

const statusOptions = [
  { value: 'lead', label: 'Lead', color: 'text-amber-400', dot: 'bg-amber-400' },
  { value: 'active', label: 'Active', color: 'text-emerald-400', dot: 'bg-emerald-400' },
  { value: 'inactive', label: 'Inactive', color: 'text-white/40', dot: 'bg-white/30' },
] as const

interface ClientFormProps {
  client?: Client // present when editing
}

export function ClientForm({ client }: ClientFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const isEditing = !!client

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = isEditing
        ? await updateClientAction(client.id, formData)
        : await createClientAction(formData)

      if (result?.error) setError(result.error)
      // On success, server action calls redirect() — no extra handling needed
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <X className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Card: Basic Info */}
      <section className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 space-y-5">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
          Basic Information
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Name */}
          <div className="sm:col-span-2">
            <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-white/60">
              Full Name <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
              <input
                id="name"
                name="name"
                type="text"
                required
                defaultValue={client?.name ?? ''}
                placeholder="e.g. Ahmad Fauzi"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/20 outline-none transition focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>
          </div>

          {/* Business name */}
          <div>
            <label htmlFor="business_name" className="mb-1.5 block text-xs font-medium text-white/60">
              Business / Brand Name
            </label>
            <div className="relative">
              <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
              <input
                id="business_name"
                name="business_name"
                type="text"
                defaultValue={client?.business_name ?? ''}
                placeholder="e.g. Toko Maju Jaya"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/20 outline-none transition focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>
          </div>

          {/* Industry */}
          <div>
            <label htmlFor="industry" className="mb-1.5 block text-xs font-medium text-white/60">
              Industry
            </label>
            <div className="relative">
              <Briefcase className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
              <select
                id="industry"
                name="industry"
                defaultValue={client?.industry ?? ''}
                className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white outline-none transition focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
              >
                <option value="" className="bg-[oklch(0.15_0_0)]">Select industry…</option>
                {industries.map((i) => (
                  <option key={i} value={i} className="bg-[oklch(0.15_0_0)]">{i}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Card: Contact */}
      <section className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 space-y-5">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
          Contact Details
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Email */}
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-white/60">
              Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={client?.email ?? ''}
                placeholder="client@example.com"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/20 outline-none transition focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="mb-1.5 block text-xs font-medium text-white/60">
              Phone
            </label>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
              <input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={client?.phone ?? ''}
                placeholder="+62 812 3456 7890"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/20 outline-none transition focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>
          </div>

          {/* Website */}
          <div className="sm:col-span-2">
            <label htmlFor="website" className="mb-1.5 block text-xs font-medium text-white/60">
              Website
            </label>
            <div className="relative">
              <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
              <input
                id="website"
                name="website"
                type="url"
                defaultValue={client?.website ?? ''}
                placeholder="https://example.com"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/20 outline-none transition focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Card: Status & Notes */}
      <section className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 space-y-5">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
          Status & Notes
        </h2>

        {/* Status */}
        <div>
          <p className="mb-3 text-xs font-medium text-white/60">Client Status</p>
          <div className="flex flex-wrap gap-3">
            {statusOptions.map(({ value, label, color, dot }) => (
              <label
                key={value}
                className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium transition has-[:checked]:border-violet-500/50 has-[:checked]:bg-violet-500/10"
              >
                <input
                  type="radio"
                  name="status"
                  value={value}
                  defaultChecked={client ? client.status === value : value === 'active'}
                  className="sr-only"
                />
                <span className={`h-2 w-2 rounded-full ${dot}`} />
                <span className={color}>{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="mb-1.5 block text-xs font-medium text-white/60">
            Notes
          </label>
          <div className="relative">
            <FileText className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-white/25" />
            <textarea
              id="notes"
              name="notes"
              rows={4}
              defaultValue={client?.notes ?? ''}
              placeholder="Internal notes about this client…"
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/20 outline-none transition focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
            />
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-white/50 transition hover:border-white/20 hover:text-white/80"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isPending ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Client'}
        </button>
      </div>
    </form>
  )
}
