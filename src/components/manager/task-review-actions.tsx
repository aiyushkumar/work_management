'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { updateTaskReviewStatus } from '@/app/manager/actions'

interface TaskReviewActionsProps {
  taskId: string
  currentStatus: string
}

export function TaskReviewActions({ taskId, currentStatus }: TaskReviewActionsProps) {
  const [loading, setLoading] = useState(false)
  const [rejecting, setRejecting] = useState(false)
  const [notes, setNotes] = useState('')

  const handleReview = async (action: 'approve' | 'reject') => {
    setLoading(true)
    try {
      await updateTaskReviewStatus(taskId, action, notes || undefined)
      setRejecting(false)
      setNotes('')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (currentStatus === 'completed') {
    return (
      <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold">
          <CheckCircle size={20} /> Task Approved & Completed
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider bg-green-200 text-green-900 px-3 py-1 rounded-full">
          Approved
        </span>
      </div>
    )
  }

  return (
    <div className="bg-white p-5 rounded-lg border shadow-sm space-y-4">
      <h3 className="font-bold text-navy-900 text-base">Manager Review & Verification</h3>

      {!rejecting ? (
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => handleReview('approve')}
            disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold h-11"
          >
            {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <CheckCircle className="mr-2 h-5 w-5" />}
            Approve Task & Mark Completed
          </Button>

          <Button
            onClick={() => setRejecting(true)}
            disabled={loading}
            variant="outline"
            className="flex-1 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 font-semibold h-11"
          >
            <XCircle className="mr-2 h-5 w-5" />
            Reject & Request Revision
          </Button>
        </div>
      ) : (
        <div className="space-y-3 bg-red-50 p-4 rounded-lg border border-red-200">
          <label className="text-sm font-semibold text-red-900 block">
            Reason for Rejection / Instructions for Employee
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Explain why the proof was rejected or what needs to be fixed..."
            rows={3}
            className="w-full text-sm p-3 rounded-md border border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setRejecting(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => handleReview('reject')}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : 'Confirm Rejection'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
