import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ClipboardList, CheckCircle2, Clock, MapPin } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function EmployeeDashboard() {
  const supabase = await createClient()

  // Get current user profile
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  // Fetch today's tasks
  const today = new Date().toISOString().split('T')[0]
  
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('assigned_to', user?.id)
    .gte('due_date', today)
    .order('priority', { ascending: false })

  const pendingTasks = tasks?.filter(t => ['assigned', 'accepted', 'in_progress'].includes(t.status)) || []
  const completedTasks = tasks?.filter(t => ['submitted', 'approved', 'completed'].includes(t.status)) || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Hello, {profile?.full_name?.split(' ')[0] || 'Employee'}</h1>
        <p className="text-muted-foreground">Here is your daily summary for {new Date().toLocaleDateString()}</p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-white shadow-sm border-t-4 border-t-yellow-500">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex justify-between">
              Pending Tasks
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{pendingTasks.length}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm border-t-4 border-t-green-500">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex justify-between">
              Completed
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{completedTasks.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/employee/properties/new">
          <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2 bg-white hover:bg-slate-50">
            <div className="bg-navy-100 p-3 rounded-full">
              <ClipboardList className="text-navy-900 h-6 w-6" />
            </div>
            <span>Add Property</span>
          </Button>
        </Link>
        <Link href="/employee/attendance">
          <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2 bg-white hover:bg-slate-50">
            <div className="bg-yellow-100 p-3 rounded-full">
              <MapPin className="text-yellow-600 h-6 w-6" />
            </div>
            <span>Check-In</span>
          </Button>
        </Link>
      </div>

      {/* Today's Tasks */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Today&apos;s Tasks</h2>
          <Link href="/employee/tasks" className="text-sm text-navy-900 font-medium">View All</Link>
        </div>
        
        <div className="space-y-4">
          {pendingTasks.length === 0 ? (
            <Card className="bg-slate-50 border-dashed">
              <CardContent className="p-8 text-center text-muted-foreground">
                <CheckCircle2 className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                <p>No pending tasks for today!</p>
              </CardContent>
            </Card>
          ) : (
            pendingTasks.map((task) => (
              <Card key={task.id} className="shadow-sm border-l-4 border-l-navy-900">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-navy-900 leading-tight">{task.title}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1 font-medium">
                        <MapPin size={14} className="text-red-500" />
                        {task.area}
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${
                      task.priority === 'urgent' ? 'bg-red-50 text-red-700 border-red-200' :
                      task.priority === 'high' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                      'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {task.priority.toUpperCase()}
                    </span>
                  </div>
                  
                  {task.description && (
                    <div className="mb-4 text-sm text-slate-600 bg-slate-50 p-3 rounded-md border border-slate-100 line-clamp-2">
                      <span className="font-semibold text-slate-700 block mb-1">Instructions:</span>
                      {task.description}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-2 mb-4 text-sm bg-slate-50 p-2 rounded-md">
                    <div>
                      <span className="text-slate-500 block text-xs">Due Date</span>
                      <span className="font-medium">{task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-xs">Target</span>
                      <span className="font-medium">{task.target_count || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status: {task.status.replace('_', ' ')}</span>
                    <Link href={`/employee/tasks/${task.id}`}>
                      <Button size="sm" className="bg-navy-900 hover:bg-navy-800 shadow-md">Start Task</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
