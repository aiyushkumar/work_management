import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import AttendanceActions from './attendance-actions'
import { Badge } from '@/components/ui/badge'

export default async function EmployeeAttendance() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: records } = await supabase
    .from('attendance')
    .select('*')
    .eq('employee_id', user?.id)
    .order('date', { ascending: false })
    .limit(30)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy-900">Attendance</h1>
      
      <AttendanceActions />
      
      <h2 className="text-xl font-semibold mt-8 mb-4">Recent Records</h2>
      <div className="grid gap-4">
        {records?.map(record => (
          <Card key={record.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{format(new Date(record.date), 'PP')}</span>
                <Badge>{record.status}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mt-2">
                <div>Check In: {record.check_in ? format(new Date(record.check_in), 'p') : '--'}</div>
                <div>Check Out: {record.check_out ? format(new Date(record.check_out), 'p') : '--'}</div>
              </div>
            </CardContent>
          </Card>
        ))}
        {(!records || records.length === 0) && (
          <p className="text-muted-foreground">No attendance records yet.</p>
        )}
      </div>
    </div>
  )
}
