import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'

export default async function ManagerAllowances() {
  const supabase = await createClient()
  const { data: allowances } = await supabase
    .from('field_allowances')
    .select(`
      *,
      profile:profiles!field_allowances_employee_id_fkey(full_name)
    `)
    .order('date', { ascending: false })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy-900">Field Allowances</h1>
      
      <div className="grid gap-4">
        {allowances?.map(allowance => (
          <Card key={allowance.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle>{allowance.profile?.full_name}</CardTitle>
                <Badge variant={allowance.status === 'approved' ? 'default' : 'secondary'}>
                  {allowance.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center text-sm">
                <div>
                  <span className="text-muted-foreground block">Date</span>
                  {format(new Date(allowance.date), 'PP')}
                </div>
                <div>
                  <span className="text-muted-foreground block">Amount</span>
                  <strong className="text-lg">₹{allowance.amount}</strong>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-600 border-t pt-4">
                <strong>Reason:</strong> {allowance.reason}
              </p>
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
