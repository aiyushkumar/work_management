import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmployeeApprovalActions } from '@/components/manager/employee-actions'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function EmployeesPage() {
  const supabase = await createClient()

  const { data: employees } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'employee')
    .order('created_at', { ascending: false })

  const pendingEmployees = employees?.filter(e => e.status === 'pending') || []
  const activeEmployees = employees?.filter(e => e.status === 'active') || []

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-navy-900">Employees</h1>
      </div>

      {/* Pending Approvals Section */}
      {pendingEmployees.length > 0 && (
        <Card className="border-yellow-500 border-2">
          <CardHeader className="bg-yellow-50">
            <CardTitle className="text-yellow-800">Pending Approvals ({pendingEmployees.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {pendingEmployees.map(emp => (
                <div key={emp.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div>
                    <h3 className="font-semibold text-lg">{emp.full_name}</h3>
                    <p className="text-sm text-muted-foreground">{emp.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">Joined: {new Date(emp.created_at).toLocaleDateString()}</p>
                  </div>
                  <EmployeeApprovalActions employeeId={emp.id} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Employees Section */}
      <Card>
        <CardHeader>
          <CardTitle>Active Staff ({activeEmployees.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 border-b">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Area</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {activeEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                      No active employees found.
                    </td>
                  </tr>
                ) : (
                  activeEmployees.map(emp => (
                    <tr key={emp.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium">{emp.full_name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{emp.email}</td>
                      <td className="px-4 py-3 text-muted-foreground">{emp.working_area || 'Not assigned'}</td>
                      <td className="px-4 py-3 text-right">
                        <Link href={`/manager/employees/${emp.id}`}>
                          <Button variant="outline" size="sm">View Profile</Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
