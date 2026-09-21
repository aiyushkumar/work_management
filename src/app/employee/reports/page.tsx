import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { format } from 'date-fns'

export default async function EmployeeReports() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: reports } = await supabase
    .from('daily_reports')
    .select('*')
    .eq('employee_id', user?.id)
    .order('date', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-navy-900">Daily Reports</h1>
        <Link href="/employee/reports/new">
          <Button className="bg-navy-900">+ Submit Report</Button>
        </Link>
      </div>
      
      <div className="grid gap-4">
        {reports?.map(report => (
          <Card key={report.id}>
            <CardHeader className="pb-2">
              <CardTitle>{format(new Date(report.date), 'PPPP')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>Tasks: {report.tasks_completed}</div>
                <div>Properties: {report.properties_found}</div>
                <div>Leads: {report.buyer_leads + report.renter_leads}</div>
              </div>
              <p className="text-sm text-slate-600 line-clamp-2">{report.today_notes}</p>
            </CardContent>
          </Card>
        ))}
        {(!reports || reports.length === 0) && (
          <p className="text-muted-foreground">You haven&apos;t submitted any reports yet.</p>
        )}
      </div>
    </div>
  )
}
