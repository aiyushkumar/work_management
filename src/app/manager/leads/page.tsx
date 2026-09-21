import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function ManagerLeads() {
  const supabase = await createClient()
  const { data: leads } = await supabase
    .from('leads')
    .select(`
      *,
      created_by_profile:profiles!leads_created_by_fkey(full_name)
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy-900">Leads Management</h1>
      
      <div className="grid gap-4">
        {leads?.map(lead => (
          <Card key={lead.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle>{lead.customer_name}</CardTitle>
                <Badge>{lead.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{lead.phone} • {lead.preferred_area}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Looking For:</span> {lead.requirement_type}
                </div>
                <div>
                  <span className="text-muted-foreground">Budget:</span> ₹{lead.budget_min} - ₹{lead.budget_max}
                </div>
                <div>
                  <span className="text-muted-foreground">Urgency:</span> {lead.urgency}
                </div>
                <div>
                  <span className="text-muted-foreground">Created By:</span> {lead.created_by_profile?.full_name}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {(!leads || leads.length === 0) && (
          <p className="text-muted-foreground">No leads recorded yet.</p>
        )}
      </div>
    </div>
  )
}
