import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User, Phone, MapPin, Building, Landmark, Save } from 'lucide-react'
import { updateProfile } from '../actions'

export default async function EmployeeProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-navy-900">My Profile</h1>
        <span className={`px-4 py-1.5 text-sm font-bold uppercase tracking-wider rounded-full ${
          profile?.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
        }`}>
          {profile?.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 shadow-sm border-t-4 border-t-navy-900">
          <CardContent className="p-6 text-center">
            <div className="w-24 h-24 bg-yellow-500 text-navy-900 rounded-full flex items-center justify-center font-bold text-4xl mx-auto mb-4 shadow-md">
              {profile?.full_name?.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-bold text-navy-900">{profile?.full_name}</h2>
            <p className="text-muted-foreground">{profile?.email}</p>
            <div className="mt-4 pt-4 border-t text-sm text-slate-500">
              Joined {new Date(profile?.created_at).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-sm">
          <CardHeader className="bg-slate-50 border-b pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <User size={20} className="text-navy-900" /> Personal & Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form action={updateProfile} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-1"><Phone size={14}/> Phone Number</label>
                  <Input name="phone" defaultValue={profile?.phone || ''} placeholder="+91 XXXXX XXXXX" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-1"><MapPin size={14}/> City</label>
                  <Input name="city" defaultValue={profile?.city || ''} placeholder="e.g. Bhopal" />
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-bold text-navy-900 mb-4 flex items-center gap-2">
                  <Landmark size={18} className="text-green-600" /> Bank Details (For Payments)
                </h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Bank Name</label>
                    <Input name="bank_name" defaultValue={profile?.bank_name || ''} placeholder="e.g. State Bank of India" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Account Number</label>
                      <Input name="bank_account_number" defaultValue={profile?.bank_account_number || ''} placeholder="Your account number" />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">IFSC Code</label>
                      <Input name="bank_ifsc" defaultValue={profile?.bank_ifsc || ''} placeholder="e.g. SBIN0001234" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" className="bg-navy-900 hover:bg-navy-800">
                  <Save className="mr-2 h-4 w-4" /> Save Profile Details
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
