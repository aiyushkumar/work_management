import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

export default async function EmployeeAllowances() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: allowances } = await supabase
    .from('field_allowances')
    .select('*')
    .eq('employee_id', user?.id)
    .order('date', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-navy-900">My Allowances</h1>
      </div>
      
      <div className="grid gap-4">
        {allowances?.map(a => (
          <Card key={a.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle>₹{a.amount}</CardTitle>
                <Badge variant={a.status === 'approved' ? 'default' : 'secondary'}>{a.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <p><strong>Date:</strong> {format(new Date(a.date), 'PP')}</p>
                <p><strong>Reason:</strong> {a.reason}</p>
              </div>
            </CardContent>
          </Card>
        ))}
        {(!allowances || allowances.length === 0) && (
          <p className="text-muted-foreground">No allowance requests found.</p>
        )}
      </div>
    </div>
  )
}
