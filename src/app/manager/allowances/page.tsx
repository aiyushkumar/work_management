import { createClient, createAdminClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, Landmark, Calendar } from 'lucide-react'
import { updateAllowanceStatus } from '@/app/manager/actions'

export default async function ManagerAllowances() {
  const supabase = await createClient()
  await supabase.auth.getUser()

  // Use Admin Client to bypass RLS policies
  const adminSupabase = await createAdminClient()

  const { data: rawAllowances } = await adminSupabase
    .from('field_allowances')
    .select('*')
    .order('date', { ascending: false })

  const { data: profiles } = await adminSupabase
    .from('profiles')
    .select('id, full_name, email')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profileMap = new Map((profiles || []).map((p: any) => [p.id, p]))

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allowanceList = (rawAllowances || []).map((item: any) => ({
    ...item,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    employee_name: (profileMap.get(item.employee_id) as any)?.full_name || `Employee (${item.employee_id?.slice(0, 6)})`,
  }))

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-bold text-navy-900">Field Allowances & Reimbursements</h1>
        <p className="text-muted-foreground mt-1">Review, approve, or reject daily travel and petrol expense claims.</p>
      </div>

      <div className="grid gap-4">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {allowanceList?.map((allowance: any) => (
          <Card key={allowance.id} className="shadow-sm border">
            <CardHeader className="pb-3 bg-slate-50 border-b">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 text-green-800 rounded-full flex items-center justify-center font-bold">
                    ₹
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-navy-900">{allowance.employee_name}</CardTitle>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Calendar size={12} /> Claimed for {format(new Date(allowance.date), 'PPPP')}
                    </p>
                  </div>
                </div>

                <Badge className={`px-3 py-1 text-xs font-semibold capitalize ${
                  allowance.status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' :
                  allowance.status === 'rejected' ? 'bg-red-100 text-red-800 border-red-200' :
                  'bg-yellow-100 text-yellow-800 border-yellow-300'
                }`}>
                  {allowance.status || 'Pending'}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-5 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-lg border gap-4">
                <div>
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider block">Allowance Amount</span>
                  <strong className="text-2xl font-bold text-green-700">₹{allowance.amount}</strong>
                </div>

                {allowance.status === 'pending' && (
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <form action={async () => {
                      'use server'
                      await updateAllowanceStatus(allowance.id, 'approved')
                    }}>
                      <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-semibold text-xs h-9">
                        <CheckCircle2 className="mr-1.5 h-4 w-4" /> Approve Claim
                      </Button>
                    </form>

                    <form action={async () => {
                      'use server'
                      await updateAllowanceStatus(allowance.id, 'rejected')
                    }}>
                      <Button type="submit" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 text-xs h-9">
                        <XCircle className="mr-1.5 h-4 w-4" /> Reject
                      </Button>
                    </form>
                  </div>
                )}
              </div>

              <div className="text-sm text-slate-700 bg-slate-50 p-3 rounded-md border">
                <strong className="text-xs uppercase tracking-wider text-slate-500 block mb-1">Reason / Description:</strong>
                <p>{allowance.reason || 'No description provided.'}</p>
              </div>
            </CardContent>
          </Card>
        ))}

        {(!allowanceList || allowanceList.length === 0) && (
          <div className="bg-white p-12 text-center rounded-lg border shadow-sm space-y-2">
            <Landmark size={40} className="mx-auto text-slate-400" />
            <h3 className="font-bold text-lg text-navy-900">No Allowance Claims Submitted</h3>
            <p className="text-slate-500 text-sm">
              Field employees can submit petrol or travel reimbursement claims from their dashboard.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
