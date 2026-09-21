import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createProperty } from '../../actions'

export default function NewProperty() {
  return (
    <div className="space-y-6 pb-20">
      <h1 className="text-2xl font-bold text-navy-900">Add New Property</h1>
      
      <Card>
        <CardContent className="pt-6">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <form action={createProperty as any} className="space-y-6">
            
            {/* Basics */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Basic Info</h3>
              
              <div className="space-y-2">
                <Label>Title</Label>
                <Input name="title" required placeholder="2 BHK Flat in Kolar" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Listing Type</Label>
                  <Select name="listing_type" defaultValue="rent">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rent">Rent</SelectItem>
                      <SelectItem value="sale">Sale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Property Type</Label>
                  <Select name="property_type" defaultValue="flat">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="flat">Flat</SelectItem>
                      <SelectItem value="room">Room</SelectItem>
                      <SelectItem value="pg">PG</SelectItem>
                      <SelectItem value="shop">Shop</SelectItem>
                      <SelectItem value="office">Office</SelectItem>
                      <SelectItem value="plot">Plot</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Owner Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Owner Details</h3>
              <div className="space-y-2">
                <Label>Owner Name</Label>
                <Input name="owner_name" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Owner Phone</Label>
                  <Input name="owner_phone" required />
                </div>
                <div className="space-y-2">
                  <Label>WhatsApp</Label>
                  <Input name="owner_whatsapp" />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Location</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Area / Colony</Label>
                  <Input name="area" required />
                </div>
                <div className="space-y-2">
                  <Label>Landmark</Label>
                  <Input name="landmark" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Complete Address</Label>
                <Textarea name="address" rows={2} required />
              </div>
            </div>

            {/* Price & Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Pricing & Details</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Rent / Sale Price</Label>
                  <Input name="price" type="number" required />
                </div>
                <div className="space-y-2">
                  <Label>Security Deposit</Label>
                  <Input name="security_deposit" type="number" />
                </div>
                <div className="space-y-2">
                  <Label>BHK</Label>
                  <Input name="bedrooms" type="number" defaultValue="1" />
                </div>
                <div className="space-y-2">
                  <Label>Bathrooms</Label>
                  <Input name="bathrooms" type="number" defaultValue="1" />
                </div>
                <div className="space-y-2">
                  <Label>Area (Sq Ft)</Label>
                  <Input name="area_sqft" type="number" />
                </div>
                <div className="space-y-2">
                  <Label>Furnishing</Label>
                  <Select name="furnishing" defaultValue="unfurnished">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unfurnished">Unfurnished</SelectItem>
                      <SelectItem value="semi_furnished">Semi Furnished</SelectItem>
                      <SelectItem value="furnished">Fully Furnished</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description / Notes</Label>
                <Textarea name="description" rows={3} />
              </div>
            </div>

            <Button type="submit" className="w-full bg-navy-900 h-12 text-lg">Submit Property</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
