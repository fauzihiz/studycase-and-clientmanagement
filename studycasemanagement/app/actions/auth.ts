'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

// ─────────────────────────────────────────────────────────
// LOGIN WITH EMAIL + PASSWORD
// ─────────────────────────────────────────────────────────
export async function loginWithPassword(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }

  redirect('/dashboard')
}

// ─────────────────────────────────────────────────────────
// LOGIN WITH MAGIC LINK
// ─────────────────────────────────────────────────────────
export async function loginWithMagicLink(formData: FormData) {
  const email = formData.get('email') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/auth/callback`,
    },
  })

  if (error) return { error: error.message }
  return { success: 'Check your email for the magic link!' }
}

// ─────────────────────────────────────────────────────────
// SIGN UP (ADMIN ONLY via ADMIN_EMAIL env var)
// ─────────────────────────────────────────────────────────
export async function signUp(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // 🔒 ADMIN_EMAIL guard
  // Only the email(s) listed in ADMIN_EMAIL (comma-separated) can register.
  // Forkers: change ADMIN_EMAIL in your .env.local to your own email.
  const adminEmails = (process.env.ADMIN_EMAIL ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())

  if (!adminEmails.includes(email.toLowerCase())) {
    return {
      error:
        'Registration is restricted. If you own this app, set ADMIN_EMAIL in your .env.local to your email.',
    }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/auth/callback`,
    },
  })

  if (error) return { error: error.message }
  return { success: 'Account created! Check your email to confirm your address.' }
}

// ─────────────────────────────────────────────────────────
// SIGN OUT
// ─────────────────────────────────────────────────────────
export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
