import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, CheckSquare, Home, UserCheck, Clock, MapPin, Building, UsersRound, PhoneCall } from 'lucide-react'

export default async function ManagerDashboard() {
  const supabase = await createClient()

  // Fetch logged in manager profile
  const { data: { user } } = await supabase.auth.getUser()
  const { data: managerProfile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user?.id)
    .single()

  // 1. Employee Stats
  const { count: totalEmployees } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'employee')
    
  const { count: pendingEmployees } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'employee')
    .eq('status', 'pending')

  const { count: activeEmployees } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'employee')
    .eq('status', 'active')

  // 2. Task Stats
  const today = new Date().toISOString().split('T')[0]
  const { data: tasksToday } = await supabase
    .from('tasks')
    .select('status')
    .gte('created_at', today)

  const completedTasks = tasksToday?.filter(t => ['submitted', 'approved', 'completed'].includes(t.status)).length || 0
  const pendingTasks = tasksToday?.filter(t => ['assigned', 'accepted', 'in_progress'].includes(t.status)).length || 0
  const totalTasksToday = tasksToday?.length || 0

  // 3. Property Stats
  const { data: allProperties } = await supabase
    .from('properties')
    .select('status')

  const totalPropertiesSubmitted = allProperties?.length || 0
  const pendingVerificationProperties = allProperties?.filter(p => p.status === 'submitted').length || 0
  const approvedProperties = allProperties?.filter(p => p.status === 'approved').length || 0

  // 4. Lead Stats
  const { count: totalLeads } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    
  const { count: todayFollowups } = await supabase
    .from('lead_followups')
    .select('*', { count: 'exact', head: true })
    .eq('followup_date', today)
    .neq('status', 'completed')

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-bold text-navy-900">
          Welcome back, {managerProfile?.full_name || 'Manager'} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Manager Dashboard — Real-time overview for {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* TEAM STATS */}
        <Card className="shadow-sm border-t-4 border-t-blue-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-slate-700 flex items-center gap-2">
              <Users className="text-blue-600" size={20} /> Team Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-muted-foreground">Total Employees</span>
              <span className="text-xl font-bold">{totalEmployees || 0}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-muted-foreground">Active Employees</span>
              <span className="text-xl font-bold text-green-600">{activeEmployees || 0}</span>
            </div>
            <div className="flex justify-between items-center pb-2">
              <span className="text-muted-foreground">Pending Approval</span>
              <span className="text-xl font-bold text-yellow-600">{pendingEmployees || 0}</span>
            </div>
          </CardContent>
        </Card>

        {/* TASK STATS */}
        <Card className="shadow-sm border-t-4 border-t-yellow-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-slate-700 flex items-center gap-2">
              <CheckSquare className="text-yellow-500" size={20} /> Today&apos;s Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-muted-foreground">Total Tasks Assigned</span>
              <span className="text-xl font-bold">{totalTasksToday}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-muted-foreground">Completed</span>
              <span className="text-xl font-bold text-green-600">{completedTasks}</span>
            </div>
            <div className="flex justify-between items-center pb-2">
              <span className="text-muted-foreground">Pending</span>
              <span className="text-xl font-bold text-yellow-600">{pendingTasks}</span>
            </div>
          </CardContent>
        </Card>

        {/* PROPERTY STATS */}
        <Card className="shadow-sm border-t-4 border-t-indigo-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-slate-700 flex items-center gap-2">
              <Building className="text-indigo-500" size={20} /> Properties
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-muted-foreground">Total Submitted</span>
              <span className="text-xl font-bold">{totalPropertiesSubmitted}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-muted-foreground">Pending Verification</span>
              <span className="text-xl font-bold text-yellow-600">{pendingVerificationProperties}</span>
            </div>
            <div className="flex justify-between items-center pb-2">
              <span className="text-muted-foreground">Approved Properties</span>
              <span className="text-xl font-bold text-green-600">{approvedProperties}</span>
            </div>
          </CardContent>
        </Card>

        {/* LEADS & FOLLOW-UPS */}
        <Card className="shadow-sm border-t-4 border-t-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-slate-700 flex items-center gap-2">
              <UsersRound className="text-green-500" size={20} /> Leads & Clients
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-muted-foreground">Total Leads Collected</span>
              <span className="text-xl font-bold">{totalLeads || 0}</span>
            </div>
            <div className="flex justify-between items-center pb-2">
              <span className="text-muted-foreground">Follow-ups Due Today</span>
              <span className="text-xl font-bold text-red-500">{todayFollowups || 0}</span>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
