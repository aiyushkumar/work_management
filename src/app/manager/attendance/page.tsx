import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format, differenceInMinutes } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Clock, MapPin, User, CheckCircle2, Calendar, ShieldAlert, Navigation } from 'lucide-react'

export default async function ManagerAttendance() {
  const supabase = await createClient()

  // 1. Primary Query: Try join with profiles
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let attendanceRecords: any[] = []
  let fetchError: string | null = null

  const { data: primaryData, error: primaryErr } = await supabase
    .from('attendance')
    .select(`
      *,
      profiles(full_name, email, phone)
    `)
    .order('date', { ascending: false })

  if (!primaryErr && primaryData && primaryData.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    attendanceRecords = primaryData.map((item: any) => ({
      ...item,
      employee_name: item.profiles?.full_name || 'Employee',
      employee_email: item.profiles?.email || '',
      employee_phone: item.profiles?.phone || '',
    }))
  } else {
    // 2. Fallback Query: Query attendance directly and fetch matching profiles
    const { data: rawAttendance, error: rawErr } = await supabase
      .from('attendance')
      .select('*')
      .order('date', { ascending: false })

    if (rawErr) {
      fetchError = rawErr.message
    } else if (rawAttendance && rawAttendance.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const empIds = Array.from(new Set(rawAttendance.map((r: any) => r.employee_id).filter(Boolean)))
      
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone')
        .in('id', empIds)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const profileMap = new Map(profilesData?.map((p: any) => [p.id, p]))

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      attendanceRecords = rawAttendance.map((item: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const p: any = profileMap.get(item.employee_id)
        return {
          ...item,
          employee_name: p?.full_name || `Employee (${item.employee_id?.slice(0, 6)})`,
          employee_email: p?.email || '',
          employee_phone: p?.phone || '',
        }
      })
    }
  }

  // Calculate Summary Stats
  const today = new Date().toISOString().split('T')[0]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const todayRecords = attendanceRecords.filter((r: any) => r.date === today)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const activeWorkingNow = todayRecords.filter((r: any) => r.check_in && !r.check_out).length
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const completedToday = todayRecords.filter((r: any) => r.check_in && r.check_out).length

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy-900">Attendance Log</h1>
          <p className="text-muted-foreground mt-1">Real-time GPS check-in and check-out records of field staff.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-white px-3 py-1 text-sm font-semibold border-slate-300">
            Today: {todayRecords.length} Active Logins
          </Badge>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-t-4 border-t-green-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Currently Working in Field</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500 animate-ping" />
              {activeWorkingNow} Employees
            </div>
            <p className="text-xs text-muted-foreground mt-1">Checked in today, check-out pending</p>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-blue-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Completed Shift Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700 flex items-center gap-2">
              <CheckCircle2 size={24} />
              {completedToday} Employees
            </div>
            <p className="text-xs text-muted-foreground mt-1">Check-in & Check-out logged</p>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-navy-900 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Attendance Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-navy-900">{attendanceRecords.length} Records</div>
            <p className="text-xs text-muted-foreground mt-1">All time attendance logs</p>
          </CardContent>
        </Card>
      </div>

      {/* Database RLS Warning Notice if records are empty */}
      {attendanceRecords.length === 0 && (
        <Card className="border-amber-300 bg-amber-50 shadow-sm">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center gap-2 font-bold text-amber-900 text-base">
              <ShieldAlert size={20} className="text-amber-600" />
              No Attendance Records Found or Supabase RLS Access Required
            </div>
            <p className="text-sm text-amber-800 leading-relaxed">
              If an employee clicked <strong>"START FIELD WORK"</strong> but the record isn't showing here, it is usually because Supabase Row Level Security (RLS) on the <code>attendance</code> table is restricting reads to the employee who created it.
            </p>
            <div className="bg-white p-4 rounded-md border border-amber-200 text-xs font-mono text-slate-800 space-y-1">
              <p className="font-bold text-slate-600 font-sans">To allow managers to view all employee attendance, run this SQL in Supabase SQL Editor:</p>
              <pre className="text-blue-700 bg-slate-50 p-2 rounded overflow-x-auto">
{`-- Allow active managers to view all attendance records
CREATE POLICY "Managers can view all attendance" 
ON public.attendance FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'manager'
  )
);`}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attendance Log Table / Cards */}
      <div className="space-y-4">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {attendanceRecords.map((record: any) => {
          let durationStr = 'In Progress...'
          if (record.check_in && record.check_out) {
            const mins = differenceInMinutes(new Date(record.check_out), new Date(record.check_in))
            const hrs = Math.floor(mins / 60)
            const remainingMins = mins % 60
            durationStr = `${hrs}h ${remainingMins}m`
          }

          const isWorkingNow = record.check_in && !record.check_out
          const initialLetter = record.employee_name?.charAt(0).toUpperCase() || 'E'

          return (
            <Card key={record.id} className={`shadow-sm border transition-all ${isWorkingNow ? 'border-l-4 border-l-green-500 bg-green-50/20' : ''}`}>
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-navy-900 text-yellow-400 rounded-full flex items-center justify-center font-bold text-lg shadow-sm">
                      {initialLetter}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-navy-900">{record.employee_name}</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                        <Calendar size={13} /> {record.date ? format(new Date(record.date), 'PPPP') : 'No Date'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isWorkingNow ? (
                      <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-green-100 text-green-800 border border-green-300 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-green-600 animate-ping" /> Working Now
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {record.status || 'Completed'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-sm">
                  {/* Check In Info */}
                  <div className="bg-slate-50 p-3 rounded-lg border space-y-1">
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                      <Clock size={13} className="text-green-600" /> Check In Time
                    </span>
                    <p className="font-bold text-navy-900 text-base">
                      {record.check_in ? format(new Date(record.check_in), 'p') : '---'}
                    </p>
                    {record.check_in_latitude && record.check_in_longitude && (
                      <a 
                        href={`https://maps.google.com/?q=${record.check_in_latitude},${record.check_in_longitude}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline pt-1"
                      >
                        <MapPin size={12} className="text-red-500" /> Check-in Location 🗺️
                      </a>
                    )}
                  </div>

                  {/* Check Out Info */}
                  <div className="bg-slate-50 p-3 rounded-lg border space-y-1">
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                      <Clock size={13} className="text-red-600" /> Check Out Time
                    </span>
                    <p className="font-bold text-navy-900 text-base">
                      {record.check_out ? format(new Date(record.check_out), 'p') : 'Pending Check-Out'}
                    </p>
                    {record.check_out_latitude && record.check_out_longitude && (
                      <a 
                        href={`https://maps.google.com/?q=${record.check_out_latitude},${record.check_out_longitude}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline pt-1"
                      >
                        <MapPin size={12} className="text-red-500" /> Check-out Location 🗺️
                      </a>
                    )}
                  </div>

                  {/* Total Work Hours */}
                  <div className="bg-slate-50 p-3 rounded-lg border space-y-1">
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                      <Navigation size={13} className="text-blue-600" /> Total Field Hours
                    </span>
                    <p className="font-bold text-navy-900 text-base">
                      {durationStr}
                    </p>
                    <p className="text-xs text-slate-500">
                      {record.check_in_accuracy ? `GPS Accuracy: ±${Math.round(record.check_in_accuracy)}m` : 'GPS Logged'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {attendanceRecords.length === 0 && !fetchError && (
          <div className="bg-white p-12 text-center rounded-lg border shadow-sm space-y-3">
            <User size={40} className="mx-auto text-slate-400" />
            <h3 className="font-bold text-lg text-navy-900">No Attendance Submitted Yet</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              When field employees click "START FIELD WORK" or "END FIELD WORK" on their dashboard, their GPS location and check-in times will automatically populate here.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
