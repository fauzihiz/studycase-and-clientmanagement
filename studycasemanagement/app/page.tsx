import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Root page — no content, just smart redirect:
 * - Authenticated  → /dashboard
 * - Unauthenticated → /login
 */
export default async function RootPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  } else {
    redirect('/login')
  }
}
