import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'

export default async function ManagerAttendance() {
  const supabase = await createClient()
  const { data: attendance } = await supabase
    .from('attendance')
    .select(`
      *,
      profile:profiles!attendance_employee_id_fkey(full_name)
    `)
    .order('date', { ascending: false })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy-900">Attendance Log</h1>
      
      <div className="grid gap-4">
        {attendance?.map(record => (
          <Card key={record.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{record.profile?.full_name}</h3>
                  <p className="text-sm text-muted-foreground">{format(new Date(record.date), 'PPPP')}</p>
                </div>
                <Badge>{record.status}</Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                <div>
                  <span className="text-muted-foreground block">Check In</span>
                  {record.check_in ? format(new Date(record.check_in), 'p') : '---'}
                </div>
                <div>
                  <span className="text-muted-foreground block">Check Out</span>
                  {record.check_out ? format(new Date(record.check_out), 'p') : '---'}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {(!attendance || attendance.length === 0) && (
          <p className="text-muted-foreground">No attendance records found.</p>
        )}
      </div>
    </div>
  )
}
