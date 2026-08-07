import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardNavbar } from '@/components/dashboard/navbar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard | Case Study Manager',
  description: 'Manage your clients, projects, and case studies.',
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="flex h-screen overflow-hidden bg-[oklch(0.10_0_0)] text-white">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardNavbar user={user} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
