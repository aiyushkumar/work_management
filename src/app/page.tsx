import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {

  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, status')
    .eq('id', user.id)
    .single()

  if (profile) {
    if (profile.status === 'pending') {
      redirect('/pending')
    } else if (profile.status === 'rejected') {
      redirect('/rejected')
    } else if (profile.status === 'inactive') {
      redirect('/inactive')
    } else if (profile.role === 'manager') {
      redirect('/manager/dashboard')
    } else {
      redirect('/employee/dashboard')
    }
  }

  redirect('/unauthorized')
}
