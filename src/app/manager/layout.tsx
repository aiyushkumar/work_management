import Link from 'next/link'
import { LayoutDashboard, Users, FileText, Settings, LogOut, CheckSquare, Briefcase, BarChart, User, Landmark } from 'lucide-react'
import { logout } from '@/app/(auth)/actions'
import { ManagerMobileNav } from '@/components/layout/manager-mobile-nav'
import { createClient } from '@/lib/supabase/server'

export default async function ManagerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email')
    .eq('id', user?.id)
    .single()

  const managerName = profile?.full_name || 'Manager'
  const managerEmail = profile?.email || user?.email || ''
  const initialLetter = managerName.charAt(0).toUpperCase()

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-navy-900 text-white hidden md:flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-500 text-navy-900 rounded-lg flex items-center justify-center font-bold text-xl">
              MP
            </div>
            <div>
              <h1 className="font-bold text-xl">Mahakal</h1>
              <p className="text-yellow-500 text-xs font-semibold tracking-wider">PROPERTY</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-2 overflow-y-auto">
          <Link href="/manager/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-navy-800 transition-colors">
            <LayoutDashboard size={18} className="text-slate-400" />
            <span className="text-sm">Dashboard</span>
          </Link>
          <Link href="/manager/profile" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-navy-800 transition-colors text-yellow-400 font-medium">
            <User size={18} className="text-yellow-400" />
            <span className="text-sm">Profile & Bank Details</span>
          </Link>
          <Link href="/manager/employees" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-navy-800 transition-colors">
            <Users size={18} className="text-slate-400" />
            <span className="text-sm">Employees</span>
          </Link>
          <Link href="/manager/tasks" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-navy-800 transition-colors">
            <CheckSquare size={18} className="text-slate-400" />
            <span className="text-sm">Tasks</span>
          </Link>
          <Link href="/manager/properties" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-navy-800 transition-colors">
            <Briefcase size={18} className="text-slate-400" />
            <span className="text-sm">Properties</span>
          </Link>
          <Link href="/manager/leads" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-navy-800 transition-colors">
            <Users size={18} className="text-slate-400" />
            <span className="text-sm">Leads</span>
          </Link>
          <Link href="/manager/reports" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-navy-800 transition-colors">
            <FileText size={18} className="text-slate-400" />
            <span className="text-sm">Daily Reports</span>
          </Link>
          <Link href="/manager/attendance" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-navy-800 transition-colors">
            <CheckSquare size={18} className="text-slate-400" />
            <span className="text-sm">Attendance</span>
          </Link>
          <Link href="/manager/allowances" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-navy-800 transition-colors">
            <Landmark size={18} className="text-slate-400" />
            <span className="text-sm">Allowances</span>
          </Link>
          <Link href="/manager/analytics" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-navy-800 transition-colors">
            <BarChart size={18} className="text-slate-400" />
            <span className="text-sm">Analytics</span>
          </Link>
          <Link href="/manager/notifications" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-navy-800 transition-colors">
            <FileText size={18} className="text-slate-400" />
            <span className="text-sm">Notifications</span>
          </Link>
          <Link href="/manager/settings" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-navy-800 transition-colors">
            <Settings size={18} className="text-slate-400" />
            <span className="text-sm">Settings</span>
          </Link>
        </nav>

        {/* User Card & Sign Out */}
        <div className="p-4 mt-auto border-t border-navy-800 space-y-3">
          <Link href="/manager/profile" className="flex items-center gap-3 p-2 rounded-lg bg-navy-800 hover:bg-navy-700/70 transition-colors group">
            <div className="w-9 h-9 bg-yellow-500 text-navy-900 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
              {initialLetter}
            </div>
            <div className="overflow-hidden text-left">
              <p className="text-sm font-semibold truncate group-hover:text-yellow-400">{managerName}</p>
              <p className="text-xs text-slate-400 truncate">{managerEmail}</p>
            </div>
          </Link>

          <form action={logout}>
            <button className="flex items-center justify-center gap-2 px-3 py-2 w-full rounded-md bg-red-950/60 hover:bg-red-900/80 text-red-300 hover:text-white transition-colors text-sm font-medium border border-red-900/50">
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-navy-900 text-white p-4 flex justify-between items-center shadow-md">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-500 text-navy-900 rounded flex items-center justify-center font-bold">
              MP
            </div>
            <div>
              <span className="font-bold text-sm block">Manager Portal</span>
              <span className="text-xs text-yellow-400 font-medium block truncate max-w-[140px]">{managerName}</span>
            </div>
          </div>
          <ManagerMobileNav managerName={managerName} managerEmail={managerEmail} />
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

