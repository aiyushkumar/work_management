'use client'

import { Button } from '@/components/ui/button'
import { updateEmployeeStatus } from '@/app/manager/actions'
import { useState } from 'react'

export function EmployeeApprovalActions({ employeeId }: { employeeId: string }) {
  const [loading, setLoading] = useState(false)

  async function handleApprove() {
    setLoading(true)
    await updateEmployeeStatus(employeeId, 'active')
    setLoading(false)
  }

  async function handleReject() {
    setLoading(true)
    await updateEmployeeStatus(employeeId, 'rejected')
    setLoading(false)
  }

  return (
    <div className="flex gap-2">
      <Button 
        size="sm" 
        onClick={handleApprove} 
        disabled={loading}
        className="bg-green-600 hover:bg-green-700"
      >
        Approve
      </Button>
      <Button 
        size="sm" 
        variant="destructive" 
        onClick={handleReject} 
        disabled={loading}
      >
        Reject
      </Button>
    </div>
  )
}
