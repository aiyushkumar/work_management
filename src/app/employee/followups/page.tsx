import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

export default async function EmployeeFollowups() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: followups } = await supabase
    .from('lead_followups')
    .select(`
      *,
      lead:leads(customer_name, phone, requirement_type)
    `)
    .eq('assigned_to', user?.id)
    .order('followup_date', { ascending: true })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy-900">My Follow-ups</h1>
      
      <div className="grid gap-4">
        {followups?.map(f => (
          <Card key={f.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{f.lead?.customer_name}</h3>
                  <p className="text-sm text-slate-500">{f.lead?.phone}</p>
                </div>
                <Badge variant={f.status === 'completed' ? 'secondary' : 'default'}>{f.status}</Badge>
              </div>
              <div className="mt-4 text-sm">
                <p><strong>Scheduled:</strong> {format(new Date(f.followup_date), 'PP')} at {f.followup_time || 'No time set'}</p>
                {f.notes && <p className="mt-2 text-slate-600"><strong>Notes:</strong> {f.notes}</p>}
              </div>
            </CardContent>
          </Card>
        ))}
        {(!followups || followups.length === 0) && (
          <p className="text-muted-foreground">No pending follow-ups.</p>
        )}
      </div>
    </div>
  )
}
