import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function ManagerProperties() {
  const supabase = await createClient()
  const { data: properties } = await supabase
    .from('properties')
    .select(`
      *,
      submitted_by_profile:profiles!properties_submitted_by_fkey(full_name)
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy-900">Properties Management</h1>
      
      <div className="grid gap-4">
        {properties?.map(property => (
          <Card key={property.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle>{property.title}</CardTitle>
                <Badge>{property.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{property.locality}, {property.area}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Type:</span> {property.property_type}
                </div>
                <div>
                  <span className="text-muted-foreground">For:</span> {property.listing_type}
                </div>
                <div>
                  <span className="text-muted-foreground">Price:</span> ₹{property.listing_type === 'rent' ? property.monthly_rent : property.sale_price}
                </div>
                <div>
                  <span className="text-muted-foreground">Submitted By:</span> {property.submitted_by_profile?.full_name}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {(!properties || properties.length === 0) && (
          <p className="text-muted-foreground">No properties submitted yet.</p>
        )}
      </div>
    </div>
  )
}
