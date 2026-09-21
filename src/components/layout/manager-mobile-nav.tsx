'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, LayoutDashboard, Users, FileText, Settings, LogOut, CheckSquare, Briefcase, BarChart } from 'lucide-react'

export function ManagerMobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const closeMenu = () => setIsOpen(false)

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 text-white hover:bg-navy-800 rounded-md"
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

        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          <Link onClick={closeMenu} href="/manager/dashboard" className={`flex items-center gap-3 px-3 py-3 rounded-md transition-colors ${pathname === '/manager/dashboard' ? 'bg-navy-800 text-yellow-500' : 'hover:bg-navy-800'}`}>
            <LayoutDashboard size={20} className={pathname === '/manager/dashboard' ? 'text-yellow-500' : 'text-slate-400'} />
            <span>Dashboard</span>
          </Link>
          <Link onClick={closeMenu} href="/manager/employees" className={`flex items-center gap-3 px-3 py-3 rounded-md transition-colors ${pathname.startsWith('/manager/employees') ? 'bg-navy-800 text-yellow-500' : 'hover:bg-navy-800'}`}>
            <Users size={20} className={pathname.startsWith('/manager/employees') ? 'text-yellow-500' : 'text-slate-400'} />
            <span>Employees</span>
          </Link>
          <Link onClick={closeMenu} href="/manager/tasks" className={`flex items-center gap-3 px-3 py-3 rounded-md transition-colors ${pathname.startsWith('/manager/tasks') ? 'bg-navy-800 text-yellow-500' : 'hover:bg-navy-800'}`}>
            <CheckSquare size={20} className={pathname.startsWith('/manager/tasks') ? 'text-yellow-500' : 'text-slate-400'} />
            <span>Tasks</span>
          </Link>
          <Link onClick={closeMenu} href="/manager/properties" className={`flex items-center gap-3 px-3 py-3 rounded-md transition-colors ${pathname.startsWith('/manager/properties') ? 'bg-navy-800 text-yellow-500' : 'hover:bg-navy-800'}`}>
            <Briefcase size={20} className={pathname.startsWith('/manager/properties') ? 'text-yellow-500' : 'text-slate-400'} />
            <span>Properties</span>
          </Link>
          <Link onClick={closeMenu} href="/manager/leads" className={`flex items-center gap-3 px-3 py-3 rounded-md transition-colors ${pathname.startsWith('/manager/leads') ? 'bg-navy-800 text-yellow-500' : 'hover:bg-navy-800'}`}>
            <Users size={20} className={pathname.startsWith('/manager/leads') ? 'text-yellow-500' : 'text-slate-400'} />
            <span>Leads</span>
          </Link>
          <Link onClick={closeMenu} href="/manager/reports" className={`flex items-center gap-3 px-3 py-3 rounded-md transition-colors ${pathname.startsWith('/manager/reports') ? 'bg-navy-800 text-yellow-500' : 'hover:bg-navy-800'}`}>
            <FileText size={20} className={pathname.startsWith('/manager/reports') ? 'text-yellow-500' : 'text-slate-400'} />
            <span>Daily Reports</span>
          </Link>
          <Link onClick={closeMenu} href="/manager/attendance" className={`flex items-center gap-3 px-3 py-3 rounded-md transition-colors ${pathname.startsWith('/manager/attendance') ? 'bg-navy-800 text-yellow-500' : 'hover:bg-navy-800'}`}>
            <CheckSquare size={20} className={pathname.startsWith('/manager/attendance') ? 'text-yellow-500' : 'text-slate-400'} />
            <span>Attendance</span>
          </Link>
        </nav>
      </div>
    </>
  )
}
