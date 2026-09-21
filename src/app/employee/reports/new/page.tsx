import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { submitReport } from '../../actions'

export default function NewReport() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy-900">Submit Daily Report</h1>
      
      <Card>
        <CardContent className="pt-6">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <form action={submitReport as any} className="space-y-4">
            
            <div className="space-y-2">
              <Label>Date</Label>
              <Input name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tasks Completed</Label>
                <Input name="tasks_completed" type="number" defaultValue="0" />
              </div>
              <div className="space-y-2">
                <Label>Properties Found</Label>
                <Input name="properties_found" type="number" defaultValue="0" />
              </div>
              <div className="space-y-2">
                <Label>Buyer Leads</Label>
                <Input name="buyer_leads" type="number" defaultValue="0" />
              </div>
              <div className="space-y-2">
                <Label>Renter Leads</Label>
                <Input name="renter_leads" type="number" defaultValue="0" />
              </div>
              <div className="space-y-2">
                <Label>Follow-ups Completed</Label>
                <Input name="followups_completed" type="number" defaultValue="0" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Today&apos;s Notes</Label>
              <Textarea name="today_notes" rows={3} placeholder="What did you do today?" />
            </div>

            <div className="space-y-2">
              <Label>Problems Faced</Label>
              <Textarea name="problems_faced" rows={2} placeholder="Any issues?" />
            </div>

            <div className="space-y-2">
              <Label>Tomorrow&apos;s Plan</Label>
              <Textarea name="tomorrow_plan" rows={2} />
            </div>

            <Button type="submit" className="w-full bg-navy-900">Submit Report</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
