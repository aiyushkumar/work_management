import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { logout } from '@/app/(auth)/actions'
import { Button } from '@/components/ui/button'

export default function Rejected() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-slate-50">
      <Card className="w-full max-w-md shadow-lg border-t-4 border-t-red-600">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-red-600">Application Rejected</CardTitle>
          <CardDescription>
            Your account registration was not approved.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-muted-foreground">
            Management has reviewed your registration and decided not to approve it at this time. 
            If you believe this is a mistake, please contact the office directly.
          </p>
          <form action={logout}>
            <Button variant="outline" className="w-full">
              Sign Out
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
