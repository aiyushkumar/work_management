import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default async function EmployeeTasks() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('assigned_to', user?.id)
    .order('due_date', { ascending: true })

  const pendingTasks = tasks?.filter(t => ['assigned', 'accepted', 'in_progress'].includes(t.status)) || []
  const completedTasks = tasks?.filter(t => ['submitted', 'approved', 'completed'].includes(t.status)) || []

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy-900">My Tasks</h1>

      <div>
        <h2 className="text-lg font-semibold mb-3">Pending ({pendingTasks.length})</h2>
        <div className="space-y-4">
          {pendingTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground bg-white p-4 rounded-lg text-center border">You have no pending tasks.</p>
          ) : (
            pendingTasks.map((task) => (
              <Link key={task.id} href={`/employee/tasks/${task.id}`} className="block">
                <Card className="shadow-sm hover:border-navy-900 transition-colors border-l-4 border-l-navy-900">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-navy-900 line-clamp-1">{task.title}</h3>
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${
                        task.priority === 'urgent' ? 'bg-red-50 text-red-700 border-red-200' :
                        task.priority === 'high' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                        'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {task.priority.toUpperCase()}
                      </span>
                    </div>
                    
                    {task.description && (
                      <p className="text-sm text-slate-600 line-clamp-2 mt-2 bg-slate-50 p-2 rounded border border-slate-100">
                        {task.description}
                      </p>
                    )}
                    
                    <div className="flex flex-col gap-1 text-sm text-slate-600 mt-3 font-medium">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-red-500" />
                        <span>{task.area}</span>
                      </div>
                      <div className="flex justify-between items-center w-full">
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-slate-400" />
                          <span>Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'} {task.due_time}</span>
                        </div>
                        <div className="bg-slate-100 px-2 py-1 rounded text-xs">
                          Target: {task.target_count || '-'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t flex justify-between items-center text-navy-900 text-sm font-bold uppercase tracking-wide">
                      <span className="text-slate-500 text-xs">Status: <span className="text-navy-900">{task.status.replace('_', ' ')}</span></span>
                      <span className="flex items-center gap-1 hover:text-yellow-600 transition-colors">Start <ArrowRight size={16} /></span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Completed ({completedTasks.length})</h2>
        <div className="space-y-4 opacity-75">
          {completedTasks.map((task) => (
             <Link key={task.id} href={`/employee/tasks/${task.id}`} className="block">
              <Card className="shadow-sm bg-slate-50">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-slate-700 line-clamp-1">{task.title}</h3>
                  <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                    <span>{task.area}</span>
                    <span className="capitalize">{task.status}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
