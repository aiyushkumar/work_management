import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Users, Building, FileText } from 'lucide-react'

export default async function ManagerAnalytics() {
  const supabase = await createClient()
  
  // Real stats from DB
  const { count: tasksCount } = await supabase.from('tasks').select('*', { count: 'exact', head: true })
  const { count: completedTasks } = await supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('status', 'completed')
  
  const { count: propertiesCount } = await supabase.from('properties').select('*', { count: 'exact', head: true })
  const { count: approvedProperties } = await supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'approved')

  const { count: leadsCount } = await supabase.from('leads').select('*', { count: 'exact', head: true })
  const { count: activeEmployees } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('status', 'active')

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy-900">Analytics Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeEmployees || 0}</div>
            <p className="text-xs text-muted-foreground">Active in system</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Task Completion</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks || 0} / {tasksCount || 0}</div>
            <p className="text-xs text-muted-foreground">Tasks completed overall</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Properties Found</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{propertiesCount || 0}</div>
            <p className="text-xs text-muted-foreground">{approvedProperties || 0} approved properties</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadsCount || 0}</div>
            <p className="text-xs text-muted-foreground">Captured leads</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
