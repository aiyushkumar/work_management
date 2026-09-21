import { createClient, createAdminClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import { FileText, Calendar, CheckSquare, Building, Users, Clock } from 'lucide-react'

export default async function ManagerReports() {
  const supabase = await createClient()
  await supabase.auth.getUser()

  // Admin client bypasses RLS
  const adminSupabase = await createAdminClient()

  const { data: rawReports } = await adminSupabase
    .from('daily_reports')
    .select('*')
    .order('date', { ascending: false })

  const { data: profiles } = await adminSupabase
    .from('profiles')
    .select('id, full_name, email')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profileMap = new Map((profiles || []).map((p: any) => [p.id, p]))

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reports = (rawReports || []).map((item: any) => ({
    ...item,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    employee_name: (profileMap.get(item.employee_id) as any)?.full_name || `Employee (${item.employee_id?.slice(0, 6)})`,
  }))

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-bold text-navy-900">Daily Work Reports</h1>
        <p className="text-muted-foreground mt-1">End-of-day task summaries, leads collected, and field notes submitted by staff.</p>
      </div>

      <div className="grid gap-4">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {reports?.map((report: any) => (
          <Card key={report.id} className="shadow-sm border">
            <CardHeader className="pb-3 bg-slate-50 border-b">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 text-navy-900 rounded-full flex items-center justify-center font-bold">
                    <FileText size={20} className="text-navy-900" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-navy-900">{report.employee_name}</CardTitle>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Calendar size={12} /> Submitted for {format(new Date(report.date), 'PPPP')}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-semibold text-slate-500 bg-white px-3 py-1 rounded-full border">
                  {format(new Date(report.created_at || report.date), 'p')}
                </span>
              </div>
            </CardHeader>

            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm bg-white p-3.5 rounded-lg border">
                <div className="space-y-0.5">
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><CheckSquare size={12} /> Tasks Done</span>
                  <span className="font-bold text-navy-900 text-base">{report.tasks_completed} Tasks</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Building size={12} /> Properties</span>
                  <span className="font-bold text-navy-900 text-base">{report.properties_found} Found</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Users size={12} /> Leads</span>
                  <span className="font-bold text-navy-900 text-base">{(report.buyer_leads || 0) + (report.renter_leads || 0)} Leads</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock size={12} /> Follow-ups</span>
                  <span className="font-bold text-navy-900 text-base">{report.followups_completed || 0} Done</span>
                </div>
              </div>

              <div className="space-y-3 text-sm border-t pt-3">
                {report.today_notes && (
                  <div className="bg-slate-50 p-3 rounded-md border">
                    <strong className="text-xs uppercase tracking-wider text-slate-500 block mb-1">Today's Summary Notes:</strong>
                    <p className="whitespace-pre-wrap text-slate-700">{report.today_notes}</p>
                  </div>
                )}
                {report.problems_faced && (
                  <div className="bg-red-50/70 p-3 rounded-md border border-red-200 text-red-900">
                    <strong className="text-xs uppercase tracking-wider text-red-700 block mb-1">Obstacles / Problems Faced:</strong>
                    <p className="whitespace-pre-wrap">{report.problems_faced}</p>
                  </div>
                )}
                {report.tomorrow_plan && (
                  <div className="bg-blue-50/70 p-3 rounded-md border border-blue-200 text-blue-900">
                    <strong className="text-xs uppercase tracking-wider text-blue-700 block mb-1">Plan for Tomorrow:</strong>
                    <p className="whitespace-pre-wrap">{report.tomorrow_plan}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {(!reports || reports.length === 0) && (
          <div className="bg-white p-12 text-center rounded-lg border shadow-sm space-y-2">
            <FileText size={40} className="mx-auto text-slate-400" />
            <h3 className="font-bold text-lg text-navy-900">No Daily Reports Submitted Yet</h3>
            <p className="text-slate-500 text-sm">
              Field staff can submit end-of-day work summaries from their dashboard.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
