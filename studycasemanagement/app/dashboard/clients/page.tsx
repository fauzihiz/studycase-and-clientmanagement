import { getClients } from '@/app/actions/clients'
import { ClientList } from '@/components/clients/client-list'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Clients | Case Study Manager',
}

export default async function ClientsPage() {
  const clients = await getClients()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Clients</h1>
          <p className="mt-1 text-sm text-white/40">
            {clients.length} client{clients.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <Link
          href="/dashboard/clients/new"
          id="add-client-button"
          className="flex items-center gap-2 self-start rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:opacity-90 sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Client
        </Link>
      </div>

      {/* Searchable, filterable client list */}
      <ClientList clients={clients} />
    </div>
  )
}