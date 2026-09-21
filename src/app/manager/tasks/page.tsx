import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Image as ImageIcon, Eye, CheckCircle2, Clock, AlertCircle } from 'lucide-react'

export default async function ManagerTasksList() {
  const supabase = await createClient()

  // Fetch all tasks with employee names and updates
  const { data: tasks } = await supabase
    .from('tasks')
    .select(`
      *,
      assigned_to:profiles!tasks_assigned_to_fkey(full_name),
      task_updates(*)
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy-900">Task Management</h1>
          <p className="text-muted-foreground mt-1">Assign field tasks, review employee submissions, and verify proof photos.</p>
        </div>
        <Link href="/manager/tasks/new">
          <Button className="bg-navy-900 hover:bg-navy-800 text-white font-semibold shadow-sm">
            + Assign New Task
          </Button>
        </Link>
      </div>

      <Card className="shadow-sm border overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-100/80 text-slate-700 border-b">
                <tr>
                  <th className="px-4 py-3.5 font-bold">Task Title</th>
                  <th className="px-4 py-3.5 font-bold">Assigned Employee</th>
                  <th className="px-4 py-3.5 font-bold">Status</th>
                  <th className="px-4 py-3.5 font-bold">Proof Attachment</th>
                  <th className="px-4 py-3.5 font-bold">Priority</th>
                  <th className="px-4 py-3.5 font-bold">Due Date</th>
                  <th className="px-4 py-3.5 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y bg-white">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {tasks?.map((task: any) => {
                  // Check if any updates have proof photos attached
                  const hasProof = task.task_updates?.some(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (u: any) => u.notes && (u.notes.includes('**Proof of Work:**') || u.notes.includes('http'))
                  )

                  return (
                    <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-4 font-semibold text-navy-900">
                        <Link href={`/manager/tasks/${task.id}`} className="hover:text-blue-600 hover:underline">
                          {task.title}
                        </Link>
                      </td>
                      <td className="px-4 py-4 text-slate-700 font-medium">
                        {task.assigned_to?.full_name || 'Unassigned'}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border ${
                          task.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' :
                          task.status === 'submitted' ? 'bg-yellow-100 text-yellow-800 border-yellow-300 animate-pulse' :
                          task.status === 'in_progress' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                          'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                          {task.status === 'completed' && <CheckCircle2 size={12} />}
                          {task.status === 'submitted' && <Clock size={12} />}
                          {task.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {hasProof ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-md border border-green-200">
                            <ImageIcon size={14} className="text-green-600" /> Photo Attached 📸
                          </span>
                        ) : task.status === 'submitted' ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                            <AlertCircle size={14} /> Notes submitted
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">No proof yet</span>
                        )}
                      </td>
                      <td className="px-4 py-4 capitalize text-xs font-semibold text-slate-600">
                        {task.priority}
                      </td>
                      <td className="px-4 py-4 text-xs text-slate-600">
                        {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Link href={`/manager/tasks/${task.id}`}>
                          <Button size="sm" variant="outline" className="text-navy-900 border-navy-900 hover:bg-navy-900 hover:text-white transition-colors">
                            <Eye size={14} className="mr-1.5" /> View & Review
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  )
                })}

                {(!tasks || tasks.length === 0) && (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                      No tasks created yet. Click "+ Assign New Task" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
