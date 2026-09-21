import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { createTask } from '@/app/manager/actions'

export default async function NewTaskPage() {
  const supabase = await createClient()

  // Get active employees
  const { data: employees } = await supabase
    .from('profiles')
    .select('id, full_name, working_area')
    .eq('role', 'employee')
    .eq('status', 'active')

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <h1 className="text-3xl font-bold text-navy-900">Assign New Task</h1>

      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
        </CardHeader>
        <CardContent>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <form action={createTask as any} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employee_id">Assign To (Employee)</Label>
                <select 
                  id="employee_id" 
                  name="employee_id" 
                  required
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select Employee</option>
                  {employees?.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.full_name} {emp.working_area ? `(${emp.working_area})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="task_type">Task Template</Label>
                <select 
                  id="task_type" 
                  name="task_type" 
                  required
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="property_search">Property Search (Rent)</option>
                  <option value="property_verification">Property Verification</option>
                  <option value="buyer_lead_collection">Buyer Lead Collection</option>
                  <option value="renter_lead_collection">Renter Lead Collection</option>
                  <option value="follow_up">Client Follow-up</option>
                  <option value="market_survey">Market Survey</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Task Title</Label>
              <Input id="title" name="title" required placeholder="e.g. Find 5 new rental properties in Kolar Road" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Instructions / Description</Label>
              <textarea 
                id="description" 
                name="description" 
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Specific instructions for this task..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="area">Target Area / Locality</Label>
                <Input id="area" name="area" required placeholder="e.g. Kolar Road, MP Nagar" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="target_count">Target Count (Optional)</Label>
                <Input id="target_count" name="target_count" type="number" min="0" placeholder="e.g. 10" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <select 
                  id="priority" 
                  name="priority" 
                  required
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  defaultValue="medium"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="due_date">Due Date</Label>
                <Input id="due_date" name="due_date" type="date" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="due_time">Due Time (Optional)</Label>
                <Input id="due_time" name="due_time" type="time" />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button type="button" variant="outline" className="w-full sm:w-auto">Cancel</Button>
              <Button type="submit" className="w-full sm:w-auto bg-navy-900">Assign Task</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
