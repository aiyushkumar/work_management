import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { logout } from '@/app/(auth)/actions'
import Link from 'next/link'

export default async function DebugPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Not Logged In</h1>
        <p>You must be logged in to view debug info.</p>
        <Link href="/login"><Button className="mt-4">Go to Login</Button></Link>
      </div>
    )
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Authentication Debug Page</h1>
      
      <Card className="border-t-4 border-t-purple-500">
        <CardHeader>
          <CardTitle>Current Session Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 font-mono text-sm">
          <div className="grid grid-cols-3 gap-2 border-b pb-2">
            <span className="font-semibold text-slate-500">User ID</span>
            <span className="col-span-2">{user.id}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 border-b pb-2">
            <span className="font-semibold text-slate-500">Email</span>
            <span className="col-span-2">{user.email}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 border-b pb-2">
            <span className="font-semibold text-slate-500">Full Name</span>
            <span className="col-span-2">{profile?.full_name || 'N/A'}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 border-b pb-2">
            <span className="font-semibold text-slate-500">Role</span>
            <span className="col-span-2 p-1 bg-slate-100 rounded inline-block">
              {profile?.role || 'N/A'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 pb-2">
            <span className="font-semibold text-slate-500">Status</span>
            <span className="col-span-2 p-1 bg-slate-100 rounded inline-block">
              {profile?.status || 'N/A'}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <form action={logout}>
          <Button variant="destructive">Sign Out</Button>
        </form>
        <Link href="/">
          <Button variant="outline">Go to App Root</Button>
        </Link>
      </div>
    </div>
  )
}
