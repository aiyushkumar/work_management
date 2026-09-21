'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { submitAttendance } from '../actions'

export default function AttendanceActions() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAction = async (action: 'check_in' | 'check_out') => {
    setLoading(true)
    setError(null)
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await submitAttendance({
            action,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          setError(err.message || 'Failed to submit attendance')
        } finally {
          setLoading(false)
        }
      },
      (err) => {
        setError('Please allow location access to submit attendance.')
        setLoading(false)
      }
    )
  }

  return (
    <div className="space-y-4 mt-8">
      {error && <div className="p-3 bg-red-100 text-red-600 rounded-md text-sm">{error}</div>}
      
      <div className="grid grid-cols-2 gap-4">
        <Button 
          onClick={() => handleAction('check_in')} 
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 h-16 text-lg"
        >
          {loading ? 'Wait...' : 'START FIELD WORK'}
        </Button>
        <Button 
          onClick={() => handleAction('check_out')} 
          disabled={loading}
          variant="destructive"
          className="h-16 text-lg"
        >
          {loading ? 'Wait...' : 'END FIELD WORK'}
        </Button>
      </div>
    </div>
  )
}
