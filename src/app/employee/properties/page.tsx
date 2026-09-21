import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function EmployeeProperties() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .eq('submitted_by', user?.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-navy-900">My Properties</h1>
        <Link href="/employee/properties/new">
          <Button className="bg-navy-900">+ Add Property</Button>
        </Link>
      </div>
      
      <div className="grid gap-4">
        {properties?.map(property => (
          <Card key={property.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle>{property.title}</CardTitle>
                <Badge>{property.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{property.locality}</p>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <span className="text-muted-foreground">Type:</span> {property.property_type} | 
                <span className="text-muted-foreground ml-2">For:</span> {property.listing_type} | 
                <span className="text-muted-foreground ml-2">Price:</span> ₹{property.listing_type === 'rent' ? property.monthly_rent : property.sale_price}
              </div>
            </CardContent>
          </Card>
        ))}
        {(!properties || properties.length === 0) && (
          <p className="text-muted-foreground">You haven&apos;t submitted any properties yet.</p>
        )}
      </div>
    </div>
  )
}
