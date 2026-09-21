import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TaskActions } from '@/components/employee/task-actions'
import { MapPin, Target, AlertCircle, Clock, Calendar } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function TaskDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: task } = await supabase
    .from('tasks')
    .select(`
      *,
      task_updates (*)
    `)
    .eq('id', id)
    .eq('assigned_to', user?.id)
    .single()

  if (!task) return notFound()

  // Sort updates by newest first
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updates = task.task_updates?.sort((a: any, b: any) => 
    new Date(b.created_at as string).getTime() - new Date(a.created_at as string).getTime()
  ) || []

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy-900 line-clamp-1">{task.title}</h1>
      </div>

      <Card className="shadow-md border-t-4 border-t-navy-900">
        <CardContent className="p-5 space-y-4 pt-6">
          <div className="flex justify-between items-center mb-2">
            <span className={`px-3 py-1 text-xs font-bold rounded-full ${
              task.status === 'completed' ? 'bg-green-100 text-green-700' :
              task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
              'bg-slate-100 text-slate-700'
            }`}>
              {task.status.toUpperCase().replace('_', ' ')}
            </span>
            <span className={`px-2 py-1 text-[10px] font-bold rounded-md border ${
              task.priority === 'urgent' ? 'border-red-200 text-red-700' :
              task.priority === 'high' ? 'border-orange-200 text-orange-700' :
              'border-blue-200 text-blue-700'
            }`}>
              Priority: {task.priority.toUpperCase()}
            </span>
          </div>

          <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
            {task.description || "No specific instructions provided."}
          </p>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-slate-50 p-3 rounded-lg border flex flex-col gap-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin size={12} /> Target Area
              </span>
              <span className="font-semibold text-sm">{task.area}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border flex flex-col gap-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Target size={12} /> Target Count
              </span>
              <span className="font-semibold text-sm">{task.target_count || 'N/A'}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border flex flex-col gap-1 col-span-2">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar size={12} /> Deadline
              </span>
              <span className="font-semibold text-sm text-red-600">
                {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No date'} 
                {task.due_time ? ` at ${task.due_time}` : ''}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Actions */}
      <TaskActions taskId={task.id} currentStatus={task.status} />

      {/* Quick Add Buttons if in progress */}
      {task.status === 'in_progress' && (
        <div className="grid grid-cols-2 gap-3">
          <Link href={`/employee/properties/new?task_id=${task.id}`}>
            <Button variant="outline" className="w-full text-navy-900 border-navy-900">
              + Add Property
            </Button>
          </Link>
          <Link href={`/employee/leads/new?task_id=${task.id}`}>
            <Button variant="outline" className="w-full text-navy-900 border-navy-900">
              + Add Lead
            </Button>
          </Link>
        </div>
      )}

      {/* Update History */}
      <div>
        <h3 className="font-bold text-lg mb-4 text-navy-900 flex items-center gap-2">
          <Clock size={18} /> Update History
        </h3>
        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
          {updates.length === 0 ? (
            <p className="text-sm text-center text-muted-foreground bg-white p-4 rounded-lg relative z-10 border shadow-sm">
              No updates recorded yet.
            </p>
          ) : (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            updates.map((update: any) => (
              <div key={update.id} className="relative z-10 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white border-4 border-slate-50 shadow flex items-center justify-center shrink-0">
                  <div className={`w-3 h-3 rounded-full ${
                    update.status === 'in_progress' ? 'bg-blue-500' :
                    update.status === 'submitted' ? 'bg-green-500' :
                    'bg-slate-400'
                  }`} />
                </div>
                <div className="bg-white p-3 rounded-lg border shadow-sm flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-sm capitalize">{update.status.replace('_', ' ')}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(update.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {update.notes && (
                    <div className="mt-2 text-sm text-slate-700 bg-slate-50 p-3 rounded-md border whitespace-pre-wrap">
                      {update.notes.includes('**Proof of Work:**') ? (
                        <>
                          <div>{update.notes.split('**Proof of Work:**')[0]}</div>
                          <div className="mt-2 pt-2 border-t">
                            <span className="font-semibold block mb-1">Proof Photo:</span>
                            <a href={update.notes.split('**Proof of Work:**\n')[1]} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all text-xs">
                              {update.notes.split('**Proof of Work:**\n')[1]}
                            </a>
                          </div>
                        </>
                      ) : (
                        update.notes
                      )}
                    </div>
                  )}
                  {update.latitude && (
                    <div className="mt-2 inline-flex items-center gap-1 bg-slate-100 text-xs px-2 py-1 rounded text-slate-500">
                      <MapPin size={10} /> Location logged
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
