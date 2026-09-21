import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'

export default async function ManagerReports() {
  const supabase = await createClient()
  const { data: reports } = await supabase
    .from('daily_reports')
    .select(`
      *,
      profile:profiles!daily_reports_employee_id_fkey(full_name)
    `)
    .order('date', { ascending: false })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy-900">Daily Reports</h1>
      
      <div className="grid gap-4">
        {reports?.map(report => (
          <Card key={report.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle>{report.profile?.full_name}</CardTitle>
                <span className="text-sm font-medium">{format(new Date(report.date), 'PP')}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                <div><span className="text-muted-foreground">Tasks:</span> {report.tasks_completed}/{report.tasks_assigned}</div>
                <div><span className="text-muted-foreground">Properties:</span> {report.properties_found}</div>
                <div><span className="text-muted-foreground">Leads:</span> {report.buyer_leads + report.renter_leads}</div>
                <div><span className="text-muted-foreground">Follow-ups:</span> {report.followups_completed}</div>
              </div>
              <div className="space-y-2 text-sm border-t pt-4">
                <div><strong>Notes:</strong> {report.today_notes || 'None'}</div>
                <div><strong>Problems:</strong> {report.problems_faced || 'None'}</div>
                <div><strong>Plan Tomorrow:</strong> {report.tomorrow_plan || 'None'}</div>
              </div>
            </CardContent>
          </Card>
        ))}
        {(!reports || reports.length === 0) && (
          <p className="text-muted-foreground">No reports submitted yet.</p>
        )}
      </div>
    </div>
  )
}
