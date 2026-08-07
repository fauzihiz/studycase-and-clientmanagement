'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { ClientInsert, ClientUpdate } from '@/lib/types/client'

// ─────────────────────────────────────────────────────────
// READ — list all clients for the authenticated user
// ─────────────────────────────────────────────────────────
export async function getClients() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

// ─────────────────────────────────────────────────────────
// READ — single client by id
// ─────────────────────────────────────────────────────────
export async function getClientById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data
}

// ─────────────────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────────────────
export async function createClientAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const payload: ClientInsert = {
    name: (formData.get('name') as string).trim(),
    business_name: (formData.get('business_name') as string)?.trim() || null,
    industry: (formData.get('industry') as string)?.trim() || null,
    email: (formData.get('email') as string)?.trim() || null,
    phone: (formData.get('phone') as string)?.trim() || null,
    website: (formData.get('website') as string)?.trim() || null,
    notes: (formData.get('notes') as string)?.trim() || null,
    status: (formData.get('status') as ClientInsert['status']) || 'active',
  }

  if (!payload.name) return { error: 'Client name is required.' }

  const { data, error } = await supabase
    .from('clients')
    .insert({ ...payload, user_id: user.id })
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/dashboard/clients')
  revalidatePath('/dashboard')
  redirect(`/dashboard/clients/${data.id}`)
}

// ─────────────────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────────────────
export async function updateClientAction(id: string, formData: FormData) {
  const supabase = await createClient()

  const payload: ClientUpdate = {
    name: (formData.get('name') as string).trim(),
    business_name: (formData.get('business_name') as string)?.trim() || null,
    industry: (formData.get('industry') as string)?.trim() || null,
    email: (formData.get('email') as string)?.trim() || null,
    phone: (formData.get('phone') as string)?.trim() || null,
    website: (formData.get('website') as string)?.trim() || null,
    notes: (formData.get('notes') as string)?.trim() || null,
    status: (formData.get('status') as ClientUpdate['status']) || 'active',
  }

  if (!payload.name) return { error: 'Client name is required.' }

  const { error } = await supabase
    .from('clients')
    .update(payload)
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/clients')
  revalidatePath(`/dashboard/clients/${id}`)
  revalidatePath('/dashboard')
  redirect(`/dashboard/clients/${id}`)
}

// ─────────────────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────────────────
export async function deleteClientAction(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/clients')
  revalidatePath('/dashboard')
  redirect('/dashboard/clients')
}
