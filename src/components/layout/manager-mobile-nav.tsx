'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, LayoutDashboard, Users, FileText, Settings, LogOut, CheckSquare, Briefcase, BarChart, User, Landmark } from 'lucide-react'
import { logout } from '@/app/(auth)/actions'

interface ManagerMobileNavProps {
  managerName?: string
  managerEmail?: string
}

export function ManagerMobileNav({ managerName, managerEmail }: ManagerMobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const closeMenu = () => setIsOpen(false)

  const initialLetter = managerName ? managerName.charAt(0).toUpperCase() : 'M'

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 text-white hover:bg-navy-800 rounded-md"
        aria-label="Open navigation menu"
      >
        <Menu size={24} />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Sidebar Drawer */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-navy-900 text-white z-50 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 flex items-center justify-between border-b border-navy-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-500 text-navy-900 rounded flex items-center justify-center font-bold">
              MP
            </div>
            <span className="font-bold">Mahakal</span>
          </div>
          <button onClick={closeMenu} className="p-2 text-slate-300 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* User Card */}
        {managerName && (
          <div className="px-4 py-3 bg-navy-800/80 border-b border-navy-800 flex items-center gap-3">
            <div className="w-9 h-9 bg-yellow-500 text-navy-900 rounded-full flex items-center justify-center font-bold text-sm">
              {initialLetter}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate text-white">{managerName}</p>
              <p className="text-xs text-slate-400 truncate">{managerEmail}</p>
            </div>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          <Link onClick={closeMenu} href="/manager/dashboard" className={`flex items-center gap-3 px-3 py-3 rounded-md transition-colors ${pathname === '/manager/dashboard' ? 'bg-navy-800 text-yellow-500 font-semibold' : 'hover:bg-navy-800'}`}>
            <LayoutDashboard size={20} className={pathname === '/manager/dashboard' ? 'text-yellow-500' : 'text-slate-400'} />
            <span>Dashboard</span>
          </Link>
          <Link onClick={closeMenu} href="/manager/profile" className={`flex items-center gap-3 px-3 py-3 rounded-md transition-colors ${pathname.startsWith('/manager/profile') ? 'bg-navy-800 text-yellow-500 font-semibold' : 'hover:bg-navy-800 text-yellow-400'}`}>
            <User size={20} className={pathname.startsWith('/manager/profile') ? 'text-yellow-500' : 'text-yellow-400'} />
            <span>Profile & Bank Details</span>
          </Link>
          <Link onClick={closeMenu} href="/manager/employees" className={`flex items-center gap-3 px-3 py-3 rounded-md transition-colors ${pathname.startsWith('/manager/employees') ? 'bg-navy-800 text-yellow-500 font-semibold' : 'hover:bg-navy-800'}`}>
            <Users size={20} className={pathname.startsWith('/manager/employees') ? 'text-yellow-500' : 'text-slate-400'} />
            <span>Employees</span>
          </Link>
          <Link onClick={closeMenu} href="/manager/tasks" className={`flex items-center gap-3 px-3 py-3 rounded-md transition-colors ${pathname.startsWith('/manager/tasks') ? 'bg-navy-800 text-yellow-500 font-semibold' : 'hover:bg-navy-800'}`}>
            <CheckSquare size={20} className={pathname.startsWith('/manager/tasks') ? 'text-yellow-500' : 'text-slate-400'} />
            <span>Tasks</span>
          </Link>
          <Link onClick={closeMenu} href="/manager/properties" className={`flex items-center gap-3 px-3 py-3 rounded-md transition-colors ${pathname.startsWith('/manager/properties') ? 'bg-navy-800 text-yellow-500 font-semibold' : 'hover:bg-navy-800'}`}>
            <Briefcase size={20} className={pathname.startsWith('/manager/properties') ? 'text-yellow-500' : 'text-slate-400'} />
            <span>Properties</span>
          </Link>
          <Link onClick={closeMenu} href="/manager/leads" className={`flex items-center gap-3 px-3 py-3 rounded-md transition-colors ${pathname.startsWith('/manager/leads') ? 'bg-navy-800 text-yellow-500 font-semibold' : 'hover:bg-navy-800'}`}>
            <Users size={20} className={pathname.startsWith('/manager/leads') ? 'text-yellow-500' : 'text-slate-400'} />
            <span>Leads</span>
          </Link>
          <Link onClick={closeMenu} href="/manager/reports" className={`flex items-center gap-3 px-3 py-3 rounded-md transition-colors ${pathname.startsWith('/manager/reports') ? 'bg-navy-800 text-yellow-500 font-semibold' : 'hover:bg-navy-800'}`}>
            <FileText size={20} className={pathname.startsWith('/manager/reports') ? 'text-yellow-500' : 'text-slate-400'} />
            <span>Daily Reports</span>
          </Link>
          <Link onClick={closeMenu} href="/manager/attendance" className={`flex items-center gap-3 px-3 py-3 rounded-md transition-colors ${pathname.startsWith('/manager/attendance') ? 'bg-navy-800 text-yellow-500 font-semibold' : 'hover:bg-navy-800'}`}>
            <CheckSquare size={20} className={pathname.startsWith('/manager/attendance') ? 'text-yellow-500' : 'text-slate-400'} />
            <span>Attendance</span>
          </Link>
          <Link onClick={closeMenu} href="/manager/allowances" className={`flex items-center gap-3 px-3 py-3 rounded-md transition-colors ${pathname.startsWith('/manager/allowances') ? 'bg-navy-800 text-yellow-500 font-semibold' : 'hover:bg-navy-800'}`}>
            <Landmark size={20} className={pathname.startsWith('/manager/allowances') ? 'text-yellow-500' : 'text-slate-400'} />
            <span>Allowances</span>
          </Link>
          <Link onClick={closeMenu} href="/manager/analytics" className={`flex items-center gap-3 px-3 py-3 rounded-md transition-colors ${pathname.startsWith('/manager/analytics') ? 'bg-navy-800 text-yellow-500 font-semibold' : 'hover:bg-navy-800'}`}>
            <BarChart size={20} className={pathname.startsWith('/manager/analytics') ? 'text-yellow-500' : 'text-slate-400'} />
            <span>Analytics</span>
          </Link>
          <Link onClick={closeMenu} href="/manager/notifications" className={`flex items-center gap-3 px-3 py-3 rounded-md transition-colors ${pathname.startsWith('/manager/notifications') ? 'bg-navy-800 text-yellow-500 font-semibold' : 'hover:bg-navy-800'}`}>
            <FileText size={20} className={pathname.startsWith('/manager/notifications') ? 'text-yellow-500' : 'text-slate-400'} />
            <span>Notifications</span>
          </Link>
          <Link onClick={closeMenu} href="/manager/settings" className={`flex items-center gap-3 px-3 py-3 rounded-md transition-colors ${pathname.startsWith('/manager/settings') ? 'bg-navy-800 text-yellow-500 font-semibold' : 'hover:bg-navy-800'}`}>
            <Settings size={20} className={pathname.startsWith('/manager/settings') ? 'text-yellow-500' : 'text-slate-400'} />
            <span>Settings</span>
          </Link>
        </nav>

        {/* Drawer Footer Sign Out Button */}
        <div className="p-4 border-t border-navy-800 bg-navy-950">
          <form action={logout}>
            <button className="flex items-center justify-center gap-2 px-3 py-2.5 w-full rounded-md bg-red-950/70 hover:bg-red-900 text-red-300 hover:text-white transition-colors text-sm font-semibold border border-red-900/60">
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

