'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { updateTaskStatus } from '@/app/employee/actions'
import { CheckCircle, Play } from 'lucide-react'

type TaskActionsProps = {
  taskId: string
  currentStatus: string
}

export function TaskActions({ taskId, currentStatus }: TaskActionsProps) {
  const [loading, setLoading] = useState(false)

  const handleUpdate = async (newStatus: string) => {
    setLoading(true)
    await updateTaskStatus(taskId, newStatus, 'Status updated via app')
    setLoading(false)
  }

  if (['submitted', 'approved', 'completed'].includes(currentStatus)) {
    return (
      <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center justify-center gap-2 border border-green-200">
        <CheckCircle size={20} />
        <span className="font-semibold">Task Completed</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {currentStatus === 'assigned' && (
        <Button 
          className="w-full h-12 text-lg bg-navy-900" 
          onClick={() => handleUpdate('accepted')}
          disabled={loading}
        >
          Accept Task
        </Button>
      )}

      {currentStatus === 'accepted' && (
        <Button 
          className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700" 
          onClick={() => handleUpdate('in_progress')}
          disabled={loading}
        >
          <Play className="mr-2" /> Start Task
        </Button>
      )}

      {currentStatus === 'in_progress' && (
        <form 
          action={async (formData) => {
            setLoading(true)
            const notes = formData.get('notes') as string
            const photo = formData.get('photo') as File
            
            // We will import a special submit action for this
            const { submitTaskCompletion } = await import('@/app/employee/actions')
            await submitTaskCompletion(taskId, notes, photo)
            setLoading(false)
          }}
          className="flex flex-col gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200"
        >
          <div className="space-y-2">
            <label className="text-sm font-semibold">Completion Notes</label>
            <textarea 
              name="notes"
              className="w-full rounded-md border border-slate-300 p-2 text-sm focus:ring-navy-900 focus:border-navy-900"
              rows={3} 
              placeholder="Describe what you accomplished..."
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-navy-900">Proof of Work (Upload Photo)</label>
            <input 
              type="file" 
              name="photo"
              accept="image/*"
              className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-navy-50 file:text-navy-900 hover:file:bg-navy-100 border border-slate-200 p-1 bg-white"
              required
            />
          </div>

          <Button 
            type="submit"
            className="w-full h-12 bg-green-600 hover:bg-green-700 mt-2 text-lg shadow-sm" 
            disabled={loading}
          >
            <CheckCircle className="mr-2 h-5 w-5" /> Submit Task
          </Button>
        </form>
      )}
    </div>
  )
}
