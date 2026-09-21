import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { logout } from '@/app/(auth)/actions'
import { Button } from '@/components/ui/button'

export default function Inactive() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-slate-50">
      <Card className="w-full max-w-md shadow-lg border-t-4 border-t-gray-500">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-gray-700">Account Inactive</CardTitle>
          <CardDescription>
            Your account has been deactivated.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-muted-foreground">
            You no longer have access to the employee portal. Please contact management if you need your account reactivated.
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
