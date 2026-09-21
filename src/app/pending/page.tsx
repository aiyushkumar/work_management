import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { logout } from '@/app/(auth)/actions'
import { Button } from '@/components/ui/button'

export default function Pending() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-slate-50">
      <Card className="w-full max-w-md shadow-lg border-t-4 border-t-yellow-500">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Account Pending</CardTitle>
          <CardDescription>
            Your registration has been submitted successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-muted-foreground">
            Management approval is required before you can access the employee dashboard. 
            Please contact your manager if you need immediate access.
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
