import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ManagerSettings() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy-900">System Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Organization Settings</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          Configuration options will appear here.
        </CardContent>
      </Card>
    </div>
  )
}
