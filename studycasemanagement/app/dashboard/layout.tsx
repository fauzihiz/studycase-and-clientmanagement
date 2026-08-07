import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardNavbar } from '@/components/dashboard/navbar'
import { SidebarProvider } from '@/components/dashboard/sidebar-context'
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
    // SidebarProvider allows mobile open/close state to be shared between
    // the Navbar hamburger button and the Sidebar drawer
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-[oklch(0.10_0_0)] text-white">
        {/* Sidebar: desktop (always visible) + mobile (drawer) */}
        <DashboardSidebar />

        {/* Main content area */}
        <div className="flex flex-1 flex-col overflow-hidden min-w-0">
          <DashboardNavbar user={user} />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
