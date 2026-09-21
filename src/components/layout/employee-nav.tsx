'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Home, ClipboardList, Building, Users, Clock, LogOut, FileText, Bell, User, Menu, X, PhoneCall } from 'lucide-react'
import { logout } from '@/app/(auth)/actions'

export function EmployeeNavigation({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Top Header */}
      <header className="bg-navy-900 text-white p-4 sticky top-0 z-50 shadow-md">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMenuOpen(true)} className="sm:hidden text-white">
              <Menu size={24} />
            </button>
            <div className="w-8 h-8 bg-yellow-500 text-navy-900 rounded-full flex items-center justify-center font-bold">
              MP
            </div>
            <span className="font-bold text-lg">Mahakal Property</span>
          </div>
          
          <div className="hidden sm:flex items-center gap-6">
            <Link href="/employee/dashboard" className="text-sm hover:text-yellow-500">Dashboard</Link>
            <Link href="/employee/tasks" className="text-sm hover:text-yellow-500">Tasks</Link>
            <Link href="/employee/properties" className="text-sm hover:text-yellow-500">Properties</Link>
            <Link href="/employee/leads" className="text-sm hover:text-yellow-500">Leads</Link>
            <Link href="/employee/profile" className="text-sm hover:text-yellow-500">Profile</Link>
            <form action={logout}>
              <button className="flex items-center gap-2 text-sm text-red-300 hover:text-red-400 transition-colors">
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 sm:hidden" onClick={() => setIsMenuOpen(false)}>
          <div 
            className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 bg-navy-900 text-white flex justify-between items-center">
              <span className="font-bold">Menu</span>
              <button onClick={() => setIsMenuOpen(false)}><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2 text-slate-700">
              <Link href="/employee/dashboard" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3 rounded hover:bg-slate-100">
                <Home size={20} /> Dashboard
              </Link>
              <Link href="/employee/tasks" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3 rounded hover:bg-slate-100">
                <ClipboardList size={20} /> My Tasks
              </Link>
              <Link href="/employee/properties" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3 rounded hover:bg-slate-100">
                <Building size={20} /> Properties
              </Link>
              <Link href="/employee/leads" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3 rounded hover:bg-slate-100">
                <Users size={20} /> Leads
              </Link>
              <Link href="/employee/followups" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3 rounded hover:bg-slate-100">
                <PhoneCall size={20} /> Follow-ups
              </Link>
              <Link href="/employee/attendance" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3 rounded hover:bg-slate-100">
                <Clock size={20} /> Attendance
              </Link>
              <Link href="/employee/reports" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3 rounded hover:bg-slate-100">
                <FileText size={20} /> Daily Report
              </Link>
              <Link href="/employee/notifications" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3 rounded hover:bg-slate-100">
                <Bell size={20} /> Notifications
              </Link>
              <Link href="/employee/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3 rounded hover:bg-slate-100">
                <User size={20} /> Profile
              </Link>
            </div>
            <div className="p-4 border-t">
              <form action={logout}>
                <button className="flex w-full items-center gap-3 p-3 text-red-600 rounded hover:bg-red-50">
                  <LogOut size={20} /> Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20 sm:pb-0">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>

      {/* Bottom Navigation for Mobile (Sticky) */}
      <nav className="sm:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around p-3 z-40 pb-safe">
        <Link href="/employee/dashboard" className="flex flex-col items-center gap-1 text-slate-600 hover:text-navy-900">
          <Home size={24} />
          <span className="text-xs font-medium">Home</span>
        </Link>
        <Link href="/employee/tasks" className="flex flex-col items-center gap-1 text-slate-600 hover:text-navy-900">
          <ClipboardList size={24} />
          <span className="text-xs font-medium">Tasks</span>
        </Link>
        <Link href="/employee/properties/new" className="flex flex-col items-center gap-1 text-slate-600 hover:text-navy-900">
          <div className="bg-navy-900 text-white p-2 rounded-full -mt-5 shadow-lg border-4 border-slate-50">
            <Building size={24} />
          </div>
          <span className="text-xs font-medium mt-1">Add Prop</span>
        </Link>
        <Link href="/employee/leads" className="flex flex-col items-center gap-1 text-slate-600 hover:text-navy-900">
          <Users size={24} />
          <span className="text-xs font-medium">Leads</span>
        </Link>
        <button onClick={() => setIsMenuOpen(true)} className="flex flex-col items-center gap-1 text-slate-600 hover:text-navy-900">
          <Menu size={24} />
          <span className="text-xs font-medium">More</span>
        </button>
      </nav>
    </div>
  )
}
