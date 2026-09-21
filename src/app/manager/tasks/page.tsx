import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function ManagerTasksList() {
  const supabase = await createClient()

  // Fetch all tasks with employee names
  const { data: tasks } = await supabase
    .from('tasks')
    .select(`
      *,
      assigned_to:profiles!tasks_assigned_to_fkey(full_name)
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-navy-900">Task Management</h1>
        <Link href="/manager/tasks/new">
          <Button className="bg-navy-900">+ Assign New Task</Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 border-b">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Employee</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Priority</th>
                  <th className="px-4 py-3 font-medium">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {tasks?.map(task => (
                  <tr key={task.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-navy-900 line-clamp-1">{task.title}</td>
                    <td className="px-4 py-3">{task.assigned_to?.full_name || 'Unknown'}</td>
                    <td className="px-4 py-3">
                      <span className="capitalize px-2 py-1 bg-slate-100 rounded text-xs border">
                        {task.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 capitalize">{task.priority}</td>
                    <td className="px-4 py-3">{task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}</td>
                  </tr>
                ))}
                {(!tasks || tasks.length === 0) && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                      No tasks created yet.
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
