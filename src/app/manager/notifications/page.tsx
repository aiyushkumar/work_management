import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ManagerNotifications() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy-900">Notifications</h1>
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          You have no new notifications.
        </CardContent>
      </Card>
    </div>
  )
}
