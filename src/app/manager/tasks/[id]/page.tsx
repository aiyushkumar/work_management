import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { MapPin } from 'lucide-react'

export default async function ManagerTaskDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient()

  const { data: task } = await supabase
    .from('tasks')
    .select(`
      *,
      assigned_to_profile:profiles!tasks_assigned_to_fkey(full_name),
      task_updates(*)
    `)
    .eq('id', id)
    .single()

  if (!task) return notFound()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updates = task.task_updates?.sort((a: any, b: any) => 
    new Date(b.created_at as string).getTime() - new Date(a.created_at as string).getTime()
  ) || []

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">{task.title}</h1>
          <p className="text-muted-foreground flex items-center gap-1 mt-1">
            <MapPin size={16} />
            {task.area}
          </p>
        </div>
        <Badge className="text-sm px-3 py-1">{task.status}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
            <div>
              <span className="text-muted-foreground block">Assigned To</span>
              {task.assigned_to_profile?.full_name}
            </div>
            <div>
              <span className="text-muted-foreground block">Target</span>
              {task.target_count || 'N/A'}
            </div>
            <div>
              <span className="text-muted-foreground block">Priority</span>
              <span className="uppercase">{task.priority}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Due Date</span>
              {task.due_date ? format(new Date(task.due_date), 'PP') : 'N/A'}
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <span className="text-muted-foreground block mb-1">Description</span>
            <p className="whitespace-pre-wrap">{task.description}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Update History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
            {updates.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No updates recorded yet.</p>
            ) : (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              updates.map((update: any) => (
                <div key={update.id} className="relative z-10 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white border-4 border-slate-50 shadow flex items-center justify-center shrink-0">
                    <div className="w-3 h-3 rounded-full bg-navy-900" />
                  </div>
                  <div className="flex-1 bg-slate-50 rounded-lg p-4 shadow-sm border border-slate-100">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline">{update.status}</Badge>
                      <span className="text-xs text-slate-500">
                        {format(new Date(update.created_at), 'PP p')}
                      </span>
                    </div>
                    {update.notes && (
                      <div className="mt-2 text-sm text-slate-700 bg-white p-3 rounded-md border whitespace-pre-wrap">
                        {update.notes.includes('**Proof of Work:**') ? (
                          <>
                            <div>{update.notes.split('**Proof of Work:**')[0]}</div>
                            <div className="mt-2 pt-2 border-t">
                              <span className="font-semibold block mb-1">Proof Photo:</span>
                              <a href={update.notes.split('**Proof of Work:**\n')[1]} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all font-medium">
                                View Proof of Work 📸
                              </a>
                            </div>
                          </>
                        ) : (
                          update.notes
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
