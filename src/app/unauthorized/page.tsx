import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { logout } from '@/app/(auth)/actions'
import { Button } from '@/components/ui/button'

export default function Unauthorized() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-slate-50">
      <Card className="w-full max-w-md shadow-lg border-t-4 border-t-red-600">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-red-600">Access Denied</CardTitle>
          <CardDescription>
            You do not have permission to view this page.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-muted-foreground">
            If you believe this is an error, please contact your system administrator.
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
