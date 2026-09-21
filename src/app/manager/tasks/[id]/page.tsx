import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { MapPin, Image as ImageIcon, ExternalLink, Calendar, CheckCircle2, User, Clock, AlertTriangle } from 'lucide-react'
import { TaskReviewActions } from '@/components/manager/task-review-actions'
import Link from 'next/link'

export default async function ManagerTaskDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient()

  const { data: task } = await supabase
    .from('tasks')
    .select(`
      *,
      assigned_to_profile:profiles!tasks_assigned_to_fkey(full_name, email, phone),
      task_updates(*)
    `)
    .eq('id', id)
    .single()

  if (!task) return notFound()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updates = task.task_updates?.sort((a: any, b: any) => 
    new Date(b.created_at as string).getTime() - new Date(a.created_at as string).getTime()
  ) || []

  // Extract all proof images from updates
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const proofUpdates = updates.filter((u: any) => u.notes && (u.notes.includes('**Proof of Work:**') || u.notes.includes('http')))

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-lg border shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/manager/tasks" className="text-xs font-semibold text-blue-600 hover:underline">
              ← Back to All Tasks
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-navy-900">{task.title}</h1>
          <p className="text-muted-foreground flex items-center gap-1.5 text-sm mt-1">
            <MapPin size={16} className="text-red-500" />
            {task.area || 'Field Area'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={`px-3 py-1.5 text-sm font-semibold capitalize ${
            task.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' :
            task.status === 'submitted' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
            'bg-blue-100 text-blue-800 border-blue-200'
          }`}>
            {task.status.replace('_', ' ')}
          </Badge>
        </div>
      </div>

      {/* Review Actions Card if submitted */}
      <TaskReviewActions taskId={task.id} currentStatus={task.status} />

      {/* Proof of Work Highlight Card */}
      {proofUpdates.length > 0 && (
        <Card className="border-2 border-yellow-500/40 shadow-md overflow-hidden">
          <CardHeader className="bg-yellow-50/80 border-b pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-navy-900">
              <ImageIcon size={22} className="text-yellow-600" /> Submitted Proof of Work
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {proofUpdates.map((update: any) => {
              let photoUrl = ''
              if (update.notes?.includes('**Proof of Work:**')) {
                photoUrl = update.notes.split('**Proof of Work:**')[1]?.trim()
              } else {
                const match = update.notes?.match(/https?:\/\/[^\s]+/)
                if (match) photoUrl = match[0]
              }

              const cleanNotes = update.notes?.split('**Proof of Work:**')[0]?.trim()

              return (
                <div key={update.id} className="space-y-4">
                  {cleanNotes && (
                    <div className="bg-slate-50 p-4 rounded-lg border text-sm text-slate-800">
                      <span className="font-semibold block mb-1 text-xs uppercase tracking-wider text-slate-500">Employee Notes:</span>
                      <p className="whitespace-pre-wrap">{cleanNotes}</p>
                    </div>
                  )}

                  {photoUrl ? (
                    <div className="space-y-2">
                      <div className="relative group rounded-xl overflow-hidden border-2 border-slate-200 bg-black/5 max-w-lg shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={photoUrl} 
                          alt="Task Completion Proof" 
                          className="w-full h-auto max-h-96 object-contain rounded-lg transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex items-center gap-3 pt-1">
                        <a 
                          href={photoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-md border border-blue-200"
                        >
                          <ExternalLink size={14} /> Open Full Size Proof Image
                        </a>
                        {update.created_at && (
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock size={12} /> Uploaded {format(new Date(update.created_at), 'PP p')}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 text-xs text-yellow-800 flex items-center gap-2">
                      <AlertTriangle size={16} /> Image upload error recorded in update note.
                    </div>
                  )}

                  {update.latitude && update.longitude && (
                    <div className="pt-2 border-t flex items-center gap-2 text-xs">
                      <MapPin size={14} className="text-green-600" />
                      <span className="font-semibold text-slate-700">GPS Location Logged:</span>
                      <a 
                        href={`https://maps.google.com/?q=${update.latitude},${update.longitude}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-mono"
                      >
                        {update.latitude.toFixed(5)}, {update.longitude.toFixed(5)} (View on Google Maps 🗺️)
                      </a>
                    </div>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Task Details Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Task Instructions & Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-slate-50 p-4 rounded-lg border">
            <div>
              <span className="text-muted-foreground block text-xs flex items-center gap-1">
                <User size={12} /> Assigned To
              </span>
              <span className="font-semibold text-navy-900">{task.assigned_to_profile?.full_name || 'N/A'}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs flex items-center gap-1">
                <CheckCircle2 size={12} /> Target Count
              </span>
              <span className="font-semibold">{task.target_count || 'N/A'}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs">Priority</span>
              <span className="uppercase font-semibold text-orange-600">{task.priority}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs flex items-center gap-1">
                <Calendar size={12} /> Due Date
              </span>
              <span className="font-semibold">{task.due_date ? format(new Date(task.due_date), 'PP') : 'N/A'}</span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <span className="text-muted-foreground block mb-2 text-xs font-semibold uppercase tracking-wider">Detailed Description</span>
            <p className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-md border">
              {task.description || 'No detailed instructions provided.'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Full Update History Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Full Task Update History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
            {updates.length === 0 ? (
              <p className="text-center text-muted-foreground py-4 text-sm">No updates recorded yet.</p>
            ) : (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              updates.map((update: any) => {
                const photoMatch = update.notes?.match(/https?:\/\/[^\s]+/)
                const photoUrl = photoMatch ? photoMatch[0] : null
                const cleanNotes = update.notes?.split('**Proof of Work:**')[0]?.trim()

                return (
                  <div key={update.id} className="relative z-10 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white border-4 border-slate-100 shadow flex items-center justify-center shrink-0 mt-1">
                      <div className={`w-3.5 h-3.5 rounded-full ${
                        update.status === 'completed' ? 'bg-green-600' :
                        update.status === 'submitted' ? 'bg-yellow-500' :
                        'bg-navy-900'
                      }`} />
                    </div>
                    <div className="flex-1 bg-slate-50 rounded-lg p-4 shadow-sm border border-slate-200">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="capitalize bg-white">{update.status.replace('_', ' ')}</Badge>
                        <span className="text-xs text-slate-500 font-medium">
                          {format(new Date(update.created_at), 'PP p')}
                        </span>
                      </div>
                      {cleanNotes && (
                        <div className="mt-2 text-sm text-slate-700 bg-white p-3 rounded-md border whitespace-pre-wrap">
                          {cleanNotes}
                        </div>
                      )}
                      {photoUrl && (
                        <div className="mt-3 pt-3 border-t">
                          <span className="text-xs font-semibold text-slate-500 block mb-2">Proof Image Attachment:</span>
                          <a href={photoUrl} target="_blank" rel="noopener noreferrer" className="block w-40 h-28 border rounded-lg overflow-hidden relative group">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={photoUrl} alt="Proof" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
