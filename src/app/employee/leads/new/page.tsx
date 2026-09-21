import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createLead } from '../../actions'

export default function NewLead() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy-900">Add New Lead</h1>
      
      <Card>
        <CardContent className="pt-6">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <form action={createLead as any} className="space-y-4">
            
            <div className="space-y-2">
              <Label>Customer Name</Label>
              <Input name="customer_name" required placeholder="John Doe" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input name="phone" required placeholder="9876543210" />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp (Optional)</Label>
                <Input name="whatsapp" placeholder="9876543210" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Requirement Type</Label>
                <Select name="requirement_type" defaultValue="buy">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buy">Buy</SelectItem>
                    <SelectItem value="rent">Rent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Property Type</Label>
                <Select name="property_type" defaultValue="house">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="flat">Flat/Apartment</SelectItem>
                    <SelectItem value="plot">Plot</SelectItem>
                    <SelectItem value="shop">Shop</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="pg">PG</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Preferred Area</Label>
              <Input name="preferred_area" placeholder="e.g. Kolar Road" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Min Budget</Label>
                <Input name="budget_min" type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label>Max Budget</Label>
                <Input name="budget_max" type="number" placeholder="50000" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>BHK</Label>
                <Input name="bhk" type="number" placeholder="2" />
              </div>
              <div className="space-y-2">
                <Label>Urgency</Label>
                <Select name="urgency" defaultValue="medium">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea name="requirements_notes" rows={3} placeholder="Specific requirements..." />
            </div>

            <Button type="submit" className="w-full bg-navy-900">Save Lead</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
