import { getClientById } from '@/app/actions/clients'
import { ClientForm } from '@/components/clients/client-form'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  try {
    const client = await getClientById(id)
    return { title: `Edit ${client.name} | Case Study Manager` }
  } catch {
    return { title: 'Edit Client | Case Study Manager' }
  }
}

export default async function EditClientPage({ params }: Props) {
  const { id } = await params
  let client
  try {
    client = await getClientById(id)
  } catch {
    notFound()
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Back */}
      <Link
        href={`/dashboard/clients/${client.id}`}
        className="inline-flex items-center gap-1.5 text-sm text-white/40 transition hover:text-white/70"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {client.name}
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-white">Edit Client</h1>
        <p className="mt-1 text-sm text-white/40">Update details for {client.name}.</p>
      </div>

      <ClientForm client={client} />
    </div>
  )
}
