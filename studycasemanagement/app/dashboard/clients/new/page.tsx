import { ClientForm } from '@/components/clients/client-form'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'New Client | Case Study Manager',
}

export default function NewClientPage() {
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

      <div>
        <h1 className="text-2xl font-bold text-white">Add Client</h1>
        <p className="mt-1 text-sm text-white/40">Register a new client in your workspace.</p>
      </div>

      <ClientForm />
    </div>
  )
}
