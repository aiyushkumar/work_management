import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { Mail, Phone, MapPin, Calendar, Briefcase, FileText, CheckSquare, Users } from 'lucide-react'

export default async function EmployeeProfileDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // 1. Fetch Employee Profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (!profile) return notFound()

  // 2. Fetch Employee Stats (Aggregated)
  const { count: tasksCount } = await supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('assigned_to', id)
  const { count: completedTasks } = await supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('assigned_to', id).eq('status', 'completed')
  const { count: propertiesCount } = await supabase.from('properties').select('*', { count: 'exact', head: true }).eq('submitted_by', id)
  const { count: leadsCount } = await supabase.from('leads').select('*', { count: 'exact', head: true }).eq('created_by', id)

  // 3. Fetch Recent Reports
  const { data: recentReports } = await supabase
    .from('daily_reports')
    .select('*')
    .eq('employee_id', id)
    .order('date', { ascending: false })
    .limit(5)

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header Profile Card */}
      <Card className="border-t-4 border-t-navy-900 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 p-6 opacity-10">
          <Briefcase size={120} />
        </div>
        <CardContent className="p-8 relative z-10">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="w-24 h-24 bg-yellow-500 text-navy-900 rounded-full flex items-center justify-center font-bold text-4xl shadow-md shrink-0">
              {profile.full_name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-navy-900">{profile.full_name}</h1>
                <Badge variant={profile.status === 'active' ? 'default' : 'secondary'} className="capitalize text-sm px-3">
                  {profile.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8 mt-4 text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-slate-400" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-slate-400" />
                  <span>{profile.phone || 'No phone provided'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-slate-400" />
                  <span>{profile.city || 'No city'} • {profile.working_area || 'No working area assigned'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-slate-400" />
                  <span>Joined {format(new Date(profile.created_at), 'MMMM d, yyyy')}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-200">
                <h3 className="font-semibold text-sm text-slate-500 mb-2 uppercase tracking-wider">Bank Details</h3>
                {profile.bank_name || profile.bank_account_number ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm bg-slate-50 p-3 rounded border">
                    <div>
                      <span className="text-slate-500 block text-xs">Bank Name</span>
                      <span className="font-medium text-slate-700">{profile.bank_name || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-xs">Account Number</span>
                      <span className="font-medium text-slate-700">{profile.bank_account_number || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-xs">IFSC Code</span>
                      <span className="font-medium text-slate-700">{profile.bank_ifsc || 'N/A'}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 italic">No bank details provided yet.</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasksCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Assigned</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Finished</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Properties Found</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{propertiesCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Submitted</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Leads Generated</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadsCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Captured</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText size={20} />
            Recent Daily Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentReports?.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No reports submitted yet.</p>
            ) : (
              recentReports?.map((report) => (
                <div key={report.id} className="p-4 rounded-lg border bg-slate-50">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold">{format(new Date(report.date), 'PPPP')}</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3 text-slate-600">
                    <div><strong>Tasks:</strong> {report.tasks_completed}</div>
                    <div><strong>Properties:</strong> {report.properties_found}</div>
                    <div><strong>Leads:</strong> {report.buyer_leads + report.renter_leads}</div>
                    <div><strong>Follow-ups:</strong> {report.followups_completed}</div>
                  </div>
                  {report.today_notes && (
                    <div className="text-sm text-slate-700 bg-white p-3 rounded border">
                      <strong>Notes:</strong> {report.today_notes}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
