import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function EmployeeLeads() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .eq('created_by', user?.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-navy-900">My Leads</h1>
        <Link href="/employee/leads/new">
          <Button className="bg-navy-900">+ Add Lead</Button>
        </Link>
      </div>
      
      <div className="grid gap-4">
        {leads?.map(lead => (
          <Card key={lead.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle>{lead.customer_name}</CardTitle>
                <Badge>{lead.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{lead.phone}</p>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <span className="text-muted-foreground">Looking For:</span> {lead.requirement_type} | 
                <span className="text-muted-foreground ml-2">Budget:</span> ₹{lead.budget_max}
              </div>
            </CardContent>
          </Card>
        ))}
        {(!leads || leads.length === 0) && (
          <p className="text-muted-foreground">You haven&apos;t added any leads yet.</p>
        )}
      </div>
    </div>
  )
}
