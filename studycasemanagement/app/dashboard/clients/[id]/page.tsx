import { getClientById } from '@/app/actions/clients'
import { DeleteClientButton } from '@/components/clients/delete-button'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  Pencil,
  Building2,
  Mail,
  Phone,
  Globe,
  FileText,
  Briefcase,
  CalendarDays,
} from 'lucide-react'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  try {
    const client = await getClientById(id)
    return { title: `${client.name} | Case Study Manager` }
  } catch {
    return { title: 'Client | Case Study Manager' }
  }
}

const statusConfig = {
  active:   { label: 'Active',   classes: 'bg-emerald-500/15 text-emerald-400 ring-emerald-500/20' },
  inactive: { label: 'Inactive', classes: 'bg-white/8 text-white/40 ring-white/10' },
  lead:     { label: 'Lead',     classes: 'bg-amber-500/15 text-amber-400 ring-amber-500/20' },
}

function DetailRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | null | undefined }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5">
        <Icon className="h-3.5 w-3.5 text-white/30" />
      </div>
      <div>
        <p className="text-[10px] font-medium uppercase tracking-wider text-white/30">{label}</p>
        {label === 'Website' ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-violet-400 hover:text-violet-300 transition break-all"
          >
            {value}
          </a>
        ) : (
          <p className="text-sm text-white/80 break-all">{value}</p>
        )}
      </div>
    </div>
  )
}

export default async function ClientDetailPage({ params }: Props) {
  const { id } = await params
  let client
  try {
    client = await getClientById(id)
  } catch {
    notFound()
  }

  const status = statusConfig[client.status as keyof typeof statusConfig] ?? statusConfig.active
  const initials = client.name
    .split(' ')
    .slice(0, 2)
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Back */}
      <Link
        href="/dashboard/clients"
        className="inline-flex items-center gap-1.5 text-sm text-white/40 transition hover:text-white/70"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Clients
      </Link>

      {/* Hero card */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/30 to-indigo-600/30 text-lg font-bold text-violet-300 ring-1 ring-white/10">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-white">{client.name}</h1>
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ring-1 ${status.classes}`}>
                  {status.label}
                </span>
              </div>
              {client.business_name && (
                <p className="mt-0.5 flex items-center gap-1.5 text-sm text-white/40">
                  <Building2 className="h-3.5 w-3.5" />
                  {client.business_name}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={`/dashboard/clients/${client.id}/edit`}
              id={`edit-client-${client.id}`}
              className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-white/60 transition hover:border-white/20 hover:text-white"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Link>
            <DeleteClientButton id={client.id} name={client.name} />
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 space-y-5">
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider">Details</h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <DetailRow icon={Mail} label="Email" value={client.email} />
          <DetailRow icon={Phone} label="Phone" value={client.phone} />
          <DetailRow icon={Globe} label="Website" value={client.website} />
          <DetailRow icon={Briefcase} label="Industry" value={client.industry} />
          <DetailRow
            icon={CalendarDays}
            label="Client Since"
            value={new Date(client.created_at).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          />
          <DetailRow
            icon={CalendarDays}
            label="Last Updated"
            value={new Date(client.updated_at).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          />
        </div>

        {client.notes && (
          <div className="border-t border-white/6 pt-5">
            <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-white/30">Notes</p>
            <div className="flex items-start gap-3">
              <FileText className="mt-0.5 h-4 w-4 shrink-0 text-white/25" />
              <p className="text-sm text-white/70 whitespace-pre-wrap">{client.notes}</p>
            </div>
          </div>
        )}
      </div>

      {/* Projects placeholder */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6">
        <h2 className="mb-4 text-sm font-semibold text-white/50 uppercase tracking-wider">Projects</h2>
        <p className="text-sm text-white/25 text-center py-6">
          No projects yet. Projects will appear here once added.
        </p>
      </div>
    </div>
  )
}
